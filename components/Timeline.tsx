'use client';

import { useAppStore } from '@/lib/store-client';
import { useState } from 'react';

export default function Timeline() {
  const { timelineEvents, addTimelineEvent, updateTimelineEvent, removeTimelineEvent } = useAppStore();
  const [newDay, setNewDay] = useState('');
  const [newNote, setNewNote] = useState('');
  const [editingDay, setEditingDay] = useState<number | null>(null);

  const handleAddEvent = () => {
    if (newDay && newNote) {
      const day = parseInt(newDay);
      if (!timelineEvents.find((e) => e.day === day)) {
        addTimelineEvent({ day, patientNote: newNote });
        setNewDay('');
        setNewNote('');
      } else {
        alert('An event for this day already exists');
      }
    }
  };

  const handleUpdateEvent = (day: number, note: string) => {
    updateTimelineEvent(day, note);
    setEditingDay(null);
  };

  return (
    <div className="glass-effect rounded-xl shadow-2xl p-6 border border-slate-700/50">
      <div className="flex items-center space-x-3 mb-4">
        <div className="w-10 h-10 bg-gradient-to-br from-green-500 to-teal-600 rounded-lg flex items-center justify-center">
          <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
        </div>
        <h2 className="text-lg font-semibold text-slate-100">Patient Timeline</h2>
      </div>

      <div className="space-y-4">
        {timelineEvents.length === 0 ? (
          <div className="text-center py-12">
            <svg className="mx-auto h-16 w-16 text-slate-600 mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
            </svg>
            <p className="text-slate-400">No timeline events. Add events below or select a preloaded scenario.</p>
          </div>
        ) : (
          <div className="space-y-3">
            {timelineEvents.map((event) => (
              <div
                key={event.day}
                className="bg-slate-800/50 border border-slate-700 rounded-lg p-4 hover:border-blue-500/50 transition-all duration-200"
              >
                <div className="flex justify-between items-start mb-2">
                  <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-gradient-to-r from-blue-500 to-purple-600 text-white shadow-lg">
                    Day {event.day}
                  </span>
                  <div className="flex space-x-2">
                    <button
                      onClick={() => setEditingDay(event.day)}
                      className="flex items-center space-x-1 text-sm text-blue-400 hover:text-blue-300 transition-colors"
                    >
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                      </svg>
                      <span>Edit</span>
                    </button>
                    <button
                      onClick={() => removeTimelineEvent(event.day)}
                      className="flex items-center space-x-1 text-sm text-red-400 hover:text-red-300 transition-colors"
                    >
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                      </svg>
                      <span>Remove</span>
                    </button>
                  </div>
                </div>
                
                {editingDay === event.day ? (
                  <div className="space-y-2">
                    <textarea
                      defaultValue={event.patientNote}
                      className="w-full px-3 py-2 bg-slate-900/50 border border-slate-600 rounded-lg text-slate-200 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      rows={3}
                      id={`edit-${event.day}`}
                    />
                    <div className="flex space-x-2">
                      <button
                        onClick={() => {
                          const textarea = document.getElementById(`edit-${event.day}`) as HTMLTextAreaElement;
                          handleUpdateEvent(event.day, textarea.value);
                        }}
                        className="px-3 py-1 text-sm bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                      >
                        Save
                      </button>
                      <button
                        onClick={() => setEditingDay(null)}
                        className="px-3 py-1 text-sm bg-slate-700 text-slate-300 rounded-lg hover:bg-slate-600 transition-colors"
                      >
                        Cancel
                      </button>
                    </div>
                  </div>
                ) : (
                  <p className="text-sm text-slate-300">{event.patientNote}</p>
                )}
              </div>
            ))}
          </div>
        )}

        <div className="border-t border-slate-700 pt-4 mt-4">
          <h3 className="text-sm font-medium text-slate-200 mb-3 flex items-center space-x-2">
            <svg className="w-5 h-5 text-green-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
            </svg>
            <span>Add New Event</span>
          </h3>
          <div className="space-y-3">
            <div>
              <label className="block text-xs font-medium text-slate-400 mb-1">
                Day
              </label>
              <input
                type="number"
                min="1"
                value={newDay}
                onChange={(e) => setNewDay(e.target.value)}
                className="block w-full px-4 py-2 bg-slate-800/50 border border-slate-600 rounded-lg text-slate-200 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="1"
              />
            </div>
            <div>
              <label className="block text-xs font-medium text-slate-400 mb-1">
                Patient Note
              </label>
              <textarea
                value={newNote}
                onChange={(e) => setNewNote(e.target.value)}
                className="block w-full px-4 py-2 bg-slate-800/50 border border-slate-600 rounded-lg text-slate-200 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                rows={3}
                placeholder="Enter patient observations, symptoms, or updates..."
              />
            </div>
            <button
              onClick={handleAddEvent}
              disabled={!newDay || !newNote}
              className="w-full flex items-center justify-center space-x-2 px-4 py-3 bg-gradient-to-r from-green-500 to-teal-600 text-white rounded-lg hover:from-green-600 hover:to-teal-700 disabled:opacity-50 disabled:cursor-not-allowed shadow-lg hover:shadow-green-500/50 transition-all duration-200"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
              </svg>
              <span>Add Event</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
