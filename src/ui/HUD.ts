import { PetStats } from '@entities/Pet';
import { InventorySystem } from '@systems/InventorySystem';

export class HUD {
  private scene: Phaser.Scene;
  private petStatsText?: Phaser.GameObjects.Text;
  private currencyText?: Phaser.GameObjects.Text;
  private container?: Phaser.GameObjects.Container;

  constructor(scene: Phaser.Scene) {
    this.scene = scene;
  }

  public create(): void {
    // Create HUD container
    this.container = this.scene.add.container(0, 0);
    
    // Background panel
    const bg = this.scene.add.rectangle(10, 10, 250, 150, 0x000000, 0.7);
    bg.setOrigin(0, 0);
    bg.setScrollFactor(0);
    bg.setDepth(1000);
    
    // Pet stats label
    const statsLabel = this.scene.add.text(20, 20, 'Pet Stats', {
      fontSize: '16px',
      color: '#ffffff',
      fontStyle: 'bold',
    });
    statsLabel.setScrollFactor(0);
    statsLabel.setDepth(1001);
    
    // Pet stats text
    this.petStatsText = this.scene.add.text(20, 45, '', {
      fontSize: '12px',
      color: '#ffffff',
    });
    this.petStatsText.setScrollFactor(0);
    this.petStatsText.setDepth(1001);
    
    // Currency text
    this.currencyText = this.scene.add.text(20, 120, 'Coins: 0', {
      fontSize: '14px',
      color: '#FFD700',
      fontStyle: 'bold',
    });
    this.currencyText.setScrollFactor(0);
    this.currencyText.setDepth(1001);
    
    this.container.add([bg, statsLabel, this.petStatsText, this.currencyText]);
  }

  public updatePetStats(stats: PetStats): void {
    if (!this.petStatsText) return;
    
    this.petStatsText.setText([
      `Hunger: ${Math.round(stats.hunger)}`,
      `Happiness: ${Math.round(stats.happiness)}`,
      `Health: ${Math.round(stats.health)}`,
      `Energy: ${Math.round(stats.energy)}`,
      `Clean: ${Math.round(stats.cleanliness)}`,
      `Level: ${stats.level}`,
    ]);
  }

  public updateCurrency(amount: number): void {
    if (!this.currencyText) return;
    this.currencyText.setText(`Coins: ${amount}`);
  }

  public destroy(): void {
    this.container?.destroy();
  }
}

