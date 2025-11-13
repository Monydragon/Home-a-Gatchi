export interface SaveData {
  player: {
    x: number;
    y: number;
    level: number;
    experience: number;
  };
  pet: {
    hunger: number;
    happiness: number;
    health: number;
    energy: number;
    cleanliness: number;
    level: number;
    experience: number;
  };
  inventory: {
    currency: number;
    items: any[];
  };
  world: {
    unlockedAreas: string[];
    currentArea: string;
  };
  timestamp: number;
}

export class SaveSystem {
  private static readonly SAVE_KEY = 'home-a-gatchi-save';

  public static save(data: SaveData): boolean {
    try {
      const json = JSON.stringify(data);
      localStorage.setItem(this.SAVE_KEY, json);
      return true;
    } catch (error) {
      console.error('Failed to save game:', error);
      return false;
    }
  }

  public static load(): SaveData | null {
    try {
      const json = localStorage.getItem(this.SAVE_KEY);
      if (!json) return null;
      return JSON.parse(json) as SaveData;
    } catch (error) {
      console.error('Failed to load game:', error);
      return null;
    }
  }

  public static hasSave(): boolean {
    return localStorage.getItem(this.SAVE_KEY) !== null;
  }

  public static delete(): boolean {
    try {
      localStorage.removeItem(this.SAVE_KEY);
      return true;
    } catch (error) {
      console.error('Failed to delete save:', error);
      return false;
    }
  }

  public static createNewSave(): SaveData {
    return {
      player: {
        x: 400,
        y: 400,
        level: 1,
        experience: 0,
      },
      pet: {
        hunger: 80,
        happiness: 80,
        health: 100,
        energy: 80,
        cleanliness: 80,
        level: 1,
        experience: 0,
      },
      inventory: {
        currency: 100,
        items: [],
      },
      world: {
        unlockedAreas: ['home'],
        currentArea: 'home',
      },
      timestamp: Date.now(),
    };
  }
}

