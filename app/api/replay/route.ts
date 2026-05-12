import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@/lib/auth';
import { dataStore } from '@/lib/store';
import { analyzePatientNote, getModelVersion } from '@/lib/ai-service';
import { applyGuardrails } from '@/lib/guardrail-service';
import { maskAnalysisData } from '@/lib/privacy-service';
import { ReplayRequest } from '@/lib/types';
import { v4 as uuidv4 } from 'uuid';

export async function POST(request: NextRequest) {
  try {
    const session = await auth();
    
    if (!session?.user) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }

    const body: ReplayRequest = await request.json();
    const { requestId, modifications } = body;

    if (!requestId) {
      return NextResponse.json(
        { error: 'Request ID is required' },
        { status: 400 }
      );
    }

    // Get original analysis
    const originalAnalysis = dataStore.getAnalysisResult(requestId);
    
    if (!originalAnalysis) {
      return NextResponse.json(
        { error: 'Original analysis not found' },
        { status: 404 }
      );
    }

    // Merge modifications with original settings
    const newGuardrails = {
      ...originalAnalysis.guardrails,
      ...modifications?.guardrails,
    };

    const newPrivacy = {
      ...originalAnalysis.privacy,
      ...modifications?.privacy,
    };

    // Re-apply guardrails and privacy to original results
    const validationResult = applyGuardrails(
      originalAnalysis.originalResults,
      newGuardrails
    );

    const replayedResults = maskAnalysisData(
      originalAnalysis.originalResults,
      newPrivacy
    );

    const newRequestId = `replay_${uuidv4().replace(/-/g, '').substring(0, 12)}`;
    const timestamp = new Date().toISOString();

    // Calculate differences
    const differences = calculateDifferences(
      originalAnalysis.maskedResults,
      replayedResults
    );

    // Save replayed analysis
    dataStore.saveAnalysisResult(newRequestId, {
      originalResults: originalAnalysis.originalResults,
      maskedResults: replayedResults,
      guardrails: newGuardrails,
      privacy: newPrivacy,
      validation: validationResult,
    } as any);

    // Audit log
    if (newGuardrails.auditLogging) {
      dataStore.addAuditLog({
        id: uuidv4(),
        timestamp,
        userId: parseInt(session.user.id),
        role: session.user.role,
        action: 'replay',
        inputData: { originalRequestId: requestId, modifications },
        outputData: { newRequestId, differences },
        validationStatus: validationResult.passed ? 'passed' : 'failed',
        modelVersion: getModelVersion(),
        requestId: newRequestId,
      });
    }

    return NextResponse.json({
      original: {
        requestId,
        results: originalAnalysis.maskedResults,
        guardrails: originalAnalysis.guardrails,
        privacy: originalAnalysis.privacy,
      },
      replayed: {
        requestId: newRequestId,
        results: replayedResults,
        guardrails: newGuardrails,
        privacy: newPrivacy,
        validation: validationResult,
      },
      differences,
      timestamp,
    });
  } catch (error) {
    console.error('Replay error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

function calculateDifferences(original: any[], replayed: any[]): any {
  const differences: any = {
    fieldsChanged: [],
    summaryChanges: [],
  };

  for (let i = 0; i < original.length; i++) {
    const orig = original[i];
    const repl = replayed[i];

    if (JSON.stringify(orig) !== JSON.stringify(repl)) {
      const dayDiff: any = { day: orig.day, changes: {} };

      if (orig.structuredSummary !== repl.structuredSummary) {
        dayDiff.changes.structuredSummary = {
          from: orig.structuredSummary,
          to: repl.structuredSummary,
        };
        differences.fieldsChanged.push('structuredSummary');
      }

      if (JSON.stringify(orig.symptoms) !== JSON.stringify(repl.symptoms)) {
        dayDiff.changes.symptoms = {
          from: orig.symptoms,
          to: repl.symptoms,
        };
        differences.fieldsChanged.push('symptoms');
      }

      if (orig.confidenceScore !== repl.confidenceScore) {
        dayDiff.changes.confidenceScore = {
          from: orig.confidenceScore,
          to: repl.confidenceScore,
          delta: repl.confidenceScore - orig.confidenceScore,
        };
      }

      if (orig.riskLevel !== repl.riskLevel) {
        dayDiff.changes.riskLevel = {
          from: orig.riskLevel,
          to: repl.riskLevel,
        };
      }

      if (Object.keys(dayDiff.changes).length > 0) {
        differences.summaryChanges.push(dayDiff);
      }
    }
  }

  differences.fieldsChanged = [...new Set(differences.fieldsChanged)];
  
  return differences;
}
