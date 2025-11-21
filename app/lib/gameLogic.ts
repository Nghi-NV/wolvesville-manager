import { Role, RoleType } from '../types';

export const ROLES: Record<RoleType, Role> = {
  WEREWOLF: {
    id: 'WEREWOLF',
    name: 'Ma Sói',
    description: 'Thức dậy vào ban đêm để giết một dân làng.',
    image: '/roles/werewolf.png',
    balanceScore: -6,
  },
  VILLAGER: {
    id: 'VILLAGER',
    name: 'Dân Làng',
    description: 'Tìm ra ma sói vào ban ngày.',
    image: '/roles/villager.png',
    balanceScore: 1,
  },
  SEER: {
    id: 'SEER',
    name: 'Tiên Tri',
    description: 'Thức dậy vào ban đêm để soi vai trò của một người chơi.',
    image: '/roles/seer.png',
    balanceScore: 7,
    maxCount: 1,
  },
  BODYGUARD: {
    id: 'BODYGUARD',
    name: 'Bảo Vệ',
    description: 'Bảo vệ một người chơi khỏi cái chết vào ban đêm.',
    image: '/roles/bodyguard.png',
    balanceScore: 3,
    maxCount: 1,
  },
  HUNTER: {
    id: 'HUNTER',
    name: 'Thợ Săn',
    description: 'Nếu bị giết, có thể kéo theo một người khác chết cùng.',
    image: '/roles/hunter.png',
    balanceScore: 3,
    maxCount: 1,
  },
  CUPID: {
    id: 'CUPID',
    name: 'Thần Tình Yêu',
    description: 'Ghép đôi hai người chơi yêu nhau.',
    image: '/roles/cupid.png',
    balanceScore: -3, // Adds chaos
    maxCount: 1,
  },
  WITCH: {
    id: 'WITCH',
    name: 'Phù Thủy',
    description: 'Có một bình thuốc độc để giết và một bình thuốc giải để cứu.',
    image: '/roles/witch.png',
    balanceScore: 4,
    maxCount: 1,
  },
  LYCAN: {
    id: 'LYCAN',
    name: 'Người Sói',
    description: 'Dân làng nhưng bị Tiên Tri soi ra là Ma Sói.',
    image: '/roles/lycan.png',
    balanceScore: -1,
    maxCount: 1,
  },
  MINION: {
    id: 'MINION',
    name: 'Kẻ Phản Bội',
    description: 'Biết ai là Ma Sói và làm việc cho chúng.',
    image: '/roles/minion.png',
    balanceScore: -4,
    maxCount: 1,
  },
  ZOMBIE: {
    id: 'ZOMBIE',
    name: 'Zombie',
    description: 'Có thể ăn thịt người chết để hồi sinh.',
    image: '/roles/zombie.png',
    balanceScore: -2,
    maxCount: 1,
  },
};

export const suggestRoles = (playerCount: number): Role[] => {
  // Basic templates based on player count
  const roles: Role[] = [];

  // Always need werewolves
  const werewolfCount = Math.max(1, Math.floor(playerCount / 4));
  for (let i = 0; i < werewolfCount; i++) {
    roles.push(ROLES.WEREWOLF);
  }

  // Always need a Seer
  roles.push(ROLES.SEER);

  // Add Bodyguard for 5+ players
  if (playerCount >= 5) {
    roles.push(ROLES.BODYGUARD);
  }

  // Add Hunter for 7+ players
  if (playerCount >= 7) {
    roles.push(ROLES.HUNTER);
  }

  // Add Witch for 9+ players
  if (playerCount >= 9) {
    roles.push(ROLES.WITCH);
  }

  // Fill rest with Villagers
  while (roles.length < playerCount) {
    roles.push(ROLES.VILLAGER);
  }

  return roles;
};

export const calculateBalance = (roles: Role[]): number => {
  return roles.reduce((sum, role) => sum + role.balanceScore, 0);
};

export const shuffleRoles = (roles: Role[]): Role[] => {
  const shuffled = [...roles];
  for (let i = shuffled.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
  }
  return shuffled;
};
