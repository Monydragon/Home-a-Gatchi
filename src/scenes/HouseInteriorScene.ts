import { InputManager } from '@core/InputManager';
import { Player } from '@entities/Player';
import { GameConfig } from '@config/gameConfig';
import { EquipmentSystem } from '@systems/EquipmentSystem';
import { InventorySystem } from '@systems/InventorySystem';
import { InteractionSystem } from '@systems/InteractionSystem';

export class HouseInteriorScene extends Phaser.Scene {
  private inputManager!: InputManager;
  private player!: Player;
  private equipment!: EquipmentSystem;
  private inventory!: InventorySystem;
  private wardrobeUI?: Phaser.GameObjects.Container;
  private isWardrobeOpen: boolean = false;
  private exitKey?: Phaser.Input.Keyboard.Key;
  private interactionSystem!: InteractionSystem;

  constructor() {
    super({ key: 'HouseInteriorScene' });
  }

  public init(data: { player: Player; equipment: EquipmentSystem; inventory: InventorySystem }): void {
    // Store references passed from GameScene
    this.equipment = data.equipment;
    this.inventory = data.inventory;
  }

  public create(data?: { player: Player; equipment: EquipmentSystem; inventory: InventorySystem }): void {
    // Use data from init or create parameter
    if (data) {
      this.equipment = data.equipment;
      this.inventory = data.inventory;
    }
    
    // Create interior textures
    this.createInteriorTextures();
    
    // Create floor
    const floor = this.add.rectangle(400, 300, 800, 600, 0xD2B48C, 1);
    floor.setDepth(0);
    
    // Create walls
    const wallTop = this.add.rectangle(400, 50, 800, 100, 0xF5DEB3, 1);
    const wallBottom = this.add.rectangle(400, 550, 800, 100, 0xF5DEB3, 1);
    const wallLeft = this.add.rectangle(50, 300, 100, 600, 0xF5DEB3, 1);
    const wallRight = this.add.rectangle(750, 300, 100, 600, 0xF5DEB3, 1);
    
    wallTop.setDepth(1);
    wallBottom.setDepth(1);
    wallLeft.setDepth(1);
    wallRight.setDepth(1);
    
    // Add wall collision
    this.physics.add.existing(wallTop, true);
    this.physics.add.existing(wallBottom, true);
    this.physics.add.existing(wallLeft, true);
    this.physics.add.existing(wallRight, true);
    
    // Create furniture
    const furniture = this.createFurniture();
    
    // Create player at entrance
    this.inputManager = new InputManager(this);
    this.player = new Player(this, 400, 500, this.inputManager);
    this.player.setCustomization(this.equipment.getCustomization());
    
    // Setup collision with walls and furniture
    this.physics.add.collider(this.player.sprite, wallTop);
    this.physics.add.collider(this.player.sprite, wallBottom);
    this.physics.add.collider(this.player.sprite, wallLeft);
    this.physics.add.collider(this.player.sprite, wallRight);
    furniture.forEach(f => {
      this.physics.add.collider(this.player.sprite, f);
    });
    
    // Setup camera
    this.cameras.main.setBounds(0, 0, 800, 600);
    this.cameras.main.startFollow(this.player.sprite);
    this.cameras.main.setZoom(1.5);
    
    // Setup interaction system
    this.interactionSystem = new InteractionSystem(this);
    
    // Exit door interaction
    this.interactionSystem.registerInteraction({
      id: 'house-exit',
      x: 400,
      y: 550,
      radius: 80,
      label: 'exit house',
      action: () => {
        this.exitHouse();
      },
      key: 'E',
    });
    
    // Wardrobe interaction
    this.interactionSystem.registerInteraction({
      id: 'wardrobe',
      x: 650,
      y: 200,
      radius: 100,
      label: 'open wardrobe',
      action: () => {
        if (!this.isWardrobeOpen) {
          this.openWardrobe();
        }
      },
      key: 'E',
    });
  }

