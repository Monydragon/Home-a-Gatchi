export class CharacterCreator {
  private scene: Phaser.Scene;
  private isActive: boolean = false;

  constructor(scene: Phaser.Scene) {
    this.scene = scene;
  }

  public create(): void {
    // Character creator UI will be implemented in Phase 2
    // Placeholder for now
  }

  public show(): void {
    this.isActive = true;
    // Show character creator UI
  }

  public hide(): void {
    this.isActive = false;
    // Hide character creator UI
  }

  public isActiveState(): boolean {
    return this.isActive;
  }
}

