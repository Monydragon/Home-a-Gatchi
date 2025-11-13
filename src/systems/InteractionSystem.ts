export interface Interaction {
  id: string;
  x: number;
  y: number;
  radius: number;
  label: string;
  action: () => void;
  key: string; // Key to press (e.g., 'E', 'F')
}

export class InteractionSystem {
  private interactions: Map<string, Interaction> = new Map();
  private activeInteraction?: Interaction;
  private hintText?: Phaser.GameObjects.Text;
  private hintBackground?: Phaser.GameObjects.Rectangle;
  private lastKeyState: Map<string, boolean> = new Map();

  constructor(private scene: Phaser.Scene) {}

  public registerInteraction(interaction: Interaction): void {
    this.interactions.set(interaction.id, interaction);
  }

  public unregisterInteraction(id: string): void {
    this.interactions.delete(id);
  }

  public update(playerX: number, playerY: number): void {
    // Find nearest interaction
    let nearest: Interaction | undefined;
    let nearestDistance = Infinity;

    this.interactions.forEach(interaction => {
      const distance = Phaser.Math.Distance.Between(
        playerX,
        playerY,
        interaction.x,
        interaction.y
      );

      if (distance <= interaction.radius && distance < nearestDistance) {
        nearest = interaction;
        nearestDistance = distance;
      }
    });

    // Update active interaction
    if (nearest !== this.activeInteraction) {
      this.activeInteraction = nearest;
      this.updateHint(playerX, playerY);
    }

    // Check if player wants to interact (only trigger once per key press)
    if (this.activeInteraction) {
      const keyCode = this.activeInteraction.key === 'E' 
        ? Phaser.Input.Keyboard.KeyCodes.E
        : this.activeInteraction.key === 'F'
        ? Phaser.Input.Keyboard.KeyCodes.F
        : this.activeInteraction.key === 'I'
        ? Phaser.Input.Keyboard.KeyCodes.I
        : Phaser.Input.Keyboard.KeyCodes.E;
      
      const key = this.scene.input.keyboard?.addKey(keyCode);
      const keyName = this.activeInteraction.key;
      const wasPressed = this.lastKeyState.get(keyName) || false;
      const isPressed = key?.isDown || false;

      if (isPressed && !wasPressed) {
        this.activeInteraction.action();
      }
      
      this.lastKeyState.set(keyName, isPressed);
    } else {
      // Clear key states when no active interaction
      this.lastKeyState.clear();
    }
  }

  private updateHint(playerX: number, playerY: number): void {
    // Remove old hint
    if (this.hintText) {
      this.hintText.destroy();
    }
    if (this.hintBackground) {
      this.hintBackground.destroy();
    }

    // Create new hint if there's an active interaction
    if (this.activeInteraction) {
      // Position hint above player (in world coordinates, then convert to screen)
      const camera = this.scene.cameras.main;
      const screenX = playerX - camera.scrollX;
      const screenY = playerY - camera.scrollY - 50; // Above player

      // Background
      this.hintBackground = this.scene.add.rectangle(
        playerX,
        playerY - 50,
        250,
        40,
        0x000000,
        0.9
      );
      this.hintBackground.setScrollFactor(1); // Follow world
      this.hintBackground.setDepth(50); // Above objects but below UI

      // Text
      this.hintText = this.scene.add.text(
        playerX,
        playerY - 50,
        `Press ${this.activeInteraction.key} to ${this.activeInteraction.label}`,
        {
          fontSize: '16px',
          color: '#ffffff',
          fontStyle: 'bold',
        }
      );
      this.hintText.setOrigin(0.5);
      this.hintText.setScrollFactor(1); // Follow world
      this.hintText.setDepth(51);
    }
  }

  public destroy(): void {
    if (this.hintText) {
      this.hintText.destroy();
    }
    if (this.hintBackground) {
      this.hintBackground.destroy();
    }
    this.interactions.clear();
  }
}

