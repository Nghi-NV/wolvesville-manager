'use client';

import { ArrowLeft, Eye, Heart, Moon, Search, Shield, Skull, Sun, X, Zap } from 'lucide-react';
import { useEffect, useMemo, useState } from 'react';
import { useAppStore } from '../store';
import { PlayerStatus, Role } from '../types';
import RoleDetailModal from './RoleDetailModal';

export default function GameSession() {
  const { currentSession, updateSession, archiveCurrentSession } = useAppStore();
  const [viewingRole, setViewingRole] = useState<Role | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [filterStatus, setFilterStatus] = useState<'ALL' | 'ALIVE' | 'DEAD'>('ALL');
  const [assigningRole, setAssigningRole] = useState<Role | null>(null);
  const [showEndGameModal, setShowEndGameModal] = useState(false);

  if (!currentSession) return null;

  // Auto-switch filter status based on dead players
  useEffect(() => {
    const hasDead = currentSession.players.some(p => !p.isAlive);
    if (hasDead && filterStatus === 'ALL') {
      setFilterStatus('ALIVE');
    } else if (!hasDead && filterStatus !== 'ALL') {
      setFilterStatus('ALL');
    }
  }, [currentSession.players, filterStatus]);

  const unassignedRoles = useMemo(() => {
    const assignedRoleIds = currentSession.players
      .map(p => p.role?.id)
      .filter(Boolean);

    const pool = [...(currentSession.rolePool || [])];
    assignedRoleIds.forEach(id => {
      const index = pool.findIndex(r => r.id === id);
      if (index !== -1) pool.splice(index, 1);
    });
    return pool;
  }, [currentSession.players, currentSession.rolePool]);

  const filteredPlayers = useMemo(() => {
    let players = currentSession.players.filter(player => {
      const matchesSearch = player.name.toLowerCase().includes(searchQuery.toLowerCase());
      const matchesFilter = filterStatus === 'ALL'
        ? true
        : filterStatus === 'ALIVE' ? player.isAlive : !player.isAlive;
      return matchesSearch && matchesFilter;
    });

    // Sort: Unassigned roles first, then assigned roles
    return players.sort((a, b) => {
      if (a.role === null && b.role !== null) return -1;
      if (a.role !== null && b.role === null) return 1;
      return 0;
    });
  }, [currentSession.players, searchQuery, filterStatus]);

  const handleAssignRole = (playerId: string, role: Role) => {
    const updatedPlayers = currentSession.players.map(p =>
      p.id === playerId ? { ...p, role } : p
    );
    updateSession({ ...currentSession, players: updatedPlayers });
    setAssigningRole(null);
  };

  const handleUnassignRole = (playerId: string) => {
    const updatedPlayers = currentSession.players.map(p =>
      p.id === playerId ? { ...p, role: null } : p
    );
    updateSession({ ...currentSession, players: updatedPlayers });
  };

  const toggleStatus = (playerId: string, status: PlayerStatus) => {
    const player = currentSession.players.find(p => p.id === playerId);
    if (!player) return;

    const currentEffects = player.statusEffects || [];
    const hasStatus = currentEffects.includes(status);

    let updatedPlayers = [...currentSession.players];

    // Logic enforcement
    if (!hasStatus) {
      if (status === 'PROTECTED') {
        // Bodyguard: Only protect 1 person. Remove PROTECTED from others.
        updatedPlayers = updatedPlayers.map(p => ({
          ...p,
          statusEffects: (p.statusEffects || []).filter(e => e !== 'PROTECTED')
        }));
      } else if (status === 'LINKED') {
        // Cupid: Only link 2 people. If 2 already linked, prevent or remove oldest?
        // Let's count current linked players
        const linkedCount = updatedPlayers.filter(p => (p.statusEffects || []).includes('LINKED')).length;
        if (linkedCount >= 2) {
          // Option: Remove from the first person found to maintain rolling window of 2
          // Or just return to prevent adding more than 2.
          // User said "chỉ bao gồm 2 người" (only consists of 2 people).
          // Let's remove the first one to allow changing selection easily.
          const firstLinked = updatedPlayers.find(p => (p.statusEffects || []).includes('LINKED'));
          if (firstLinked) {
            updatedPlayers = updatedPlayers.map(p =>
              p.id === firstLinked.id
                ? { ...p, statusEffects: (p.statusEffects || []).filter(e => e !== 'LINKED') }
                : p
            );
          }
        }
      }
    }

    // Apply toggle to target player
    updatedPlayers = updatedPlayers.map(p => {
      if (p.id !== playerId) return p;

      const effects = p.statusEffects || [];
      const newEffects = effects.includes(status)
        ? effects.filter(e => e !== status)
        : [...effects, status];

      return { ...p, statusEffects: newEffects };
    });

    updateSession({ ...currentSession, players: updatedPlayers });
  };

  const handleKill = (playerId: string) => {
    const updatedPlayers = currentSession.players.map(p =>
      p.id === playerId ? { ...p, isAlive: !p.isAlive } : p
    );
    updateSession({ ...currentSession, players: updatedPlayers });
  };

  const getStatusText = (status: PlayerStatus) => {
    switch (status) {
      case 'PROTECTED': return 'Được bảo vệ';
      case 'LINKED': return 'Kết đôi';
      case 'TARGETED': return 'Bị nhắm';
      case 'POISONED': return 'Trúng độc';
      case 'SILENCED': return 'Bị câm';
      default: return status;
    }
  };

  const getStatusIcon = (status: PlayerStatus) => {
    switch (status) {
      case 'PROTECTED': return <Shield size={14} className="text-blue-500" />;
      case 'LINKED': return <Heart size={14} className="text-pink-500" />;
      case 'TARGETED': return <Zap size={14} className="text-amber-500" />;
      case 'POISONED': return <Skull size={14} className="text-green-500" />;
      case 'SILENCED': return <Eye size={14} className="text-gray-500" />;
      default: return null;
    }
  };

  return (
    <div className="pb-24 lg:pb-0">
      {/* Header Controls */}
      <div className="sticky top-0 z-10 bg-white dark:bg-zinc-900 border-b border-zinc-200 dark:border-zinc-800 p-4 shadow-sm">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-3">
            <button onClick={() => archiveCurrentSession('OTHER')} className="p-2 hover:bg-zinc-100 dark:hover:bg-zinc-800 rounded-lg">
              <ArrowLeft size={20} />
            </button>
            <div>
              <h2 className="font-bold text-lg flex items-center gap-2 text-zinc-900 dark:text-zinc-100">
                {currentSession.phase === 'DAY' ? <Sun className="text-amber-500" /> : <Moon className="text-indigo-500" />}
                Vòng {currentSession.round}
              </h2>
              <p className="text-xs text-zinc-500 dark:text-zinc-400">
                {unassignedRoles.length > 0 ? 'Đang gán vai trò...' : 'Đang diễn ra'}
              </p>
            </div>
          </div>
          <div className="flex gap-2">
            <button
              onClick={() => updateSession({ ...currentSession, phase: currentSession.phase === 'DAY' ? 'NIGHT' : 'DAY', round: currentSession.phase === 'NIGHT' ? currentSession.round + 1 : currentSession.round })}
              className="px-3 py-1.5 bg-indigo-600 text-white text-sm font-medium rounded-lg hover:bg-indigo-700"
            >
              Chuyển {currentSession.phase === 'DAY' ? 'Đêm' : 'Ngày'}
            </button>
            <button
              onClick={() => setShowEndGameModal(true)}
              className="px-3 py-1.5 bg-red-600 text-white text-sm font-medium rounded-lg hover:bg-red-700"
            >
              Kết thúc
            </button>
          </div>
        </div>

        {/* End Game Modal */}
        {showEndGameModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm animate-in fade-in duration-200">
            <div className="bg-white dark:bg-zinc-900 rounded-2xl shadow-xl max-w-sm w-full p-6 border border-zinc-200 dark:border-zinc-800 scale-100 animate-in zoom-in-95 duration-200">
              <h3 className="text-xl font-bold text-zinc-900 dark:text-zinc-100 mb-2 text-center">
                Kết thúc trò chơi
              </h3>
              <p className="text-zinc-500 dark:text-zinc-400 text-center mb-6 text-sm">
                Xác nhận kết thúc game và chọn phe chiến thắng
              </p>

              <div className="flex flex-col gap-3">
                <button
                  onClick={() => {
                    archiveCurrentSession('VILLAGERS');
                    setShowEndGameModal(false);
                  }}
                  className="w-full p-4 rounded-xl bg-indigo-50 dark:bg-indigo-900/20 border-2 border-indigo-100 dark:border-indigo-800 hover:border-indigo-500 dark:hover:border-indigo-500 transition-all group text-left"
                >
                  <span className="block font-bold text-indigo-700 dark:text-indigo-300 group-hover:text-indigo-600 dark:group-hover:text-indigo-200">
                    Phe Dân Làng thắng
                  </span>
                  <span className="text-xs text-indigo-600/70 dark:text-indigo-400/70">
                    Bao gồm Dân, Tiên tri, Bảo vệ...
                  </span>
                </button>

                <button
                  onClick={() => {
                    archiveCurrentSession('WEREWOLVES');
                    setShowEndGameModal(false);
                  }}
                  className="w-full p-4 rounded-xl bg-red-50 dark:bg-red-900/20 border-2 border-red-100 dark:border-red-800 hover:border-red-500 dark:hover:border-red-500 transition-all group text-left"
                >
                  <span className="block font-bold text-red-700 dark:text-red-300 group-hover:text-red-600 dark:group-hover:text-red-200">
                    Phe Sói thắng
                  </span>
                  <span className="text-xs text-red-600/70 dark:text-red-400/70">
                    Sói đã tiêu diệt hết dân làng
                  </span>
                </button>

                <button
                  onClick={() => {
                    archiveCurrentSession('OTHER');
                    setShowEndGameModal(false);
                  }}
                  className="w-full p-4 rounded-xl bg-amber-50 dark:bg-amber-900/20 border-2 border-amber-100 dark:border-amber-800 hover:border-amber-500 dark:hover:border-amber-500 transition-all group text-left"
                >
                  <span className="block font-bold text-amber-700 dark:text-amber-300 group-hover:text-amber-600 dark:group-hover:text-amber-200">
                    Phe thứ 3 thắng
                  </span>
                  <span className="text-xs text-amber-600/70 dark:text-amber-400/70">
                    Chán đời, Kẻ chán đời...
                  </span>
                </button>
              </div>

              <button
                onClick={() => setShowEndGameModal(false)}
                className="mt-6 w-full py-3 text-zinc-500 dark:text-zinc-400 font-medium hover:text-zinc-800 dark:hover:text-zinc-200 transition-colors"
              >
                Hủy bỏ
              </button>
            </div>
          </div>
        )}

        {/* Search and Filter */}
        <div className="flex flex-col gap-3">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-zinc-400" size={16} />
            <input
              type="text"
              placeholder="Tìm người chơi..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-9 pr-4 py-2 bg-zinc-100 dark:bg-zinc-800 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 border border-zinc-200 dark:border-zinc-700"
            />
          </div>

          {currentSession.players.some(p => !p.isAlive) && (
            <div className="flex p-1 bg-zinc-100 dark:bg-zinc-800 rounded-lg border border-zinc-200 dark:border-zinc-700">
              <button
                onClick={() => setFilterStatus('ALIVE')}
                className={`flex-1 py-1.5 text-sm font-medium rounded-md transition-all ${filterStatus === 'ALIVE'
                  ? 'bg-white dark:bg-zinc-700 text-zinc-900 dark:text-zinc-100 shadow-sm'
                  : 'text-zinc-500 dark:text-zinc-400 hover:text-zinc-700 dark:hover:text-zinc-200'
                  }`}
              >
                Còn sống ({currentSession.players.filter(p => p.isAlive).length})
              </button>
              <button
                onClick={() => setFilterStatus('DEAD')}
                className={`flex-1 py-1.5 text-sm font-medium rounded-md transition-all ${filterStatus === 'DEAD'
                  ? 'bg-white dark:bg-zinc-700 text-zinc-900 dark:text-zinc-100 shadow-sm'
                  : 'text-zinc-500 dark:text-zinc-400 hover:text-zinc-700 dark:hover:text-zinc-200'
                  }`}
              >
                Đã chết ({currentSession.players.filter(p => !p.isAlive).length})
              </button>
            </div>
          )}
        </div>
      </div>

      {/* Unassigned Roles Bar */}
      {unassignedRoles.length > 0 && (
        <div className="bg-amber-50 dark:bg-amber-900/20 p-4 border-b border-amber-100 dark:border-amber-800/30">
          <p className="text-xs font-bold text-amber-700 dark:text-amber-400 mb-2 uppercase tracking-wider">
            Vai trò chưa gán ({unassignedRoles.length})
          </p>
          <div className="flex flex-wrap gap-2">
            {unassignedRoles.map((role, idx) => (
              <button
                key={`${role.id}-${idx}`}
                onClick={() => setAssigningRole(role)}
                className={`flex items-center gap-2 px-3 py-1.5 rounded-full border text-sm font-medium whitespace-nowrap transition-all ${assigningRole === role
                  ? 'bg-amber-500 border-amber-500 text-white shadow-md scale-105'
                  : 'bg-white dark:bg-zinc-800 border-amber-200 dark:border-amber-800 text-zinc-700 dark:text-zinc-300 hover:border-amber-400'
                  }`}
              >
                <img src={role.image} alt="" className="w-5 h-5 rounded-full object-cover" />
                {role.name}
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Players Grid */}
      <div className="p-4 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
        {filteredPlayers.map(player => (
          <div
            key={player.id}
            className={`relative flex flex-col gap-3 p-3 rounded-xl border transition-all ${!player.isAlive
              ? 'bg-zinc-100 dark:bg-zinc-900 border-zinc-200 dark:border-zinc-800 opacity-75'
              : 'bg-white dark:bg-zinc-800/50 border-zinc-200 dark:border-zinc-700 shadow-sm'
              }`}
          >
            {/* Player Header */}
            <div className="flex items-start justify-between gap-3">
              <div className="flex items-center gap-3 overflow-hidden">
                <div className={`w-10 h-10 rounded-full border-2 flex-shrink-0 overflow-hidden ${player.isAlive ? 'border-green-500' : 'border-zinc-400 grayscale'
                  }`}>
                  <img src={player.avatar} alt={player.name} className="w-full h-full object-cover" />
                </div>
                <div className="min-w-0">
                  <h3 className={`font-bold truncate text-zinc-900 dark:text-zinc-100 ${!player.isAlive && 'line-through text-zinc-500'}`}>
                    {player.name}
                  </h3>
                  {player.role ? (
                    <div className="flex items-center gap-2">
                      <div
                        onClick={() => setViewingRole(player.role)}
                        className="flex items-center gap-1.5 text-xs text-indigo-600 dark:text-indigo-400 cursor-pointer hover:underline"
                      >
                        <img src={player.role.image} alt="" className="w-3 h-3 rounded-full object-cover" />
                        {player.role.name}
                      </div>
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          handleUnassignRole(player.id);
                        }}
                        className="p-0.5 text-zinc-400 hover:text-red-500 hover:bg-red-50 rounded transition-colors"
                        title="Gỡ vai trò"
                      >
                        <X size={12} />
                      </button>
                    </div>
                  ) : (
                    <button
                      onClick={() => {
                        if (assigningRole) handleAssignRole(player.id, assigningRole);
                      }}
                      className={`text-xs font-medium px-2 py-0.5 rounded border border-dashed ${assigningRole
                        ? 'bg-indigo-50 text-indigo-600 border-indigo-300 animate-pulse cursor-pointer'
                        : 'text-zinc-400 border-zinc-300 cursor-not-allowed'
                        }`}
                    >
                      {assigningRole ? 'Gán vai trò này' : 'Chưa có vai trò'}
                    </button>
                  )}
                </div>
              </div>

              <div className="flex flex-col gap-1 items-end">
                <button
                  onClick={() => handleKill(player.id)}
                  className={`p-1.5 rounded-lg transition-colors ${player.isAlive
                    ? 'text-zinc-400 hover:bg-red-50 hover:text-red-500'
                    : 'text-red-500 bg-red-50 dark:bg-red-900/20'
                    }`}
                >
                  <Skull size={16} />
                </button>
              </div>
            </div>

            {/* Status Effects */}
            <div className="flex flex-wrap gap-1.5 pt-2 border-t border-zinc-100 dark:border-zinc-700/50">
              {(player.statusEffects || []).map(status => (
                <div key={status} className="flex items-center gap-1 px-1.5 py-0.5 bg-zinc-100 dark:bg-zinc-700 rounded text-[10px] font-medium text-zinc-600 dark:text-zinc-300">
                  {getStatusIcon(status)}
                  {getStatusText(status)}
                  <button
                    onClick={() => toggleStatus(player.id, status)}
                    className="ml-1 hover:text-red-500"
                  >
                    &times;
                  </button>
                </div>
              ))}

              {/* Add Status Buttons */}
              <div className="flex gap-1 ml-auto">
                <button onClick={() => toggleStatus(player.id, 'PROTECTED')} className="p-1 text-blue-400 hover:bg-blue-50 rounded" title="Bảo vệ">
                  <Shield size={14} />
                </button>
                <button onClick={() => toggleStatus(player.id, 'LINKED')} className="p-1 text-pink-400 hover:bg-pink-50 rounded" title="Ghép đôi">
                  <Heart size={14} />
                </button>
                <button onClick={() => toggleStatus(player.id, 'POISONED')} className="p-1 text-green-400 hover:bg-green-50 rounded" title="Đầu độc">
                  <Skull size={14} />
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      <RoleDetailModal role={viewingRole} onClose={() => setViewingRole(null)} />
    </div>
  );
}
