export const PetConfig = {
  // Stat decay rates (per second)
  DECAY_RATES: {
    hunger: 0.5,
    happiness: 0.3,
    energy: 0.2,
    cleanliness: 0.4,
  },
  
  // Stat maximums
  MAX_STATS: {
    hunger: 100,
    happiness: 100,
    health: 100,
    energy: 100,
    cleanliness: 100,
  },
  
  // Stat minimums
  MIN_STATS: {
    hunger: 0,
    happiness: 0,
    health: 0,
    energy: 0,
    cleanliness: 0,
  },
  
  // Evolution thresholds
  EVOLUTION_LEVELS: [5, 10, 20, 30, 50],
  
  // XP requirements per level
  XP_PER_LEVEL: 100,
  
  // Starting stats
  STARTING_STATS: {
    hunger: 80,
    happiness: 80,
    health: 100,
    energy: 80,
    cleanliness: 80,
    level: 1,
    experience: 0,
  },
} as const;

