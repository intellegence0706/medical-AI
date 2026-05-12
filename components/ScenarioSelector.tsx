'use client';

import { useEffect, useState } from 'react';
import { useAppStore } from '@/lib/store-client';
import { Scenario } from '@/lib/types';

export default function ScenarioSelector() {
  const { scenarios, selectedScenario, setScenarios, setSelectedScenario } = useAppStore();
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    fetchScenarios();
  }, []);

  const fetchScenarios = async () => {
    try {
      const response = await fetch('/api/scenarios');
      if (response.ok) {
        const data = await response.json();
        setScenarios(data.scenarios);
      }
    } catch (error) {
      console.error('Failed to fetch scenarios:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleScenarioChange = (scenarioId: string) => {
    if (scenarioId === '') {
      setSelectedScenario(null);
      return;
    }
    const scenario = scenarios.find((s) => s.id === parseInt(scenarioId));
    setSelectedScenario(scenario || null);
  };

  if (isLoading) {
    return (
      <div className="bg-white rounded-lg shadow p-6">
        <div className="animate-pulse">
          <div className="h-4 bg-gray-200 rounded w-1/4 mb-4"></div>
          <div className="h-10 bg-gray-200 rounded"></div>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-lg shadow p-6">
      <h2 className="text-lg font-semibold text-gray-900 mb-4">Select Challenge Scenario</h2>
      
      <select
        value={selectedScenario?.id || ''}
        onChange={(e) => handleScenarioChange(e.target.value)}
        className="block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
      >
        <option value="">-- Select a scenario or create custom --</option>
        {scenarios.map((scenario) => (
          <option key={scenario.id} value={scenario.id}>
            {scenario.name} {scenario.isPreloaded ? '(Preloaded)' : '(Custom)'}
          </option>
        ))}
      </select>

      {selectedScenario && (
        <div className="mt-4 p-4 bg-blue-50 rounded-md">
          <h3 className="font-medium text-blue-900">{selectedScenario.name}</h3>
          <p className="text-sm text-blue-700 mt-1">{selectedScenario.description}</p>
          <p className="text-xs text-blue-600 mt-2">
            {selectedScenario.timeline.length} timeline event(s)
          </p>
        </div>
      )}
    </div>
  );
}
