'use client';

import { useEffect, useState } from 'react';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import { useAppStore } from '@/lib/store-client';
import ScenarioSelector from '@/components/ScenarioSelector';
import Timeline from '@/components/Timeline';
import ControlPanel from '@/components/ControlPanel';
import AnalysisOutput from '@/components/AnalysisOutput';
import AuditLogs from '@/components/AuditLogs';
import Header from '@/components/Header';

export default function DashboardPage() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [activeTab, setActiveTab] = useState<'analysis' | 'logs'>('analysis');

  useEffect(() => {
    if (status === 'unauthenticated') {
      router.push('/login');
    }
  }, [status, router]);

  if (status === 'loading') {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="inline-block animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500 mb-4"></div>
          <div className="text-lg text-slate-300">Loading...</div>
        </div>
      </div>
    );
  }

  if (!session) {
    return null;
  }

  return (
    <div className="min-h-screen">
      <Header />
      
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-6">
          <div className="glass-effect rounded-lg p-1">
            <nav className="flex space-x-2">
              <button
                onClick={() => setActiveTab('analysis')}
                className={`${
                  activeTab === 'analysis'
                    ? 'bg-blue-600 text-white shadow-lg'
                    : 'text-slate-300 hover:text-white hover:bg-slate-700/50'
                } flex items-center space-x-2 px-6 py-3 rounded-md font-medium text-sm transition-all duration-200`}
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                </svg>
                <span>Analysis Playground</span>
              </button>
              {(session.user.role === 'admin' || session.user.role === 'doctor') && (
                <button
                  onClick={() => setActiveTab('logs')}
                  className={`${
                    activeTab === 'logs'
                      ? 'bg-blue-600 text-white shadow-lg'
                      : 'text-slate-300 hover:text-white hover:bg-slate-700/50'
                  } flex items-center space-x-2 px-6 py-3 rounded-md font-medium text-sm transition-all duration-200`}
                >
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                  </svg>
                  <span>Audit Logs</span>
                </button>
              )}
            </nav>
          </div>
        </div>

        {activeTab === 'analysis' ? (
          <div className="space-y-6">
            <ScenarioSelector />
            <Timeline />
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              <div className="lg:col-span-1">
                <ControlPanel />
              </div>
              <div className="lg:col-span-2">
                <AnalysisOutput />
              </div>
            </div>
          </div>
        ) : (
          <AuditLogs />
        )}
      </main>
    </div>
  );
}
