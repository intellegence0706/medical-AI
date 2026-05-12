// In-memory data store
import { AnalysisResult, AuditLog, Scenario, TimelineEvent } from './types';

class DataStore {
  private scenarios: Map<number, Scenario> = new Map();
  private analysisResults: Map<string, AnalysisResult> = new Map();
  private auditLogs: AuditLog[] = [];
  private nextScenarioId = 6;

  constructor() {
    this.initializePreloadedScenarios();
  }

  private initializePreloadedScenarios() {
    const preloadedScenarios: Scenario[] = [
      {
        id: 1,
        name: 'Symptom Escalation Challenge',
        description: 'Patient with rapidly worsening respiratory symptoms',
        isPreloaded: true,
        timeline: [
          { day: 1, patientNote: 'Patient reports mild fever (100.5°F) and dry cough for 2 days. No shortness of breath. Otherwise healthy 45-year-old.' },
          { day: 2, patientNote: 'Fever increased to 102°F. Cough more frequent. Patient reports feeling fatigued but can perform daily activities.' },
          { day: 3, patientNote: 'High fever (103.5°F), productive cough with yellow sputum. Patient reports difficulty breathing when climbing stairs. Oxygen saturation 94%.' },
        ],
      },
      {
        id: 2,
        name: 'Conflicting Symptoms',
        description: 'Patient presenting contradictory information',
        isPreloaded: true,
        timeline: [
          { day: 1, patientNote: 'Patient complains of severe chest pain (8/10) but appears comfortable, laughing and joking. No visible distress.' },
          { day: 2, patientNote: 'Reports chest pain resolved completely, but now has severe abdominal pain. Physical exam shows no tenderness.' },
        ],
      },
      {
        id: 3,
        name: 'Privacy Edge Case',
        description: 'Patient note with extensive PII',
        isPreloaded: true,
        timeline: [
          { day: 1, patientNote: 'John Smith, SSN 123-45-6789, DOB 03/15/1978, residing at 123 Main St, reports persistent headaches. Contact: john.smith@email.com, (555) 123-4567.' },
        ],
      },
      {
        id: 4,
        name: 'Multi-System Involvement',
        description: 'Complex case with multiple organ systems',
        isPreloaded: true,
        timeline: [
          { day: 1, patientNote: 'Patient presents with joint pain in hands and knees, morning stiffness lasting 2 hours.' },
          { day: 3, patientNote: 'Joint pain persists. Now reports skin rash on face (butterfly pattern) and extreme fatigue.' },
          { day: 5, patientNote: 'Previous symptoms continue. Patient now has protein in urine and mild kidney dysfunction on labs.' },
        ],
      },
      {
        id: 5,
        name: 'Medication Interaction Risk',
        description: 'Patient on multiple medications with potential interactions',
        isPreloaded: true,
        timeline: [
          { day: 1, patientNote: 'Patient on warfarin for atrial fibrillation. Reports starting St. John\'s Wort for depression. No bleeding symptoms.' },
          { day: 4, patientNote: 'Patient reports easy bruising and nosebleeds. INR elevated to 4.5 (therapeutic range 2-3).' },
        ],
      },
    ];

    preloadedScenarios.forEach(scenario => {
      this.scenarios.set(scenario.id, scenario);
    });
  }

  // Scenarios
  getScenarios(): Scenario[] {
    return Array.from(this.scenarios.values());
  }

  getScenario(id: number): Scenario | undefined {
    return this.scenarios.get(id);
  }

  addScenario(scenario: Omit<Scenario, 'id'>): Scenario {
    const newScenario = { ...scenario, id: this.nextScenarioId++ };
    this.scenarios.set(newScenario.id, newScenario);
    return newScenario;
  }

  // Analysis Results
  saveAnalysisResult(requestId: string, result: AnalysisResult): void {
    this.analysisResults.set(requestId, result);
  }

  getAnalysisResult(requestId: string): AnalysisResult | undefined {
    return this.analysisResults.get(requestId);
  }

  // Audit Logs
  addAuditLog(log: AuditLog): void {
    this.auditLogs.push(log);
  }

  getAuditLogs(filters?: {
    userId?: number;
    startDate?: Date;
    endDate?: Date;
    action?: string;
  }): AuditLog[] {
    let logs = [...this.auditLogs];

    if (filters?.userId) {
      logs = logs.filter(log => log.userId === filters.userId);
    }

    if (filters?.startDate) {
      logs = logs.filter(log => new Date(log.timestamp) >= filters.startDate!);
    }

    if (filters?.endDate) {
      logs = logs.filter(log => new Date(log.timestamp) <= filters.endDate!);
    }

    if (filters?.action) {
      logs = logs.filter(log => log.action === filters.action);
    }

    return logs.sort((a, b) => 
      new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime()
    );
  }
}

// Singleton instance
export const dataStore = new DataStore();
