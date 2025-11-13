import { GameConfig } from './gameConfig';

export interface AreaDefinition {
  id: string;
  name: string;
  width: number;
  height: number;
  unlocked: boolean;
  unlockRequirement?: {
    type: 'level' | 'quest' | 'currency';
    value: number | string;
  };
  spawnPoints: { x: number; y: number }[];
}

export const WorldConfig = {
  // Default area
  DEFAULT_AREA: 'home',
  
  // Area definitions
  AREAS: [
    {
      id: 'home',
      name: 'Home',
      width: GameConfig.WORLD_WIDTH,
      height: GameConfig.WORLD_HEIGHT,
      unlocked: true,
      spawnPoints: [
        { x: GameConfig.WORLD_WIDTH * GameConfig.TILE_SIZE / 2, y: GameConfig.WORLD_HEIGHT * GameConfig.TILE_SIZE / 2 },
      ],
    },
  ] as AreaDefinition[],
  
  // Spawn rates (for future NPC/monster spawning)
  SPAWN_RATES: {
    npc: 0.1,
    monster: 0.05,
    item: 0.02,
  },
} as const;

