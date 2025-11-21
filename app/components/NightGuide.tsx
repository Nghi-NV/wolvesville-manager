'use client';

import { Moon } from 'lucide-react';
import { useAppStore } from '../store';
import { RoleType } from '../types';

const NIGHT_ORDER: { role: RoleType; action: string }[] = [
  { role: 'CUPID', action: 'Gọi Cupid dậy. Yêu cầu ghép đôi hai người chơi.' },
  { role: 'ZOMBIE', action: 'Gọi Zombie dậy. Hỏi xem họ có muốn sử dụng kỹ năng không.' },
  { role: 'SEER', action: 'Gọi Tiên Tri dậy. Hỏi xem họ muốn soi ai.' },
  { role: 'BODYGUARD', action: 'Gọi Bảo Vệ dậy. Hỏi xem họ muốn bảo vệ ai.' },
  { role: 'WEREWOLF', action: 'Gọi Ma Sói dậy. Hỏi xem họ muốn giết ai.' },
  { role: 'MINION', action: 'Gọi Kẻ Phản Bội dậy. Cho họ biết ai là Ma Sói.' },
  { role: 'WITCH', action: 'Gọi Phù Thủy dậy. Chỉ nạn nhân. Hỏi xem có muốn cứu hoặc giết ai không.' },
  { role: 'HUNTER', action: 'Gọi Thợ Săn dậy. (Chỉ gọi nếu cần xác nhận vai trò).' },
];

export default function NightGuide() {
  const { currentSession } = useAppStore();

  if (!currentSession) return null;

  // Filter roles that are actually in the game
  const activeSteps = NIGHT_ORDER.filter((step) =>
    currentSession.players.some((p) => p.role.id === step.role && p.isAlive)
  );

  return (
    <div className="bg-white dark:bg-zinc-900 rounded-xl border border-zinc-200 dark:border-zinc-800 p-4">
      <div className="flex items-center gap-2 mb-4 text-zinc-900 dark:text-zinc-100 font-semibold">
        <Moon size={20} className="text-indigo-500" />
        <h3>Hướng Dẫn Ban Đêm</h3>
      </div>

      <div className="space-y-3">
        {activeSteps.length > 0 ? (
          activeSteps.map((step, index) => (
            <div
              key={step.role}
              className="flex items-start gap-3 p-3 rounded-lg bg-zinc-50 dark:bg-zinc-800/50 border border-zinc-100 dark:border-zinc-700/50"
            >
              <div className="flex-shrink-0 w-6 h-6 rounded-full bg-indigo-100 dark:bg-indigo-900/50 text-indigo-600 dark:text-indigo-400 flex items-center justify-center text-sm font-bold">
                {index + 1}
              </div>
              <div>
                <div className="font-medium text-zinc-900 dark:text-zinc-100 text-sm">
                  {step.role}
                </div>
                <div className="text-xs text-zinc-500 dark:text-zinc-400">
                  {step.action}
                </div>
              </div>
            </div>
          ))
        ) : (
          <div className="text-center text-sm text-zinc-500 dark:text-zinc-400 py-4">
            Không có vai trò đặc biệt nào hoạt động tối nay.
          </div>
        )}
      </div>
    </div>
  );
}
