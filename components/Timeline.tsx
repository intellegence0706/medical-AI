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
    <div className="bg-white rounded-lg shadow p-6">
      <h2 className="text-lg font-semibold text-gray-900 mb-4">Patient Timeline</h2>

      <div className="space-y-4">
        {timelineEvents.length === 0 ? (
          <p className="text-gray-500 text-center py-8">
            No timeline events. Add events below or select a preloaded scenario.
          </p>
        ) : (
          <div className="space-y-3">
            {timelineEvents.map((event) => (
              <div
                key={event.day}
                className="border border-gray-200 rounded-lg p-4 hover:border-indigo-300 transition-colors"
              >
                <div className="flex justify-between items-start mb-2">
                  <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-indigo-100 text-indigo-800">
                    Day {event.day}
                  </span>
                  <div className="flex space-x-2">
                    <button
                      onClick={() => setEditingDay(event.day)}
                      className="text-sm text-indigo-600 hover:text-indigo-800"
                    >
                      Edit
                    </button>
                    <button
                      onClick={() => removeTimelineEvent(event.day)}
                      className="text-sm text-red-600 hover:text-red-800"
                    >
                      Remove
                    </button>
                  </div>
                </div>
                
                {editingDay === event.day ? (
                  <div className="space-y-2">
                    <textarea
                      defaultValue={event.patientNote}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
                      rows={3}
                      id={`edit-${event.day}`}
                    />
                    <div className="flex space-x-2">
                      <button
                        onClick={() => {
                          const textarea = document.getElementById(`edit-${event.day}`) as HTMLTextAreaElement;
                          handleUpdateEvent(event.day, textarea.value);
                        }}
                        className="px-3 py-1 text-sm bg-indigo-600 text-white rounded hover:bg-indigo-700"
                      >
                        Save
                      </button>
                      <button
                        onClick={() => setEditingDay(null)}
                        className="px-3 py-1 text-sm bg-gray-200 text-gray-700 rounded hover:bg-gray-300"
                      >
                        Cancel
                      </button>
                    </div>
                  </div>
                ) : (
                  <p className="text-sm text-gray-700">{event.patientNote}</p>
                )}
              </div>
            ))}
          </div>
        )}

        <div className="border-t pt-4 mt-4">
          <h3 className="text-sm font-medium text-gray-900 mb-3">Add New Event</h3>
          <div className="space-y-3">
            <div>
              <label className="block text-xs font-medium text-gray-700 mb-1">
                Day
              </label>
              <input
                type="number"
                min="1"
                value={newDay}
                onChange={(e) => setNewDay(e.target.value)}
                className="block w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
                placeholder="1"
              />
            </div>
            <div>
              <label className="block text-xs font-medium text-gray-700 mb-1">
                Patient Note
              </label>
              <textarea
                value={newNote}
                onChange={(e) => setNewNote(e.target.value)}
                className="block w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
                rows={3}
                placeholder="Enter patient observations, symptoms, or updates..."
              />
            </div>
            <button
              onClick={handleAddEvent}
              disabled={!newDay || !newNote}
              className="w-full px-4 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Add Event
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
