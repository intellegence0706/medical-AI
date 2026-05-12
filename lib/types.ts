// Type definitions
export interface User {
  id: number;
  email: string;
  password: string;
  role: 'doctor' | 'admin' | 'viewer';
  name: string;
}

export interface TimelineEvent {
  day: number;
  patientNote: string;
}

export interface Scenario {
  id: number;
  name: string;
  description: string;
  isPreloaded: boolean;
  timeline: TimelineEvent[];
}

export interface AnalysisResult {
  day: number;
  structuredSummary: string;
  symptoms: string[];
  conditions: string[];
  confidenceScore: number;
  riskLevel: 'low' | 'medium' | 'high';
  explanation: string;
}

export interface AnalysisResponse {
  requestId: string;
  results: AnalysisResult[];
  modelVersion: string;
  timestamp: string;
  guardrailsApplied: GuardrailSettings;
  privacySettings: PrivacySettings;
}

export interface GuardrailSettings {
  auditLogging: boolean;
  validationRules: string[];
}

export interface PrivacySettings {
  maskPii: boolean;
  maskAge: boolean;
  maskGender: boolean;
}

export interface AuditLog {
  id: string;
  timestamp: string;
  userId: number;
  role: string;
  action: string;
  inputData: any;
  outputData: any;
  validationStatus: string;
  modelVersion: string;
  requestId?: string;
}

export interface AnalyzeRequest {
  scenarioId?: number;
  timelineEvents: TimelineEvent[];
  guardrails: GuardrailSettings;
  privacy: PrivacySettings;
}

export interface ReplayRequest {
  requestId: string;
  modifications?: {
    guardrails?: Partial<GuardrailSettings>;
    privacy?: Partial<PrivacySettings>;
  };
}
