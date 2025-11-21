'use client';

import { Calendar, ChevronDown, ChevronUp, Clock, Skull, Trophy, Users } from 'lucide-react';
import { useState } from 'react';
import { useAppStore } from '../store';

export default function GameHistory() {
  const { gameHistory } = useAppStore();
  const [expandedGameId, setExpandedGameId] = useState<string | null>(null);

  if (gameHistory.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-20 text-zinc-400 dark:text-zinc-500">
        <Clock size={48} className="mb-4 opacity-50" />
        <p className="text-lg font-medium">Chưa có lịch sử trò chơi.</p>
        <p className="text-sm">Hoàn thành một trò chơi để xem lại tại đây.</p>
      </div>
    );
  }

  const toggleExpand = (id: string) => {
    setExpandedGameId(expandedGameId === id ? null : id);
  };

  const formatDuration = (start: number, end?: number) => {
    if (!end) return 'Không rõ';
    const minutes = Math.floor((end - start) / 60000);
    return `${minutes} phút`;
  };

  const formatDate = (timestamp: number) => {
    return new Date(timestamp).toLocaleDateString('vi-VN', {
      weekday: 'short',
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  return (
    <div className="space-y-4">
      {gameHistory.map((game) => (
        <div key={game.id} className="bg-white dark:bg-zinc-900 rounded-xl border border-zinc-200 dark:border-zinc-800 overflow-hidden">
          <div className="p-4 flex items-center justify-between cursor-pointer hover:bg-zinc-50 dark:hover:bg-zinc-800/50 transition-colors" onClick={() => toggleExpand(game.id)}>
            <div className="flex items-center gap-4">
              <div className={`w-12 h-12 rounded-full flex items-center justify-center ${game.winner === 'VILLAGERS'
                ? 'bg-green-100 text-green-600 dark:bg-green-900/30 dark:text-green-400'
                : game.winner === 'WEREWOLVES'
                  ? 'bg-red-100 text-red-600 dark:bg-red-900/30 dark:text-red-400'
                  : 'bg-zinc-100 text-zinc-600 dark:bg-zinc-800 dark:text-zinc-400'}`}
              >
                {game.winner === 'VILLAGERS' ? <Trophy size={20} /> : game.winner === 'WEREWOLVES' ? <Skull size={20} /> : <Users size={20} />}
              </div>
              <div>
                <div className="font-bold text-zinc-900 dark:text-zinc-100">
                  {game.winner === 'VILLAGERS' ? 'Dân Làng Thắng' : game.winner === 'WEREWOLVES' ? 'Ma Sói Thắng' : 'Hòa / Khác'}
                </div>
                <div className="flex items-center gap-3 text-xs text-zinc-500 dark:text-zinc-400 mt-1">
                  <span className="flex items-center gap-1"><Calendar size={12} /> {formatDate(game.startTime)}</span>
                  <span className="flex items-center gap-1"><Clock size={12} /> {formatDuration(game.startTime, game.endTime)}</span>
                  <span className="flex items-center gap-1"><Users size={12} /> {game.players.length} Người chơi</span>
                </div>
              </div>
            </div>
            <div className="text-zinc-400">{expandedGameId === game.id ? <ChevronUp size={20} /> : <ChevronDown size={20} />}</div>
          </div>
          {expandedGameId === game.id && (
            <div className="p-4 border-t border-zinc-200 dark:border-zinc-800 bg-zinc-50 dark:bg-zinc-900/50">
              <h4 className="text-sm font-semibold text-zinc-500 dark:text-zinc-400 mb-3 uppercase tracking-wider">Vai Trò Người Chơi</h4>
              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-2">
                {game.players.map((p) => (
                  <div key={p.id} className="flex items-center gap-2 p-2 rounded bg-white dark:bg-zinc-800 border border-zinc-200 dark:border-zinc-700">
                    {p.role && <img src={p.role.image} alt={p.role.name} className="w-6 h-6 rounded-full object-cover" />}
                    <div className="min-w-0">
                      <div className="text-sm font-medium text-zinc-900 dark:text-zinc-100 truncate">{p.name}</div>
                      {p.role ? (
                        <div className="text-xs text-zinc-500 dark:text-zinc-400 truncate">{p.role.name}</div>
                      ) : (
                        <div className="text-xs text-zinc-500 dark:text-zinc-400 truncate">Chưa có vai trò</div>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      ))}
    </div>
  );
}
