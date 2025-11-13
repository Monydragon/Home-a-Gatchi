import { BaseEntity } from './BaseEntity';
import { GameConfig } from '@config/gameConfig';
import { InputManager } from '@core/InputManager';
import { CharacterCustomization } from '@systems/EquipmentSystem';

export class Player extends BaseEntity {
  private inputManager: InputManager;
  private speed: number;
  private body?: Phaser.Physics.Arcade.Body;
  private customization: CharacterCustomization;
  private hatSprite?: Phaser.GameObjects.Sprite;

  constructor(scene: Phaser.Scene, x: number, y: number, inputManager: InputManager) {
    // Create a simple colored rectangle as placeholder sprite
    super(scene, x, y, 'player');
    
    this.inputManager = inputManager;
    this.speed = GameConfig.PLAYER_SPEED;
    this.customization = {
      hat: null,
      shirt: null,
      pants: null,
      shoes: null,
      accessory: null,
    };
    
    // Make sure sprite is visible
    this.sprite.setVisible(true);
    this.sprite.setActive(true);
    
    // Enable physics
    scene.physics.add.existing(this.sprite);
    this.body = this.sprite.body as Phaser.Physics.Arcade.Body;
    this.body.setCollideWorldBounds(true);
    this.body.setSize(24, 24);
    this.body.setOffset(4, 4);
    this.body.setImmovable(false);
    
    // Set depth so player appears above house and trees
    this.sprite.setDepth(10);
    
    // Create hat sprite
    this.createHatSprite();
    
    console.log('Player sprite created:', {
      x: this.sprite.x,
      y: this.sprite.y,
      visible: this.sprite.visible,
      active: this.sprite.active,
      texture: this.sprite.texture.key
    });
  }

  private createHatSprite(): void {
    // Create blue hat texture if it doesn't exist
    if (!this.scene.textures.exists('blueHat')) {
      const graphics = this.scene.add.graphics();
      graphics.fillStyle(0x4169E1, 1); // Blue
      graphics.fillRect(0, 0, 28, 12);
      // Hat brim
      graphics.fillStyle(0x1E3A8A, 1); // Darker blue
      graphics.fillRect(-2, 10, 32, 4);
      graphics.generateTexture('blueHat', 32, 16);
      graphics.destroy();
    }
    
    this.hatSprite = this.scene.add.sprite(this.x, this.y - 8, 'blueHat');
    this.hatSprite.setDepth(11); // Above player
    this.hatSprite.setOrigin(0.5, 0.5);
    // Hat is visible by default since player starts with it equipped
    this.customization.hat = 'blueHat';
    this.hatSprite.setVisible(true);
  }

  public update(time: number, delta: number): void {
    const movement = this.inputManager.getMovementVector();
    
    if (this.body) {
      // Apply movement
      const velocityX = movement.x * this.speed;
      const velocityY = movement.y * this.speed;
      
      this.body.setVelocity(velocityX, velocityY);
      
      // Update position tracking
      this.x = this.sprite.x;
      this.y = this.sprite.y;
      
      // Update hat position
      if (this.hatSprite) {
        this.hatSprite.setPosition(this.x, this.y - 8);
      }
    }
  }

  public setCustomization(customization: CharacterCustomization): void {
    this.customization = { ...customization };
    this.updateVisuals();
  }

  private updateVisuals(): void {
    // Update hat visibility
    if (this.hatSprite) {
      this.hatSprite.setVisible(this.customization.hat !== null);
    }
  }

  public getCustomization(): CharacterCustomization {
    return { ...this.customization };
  }

  public getSpeed(): number {
    return this.speed;
  }

  public setSpeed(speed: number): void {
    this.speed = speed;
  }

  public destroy(): void {
    if (this.hatSprite) {
      this.hatSprite.destroy();
    }
    super.destroy();
  }
}
