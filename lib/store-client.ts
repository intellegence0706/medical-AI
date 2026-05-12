import { create } from 'zustand';
import { AnalysisResponse, GuardrailSettings, PrivacySettings, Scenario, TimelineEvent } from './types';

interface AppState {
  // Scenarios
  scenarios: Scenario[];
  selectedScenario: Scenario | null;
  setScenarios: (scenarios: Scenario[]) => void;
  setSelectedScenario: (scenario: Scenario | null) => void;

  // Timeline
  timelineEvents: TimelineEvent[];
  setTimelineEvents: (events: TimelineEvent[]) => void;
  addTimelineEvent: (event: TimelineEvent) => void;
  updateTimelineEvent: (day: number, note: string) => void;
  removeTimelineEvent: (day: number) => void;

  // Settings
  guardrails: GuardrailSettings;
  privacy: PrivacySettings;
  setGuardrails: (guardrails: Partial<GuardrailSettings>) => void;
  setPrivacy: (privacy: Partial<PrivacySettings>) => void;

  // Analysis
  currentAnalysis: AnalysisResponse | null;
  setCurrentAnalysis: (analysis: AnalysisResponse | null) => void;
  isAnalyzing: boolean;
  setIsAnalyzing: (isAnalyzing: boolean) => void;
}

export const useAppStore = create<AppState>((set) => ({
  // Scenarios
  scenarios: [],
  selectedScenario: null,
  setScenarios: (scenarios) => set({ scenarios }),
  setSelectedScenario: (scenario) => {
    set({ 
      selectedScenario: scenario,
      timelineEvents: scenario?.timeline || [],
      currentAnalysis: null,
    });
  },

  // Timeline
  timelineEvents: [],
  setTimelineEvents: (events) => set({ timelineEvents: events }),
  addTimelineEvent: (event) =>
    set((state) => ({
      timelineEvents: [...state.timelineEvents, event].sort((a, b) => a.day - b.day),
    })),
  updateTimelineEvent: (day, note) =>
    set((state) => ({
      timelineEvents: state.timelineEvents.map((e) =>
        e.day === day ? { ...e, patientNote: note } : e
      ),
    })),
  removeTimelineEvent: (day) =>
    set((state) => ({
      timelineEvents: state.timelineEvents.filter((e) => e.day !== day),
    })),

  // Settings
  guardrails: {
    auditLogging: true,
    validationRules: ['check_contradictions', 'flag_high_risk', 'confidence_threshold'],
  },
  privacy: {
    maskPii: false,
    maskAge: false,
    maskGender: false,
  },
  setGuardrails: (guardrails) =>
    set((state) => ({
      guardrails: { ...state.guardrails, ...guardrails },
    })),
  setPrivacy: (privacy) =>
    set((state) => ({
      privacy: { ...state.privacy, ...privacy },
    })),

  // Analysis
  currentAnalysis: null,
  setCurrentAnalysis: (analysis) => set({ currentAnalysis: analysis }),
  isAnalyzing: false,
  setIsAnalyzing: (isAnalyzing) => set({ isAnalyzing }),
}));
