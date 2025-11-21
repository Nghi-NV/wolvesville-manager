'use client';

import { X } from 'lucide-react';
import { Role } from '../types';

interface RoleDetailModalProps {
  role: Role | null;
  onClose: () => void;
}

export default function RoleDetailModal({ role, onClose }: RoleDetailModalProps) {
  if (!role) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-in fade-in duration-200">
      <div
        className="relative w-full max-w-md bg-white dark:bg-zinc-900 rounded-2xl shadow-2xl overflow-hidden animate-in zoom-in-95 duration-200"
        onClick={(e) => e.stopPropagation()}
      >
        <button
          onClick={onClose}
          className="absolute top-4 right-4 z-10 p-2 bg-black/20 hover:bg-black/40 text-white rounded-full transition-colors"
        >
          <X size={20} />
        </button>

        <div className="relative h-64 sm:h-80 bg-zinc-100 dark:bg-zinc-800">
          <img
            src={role.image}
            alt={role.name}
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent" />
          <div className="absolute bottom-0 left-0 p-6">
            <h2 className="text-3xl font-bold text-white mb-1">{role.name}</h2>
            <div className={`inline-block px-3 py-1 rounded-full text-xs font-bold ${role.balanceScore > 0
              ? 'bg-green-500/20 text-green-200 border border-green-500/30'
              : 'bg-red-500/20 text-red-200 border border-red-500/30'
              }`}>
              Điểm cân bằng: {role.balanceScore > 0 ? '+' : ''}{role.balanceScore}
            </div>
          </div>
        </div>

        <div className="p-6">
          <h3 className="text-sm font-semibold text-zinc-500 dark:text-zinc-400 uppercase tracking-wider mb-2">
            Kỹ Năng
          </h3>
          <p className="text-lg text-zinc-900 dark:text-zinc-100 leading-relaxed">
            {role.description}
          </p>

          <div className="mt-8 flex justify-end">
            <button
              onClick={onClose}
              className="px-6 py-2 bg-zinc-100 hover:bg-zinc-200 dark:bg-zinc-800 dark:hover:bg-zinc-700 text-zinc-900 dark:text-zinc-100 rounded-lg font-medium transition-colors"
            >
              Đóng
            </button>
          </div>
        </div>
      </div>

      {/* Backdrop click to close */}
      <div className="absolute inset-0 -z-10" onClick={onClose} />
    </div>
  );
}
