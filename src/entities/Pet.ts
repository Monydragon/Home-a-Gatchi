import { BaseEntity } from './BaseEntity';

export interface PetStats {
  hunger: number;      // 0-100
  happiness: number;   // 0-100
  health: number;      // 0-100
  energy: number;      // 0-100
  cleanliness: number; // 0-100
  level: number;
  experience: number;
}

export class Pet extends BaseEntity {
  public stats: PetStats;

  constructor(scene: Phaser.Scene, x: number, y: number) {
    super(scene, x, y, 'pet');
    
    this.stats = {
      hunger: 80,
      happiness: 80,
      health: 100,
      energy: 80,
      cleanliness: 80,
      level: 1,
      experience: 0,
    };
  }

  public update(time: number, delta: number): void {
    // Pet update logic will be handled by PetCareSystem
  }

  public getStats(): PetStats {
    return { ...this.stats };
  }
}

