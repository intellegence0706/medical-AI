import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@/lib/auth';
import { dataStore } from '@/lib/store';
import { analyzePatientNote, getModelVersion } from '@/lib/ai-service';
import { applyGuardrails } from '@/lib/guardrail-service';
import { maskAnalysisData } from '@/lib/privacy-service';
import { AnalyzeRequest, AnalysisResponse } from '@/lib/types';
import { v4 as uuidv4 } from 'uuid';

function generateRequestId(): string {
  return `req_${uuidv4().replace(/-/g, '').substring(0, 12)}`;
}

export async function POST(request: NextRequest) {
  try {
    const session = await auth();
    
    if (!session?.user) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }

    const body: AnalyzeRequest = await request.json();
    const { timelineEvents, guardrails, privacy, scenarioId } = body;

    if (!timelineEvents || timelineEvents.length === 0) {
      return NextResponse.json(
        { error: 'Timeline events are required' },
        { status: 400 }
      );
    }

    // Analyze each timeline event
    const results = [];
    for (let i = 0; i < timelineEvents.length; i++) {
      const event = timelineEvents[i];
      const context = timelineEvents.slice(0, i);
      
      const analysis = await analyzePatientNote(event, context);
      results.push(analysis);
    }

    // Apply guardrails
    let validationResult = { passed: true, warnings: [], errors: [] };
    if (guardrails.auditLogging) {
      validationResult = applyGuardrails(results, guardrails);
    }

    // Apply privacy masking
    const maskedResults = maskAnalysisData(results, privacy);

    const requestId = generateRequestId();
    const modelVersion = getModelVersion();
    const timestamp = new Date().toISOString();

    const response: AnalysisResponse = {
      requestId,
      results: maskedResults,
      modelVersion,
      timestamp,
      guardrailsApplied: guardrails,
      privacySettings: privacy,
    };

    // Save to store
    dataStore.saveAnalysisResult(requestId, {
      originalResults: results,
      maskedResults,
      guardrails,
      privacy,
      validation: validationResult,
    } as any);

    // Audit log
    if (guardrails.auditLogging) {
      dataStore.addAuditLog({
        id: uuidv4(),
        timestamp,
        userId: parseInt(session.user.id),
        role: session.user.role,
        action: 'analyze',
        inputData: { timelineEvents, scenarioId },
        outputData: response,
        validationStatus: validationResult.passed ? 'passed' : 'failed',
        modelVersion,
        requestId,
      });
    }

    return NextResponse.json({
      ...response,
      validation: validationResult,
    });
  } catch (error) {
    console.error('Analysis error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
