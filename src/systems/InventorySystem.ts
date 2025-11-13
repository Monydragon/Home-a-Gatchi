export interface Item {
  id: string;
  name: string;
  type: 'food' | 'toy' | 'medicine' | 'other';
  value: number;
  quantity: number;
}

export class InventorySystem {
  private currency: number = 100;
  private items: Map<string, Item> = new Map();

  public addCurrency(amount: number): void {
    this.currency = Math.max(0, this.currency + amount);
  }

  public spendCurrency(amount: number): boolean {
    if (this.currency >= amount) {
      this.currency -= amount;
      return true;
    }
    return false;
  }

  public getCurrency(): number {
    return this.currency;
  }

  public addItem(item: Item): void {
    const existing = this.items.get(item.id);
    if (existing) {
      existing.quantity += item.quantity;
    } else {
      this.items.set(item.id, { ...item });
    }
  }

  public removeItem(itemId: string, quantity: number = 1): boolean {
    const item = this.items.get(itemId);
    if (item && item.quantity >= quantity) {
      item.quantity -= quantity;
      if (item.quantity <= 0) {
        this.items.delete(itemId);
      }
      return true;
    }
    return false;
  }

  public getItem(itemId: string): Item | undefined {
    return this.items.get(itemId);
  }

  public getAllItems(): Item[] {
    return Array.from(this.items.values());
  }

  public getItems(): Item[] {
    // Return items as array for UI display (up to 27 slots for 9x3 grid)
    const items = Array.from(this.items.values());
    const result: Item[] = [];
    for (let i = 0; i < 27; i++) {
      result.push(items[i] || { id: '', name: '', type: 'other', value: 0, quantity: 0 });
    }
    return result;
  }

  public hasItem(itemId: string, quantity: number = 1): boolean {
    const item = this.items.get(itemId);
    return item ? item.quantity >= quantity : false;
  }
}

