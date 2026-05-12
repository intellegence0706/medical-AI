import OpenAI from 'openai';
import { AnalysisResult, TimelineEvent } from './types';

const openai = process.env.OPENAI_API_KEY 
  ? new OpenAI({ apiKey: process.env.OPENAI_API_KEY })
  : null;

const SYSTEM_PROMPT = `You are a medical AI assistant analyzing patient notes. 
Return a JSON object with:
- structuredSummary: brief clinical summary (1-2 sentences)
- symptoms: array of identified symptoms
- conditions: array of possible conditions/diagnoses
- confidenceScore: number between 0 and 1 representing confidence in analysis
- riskLevel: "low", "medium", or "high"
- explanation: brief reasoning for the assessment (2-3 sentences)

Be conservative with risk assessment. Flag uncertainty clearly. Focus on clinical relevance.`;

export async function analyzePatientNote(
  event: TimelineEvent,
  context?: TimelineEvent[]
): Promise<AnalysisResult> {
  // If OpenAI API key is not configured, use mock response
  if (!openai) {
    return generateMockAnalysis(event);
  }

  try {
    const prompt = buildPrompt(event, context);
    
    const response = await openai.chat.completions.create({
      model: 'gpt-4-turbo',
      messages: [
        { role: 'system', content: SYSTEM_PROMPT },
        { role: 'user', content: prompt },
      ],
      response_format: { type: 'json_object' },
      temperature: 0.3,
    });

    const content = response.choices[0].message.content;
    if (!content) {
      throw new Error('No response from AI');
    }

    const result = JSON.parse(content);
    
    return {
      day: event.day,
      structuredSummary: result.structuredSummary,
      symptoms: result.symptoms,
      conditions: result.conditions,
      confidenceScore: result.confidenceScore,
      riskLevel: result.riskLevel,
      explanation: result.explanation,
    };
  } catch (error) {
    console.error('AI analysis error:', error);
    return generateMockAnalysis(event);
  }
}

function buildPrompt(event: TimelineEvent, context?: TimelineEvent[]): string {
  let prompt = `Analyze the following patient note from Day ${event.day}:\n\n${event.patientNote}`;
  
  if (context && context.length > 0) {
    prompt += '\n\nPrevious timeline context:\n';
    context.forEach(ctx => {
      prompt += `Day ${ctx.day}: ${ctx.patientNote}\n`;
    });
  }
  
  return prompt;
}

function generateMockAnalysis(event: TimelineEvent): AnalysisResult {
  const note = event.patientNote.toLowerCase();
  
  // Simple keyword-based mock analysis
  const symptoms: string[] = [];
  const conditions: string[] = [];
  let riskLevel: 'low' | 'medium' | 'high' = 'low';
  let confidenceScore = 0.7;

  // Detect symptoms
  if (note.includes('fever')) symptoms.push('fever');
  if (note.includes('cough')) symptoms.push('cough');
  if (note.includes('pain')) symptoms.push('pain');
  if (note.includes('shortness of breath') || note.includes('difficulty breathing')) {
    symptoms.push('dyspnea');
    riskLevel = 'medium';
  }
  if (note.includes('headache')) symptoms.push('headache');
  if (note.includes('fatigue')) symptoms.push('fatigue');
  if (note.includes('nausea')) symptoms.push('nausea');
  if (note.includes('rash')) symptoms.push('rash');

  // Detect conditions based on symptoms
  if (symptoms.includes('fever') && symptoms.includes('cough')) {
    conditions.push('upper respiratory infection', 'influenza', 'COVID-19');
  }
  if (symptoms.includes('dyspnea')) {
    conditions.push('pneumonia', 'bronchitis');
    riskLevel = 'medium';
  }
  if (note.includes('chest pain')) {
    conditions.push('cardiac event', 'costochondritis');
    riskLevel = 'high';
    confidenceScore = 0.6;
  }
  if (symptoms.includes('rash') && note.includes('butterfly')) {
    conditions.push('systemic lupus erythematosus', 'rosacea');
    riskLevel = 'medium';
  }

  // Check for high-risk indicators
  if (note.includes('severe') || note.includes('103') || note.includes('oxygen')) {
    riskLevel = 'high';
  }

  const structuredSummary = symptoms.length > 0
    ? `Patient presents with ${symptoms.join(', ')}`
    : 'Patient presents with non-specific symptoms';

  const explanation = riskLevel === 'high'
    ? 'Symptoms indicate potential serious condition requiring immediate attention'
    : riskLevel === 'medium'
    ? 'Symptoms suggest moderate concern, monitoring recommended'
    : 'Symptoms appear mild and self-limiting';

  return {
    day: event.day,
    structuredSummary,
    symptoms: symptoms.length > 0 ? symptoms : ['general malaise'],
    conditions: conditions.length > 0 ? conditions : ['viral syndrome'],
    confidenceScore,
    riskLevel,
    explanation,
  };
}

export function getModelVersion(): string {
  return openai ? 'gpt-4-turbo-2024-04-09' : 'mock-ai-v1.0';
}
