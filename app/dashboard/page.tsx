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
        <div className="text-lg">Loading...</div>
      </div>
    );
  }

  if (!session) {
    return null;
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-6">
          <div className="border-b border-gray-200">
            <nav className="-mb-px flex space-x-8">
              <button
                onClick={() => setActiveTab('analysis')}
                className={`${
                  activeTab === 'analysis'
                    ? 'border-indigo-500 text-indigo-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                } whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm`}
              >
                Analysis Playground
              </button>
              {(session.user.role === 'admin' || session.user.role === 'doctor') && (
                <button
                  onClick={() => setActiveTab('logs')}
                  className={`${
                    activeTab === 'logs'
                      ? 'border-indigo-500 text-indigo-600'
                      : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                  } whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm`}
                >
                  Audit Logs
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