  private createInteriorTextures(): void {
    // Couch
    if (!this.textures.exists('couch')) {
      const graphics = this.add.graphics();
      graphics.fillStyle(0x8B4513, 1); // Brown
      graphics.fillRect(0, 0, 120, 40);
      graphics.fillRect(0, 30, 120, 20);
      graphics.generateTexture('couch', 120, 50);
      graphics.destroy();
    }
    
    // Bookshelf
    if (!this.textures.exists('bookshelf')) {
      const graphics = this.add.graphics();
      graphics.fillStyle(0x654321, 1); // Dark brown
      graphics.fillRect(0, 0, 60, 100);
      // Shelves
      for (let i = 0; i < 4; i++) {
        graphics.fillRect(5, 20 + i * 20, 50, 3);
      }
      graphics.generateTexture('bookshelf', 60, 100);
      graphics.destroy();
    }
    
    // Table
    if (!this.textures.exists('table')) {
      const graphics = this.add.graphics();
      graphics.fillStyle(0x8B4513, 1);
      graphics.fillRect(0, 0, 80, 50);
      // Table legs
      graphics.fillRect(5, 45, 10, 20);
      graphics.fillRect(65, 45, 10, 20);
      graphics.fillRect(5, 0, 10, 5);
      graphics.fillRect(65, 0, 10, 5);
      graphics.generateTexture('table', 80, 65);
      graphics.destroy();
    }
    
    // Bed
    if (!this.textures.exists('bed')) {
      const graphics = this.add.graphics();
      graphics.fillStyle(0x4169E1, 1); // Blue
      graphics.fillRect(0, 0, 100, 80);
      // Pillow
      graphics.fillStyle(0xFFFFFF, 1);
      graphics.fillRect(10, 10, 30, 20);
      graphics.generateTexture('bed', 100, 80);
      graphics.destroy();
    }
    
    // Wardrobe/Closet
    if (!this.textures.exists('wardrobe')) {
      const graphics = this.add.graphics();
      graphics.fillStyle(0x654321, 1);
      graphics.fillRect(0, 0, 80, 100);
      // Door lines
      graphics.lineStyle(2, 0x000000, 1);
      graphics.strokeRect(0, 0, 40, 100);
      graphics.strokeRect(40, 0, 40, 100);
      graphics.generateTexture('wardrobe', 80, 100);
      graphics.destroy();
    }
  }

  private createFurniture(): Phaser.GameObjects.Image[] {
    const furniture: Phaser.GameObjects.Image[] = [];
    
    // Couch (living room)
    const couch = this.add.image(200, 400, 'couch');
    couch.setDepth(5);
    couch.setOrigin(0.5, 1);
    this.physics.add.existing(couch, true);
    furniture.push(couch);
    
    // Bookshelf (living room)
    const bookshelf = this.add.image(150, 350, 'bookshelf');
    bookshelf.setDepth(5);
    bookshelf.setOrigin(0.5, 1);
    this.physics.add.existing(bookshelf, true);
    furniture.push(bookshelf);
    
    // Table (living room)
    const table = this.add.image(300, 400, 'table');
    table.setDepth(5);
    table.setOrigin(0.5, 1);
    this.physics.add.existing(table, true);
    furniture.push(table);
    
    // Bedroom area (right side)
    // Bed
    const bed = this.add.image(650, 300, 'bed');
    bed.setDepth(5);
    bed.setOrigin(0.5, 1);
    this.physics.add.existing(bed, true);
    furniture.push(bed);
    
    // Wardrobe/Closet
    const wardrobe = this.add.image(650, 200, 'wardrobe');
    wardrobe.setDepth(5);
    wardrobe.setOrigin(0.5, 1);
    this.physics.add.existing(wardrobe, true);
    furniture.push(wardrobe);
    
    return furniture;
  }

  private openWardrobe(): void {
    if (this.isWardrobeOpen) return;
    
    this.isWardrobeOpen = true;
    this.createWardrobeUI();
  }

