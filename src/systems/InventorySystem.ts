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

  public hasItem(itemId: string, quantity: number = 1): boolean {
    const item = this.items.get(itemId);
    return item ? item.quantity >= quantity : false;
  }
}

