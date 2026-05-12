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
      <div className="glass-effect rounded-xl shadow-2xl p-6 border border-slate-700/50">
        <div className="animate-pulse">
          <div className="h-4 bg-slate-700 rounded w-1/4 mb-4"></div>
          <div className="h-10 bg-slate-700 rounded"></div>
        </div>
      </div>
    );
  }

  return (
    <div className="glass-effect rounded-xl shadow-2xl p-6 border border-slate-700/50">
      <div className="flex items-center space-x-3 mb-4">
        <div className="w-10 h-10 bg-gradient-to-br from-purple-500 to-pink-600 rounded-lg flex items-center justify-center">
          <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
          </svg>
        </div>
        <h2 className="text-lg font-semibold text-slate-100">Select Challenge Scenario</h2>
      </div>
      
      <select
        value={selectedScenario?.id || ''}
        onChange={(e) => handleScenarioChange(e.target.value)}
        className="block w-full px-4 py-3 bg-slate-800/50 border border-slate-600 rounded-lg text-slate-200 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
      >
        <option value="">-- Select a scenario or create custom --</option>
        {scenarios.map((scenario) => (
          <option key={scenario.id} value={scenario.id}>
            {scenario.name} {scenario.isPreloaded ? '(Preloaded)' : '(Custom)'}
          </option>
        ))}
      </select>

      {selectedScenario && (
        <div className="mt-4 p-4 bg-gradient-to-br from-blue-900/30 to-purple-900/30 rounded-lg border border-blue-500/30">
          <div className="flex items-start space-x-3">
            <svg className="w-5 h-5 text-blue-400 mt-0.5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            <div className="flex-1">
              <h3 className="font-medium text-blue-300">{selectedScenario.name}</h3>
              <p className="text-sm text-slate-400 mt-1">{selectedScenario.description}</p>
              <div className="flex items-center space-x-2 mt-2">
                <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-500/20 text-blue-300">
                  {selectedScenario.timeline.length} timeline event(s)
                </span>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
