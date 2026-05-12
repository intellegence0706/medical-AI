import { AnalysisResult, GuardrailSettings } from './types';

export interface ValidationResult {
  passed: boolean;
  warnings: string[];
  errors: string[];
}

export function applyGuardrails(
  results: AnalysisResult[],
  settings: GuardrailSettings
): ValidationResult {
  const warnings: string[] = [];
  const errors: string[] = [];

  if (settings.validationRules.includes('check_contradictions')) {
    const contradictionCheck = checkContradictions(results);
    warnings.push(...contradictionCheck.warnings);
    errors.push(...contradictionCheck.errors);
  }

  if (settings.validationRules.includes('flag_high_risk')) {
    const riskCheck = flagHighRisk(results);
    warnings.push(...riskCheck.warnings);
  }

  if (settings.validationRules.includes('confidence_threshold')) {
    const confidenceCheck = checkConfidenceThreshold(results);
    warnings.push(...confidenceCheck.warnings);
  }

  return {
    passed: errors.length === 0,
    warnings,
    errors,
  };
}

function checkContradictions(results: AnalysisResult[]): { warnings: string[]; errors: string[] } {
  const warnings: string[] = [];
  const errors: string[] = [];

  for (let i = 1; i < results.length; i++) {
    const prev = results[i - 1];
    const curr = results[i];

    // Check if risk level decreased unexpectedly
    if (prev.riskLevel === 'high' && curr.riskLevel === 'low') {
      warnings.push(
        `Day ${curr.day}: Risk level dropped from HIGH to LOW without clear explanation`
      );
    }

    // Check if symptoms disappeared without explanation
    const prevSymptoms = new Set(prev.symptoms);
    const currSymptoms = new Set(curr.symptoms);
    const disappearedSymptoms = [...prevSymptoms].filter(s => !currSymptoms.has(s));
    
    if (disappearedSymptoms.length > 2) {
      warnings.push(
        `Day ${curr.day}: Multiple symptoms (${disappearedSymptoms.join(', ')}) disappeared without documentation`
      );
    }
  }

  return { warnings, errors };
}

function flagHighRisk(results: AnalysisResult[]): { warnings: string[] } {
  const warnings: string[] = [];

  results.forEach(result => {
    if (result.riskLevel === 'high') {
      warnings.push(
        `Day ${result.day}: HIGH RISK detected - ${result.explanation}. Immediate review recommended.`
      );
    }

    if (result.riskLevel === 'medium' && result.confidenceScore < 0.6) {
      warnings.push(
        `Day ${result.day}: Medium risk with low confidence (${(result.confidenceScore * 100).toFixed(0)}%). Consider additional evaluation.`
      );
    }
  });

  return { warnings };
}

function checkConfidenceThreshold(results: AnalysisResult[]): { warnings: string[] } {
  const warnings: string[] = [];
  const threshold = 0.5;

  results.forEach(result => {
    if (result.confidenceScore < threshold) {
      warnings.push(
        `Day ${result.day}: Low confidence score (${(result.confidenceScore * 100).toFixed(0)}%). Analysis may be unreliable.`
      );
    }
  });

  return { warnings };
}
