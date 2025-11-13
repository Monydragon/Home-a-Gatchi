import { Pet, PetStats } from '@entities/Pet';

export class PetCareSystem {
  private pet: Pet;
  private decayRates: {
    hunger: number;
    happiness: number;
    energy: number;
    cleanliness: number;
  };
  private lastUpdateTime: number = 0;
  private updateInterval: number = 1000; // Update every second

  constructor(pet: Pet) {
    this.pet = pet;
    this.decayRates = {
      hunger: 0.5,      // Per second
      happiness: 0.3,
      energy: 0.2,
      cleanliness: 0.4,
    };
  }

  public update(time: number, delta: number): void {
    if (time - this.lastUpdateTime < this.updateInterval) return;
    
    this.lastUpdateTime = time;
    const stats = this.pet.stats;
    
    // Decay stats over time
    stats.hunger = Math.max(0, stats.hunger - this.decayRates.hunger);
    stats.happiness = Math.max(0, stats.happiness - this.decayRates.happiness);
    stats.energy = Math.max(0, stats.energy - this.decayRates.energy);
    stats.cleanliness = Math.max(0, stats.cleanliness - this.decayRates.cleanliness);
    
    // Health decreases if other stats are too low
    if (stats.hunger < 20 || stats.happiness < 20 || stats.cleanliness < 20) {
      stats.health = Math.max(0, stats.health - 0.5);
    }
    
    // Check for level up
    this.checkLevelUp();
  }

  public feed(amount: number = 20): void {
    this.pet.stats.hunger = Math.min(100, this.pet.stats.hunger + amount);
    this.pet.stats.happiness = Math.min(100, this.pet.stats.happiness + 5);
  }

  public play(amount: number = 20): void {
    this.pet.stats.happiness = Math.min(100, this.pet.stats.happiness + amount);
    this.pet.stats.energy = Math.max(0, this.pet.stats.energy - 10);
  }

  public clean(amount: number = 20): void {
    this.pet.stats.cleanliness = Math.min(100, this.pet.stats.cleanliness + amount);
    this.pet.stats.happiness = Math.min(100, this.pet.stats.happiness + 5);
  }

  public rest(amount: number = 20): void {
    this.pet.stats.energy = Math.min(100, this.pet.stats.energy + amount);
    this.pet.stats.health = Math.min(100, this.pet.stats.health + 5);
  }

  private checkLevelUp(): void {
    const stats = this.pet.stats;
    const xpNeeded = stats.level * 100;
    
    if (stats.experience >= xpNeeded) {
      stats.level++;
      stats.experience -= xpNeeded;
      // Level up bonuses
      stats.health = Math.min(100, stats.health + 10);
      stats.energy = Math.min(100, stats.energy + 10);
    }
  }

  public getPetStats(): PetStats {
    return { ...this.pet.stats };
  }
}

