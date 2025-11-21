'use client';

import { ScrollText, Send } from 'lucide-react';
import { useState } from 'react';
import { useAppStore } from '../store';

export default function EventLog() {
  const { currentSession, addEvent } = useAppStore();
  const [newEvent, setNewEvent] = useState('');

  if (!currentSession) return null;

  const handleAddEvent = () => {
    if (!newEvent.trim()) return;
    addEvent(newEvent.trim());
    setNewEvent('');
  };

  return (
    <div className="bg-white dark:bg-zinc-900 rounded-xl border border-zinc-200 dark:border-zinc-800 p-4 flex flex-col h-full">
      <div className="flex items-center gap-2 mb-4 text-zinc-900 dark:text-zinc-100 font-semibold">
        <ScrollText size={20} className="text-indigo-500" />
        <h3>Nhật Ký Trò Chơi</h3>
      </div>

      <div className="flex-1 overflow-y-auto min-h-[200px] max-h-[300px] mb-4 space-y-2 pr-2">
        {currentSession.events && currentSession.events.length > 0 ? (
          currentSession.events.map((event: string, index: number) => (
            <div key={index} className="text-sm p-2 rounded bg-zinc-50 dark:bg-zinc-800/50 text-zinc-700 dark:text-zinc-300 border border-zinc-100 dark:border-zinc-700/50">
              {event}
            </div>
          ))
        ) : (
          <div className="text-center text-sm text-zinc-400 dark:text-zinc-500 py-8 italic">
            Chưa có sự kiện nào được ghi lại.
          </div>
        )}
      </div>

      <div className="flex gap-2">
        <input
          type="text"
          value={newEvent}
          onChange={(e) => setNewEvent(e.target.value)}
          onKeyDown={(e) => e.key === 'Enter' && handleAddEvent()}
          placeholder="Ghi lại sự kiện..."
          className="flex-1 px-3 py-2 text-sm rounded-lg border border-zinc-300 dark:border-zinc-700 bg-white dark:bg-zinc-800 text-zinc-900 dark:text-zinc-100 focus:outline-none focus:ring-2 focus:ring-indigo-500"
        />
        <button
          onClick={handleAddEvent}
          disabled={!newEvent.trim()}
          className="p-2 bg-indigo-600 hover:bg-indigo-700 disabled:opacity-50 text-white rounded-lg transition-colors"
        >
          <Send size={18} />
        </button>
      </div>
    </div>
  );
}
