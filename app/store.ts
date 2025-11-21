import { create } from 'zustand';
import { createJSONStorage, persist } from 'zustand/middleware';
import { GameSession, Group, Player } from './types';

interface AppState {
  players: Player[];
  groups: Group[];
  currentSession: GameSession | null;
  gameHistory: GameSession[];
  archiveCurrentSession: (winner: 'VILLAGERS' | 'WEREWOLVES' | 'OTHER') => void;

  // Player Actions
  addPlayer: (player: Player) => void;
  updatePlayer: (player: Player) => void;
  deletePlayer: (id: string) => void;

  // Group Actions
  addGroup: (group: Group) => void;
  updateGroup: (group: Group) => void;
  deleteGroup: (id: string) => void;

  // Session Actions
  setSession: (session: GameSession | null) => void;
  updateSession: (session: GameSession) => void;
  addEvent: (event: string) => void;
}

export const useAppStore = create<AppState>()(
  persist(
    (set) => ({
      players: [],
      groups: [],
      currentSession: null,
      gameHistory: [],

      addPlayer: (player) => set((state) => ({ players: [...state.players, player] })),
      updatePlayer: (updatedPlayer) => set((state) => ({
        players: state.players.map((p) => (p.id === updatedPlayer.id ? updatedPlayer : p)),
      })),
      deletePlayer: (id) => set((state) => ({
        players: state.players.filter((p) => p.id !== id),
        // Also remove from groups
        groups: state.groups.map(g => ({
          ...g,
          playerIds: g.playerIds.filter(pid => pid !== id)
        }))
      })),

      addGroup: (group) => set((state) => ({ groups: [...state.groups, group] })),
      updateGroup: (updatedGroup) => set((state) => ({
        groups: state.groups.map((g) => (g.id === updatedGroup.id ? updatedGroup : g)),
      })),
      deleteGroup: (id) => set((state) => ({
        groups: state.groups.filter((g) => g.id !== id),
      })),

      setSession: (session) => set({ currentSession: session }),
      updateSession: (session) => set({ currentSession: session }),
      addEvent: (event) => set((state) => {
        if (!state.currentSession) return {};
        const timestamp = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
        return {
          currentSession: {
            ...state.currentSession,
            events: [`[${timestamp}] ${event}`, ...(state.currentSession.events || [])]
          }
        };
      }),
      archiveCurrentSession: (winner) => set((state) => {
        if (!state.currentSession) return {};
        const finishedSession: GameSession = {
          ...state.currentSession,
          status: 'FINISHED',
          endTime: Date.now(),
          winner,
        };
        return {
          currentSession: null,
          gameHistory: [finishedSession, ...state.gameHistory],
        };
      }),
    }),
    {
      name: 'werewolf-manager-storage',
      storage: createJSONStorage(() => localStorage),
    }
  )
);
