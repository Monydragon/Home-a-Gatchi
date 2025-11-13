import { EquipmentSystem } from './EquipmentSystem';
import { InventorySystem } from './InventorySystem';

export interface Fish {
  id: string;
  name: string;
  rarity: 'common' | 'uncommon' | 'rare' | 'legendary';
  minSize: number;
  maxSize: number;
  catchChance: number; // 0-1
}

export class FishingSystem {
  private equipment: EquipmentSystem;
  private inventory: InventorySystem;
  private isFishing: boolean = false;
  private fishingProgress: number = 0;
  private currentFish?: Fish;
  
  private fishTypes: Fish[] = [
    { id: 'bass', name: 'Bass', rarity: 'common', minSize: 10, maxSize: 30, catchChance: 0.6 },
    { id: 'trout', name: 'Trout', rarity: 'common', minSize: 8, maxSize: 25, catchChance: 0.5 },
    { id: 'salmon', name: 'Salmon', rarity: 'uncommon', minSize: 15, maxSize: 40, catchChance: 0.3 },
    { id: 'pike', name: 'Pike', rarity: 'rare', minSize: 20, maxSize: 50, catchChance: 0.15 },
    { id: 'legendary', name: 'Golden Fish', rarity: 'legendary', minSize: 30, maxSize: 60, catchChance: 0.05 },
  ];
  
  constructor(equipment: EquipmentSystem, inventory: InventorySystem) {
    this.equipment = equipment;
    this.inventory = inventory;
  }
  
  public canFish(): boolean {
    return this.equipment.hasFishingPole() && this.equipment.hasBait();
  }
  
  public startFishing(): boolean {
    if (!this.canFish() || this.isFishing) return false;
    
    this.isFishing = true;
    this.fishingProgress = 0;
    
    // Select a random fish based on catch chances
    this.selectFish();
    
    return true;
  }
  
  private selectFish(): void {
    const rand = Math.random();
    let cumulative = 0;
    
    for (const fish of this.fishTypes) {
      cumulative += fish.catchChance;
      if (rand <= cumulative) {
        this.currentFish = fish;
        return;
      }
    }
    
    // Fallback to first fish
    this.currentFish = this.fishTypes[0];
  }
  
  public updateFishing(delta: number): { caught: boolean; fish?: Fish } {
    if (!this.isFishing) return { caught: false };
    
    // Fishing takes 2-5 seconds
    const fishingTime = Phaser.Math.Between(2000, 5000);
    this.fishingProgress += delta;
    
    if (this.fishingProgress >= fishingTime) {
      this.isFishing = false;
      
      // Success chance based on fish rarity
      const success = Math.random() < (this.currentFish?.catchChance || 0.5);
      
      if (success && this.currentFish) {
        // Add fish to inventory
        const fishSize = Phaser.Math.Between(
          this.currentFish.minSize,
          this.currentFish.maxSize
        );
        
        this.inventory.addItem({
          id: this.currentFish.id,
          name: `${this.currentFish.name} (${fishSize}cm)`,
          type: 'other',
          value: this.getFishValue(this.currentFish.rarity, fishSize),
          quantity: 1,
        });
        
        // Consume bait
        this.equipment.unequipItem('bait');
        
        const caughtFish = { ...this.currentFish };
        this.currentFish = undefined;
        return { caught: true, fish: caughtFish };
      }
      
      this.currentFish = undefined;
      return { caught: false };
    }
    
    return { caught: false };
  }
  
  private getFishValue(rarity: string, size: number): number {
    const baseValues: Record<string, number> = {
      common: 10,
      uncommon: 25,
      rare: 50,
      legendary: 200,
    };
    
    return Math.floor((baseValues[rarity] || 10) * (size / 20));
  }
  
  public stopFishing(): void {
    this.isFishing = false;
    this.fishingProgress = 0;
    this.currentFish = undefined;
  }
  
  public isCurrentlyFishing(): boolean {
    return this.isFishing;
  }
  
  public getFishingProgress(): number {
    return this.fishingProgress;
  }
  
  public getCurrentFish(): Fish | undefined {
    return this.currentFish;
  }
}

