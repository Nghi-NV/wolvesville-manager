'use client';

import { Check, ChevronDown, ChevronUp, Plus, Trash2, Users } from 'lucide-react';
import { useState } from 'react';
import { useAppStore } from '../store';

export default function GroupManager() {
  const { groups, players, addGroup, deleteGroup, updateGroup } = useAppStore();
  const [newGroupName, setNewGroupName] = useState('');
  const [expandedGroupId, setExpandedGroupId] = useState<string | null>(null);

  const handleAddGroup = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newGroupName.trim()) return;

    addGroup({
      id: crypto.randomUUID(),
      name: newGroupName.trim(),
      playerIds: [],
    });
    setNewGroupName('');
  };

  const togglePlayerInGroup = (groupId: string, playerId: string) => {
    const group = groups.find(g => g.id === groupId);
    if (!group) return;

    const isSelected = group.playerIds.includes(playerId);
    const newPlayerIds = isSelected
      ? group.playerIds.filter(id => id !== playerId)
      : [...group.playerIds, playerId];

    updateGroup({ ...group, playerIds: newPlayerIds });
  };

  return (
    <div className="space-y-6">
      <div className="bg-white dark:bg-zinc-900 p-6 rounded-xl shadow-sm border border-zinc-200 dark:border-zinc-800">
        <h2 className="text-xl font-bold mb-4 text-zinc-900 dark:text-zinc-100 flex items-center gap-2">
          <Users className="text-indigo-500" /> Quản Lý Nhóm
        </h2>

        <form onSubmit={handleAddGroup} className="flex gap-2 mb-6">
          <input
            type="text"
            value={newGroupName}
            onChange={(e) => setNewGroupName(e.target.value)}
            placeholder="Nhập tên nhóm..."
            className="flex-1 px-4 py-2 rounded-lg border border-zinc-200 dark:border-zinc-700 bg-zinc-50 dark:bg-zinc-800 focus:outline-none focus:ring-2 focus:ring-indigo-500"
          />
          <button
            type="submit"
            className="px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors flex items-center gap-2 font-medium"
          >
            <Plus size={20} /> Tạo Nhóm
          </button>
        </form>

        <div className="space-y-4">
          {groups.map((group) => (
            <div
              key={group.id}
              className="border border-zinc-200 dark:border-zinc-800 rounded-xl overflow-hidden bg-zinc-50 dark:bg-zinc-800/30"
            >
              <div
                className="flex items-center justify-between p-4 cursor-pointer hover:bg-zinc-100 dark:hover:bg-zinc-800/50 transition-colors"
                onClick={() => setExpandedGroupId(expandedGroupId === group.id ? null : group.id)}
              >
                <div className="flex items-center gap-3">
                  <span className="font-bold text-lg text-zinc-800 dark:text-zinc-200">{group.name}</span>
                  <span className="px-2 py-0.5 bg-indigo-100 dark:bg-indigo-900/30 text-indigo-600 dark:text-indigo-400 text-xs font-bold rounded-full">
                    {group.playerIds.length} người
                  </span>
                </div>
                <div className="flex items-center gap-2">
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      deleteGroup(group.id);
                    }}
                    className="p-2 text-red-500 hover:bg-red-100 dark:hover:bg-red-900/30 rounded-lg transition-colors"
                  >
                    <Trash2 size={18} />
                  </button>
                  {expandedGroupId === group.id ? <ChevronUp size={20} className="text-zinc-400" /> : <ChevronDown size={20} className="text-zinc-400" />}
                </div>
              </div>

              {expandedGroupId === group.id && (
                <div className="p-4 border-t border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900">
                  <p className="text-sm text-zinc-500 dark:text-zinc-400 mb-3">Chọn người chơi cho nhóm này:</p>
                  <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-2">
                    {players.map((player) => {
                      const isSelected = group.playerIds.includes(player.id);
                      return (
                        <div
                          key={player.id}
                          onClick={() => togglePlayerInGroup(group.id, player.id)}
                          className={`flex items-center gap-3 p-2 rounded-lg border cursor-pointer transition-all ${isSelected
                            ? 'border-indigo-500 bg-indigo-50 dark:bg-indigo-900/20'
                            : 'border-zinc-200 dark:border-zinc-700 hover:border-indigo-300 dark:hover:border-indigo-700'
                            }`}
                        >
                          <div className={`w-5 h-5 rounded-full border flex items-center justify-center ${isSelected
                            ? 'bg-indigo-500 border-indigo-500 text-white'
                            : 'border-zinc-300 dark:border-zinc-600'
                            }`}>
                            {isSelected && <Check size={12} />}
                          </div>
                          <img src={player.avatar} alt={player.name} className="w-8 h-8 rounded-full" />
                          <span className={`text-sm font-medium ${isSelected ? 'text-indigo-700 dark:text-indigo-300' : 'text-zinc-700 dark:text-zinc-300'}`}>
                            {player.name}
                          </span>
                        </div>
                      );
                    })}
                  </div>
                  {players.length === 0 && (
                    <p className="text-center text-zinc-400 italic text-sm py-2">Chưa có người chơi nào. Hãy thêm người chơi trước.</p>
                  )}
                </div>
              )}
            </div>
          ))}

          {groups.length === 0 && (
            <div className="text-center py-8 text-zinc-500 dark:text-zinc-400 italic">
              Chưa có nhóm nào. Hãy tạo nhóm mới!
            </div>
          )}
        </div>

      </div>
    </div>
  );
}
