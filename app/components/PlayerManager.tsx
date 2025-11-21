'use client';

import { Edit2, Plus, Save, Trash2, User, X } from 'lucide-react';
import { useState } from 'react';
import { useAppStore } from '../store';

export default function PlayerManager() {
  const { players, addPlayer, deletePlayer, updatePlayer } = useAppStore();
  const [newName, setNewName] = useState('');
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editName, setEditName] = useState('');

  const handleAddPlayer = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newName.trim()) return;

    addPlayer({
      id: crypto.randomUUID(),
      name: newName.trim(),
      avatar: `https://api.dicebear.com/7.x/avataaars/svg?seed=${newName.trim()}`,
    });
    setNewName('');
  };

  const startEditing = (player: { id: string, name: string }) => {
    setEditingId(player.id);
    setEditName(player.name);
  };

  const saveEdit = () => {
    if (editingId && editName.trim()) {
      const player = players.find(p => p.id === editingId);
      if (player) {
        updatePlayer({
          ...player,
          name: editName.trim(),
          avatar: `https://api.dicebear.com/7.x/avataaars/svg?seed=${editName.trim()}`,
        });
      }
      setEditingId(null);
      setEditName('');
    }
  };

  return (
    <div className="space-y-6">
      <div className="bg-white dark:bg-zinc-900 p-6 rounded-xl shadow-sm border border-zinc-200 dark:border-zinc-800">
        <h2 className="text-xl font-bold mb-4 text-zinc-900 dark:text-zinc-100 flex items-center gap-2">
          <User className="text-indigo-500" /> Quản Lý Người Chơi
        </h2>

        <form onSubmit={handleAddPlayer} className="flex gap-2 mb-6">
          <input
            type="text"
            value={newName}
            onChange={(e) => setNewName(e.target.value)}
            placeholder="Nhập tên người chơi..."
            className="flex-1 px-4 py-2 rounded-lg border border-zinc-200 dark:border-zinc-700 bg-zinc-50 dark:bg-zinc-800 focus:outline-none focus:ring-2 focus:ring-indigo-500"
          />
          <button
            type="submit"
            className="px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors flex items-center gap-2 font-medium"
          >
            <Plus size={20} /> Thêm
          </button>
        </form>

        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3">
          {players.map((player) => (
            <div
              key={player.id}
              className="flex items-center justify-between p-3 rounded-lg bg-zinc-50 dark:bg-zinc-800/50 border border-zinc-200 dark:border-zinc-700 group hover:border-indigo-500/50 transition-colors"
            >
              <div className="flex items-center gap-3 overflow-hidden">
                <img
                  src={player.avatar}
                  alt={player.name}
                  className="w-10 h-10 rounded-full bg-white dark:bg-zinc-700"
                />
                {editingId === player.id ? (
                  <input
                    type="text"
                    value={editName}
                    onChange={(e) => setEditName(e.target.value)}
                    className="w-full px-2 py-1 text-sm rounded border border-indigo-500 bg-white dark:bg-zinc-900 focus:outline-none"
                    autoFocus
                  />
                ) : (
                  <span className="font-medium truncate text-zinc-700 dark:text-zinc-200">
                    {player.name}
                  </span>
                )}
              </div>

              <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                {editingId === player.id ? (
                  <>
                    <button
                      onClick={saveEdit}
                      className="p-1.5 text-green-600 hover:bg-green-100 dark:hover:bg-green-900/30 rounded-md transition-colors"
                    >
                      <Save size={16} />
                    </button>
                    <button
                      onClick={() => setEditingId(null)}
                      className="p-1.5 text-zinc-500 hover:bg-zinc-100 dark:hover:bg-zinc-700 rounded-md transition-colors"
                    >
                      <X size={16} />
                    </button>
                  </>
                ) : (
                  <>
                    <button
                      onClick={() => startEditing(player)}
                      className="p-1.5 text-indigo-500 hover:bg-indigo-50 dark:hover:bg-indigo-900/30 rounded-md transition-colors"
                    >
                      <Edit2 size={16} />
                    </button>
                    <button
                      onClick={() => deletePlayer(player.id)}
                      className="p-1.5 text-red-500 hover:bg-red-50 dark:hover:bg-red-900/30 rounded-md transition-colors"
                    >
                      <Trash2 size={16} />
                    </button>
                  </>
                )}
              </div>
            </div>
          ))}

          {players.length === 0 && (
            <div className="col-span-full text-center py-8 text-zinc-500 dark:text-zinc-400 italic">
              Chưa có người chơi nào. Hãy thêm người chơi mới!
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