  private createWardrobeUI(): void {
    const { width, height } = this.cameras.main;
    
    // Background
    const bg = this.add.rectangle(width / 2, height / 2, 600, 500, 0x000000, 0.9);
    bg.setScrollFactor(0).setDepth(200);
    
    // Title
    const title = this.add.text(width / 2, height / 2 - 220, 'Wardrobe - Character Customization', {
      fontSize: '24px',
      color: '#ffffff',
      fontStyle: 'bold',
    }).setOrigin(0.5).setScrollFactor(0).setDepth(201);
    
    // Close button
    const closeBtn = this.add.rectangle(width / 2 + 250, height / 2 - 220, 40, 40, 0xff0000)
      .setInteractive({ useHandCursor: true })
      .setScrollFactor(0)
      .setDepth(201)
      .on('pointerdown', () => {
        this.closeWardrobe();
      });
    
    this.add.text(width / 2 + 250, height / 2 - 220, 'X', {
      fontSize: '20px',
      color: '#ffffff',
    }).setOrigin(0.5).setScrollFactor(0).setDepth(202);
    
    // Customization options
    const options = ['Hat', 'Shirt', 'Pants', 'Shoes', 'Accessory'];
    const colors = [
      [0x4169E1, 0x1E3A8A], // Blue
      [0xFF0000, 0x8B0000], // Red
      [0x00FF00, 0x006400], // Green
      [0xFFFF00, 0xFFD700], // Yellow
      [0xFF00FF, 0x8B008B], // Magenta
    ];
    
    options.forEach((option, index) => {
      const yPos = height / 2 - 150 + (index * 70);
      
      // Label
      this.add.text(width / 2 - 200, yPos, option + ':', {
        fontSize: '18px',
        color: '#ffffff',
      }).setOrigin(0, 0.5).setScrollFactor(0).setDepth(201);
      
      // Color options
      colors.forEach((colorPair, colorIndex) => {
        const btnX = width / 2 - 100 + (colorIndex * 50);
        const btn = this.add.rectangle(btnX, yPos, 40, 40, colorPair[0])
          .setInteractive({ useHandCursor: true })
          .setScrollFactor(0)
          .setDepth(201)
          .on('pointerdown', () => {
            this.applyCustomization(option.toLowerCase(), colorPair[0]);
          });
        
        // Border
        this.add.rectangle(btnX, yPos, 40, 40, 0x000000, 0)
          .setStrokeStyle(2, 0xffffff, 1)
          .setScrollFactor(0)
          .setDepth(202);
      });
      
      // Remove option
      const removeBtn = this.add.rectangle(width / 2 + 150, yPos, 60, 30, 0x666666)
        .setInteractive({ useHandCursor: true })
        .setScrollFactor(0)
        .setDepth(201)
        .on('pointerdown', () => {
          this.removeCustomization(option.toLowerCase());
        });
      
      this.add.text(width / 2 + 150, yPos, 'None', {
        fontSize: '12px',
        color: '#ffffff',
      }).setOrigin(0.5).setScrollFactor(0).setDepth(202);
    });
    
    this.wardrobeUI = this.add.container(0, 0, [bg, title, closeBtn]);
    
    // Close on ESC
    this.input.keyboard?.once('keydown-ESC', () => {
      this.closeWardrobe();
    });
  }

  private applyCustomization(slot: string, color: number): void {
    const customization = this.equipment.getCustomization();
    (customization as any)[slot] = `color_${color.toString(16)}`;
    this.equipment.setCustomization(customization);
    this.player.setCustomization(customization);
    console.log(`Applied ${slot} with color ${color.toString(16)}`);
  }

  private removeCustomization(slot: string): void {
    const customization = this.equipment.getCustomization();
    (customization as any)[slot] = null;
    this.equipment.setCustomization(customization);
    this.player.setCustomization(customization);
    console.log(`Removed ${slot}`);
  }

  private closeWardrobe(): void {
    if (this.wardrobeUI) {
      this.wardrobeUI.destroy(true);
      this.wardrobeUI = undefined;
    }
    this.isWardrobeOpen = false;
  }

  private exitHouse(): void {
    // Resume GameScene and stop this scene
    this.scene.resume('GameScene');
    this.scene.stop('HouseInteriorScene');
  }

  public update(time: number, delta: number): void {
    if (this.inputManager) {
      this.inputManager.update();
    }
    if (this.player) {
      this.player.update(time, delta);
      
      // Update interaction system
      if (this.interactionSystem && !this.isWardrobeOpen) {
        const playerPos = this.player.getPosition();
        this.interactionSystem.update(playerPos.x, playerPos.y);
      }
    }
  }
}

