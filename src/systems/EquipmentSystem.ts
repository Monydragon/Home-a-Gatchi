import { InventorySystem, Item } from './InventorySystem';

export interface EquipmentSlot {
  id: string;
  name: string;
  item: Item | null;
}

export interface CharacterCustomization {
  hat: string | null;
  shirt: string | null;
  pants: string | null;
  shoes: string | null;
  accessory: string | null;
}

export class EquipmentSystem {
  private inventory: InventorySystem;
  private equipment: Map<string, EquipmentSlot> = new Map();
  private customization: CharacterCustomization = {
    hat: null,
    shirt: null,
    pants: null,
    shoes: null,
    accessory: null,
  };
  
  constructor(inventory: InventorySystem) {
    this.inventory = inventory;
    this.initializeEquipmentSlots();
  }
  
  private initializeEquipmentSlots(): void {
    const slots = [
      { id: 'hat', name: 'Hat' },
      { id: 'shirt', name: 'Shirt' },
      { id: 'pants', name: 'Pants' },
      { id: 'shoes', name: 'Shoes' },
      { id: 'accessory', name: 'Accessory' },
      { id: 'fishingPole', name: 'Fishing Pole' },
      { id: 'bait', name: 'Bait' },
    ];
    
    slots.forEach(slot => {
      this.equipment.set(slot.id, {
        id: slot.id,
        name: slot.name,
        item: null,
      });
    });
  }
  
  public equipItem(itemId: string, slotId: string): boolean {
    const item = this.inventory.getItem(itemId);
    if (!item) return false;
    
    const slot = this.equipment.get(slotId);
    if (!slot) return false;
    
    // Unequip current item if any
    if (slot.item) {
      this.unequipItem(slotId);
    }
    
    // Equip new item
    slot.item = { ...item };
    this.inventory.removeItem(itemId, 1);
    
    // Update customization if it's a cosmetic item
    if (['hat', 'shirt', 'pants', 'shoes', 'accessory'].includes(slotId)) {
      (this.customization as any)[slotId] = itemId;
    }
    
    return true;
  }
  
  public unequipItem(slotId: string): boolean {
    const slot = this.equipment.get(slotId);
    if (!slot || !slot.item) return false;
    
    // Return item to inventory
    this.inventory.addItem(slot.item);
    
    // Update customization
    if (['hat', 'shirt', 'pants', 'shoes', 'accessory'].includes(slotId)) {
      (this.customization as any)[slotId] = null;
    }
    
    slot.item = null;
    return true;
  }
  
  public getEquippedItem(slotId: string): Item | null {
    const slot = this.equipment.get(slotId);
    return slot ? slot.item : null;
  }
  
  public getAllEquipment(): Map<string, EquipmentSlot> {
    return this.equipment;
  }
  
  public getCustomization(): CharacterCustomization {
    return { ...this.customization };
  }
  
  public setCustomization(customization: Partial<CharacterCustomization>): void {
    this.customization = { ...this.customization, ...customization };
  }
  
  public hasFishingPole(): boolean {
    return this.getEquippedItem('fishingPole') !== null;
  }
  
  public hasBait(): boolean {
    return this.getEquippedItem('bait') !== null;
  }
}

