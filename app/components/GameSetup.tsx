'use client';

import { AlertTriangle, ChevronDown, Play } from 'lucide-react';
import { useEffect, useState } from 'react';
import { calculateBalance, ROLES, suggestRoles } from '../lib/gameLogic';
import { useAppStore } from '../store';
import { GamePlayer, GameSession, Role, RoleType } from '../types';
import RoleDetailModal from './RoleDetailModal';

interface GameSetupProps {
  onStartGame: () => void;
}

export default function GameSetup({ onStartGame }: GameSetupProps) {
  const { players, groups, setSession } = useAppStore();

  const [selectedGroupId, setSelectedGroupId] = useState<string>('');
  const [selectedPlayerIds, setSelectedPlayerIds] = useState<Set<string>>(new Set());
  const [selectedRoles, setSelectedRoles] = useState<Role[]>([]);
  const [viewingRole, setViewingRole] = useState<Role | null>(null);

  // Load group players when group changes
  useEffect(() => {
    if (selectedGroupId) {
      const group = groups.find(g => g.id === selectedGroupId);
      if (group) {
        setSelectedPlayerIds(new Set(group.playerIds));
      }
    }
  }, [selectedGroupId, groups]);

  // Auto-suggest roles when player count changes
  useEffect(() => {
    const count = selectedPlayerIds.size;
    if (count >= 4) {
      setSelectedRoles(suggestRoles(count));
    } else {
      setSelectedRoles([]);
    }
  }, [selectedPlayerIds.size]);

  const playerCount = selectedPlayerIds.size;
  const balanceScore = calculateBalance(selectedRoles);

  const handleRoleChange = (roleType: RoleType, delta: number) => {
    const currentCount = selectedRoles.filter(r => r.id === roleType).length;
    const role = ROLES[roleType];

    if (delta > 0) {
      // Adding role
      if (role.maxCount && currentCount >= role.maxCount) return;
      if (selectedRoles.length >= playerCount) return; // Can't have more roles than players

      setSelectedRoles([...selectedRoles, role]);
    } else {
      // Removing role
      if (currentCount === 0) return;

      const index = selectedRoles.findIndex(r => r.id === roleType);
      if (index > -1) {
        const newRoles = [...selectedRoles];
        newRoles.splice(index, 1);
        setSelectedRoles(newRoles);
      }
    }
  };

  const handleStartGame = () => {
    if (selectedRoles.length !== playerCount) return;

    // Don't shuffle or assign roles yet. Just create players with null roles.
    const gamePlayers: GamePlayer[] = Array.from(selectedPlayerIds).map((pid) => {
      const player = players.find(p => p.id === pid)!;
      return {
        ...player,
        role: null, // Role will be assigned in Night 1
        isAlive: true,
        statusEffects: [],
      };
    });

    const newSession: GameSession = {
      id: crypto.randomUUID(),
      startTime: Date.now(),
      players: gamePlayers,
      rolePool: selectedRoles, // Store selected roles for assignment
      status: 'PLAYING',
      phase: 'NIGHT',
      round: 1,
      events: [],
      actions: [],
    };

    setSession(newSession);
    onStartGame();
  };

  const togglePlayerSelection = (playerId: string) => {
    const newSelection = new Set(selectedPlayerIds);
    if (newSelection.has(playerId)) {
      newSelection.delete(playerId);
    } else {
      newSelection.add(playerId);
    }
    setSelectedPlayerIds(newSelection);
    setSelectedGroupId(''); // Clear group selection if manually modifying
  };

  return (
    <div className="p-4 sm:p-6 bg-white dark:bg-zinc-900 rounded-xl shadow-sm border border-zinc-200 dark:border-zinc-800 pb-24 lg:pb-6">
      <h2 className="text-2xl font-bold mb-6 text-zinc-900 dark:text-zinc-100">Thiết Lập Game Mới</h2>

      {/* Step 1: Select Players */}
      <div className="mb-8">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between mb-4 gap-2">
          <h3 className="font-semibold text-lg text-zinc-900 dark:text-zinc-100">1. Chọn Người Chơi ({playerCount})</h3>
          <div className="relative w-full sm:w-auto">
            <select
              value={selectedGroupId}
              onChange={(e) => setSelectedGroupId(e.target.value)}
              className="w-full sm:w-auto pl-3 pr-10 py-2 rounded-lg border border-zinc-300 dark:border-zinc-700 bg-white dark:bg-zinc-800 text-sm appearance-none focus:outline-none focus:ring-2 focus:ring-indigo-500"
            >
              <option value="">Chọn Tùy Chỉnh</option>
              {groups.map(g => (
                <option key={g.id} value={g.id}>{g.name} ({g.playerIds.length})</option>
              ))}
            </select>
            <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 text-zinc-500 pointer-events-none" size={16} />
          </div>
        </div>

        <div className="grid grid-cols-2 gap-2 max-h-60 overflow-y-auto mb-2 p-1">
          {players.map((player) => (
            <button
              key={player.id}
              onClick={() => togglePlayerSelection(player.id)}
              className={`flex items-center gap-3 p-3 rounded-xl border text-sm transition-all active:scale-95 ${selectedPlayerIds.has(player.id)
                ? 'bg-indigo-50 border-indigo-500 text-indigo-700 dark:bg-indigo-900/30 dark:border-indigo-500 dark:text-indigo-300 shadow-sm'
                : 'bg-white border-zinc-200 text-zinc-600 hover:border-zinc-300 dark:bg-zinc-800 dark:border-zinc-700 dark:text-zinc-400'
                }`}
            >
              <div className={`w-4 h-4 rounded-full border flex items-center justify-center flex-shrink-0 ${selectedPlayerIds.has(player.id) ? 'bg-indigo-500 border-indigo-500' : 'border-zinc-400'
                }`} />
              <span className="truncate font-medium">{player.name}</span>
            </button>
          ))}
        </div>
        {playerCount < 4 && (
          <p className="text-amber-600 text-sm flex items-center gap-1 mt-2">
            <AlertTriangle size={14} /> Cần ít nhất 4 người chơi để bắt đầu.
          </p>
        )}
      </div>

      {/* Step 2: Select Roles */}
      {playerCount >= 4 && (
        <div className="mb-8">
          <div className="flex items-center justify-between mb-4 sticky top-0 bg-white dark:bg-zinc-900 z-10 py-2">
            <h3 className="font-semibold text-lg text-zinc-900 dark:text-zinc-100">
              2. Gán Vai Trò ({selectedRoles.length}/{playerCount})
            </h3>
            <div className={`px-3 py-1 rounded-full text-sm font-bold ${Math.abs(balanceScore) <= 3 ? 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400' :
              'bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-400'
              }`}>
              {balanceScore > 0 ? '+' : ''}{balanceScore}
            </div>
          </div>

          <div className="grid grid-cols-1 gap-3">
            {Object.values(ROLES).map((role) => {
              const count = selectedRoles.filter(r => r.id === role.id).length;
              return (
                <div key={role.id} className="flex items-center justify-between p-3 bg-zinc-50 dark:bg-zinc-800/50 rounded-xl border border-zinc-200 dark:border-zinc-700/50">
                  <div
                    className="flex items-center gap-3 cursor-pointer flex-1"
                    onClick={() => setViewingRole(role)}
                  >
                    <div className="w-12 h-12 bg-zinc-300 dark:bg-zinc-600 rounded-lg flex-shrink-0 overflow-hidden relative group">
                      <img src={role.image} alt={role.name} className="w-full h-full object-cover" />
                    </div>
                    <div>
                      <div className="font-bold text-zinc-900 dark:text-zinc-100">{role.name}</div>
                      <div className="text-xs text-zinc-500 dark:text-zinc-400">Điểm: {role.balanceScore}</div>
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <button
                      onClick={() => handleRoleChange(role.id, -1)}
                      disabled={count === 0}
                      className="w-10 h-10 flex items-center justify-center rounded-full bg-white dark:bg-zinc-700 border border-zinc-200 dark:border-zinc-600 hover:bg-zinc-100 dark:hover:bg-zinc-600 disabled:opacity-50 active:scale-95 transition-transform"
                    >
                      -
                    </button>
                    <span className="w-6 text-center font-bold text-lg">{count}</span>
                    <button
                      onClick={() => handleRoleChange(role.id, 1)}
                      disabled={(role.maxCount && count >= role.maxCount) || selectedRoles.length >= playerCount}
                      className="w-10 h-10 flex items-center justify-center rounded-full bg-white dark:bg-zinc-700 border border-zinc-200 dark:border-zinc-600 hover:bg-zinc-100 dark:hover:bg-zinc-600 disabled:opacity-50 active:scale-95 transition-transform"
                    >
                      +
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      <div className="fixed bottom-20 left-4 right-4 lg:static lg:mt-8 z-20">
        <button
          onClick={handleStartGame}
          disabled={playerCount < 4 || selectedRoles.length !== playerCount}
          className="w-full py-4 bg-indigo-600 hover:bg-indigo-700 disabled:opacity-50 disabled:cursor-not-allowed text-white rounded-xl font-bold text-lg shadow-xl shadow-indigo-500/30 flex items-center justify-center gap-2 transition-all active:scale-95"
        >
          <Play size={24} />
          Bắt Đầu Game
        </button>
      </div>

      <RoleDetailModal role={viewingRole} onClose={() => setViewingRole(null)} />
    </div>
  );
}
