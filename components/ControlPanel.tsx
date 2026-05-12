'use client';

import { useAppStore } from '@/lib/store-client';
import { useState } from 'react';

export default function ControlPanel() {
  const {
    timelineEvents,
    guardrails,
    privacy,
    setGuardrails,
    setPrivacy,
    setCurrentAnalysis,
    isAnalyzing,
    setIsAnalyzing,
  } = useAppStore();

  const [error, setError] = useState('');

  const handleAnalyze = async () => {
    if (timelineEvents.length === 0) {
      setError('Please add at least one timeline event');
      return;
    }

    setError('');
    setIsAnalyzing(true);

    try {
      const response = await fetch('/api/analyze', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          timelineEvents,
          guardrails,
          privacy,
        }),
      });

      if (!response.ok) {
        throw new Error('Analysis failed');
      }

      const data = await response.json();
      setCurrentAnalysis(data);
    } catch (err) {
      setError('Failed to analyze. Please try again.');
      console.error(err);
    } finally {
      setIsAnalyzing(false);
    }
  };

  return (
    <div className="bg-white rounded-lg shadow p-6 space-y-6">
      <div>
        <h2 className="text-lg font-semibold text-gray-900 mb-4">Control Panel</h2>
      </div>

      <div>
        <h3 className="text-sm font-medium text-gray-900 mb-3">Guardrails</h3>
        <div className="space-y-2">
          <label className="flex items-center">
            <input
              type="checkbox"
              checked={guardrails.auditLogging}
              onChange={(e) => setGuardrails({ auditLogging: e.target.checked })}
              className="rounded border-gray-300 text-indigo-600 focus:ring-indigo-500"
            />
            <span className="ml-2 text-sm text-gray-700">Audit Logging</span>
          </label>

          <div className="ml-6 space-y-1">
            <label className="flex items-center">
              <input
                type="checkbox"
                checked={guardrails.validationRules.includes('check_contradictions')}
                onChange={(e) => {
                  const rules = e.target.checked
                    ? [...guardrails.validationRules, 'check_contradictions']
                    : guardrails.validationRules.filter((r) => r !== 'check_contradictions');
                  setGuardrails({ validationRules: rules });
                }}
                className="rounded border-gray-300 text-indigo-600 focus:ring-indigo-500"
              />
              <span className="ml-2 text-xs text-gray-600">Check Contradictions</span>
            </label>

            <label className="flex items-center">
              <input
                type="checkbox"
                checked={guardrails.validationRules.includes('flag_high_risk')}
                onChange={(e) => {
                  const rules = e.target.checked
                    ? [...guardrails.validationRules, 'flag_high_risk']
                    : guardrails.validationRules.filter((r) => r !== 'flag_high_risk');
                  setGuardrails({ validationRules: rules });
                }}
                className="rounded border-gray-300 text-indigo-600 focus:ring-indigo-500"
              />
              <span className="ml-2 text-xs text-gray-600">Flag High Risk</span>
            </label>

            <label className="flex items-center">
              <input
                type="checkbox"
                checked={guardrails.validationRules.includes('confidence_threshold')}
                onChange={(e) => {
                  const rules = e.target.checked
                    ? [...guardrails.validationRules, 'confidence_threshold']
                    : guardrails.validationRules.filter((r) => r !== 'confidence_threshold');
                  setGuardrails({ validationRules: rules });
                }}
                className="rounded border-gray-300 text-indigo-600 focus:ring-indigo-500"
              />
              <span className="ml-2 text-xs text-gray-600">Confidence Threshold</span>
            </label>
          </div>
        </div>
      </div>

      <div>
        <h3 className="text-sm font-medium text-gray-900 mb-3">Privacy Masking</h3>
        <div className="space-y-2">
          <label className="flex items-center">
            <input
              type="checkbox"
              checked={privacy.maskPii}
              onChange={(e) => setPrivacy({ maskPii: e.target.checked })}
              className="rounded border-gray-300 text-indigo-600 focus:ring-indigo-500"
            />
            <span className="ml-2 text-sm text-gray-700">Mask PII (names, emails, SSN)</span>
          </label>

          <label className="flex items-center">
            <input
              type="checkbox"
              checked={privacy.maskAge}
              onChange={(e) => setPrivacy({ maskAge: e.target.checked })}
              className="rounded border-gray-300 text-indigo-600 focus:ring-indigo-500"
            />
            <span className="ml-2 text-sm text-gray-700">Mask Age</span>
          </label>

          <label className="flex items-center">
            <input
              type="checkbox"
              checked={privacy.maskGender}
              onChange={(e) => setPrivacy({ maskGender: e.target.checked })}
              className="rounded border-gray-300 text-indigo-600 focus:ring-indigo-500"
            />
            <span className="ml-2 text-sm text-gray-700">Mask Gender</span>
          </label>
        </div>
      </div>

      {error && (
        <div className="text-red-600 text-sm bg-red-50 p-3 rounded-md">
          {error}
        </div>
      )}

      <button
        onClick={handleAnalyze}
        disabled={isAnalyzing || timelineEvents.length === 0}
        className="w-full px-4 py-3 bg-indigo-600 text-white rounded-md hover:bg-indigo-700 disabled:opacity-50 disabled:cursor-not-allowed font-medium"
      >
        {isAnalyzing ? 'Analyzing...' : 'Run AI Analysis'}
      </button>
    </div>
  );
}
