'use client';

import { History, Moon, Play, Users } from 'lucide-react';
import { useState } from 'react';
import GameHistory from './components/GameHistory';
import GameSession from './components/GameSession';
import GameSetup from './components/GameSetup';
import GroupManager from './components/GroupManager';
import PlayerManager from './components/PlayerManager';
import { useAppStore } from './store';

export default function Home() {
  const { currentSession } = useAppStore();
  const [activeTab, setActiveTab] = useState<'GAME' | 'PLAYERS' | 'GROUPS' | 'HISTORY'>('GAME');

  return (
    <div className="min-h-screen bg-zinc-50 dark:bg-zinc-950 text-zinc-900 dark:text-zinc-100 font-sans selection:bg-indigo-100 dark:selection:bg-indigo-900/30">
      {/* Header & Navigation */}
      <header className="sticky top-0 z-40 bg-white/80 dark:bg-zinc-900/80 backdrop-blur-md border-b border-zinc-200 dark:border-zinc-800">
        <div className="max-w-5xl mx-auto px-4 h-16 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 bg-indigo-600 rounded-lg flex items-center justify-center text-white font-bold shadow-lg shadow-indigo-500/20">
              <Moon size={20} />
            </div>
            <h1 className="text-xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-indigo-600 to-violet-600 dark:from-indigo-400 dark:to-violet-400">
              Ma Sói Manager
            </h1>
          </div>

          <nav className="flex items-center gap-1 bg-zinc-100 dark:bg-zinc-800/50 p-1 rounded-xl overflow-x-auto">
            <button
              onClick={() => setActiveTab('GAME')}
              className={`px-3 py-1.5 rounded-lg text-sm font-medium flex items-center gap-2 transition-all ${activeTab === 'GAME'
                ? 'bg-white dark:bg-zinc-800 text-indigo-600 dark:text-indigo-400 shadow-sm'
                : 'text-zinc-500 hover:text-zinc-900 dark:text-zinc-400 dark:hover:text-zinc-200'
                }`}
            >
              <Play size={18} />
              <span className="hidden sm:inline">Game</span>
            </button>

            <button
              onClick={() => setActiveTab('PLAYERS')}
              className={`px-3 py-1.5 rounded-lg text-sm font-medium flex items-center gap-2 transition-all ${activeTab === 'PLAYERS'
                ? 'bg-white dark:bg-zinc-800 text-indigo-600 dark:text-indigo-400 shadow-sm'
                : 'text-zinc-500 hover:text-zinc-900 dark:text-zinc-400 dark:hover:text-zinc-200'
                }`}
            >
              <Users size={18} />
              <span className="hidden sm:inline">Players</span>
            </button>

            <button
              onClick={() => setActiveTab('GROUPS')}
              className={`px-3 py-1.5 rounded-lg text-sm font-medium flex items-center gap-2 transition-all ${activeTab === 'GROUPS'
                ? 'bg-white dark:bg-zinc-800 text-indigo-600 dark:text-indigo-400 shadow-sm'
                : 'text-zinc-500 hover:text-zinc-900 dark:text-zinc-400 dark:hover:text-zinc-200'
                }`}
            >
              <Users size={18} />
              <span className="hidden sm:inline">Groups</span>
            </button>

            <button
              onClick={() => setActiveTab('HISTORY')}
              className={`px-3 py-1.5 rounded-lg text-sm font-medium flex items-center gap-2 transition-all ${activeTab === 'HISTORY'
                ? 'bg-white dark:bg-zinc-800 text-indigo-600 dark:text-indigo-400 shadow-sm'
                : 'text-zinc-500 hover:text-zinc-900 dark:text-zinc-400 dark:hover:text-zinc-200'
                }`}
            >
              <History size={18} />
              <span className="hidden sm:inline">History</span>
            </button>
          </nav>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-5xl mx-auto px-4 py-8">
        {activeTab === 'PLAYERS' && <PlayerManager />}
        {activeTab === 'GROUPS' && <GroupManager />}
        {activeTab === 'HISTORY' && <GameHistory />}
        {activeTab === 'GAME' && (
          <div className="animate-in fade-in slide-in-from-bottom-4 duration-500">
            {currentSession ? (
              <GameSession />
            ) : (
              <GameSetup onStartGame={() => { }} />
            )}
          </div>
        )}
      </main>
    </div>
  );
}
