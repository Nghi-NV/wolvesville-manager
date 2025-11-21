export type RoleType = 'WEREWOLF' | 'VILLAGER' | 'SEER' | 'BODYGUARD' | 'HUNTER' | 'CUPID' | 'WITCH' | 'LYCAN' | 'MINION' | 'ZOMBIE';

export interface Role {
  id: RoleType;
  name: string;
  description: string;
  image: string;
  balanceScore: number; // Positive for good side, negative for bad side
  maxCount?: number;
}

export interface Player {
  id: string;
  name: string;
  avatar?: string; // URL or base64
}

export interface Group {
  id: string;
  name: string;
  playerIds: string[];
}

export interface GamePlayer extends Player {
  role: Role | null;
  isAlive: boolean;
  notes?: string;
  statusEffects?: PlayerStatus[];
}

export type PlayerStatus = 'PROTECTED' | 'LINKED' | 'TARGETED' | 'POISONED' | 'SILENCED';

export interface GameAction {
  id: string;
  type: 'KILL' | 'PROTECT' | 'LINK' | 'REVIVE' | 'POISON' | 'CHECK';
  sourceId: string; // Player ID who performed the action
  targetId: string; // Player ID who was targeted
  round: number;
}

export interface GameSession {
  id: string;
  startTime: number;
  endTime?: number;
  players: GamePlayer[];
  rolePool: Role[]; // Roles selected for this game
  status: 'SETUP' | 'PLAYING' | 'FINISHED';
  phase: 'DAY' | 'NIGHT';
  round: number;
  winner?: 'VILLAGERS' | 'WEREWOLVES' | 'OTHER';
  events: string[];
  actions: GameAction[];
}
