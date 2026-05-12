'use client';

import { useAppStore } from '@/lib/store-client';
import { AnalysisResult } from '@/lib/types';

export default function AnalysisOutput() {
  const { currentAnalysis } = useAppStore();

  if (!currentAnalysis) {
    return (
      <div className="bg-white rounded-lg shadow p-6">
        <h2 className="text-lg font-semibold text-gray-900 mb-4">AI Analysis Output</h2>
        <div className="text-center py-12 text-gray-500">
          <svg
            className="mx-auto h-12 w-12 text-gray-400"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
            />
          </svg>
          <p className="mt-2">No analysis yet. Configure timeline and run analysis.</p>
        </div>
      </div>
    );
  }

  const getRiskColor = (risk: string) => {
    switch (risk) {
      case 'high':
        return 'bg-red-100 text-red-800 border-red-200';
      case 'medium':
        return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      case 'low':
        return 'bg-green-100 text-green-800 border-green-200';
      default:
        return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  return (
    <div className="bg-white rounded-lg shadow p-6">
      <div className="flex justify-between items-start mb-4">
        <h2 className="text-lg font-semibold text-gray-900">AI Analysis Output</h2>
        <div className="text-xs text-gray-500">
          <p>Request ID: {currentAnalysis.requestId}</p>
          <p>Model: {currentAnalysis.modelVersion}</p>
        </div>
      </div>

      {currentAnalysis.validation && currentAnalysis.validation.warnings.length > 0 && (
        <div className="mb-4 p-4 bg-yellow-50 border border-yellow-200 rounded-md">
          <h3 className="text-sm font-medium text-yellow-800 mb-2">Validation Warnings</h3>
          <ul className="list-disc list-inside space-y-1">
            {currentAnalysis.validation.warnings.map((warning, idx) => (
              <li key={idx} className="text-xs text-yellow-700">
                {warning}
              </li>
            ))}
          </ul>
        </div>
      )}

      <div className="space-y-4">
        {currentAnalysis.results.map((result: AnalysisResult) => (
          <div key={result.day} className="border border-gray-200 rounded-lg p-4">
            <div className="flex justify-between items-start mb-3">
              <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-indigo-100 text-indigo-800">
                Day {result.day}
              </span>
              <span
                className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium border ${getRiskColor(
                  result.riskLevel
                )}`}
              >
                {result.riskLevel.toUpperCase()} RISK
              </span>
            </div>

            <div className="space-y-3">
              <div>
                <h4 className="text-xs font-medium text-gray-500 uppercase mb-1">Summary</h4>
                <p className="text-sm text-gray-900">{result.structuredSummary}</p>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <h4 className="text-xs font-medium text-gray-500 uppercase mb-1">Symptoms</h4>
                  <div className="flex flex-wrap gap-1">
                    {result.symptoms.map((symptom, idx) => (
                      <span
                        key={idx}
                        className="inline-flex items-center px-2 py-0.5 rounded text-xs bg-blue-50 text-blue-700"
                      >
                        {symptom}
                      </span>
                    ))}
                  </div>
                </div>

                <div>
                  <h4 className="text-xs font-medium text-gray-500 uppercase mb-1">
                    Possible Conditions
                  </h4>
                  <div className="flex flex-wrap gap-1">
                    {result.conditions.map((condition, idx) => (
                      <span
                        key={idx}
                        className="inline-flex items-center px-2 py-0.5 rounded text-xs bg-purple-50 text-purple-700"
                      >
                        {condition}
                      </span>
                    ))}
                  </div>
                </div>
              </div>

              <div>
                <h4 className="text-xs font-medium text-gray-500 uppercase mb-1">
                  Confidence Score
                </h4>
                <div className="flex items-center space-x-2">
                  <div className="flex-1 bg-gray-200 rounded-full h-2">
                    <div
                      className="bg-indigo-600 h-2 rounded-full"
                      style={{ width: `${result.confidenceScore * 100}%` }}
                    />
                  </div>
                  <span className="text-sm font-medium text-gray-900">
                    {(result.confidenceScore * 100).toFixed(0)}%
                  </span>
                </div>
              </div>

              <div>
                <h4 className="text-xs font-medium text-gray-500 uppercase mb-1">Explanation</h4>
                <p className="text-sm text-gray-700">{result.explanation}</p>
              </div>
            </div>
          </div>
        ))}
      </div>

      <div className="mt-4 pt-4 border-t">
        <div className="flex items-center justify-between text-xs text-gray-500">
          <div>
            <p>Guardrails: {currentAnalysis.guardrailsApplied.auditLogging ? 'Enabled' : 'Disabled'}</p>
            <p>Privacy Masking: {Object.values(currentAnalysis.privacySettings).some(v => v) ? 'Active' : 'Inactive'}</p>
          </div>
          <p>{new Date(currentAnalysis.timestamp).toLocaleString()}</p>
        </div>
      </div>
    </div>
  );
}
