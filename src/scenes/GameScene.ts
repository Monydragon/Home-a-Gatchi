import { InputManager } from '@core/InputManager';
import { Player } from '@entities/Player';
import { WorldMap } from '@world/WorldMap';
import { GameConfig } from '@config/gameConfig';
import { TimeWeatherSystem } from '@systems/TimeWeatherSystem';
import { InventorySystem } from '@systems/InventorySystem';
import { EquipmentSystem } from '@systems/EquipmentSystem';
import { FishingSystem } from '@systems/FishingSystem';
import { InteractionSystem } from '@systems/InteractionSystem';
import { InventoryUI } from '@ui/InventoryUI';
import { FishingMinigameUI } from '@ui/FishingMinigameUI';

export class GameScene extends Phaser.Scene {
  private inputManager!: InputManager;
  private player!: Player;
  private worldMap!: WorldMap;
  private timeWeather!: TimeWeatherSystem;
  private inventory!: InventorySystem;
  private equipment!: EquipmentSystem;
  private fishing!: FishingSystem;
  private interactionSystem!: InteractionSystem;
  private inventoryUI!: InventoryUI;
  private fishingMinigameUI!: FishingMinigameUI;
  
  // Visual elements
  private clouds: Phaser.GameObjects.Image[] = [];
  private sun!: Phaser.GameObjects.Image;
  private skyOverlay!: Phaser.GameObjects.Rectangle;
  private houseX: number = 0;
  private houseY: number = 0;
  private houseSprite?: Phaser.GameObjects.Image;
  private pondX: number = 0;
  private pondY: number = 0;
  private flowers: Phaser.GameObjects.Image[] = [];
  private trees: Phaser.GameObjects.Image[] = [];
  
  // Collision objects
  private collisionObjects: Phaser.GameObjects.GameObject[] = [];
  
  // UI
  private equipmentKey?: Phaser.Input.Keyboard.Key;
  private fishingKey?: Phaser.Input.Keyboard.Key;
  private inventoryKey?: Phaser.Input.Keyboard.Key;

  constructor() {
    super({ key: 'GameScene' });
  }

  public init(data?: any): void {
    console.log('GameScene init() called', data);
    // If returning from house, restore player position if needed
  }

  public preload(): void {
    console.log('GameScene preload() called');
  }

  public create(): void {
    console.log('GameScene create() called - starting initialization');
    
    try {
      // Create textures FIRST before anything else
      console.log('Creating textures...');
      this.createPlayerTexture();
      this.createHouseTexture();
      this.createTreeTexture();
      this.createSkyTextures();
      this.createMailboxTexture();
      this.createFlowerTextures();
      this.createPondTexture();
      console.log('Textures created');
      
      // Initialize input manager
      console.log('Initializing input manager...');
      this.inputManager = new InputManager(this);
      console.log('Input manager initialized');
      
      // Initialize world map
      console.log('Initializing world map...');
      this.worldMap = new WorldMap(this);
      this.worldMap.initialize();
      console.log('World map initialized');
      
      // Initialize systems
      console.log('Initializing game systems...');
      this.inventory = new InventorySystem();
      this.equipment = new EquipmentSystem(this.inventory);
      this.fishing = new FishingSystem(this.equipment, this.inventory);
      this.timeWeather = new TimeWeatherSystem();
      this.timeWeather.setTime(12, 0); // Start at noon
      this.interactionSystem = new InteractionSystem(this);
      this.inventoryUI = new InventoryUI(this, this.inventory);
      this.fishingMinigameUI = new FishingMinigameUI(this);
      console.log('Game systems initialized');
      
      // Give player starting equipment
      this.inventory.addItem({ id: 'blueHat', name: 'Blue Hat', type: 'other', value: 0, quantity: 1 });
      this.inventory.addItem({ id: 'fishingPole', name: 'Fishing Pole', type: 'other', value: 50, quantity: 1 });
      this.inventory.addItem({ id: 'bait', name: 'Bait', type: 'other', value: 5, quantity: 10 });
      this.equipment.equipItem('blueHat', 'hat');
      this.equipment.equipItem('fishingPole', 'fishingPole');
      this.equipment.equipItem('bait', 'bait');
      
      // Create player
      console.log('Creating player...');
      const startX = (GameConfig.WORLD_WIDTH * GameConfig.TILE_SIZE) / 2;
      const startY = (GameConfig.WORLD_HEIGHT * GameConfig.TILE_SIZE) / 2;
      this.player = new Player(this, startX, startY, this.inputManager);
      this.player.setCustomization(this.equipment.getCustomization());
      console.log('Player created at', startX, startY);
      
      // Create house (larger)
      console.log('Creating house...');
      this.houseX = startX - 100;
      this.houseY = startY - 50;
      this.houseSprite = this.add.image(this.houseX, this.houseY, 'house');
      this.houseSprite.setDepth(4); // Object layer
      this.houseSprite.setOrigin(0.5, 1);
      
      // Add physics body for collision (but allow door entry)
      this.physics.add.existing(this.houseSprite, true);
      const houseBody = this.houseSprite.body as Phaser.Physics.Arcade.Body;
      // Make collision body smaller to allow door entry
      houseBody.setSize(140, 100);
      houseBody.setOffset(5, 0);
      this.collisionObjects.push(this.houseSprite);
      
      // Create mailbox and driveway
      this.createMailboxAndDriveway();
      
      // Create pond
      this.pondX = startX + 200;
      this.pondY = startY + 100;
      this.createPond();
      
      // Create sky elements (textures are already created above)
      this.createSky();
      
      // Create trees
      this.createTrees();
      
      // Create flowers
      this.createFlowers();
      
      // Setup collision detection (after all objects are created)
      console.log('Setting up collision detection...');
      // Collision will be set up after all objects are added to collisionObjects array
      this.setupCollisions();
      console.log('Collision detection setup complete');
      
      // Setup camera
      console.log('Setting up camera...');
      this.worldMap.getCameraController().follow(this.player.sprite);
      console.log('Camera setup complete');
      
      // Setup input
      if (this.input.keyboard) {
        this.equipmentKey = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.E);
        this.fishingKey = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.F);
        this.inventoryKey = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.I);
        
        // Inventory toggle - use 'down' event that can fire multiple times
        this.inventoryKey.on('down', () => {
          if (this.inventoryUI.isInventoryOpen()) {
            this.inventoryUI.close();
          } else {
            this.inventoryUI.open();
          }
        });
        
        this.input.keyboard.on('keydown-ESC', () => {
          if (this.inventoryUI.isInventoryOpen()) {
            this.inventoryUI.close();
          } else {
            this.scene.start('MainMenuScene');
          }
        });
      }
      
      // Setup interactions
      this.setupInteractions();
      
      // HUD
      this.createHUD();
      
      console.log('GameScene create() completed successfully!');
      console.log('Player position:', this.player.getPosition());
      console.log('Player sprite visible:', this.player.sprite.visible);
    } catch (error) {
      console.error('Error in GameScene create():', error);
      console.error('Error stack:', (error as Error).stack);
      
      // Show error on screen
      this.add.text(this.cameras.main.width / 2, this.cameras.main.height / 2, 
        `Error: ${error}\nCheck console for details`, {
        fontSize: '16px',
        color: '#ff0000',
        backgroundColor: '#000000',
        padding: { x: 10, y: 10 },
        align: 'center',
      }).setOrigin(0.5).setScrollFactor(0);
    }
  }

  private createPlayerTexture(): void {
    if (this.textures.exists('player')) return;
    const graphics = this.add.graphics();
    graphics.fillStyle(0x4169E1, 1);
    graphics.fillRect(0, 0, GameConfig.PLAYER_SPRITE_SIZE, GameConfig.PLAYER_SPRITE_SIZE);
    graphics.generateTexture('player', GameConfig.PLAYER_SPRITE_SIZE, GameConfig.PLAYER_SPRITE_SIZE);
    graphics.destroy();
  }

  private createHouseTexture(): void {
    if (this.textures.exists('house')) return;
    const graphics = this.add.graphics();
    const houseWidth = 150; // Larger house
    const houseHeight = 120;
    
    // House body (yellow)
    graphics.fillStyle(0xFFD700, 1);
    graphics.fillRect(0, 0, houseWidth, houseHeight);
    
    // House roof (darker yellow/brown)
    graphics.fillStyle(0xDAA520, 1);
    graphics.beginPath();
    graphics.moveTo(0, 0);
    graphics.lineTo(houseWidth / 2, -50);
    graphics.lineTo(houseWidth, 0);
    graphics.closePath();
    graphics.fillPath();
    
    // Door (brown)
    graphics.fillStyle(0x8B4513, 1);
    graphics.fillRect(houseWidth / 2 - 20, houseHeight - 50, 40, 50);
    
    // Windows (light blue)
    graphics.fillStyle(0x87CEEB, 1);
    graphics.fillRect(houseWidth / 4 - 12, houseHeight / 2 - 12, 24, 24);
    graphics.fillRect(houseWidth * 3 / 4 - 12, houseHeight / 2 - 12, 24, 24);
    
    graphics.generateTexture('house', houseWidth, houseHeight + 50);
    graphics.destroy();
  }

  private createTreeTexture(): void {
    if (this.textures.exists('tree')) return;
    const graphics = this.add.graphics();
    const treeWidth = 40;
    const treeHeight = 50;
    
    graphics.fillStyle(0x8B4513, 1);
    graphics.fillRect(treeWidth / 2 - 6, treeHeight - 20, 12, 20);
    
    graphics.fillStyle(0x228B22, 1);
    graphics.fillCircle(treeWidth / 2, treeHeight - 30, 18);
    graphics.fillCircle(treeWidth / 2 - 8, treeHeight - 35, 15);
    graphics.fillCircle(treeWidth / 2 + 8, treeHeight - 35, 15);
    
    graphics.generateTexture('tree', treeWidth, treeHeight);
    graphics.destroy();
  }

  private createSkyTextures(): void {
    // Sun
    if (!this.textures.exists('sun')) {
      const graphics = this.add.graphics();
      graphics.fillStyle(0xFFD700, 1);
      graphics.fillCircle(20, 20, 20);
      graphics.generateTexture('sun', 40, 40);
      graphics.destroy();
    }
    
    // Cloud
    if (!this.textures.exists('cloud')) {
      const graphics = this.add.graphics();
      graphics.fillStyle(0xFFFFFF, 0.8);
      graphics.fillCircle(15, 15, 12);
      graphics.fillCircle(25, 15, 15);
      graphics.fillCircle(35, 15, 12);
      graphics.fillCircle(20, 10, 10);
      graphics.fillCircle(30, 10, 10);
      graphics.generateTexture('cloud', 50, 30);
      graphics.destroy();
    }
  }

  private createMailboxTexture(): void {
    if (this.textures.exists('mailbox')) return;
    const graphics = this.add.graphics();
    // Post
    graphics.fillStyle(0x654321, 1);
    graphics.fillRect(8, 0, 4, 30);
    // Box
    graphics.fillStyle(0x000000, 1);
    graphics.fillRect(0, 0, 20, 15);
    // Flag
    graphics.fillStyle(0xFF0000, 1);
    graphics.fillRect(20, 2, 8, 6);
    graphics.generateTexture('mailbox', 30, 30);
    graphics.destroy();
  }

  private createFlowerTextures(): void {
    const colors = [0xFF69B4, 0xFF1493, 0xFFB6C1, 0xFFA500, 0xFFFF00, 0x00FF00];
    colors.forEach((color, index) => {
      const key = `flower${index}`;
      if (this.textures.exists(key)) return;
      const graphics = this.add.graphics();
      // Stem
      graphics.fillStyle(0x228B22, 1);
      graphics.fillRect(4, 8, 2, 8);
      // Petals
      graphics.fillStyle(color, 1);
      graphics.fillCircle(5, 5, 3);
      graphics.fillCircle(2, 6, 2);
      graphics.fillCircle(8, 6, 2);
      graphics.fillCircle(5, 8, 2);
      // Center
      graphics.fillStyle(0xFFD700, 1);
      graphics.fillCircle(5, 6, 1.5);
      graphics.generateTexture(key, 10, 16);
      graphics.destroy();
    });
  }

  private createPondTexture(): void {
    if (this.textures.exists('pond')) return;
    const graphics = this.add.graphics();
    graphics.fillStyle(0x4682B4, 1);
    graphics.fillCircle(40, 40, 40);
    graphics.fillStyle(0x5F9EA0, 1);
    graphics.fillCircle(40, 40, 35);
    graphics.fillStyle(0x4682B4, 1);
    graphics.fillCircle(40, 40, 30);
    graphics.generateTexture('pond', 80, 80);
    graphics.destroy();
  }

  private createSky(): void {
    try {
      const worldWidth = GameConfig.WORLD_WIDTH * GameConfig.TILE_SIZE;
      const worldHeight = GameConfig.WORLD_HEIGHT * GameConfig.TILE_SIZE;
      
      // Sun - stationary with ground (depth 2 for overhead layer)
      if (this.textures.exists('sun')) {
        this.sun = this.add.image(worldWidth * 0.5, 100, 'sun');
        this.sun.setDepth(2); // Overhead layer
        this.sun.setScrollFactor(1); // Stationary with ground
        this.sun.setActive(true);
        this.sun.setVisible(true);
        this.sun.setAlpha(1);
        console.log('Sun created at:', this.sun.x, this.sun.y, 'visible:', this.sun.visible, 'active:', this.sun.active, 'depth:', this.sun.depth);
      } else {
        console.error('Sun texture does not exist! Creating it now...');
        // Create sun texture if it doesn't exist
        this.createSkyTextures();
        if (this.textures.exists('sun')) {
          this.sun = this.add.image(worldWidth * 0.5, 100, 'sun');
          this.sun.setDepth(2); // Overhead layer
          this.sun.setScrollFactor(1);
          this.sun.setActive(true);
          this.sun.setVisible(true);
          this.sun.setAlpha(1);
          console.log('Sun created after texture generation');
        }
      }
      
      // Clouds - stationary with ground (depth 2 for overhead layer)
      if (this.textures.exists('cloud')) {
        for (let i = 0; i < 5; i++) {
          const cloud = this.add.image(
            Phaser.Math.Between(0, worldWidth),
            Phaser.Math.Between(50, 200),
            'cloud'
          );
          cloud.setDepth(2); // Overhead layer
          cloud.setScrollFactor(1); // Stationary with ground
          cloud.setActive(true);
          cloud.setVisible(true);
          this.clouds.push(cloud);
        }
      } else {
        console.error('Cloud texture does not exist!');
      }
      
      // Sky overlay for day/night (full screen overlay)
      this.skyOverlay = this.add.rectangle(
        this.cameras.main.width / 2,
        this.cameras.main.height / 2,
        this.cameras.main.width * 2,
        this.cameras.main.height * 2,
        0x000000,
        0
      );
      this.skyOverlay.setDepth(199); // Overlay layer (below UI)
      this.skyOverlay.setScrollFactor(0);
      this.skyOverlay.setOrigin(0.5, 0.5);
      this.skyOverlay.setActive(true);
      this.skyOverlay.setVisible(true);
    } catch (error) {
      console.error('Error creating sky:', error);
    }
  }

  private createMailboxAndDriveway(): void {
    // Mailbox
    const mailboxX = this.houseX - 60;
    const mailboxY = this.houseY - 10;
    const mailbox = this.add.image(mailboxX, mailboxY, 'mailbox');
    mailbox.setDepth(4); // Object layer
    mailbox.setOrigin(0.5, 1);
    mailbox.setName('mailbox');
    
    // Add collision for mailbox
    this.physics.add.existing(mailbox, true);
    const mailboxBody = mailbox.body as Phaser.Physics.Arcade.Body;
    mailboxBody.setSize(20, 30);
    this.collisionObjects.push(mailbox);
    
    // Curved driveway using line segments to approximate a curve
    const graphics = this.add.graphics();
    graphics.lineStyle(20, 0x696969, 1);
    
    // Create a curved path using multiple line segments
    const startX = this.houseX - 40;
    const startY = this.houseY;
    const endX = this.houseX + 40;
    const endY = this.houseY + 50;
    const controlX = this.houseX - 20;
    const controlY = this.houseY + 30;
    
    // Draw curve using multiple line segments
    graphics.beginPath();
    graphics.moveTo(startX, startY);
    
    // Approximate quadratic curve with line segments
    for (let t = 0; t <= 1; t += 0.1) {
      const x = (1 - t) * (1 - t) * startX + 2 * (1 - t) * t * controlX + t * t * endX;
      const y = (1 - t) * (1 - t) * startY + 2 * (1 - t) * t * controlY + t * t * endY;
      graphics.lineTo(x, y);
    }
    
    graphics.strokePath();
    graphics.setDepth(1); // Ground Detail layer (driveway)
  }

  private createPond(): void {
    const pond = this.add.image(this.pondX, this.pondY, 'pond');
    pond.setDepth(3); // Object layer
    pond.setOrigin(0.5, 0.5);
    pond.setInteractive({ useHandCursor: true });
    pond.on('pointerdown', () => {
      if (this.fishing.canFish() && !this.fishing.isCurrentlyFishing()) {
        this.fishing.startFishing();
      }
    });
    
    // Add collision for pond (player can't walk through water)
    this.physics.add.existing(pond, true);
    const pondBody = pond.body as Phaser.Physics.Arcade.Body;
    pondBody.setSize(70, 70);
    pondBody.setOffset(5, 5);
    this.collisionObjects.push(pond);
  }

  private createFlowers(): void {
    const worldWidth = GameConfig.WORLD_WIDTH * GameConfig.TILE_SIZE;
    const worldHeight = GameConfig.WORLD_HEIGHT * GameConfig.TILE_SIZE;
    
    for (let i = 0; i < 20; i++) {
      const flowerX = Phaser.Math.Between(50, worldWidth - 50);
      const flowerY = Phaser.Math.Between(50, worldHeight - 50);
      
      // Avoid house and pond area
      const distToHouse = Phaser.Math.Distance.Between(flowerX, flowerY, this.houseX, this.houseY);
      const distToPond = Phaser.Math.Distance.Between(flowerX, flowerY, this.pondX, this.pondY);
      
      if (distToHouse > 100 && distToPond > 60) {
        const flowerType = Phaser.Math.Between(0, 5);
        const flower = this.add.image(flowerX, flowerY, `flower${flowerType}`);
        flower.setDepth(1); // Ground Detail layer
        flower.setOrigin(0.5, 1);
        this.flowers.push(flower);
      }
    }
  }

  private createTrees(): void {
    const worldWidth = GameConfig.WORLD_WIDTH * GameConfig.TILE_SIZE;
    const worldHeight = GameConfig.WORLD_HEIGHT * GameConfig.TILE_SIZE;
    
    for (let i = 0; i < 30; i++) {
      let treeX = Phaser.Math.Between(50, worldWidth - 50);
      let treeY = Phaser.Math.Between(50, worldHeight - 50);
      
      const startX = (GameConfig.WORLD_WIDTH * GameConfig.TILE_SIZE) / 2;
      const startY = (GameConfig.WORLD_HEIGHT * GameConfig.TILE_SIZE) / 2;
      const distance = Phaser.Math.Distance.Between(treeX, treeY, startX, startY);
      
      if (distance < 200) {
        const angle = Phaser.Math.Angle.Between(startX, startY, treeX, treeY);
        treeX = startX + Math.cos(angle) * 250;
        treeY = startY + Math.sin(angle) * 250;
      }
      
      const tree = this.add.image(treeX, treeY, 'tree');
      tree.setDepth(4); // Object layer
      tree.setOrigin(0.5, 1);
      
      // Add physics body for collision
      this.physics.add.existing(tree, true);
      const treeBody = tree.body as Phaser.Physics.Arcade.Body;
      treeBody.setSize(30, 40);
      treeBody.setOffset(5, 10);
      this.collisionObjects.push(tree);
      this.trees.push(tree);
    }
  }

  private timeText?: Phaser.GameObjects.Text;
  private weatherText?: Phaser.GameObjects.Text;

  private createHUD(): void {
    // Time display
    this.timeText = this.add.text(10, 10, '', {
      fontSize: '16px',
      color: '#ffffff',
      backgroundColor: '#000000',
      padding: { x: 5, y: 3 },
    });
    this.timeText.setScrollFactor(0).setDepth(100);
    
    // Weather display
    this.weatherText = this.add.text(10, 35, '', {
      fontSize: '14px',
      color: '#ffffff',
      backgroundColor: '#000000',
      padding: { x: 5, y: 3 },
    });
    this.weatherText.setScrollFactor(0).setDepth(100);
    
    // Controls hint
    this.add.text(10, 60, 'I: Inventory | E: Interact | F: Fish', {
      fontSize: '12px',
      color: '#ffffff',
      backgroundColor: '#000000',
      padding: { x: 5, y: 3 },
    }).setScrollFactor(0).setDepth(100);
  }

  public update(time: number, delta: number): void {
    try {
      // Update inventory navigation if open
      if (this.inventoryUI.isInventoryOpen()) {
        this.inventoryUI.updateNavigation();
        return; // Don't update game systems when inventory is open
      }
      
      // Update systems
      if (this.timeWeather) {
        this.timeWeather.update(delta);
      }
      
      // Update input
      if (this.inputManager) {
        this.inputManager.update();
      }
      
      // Update player - CRITICAL: This must run for player to move
      if (this.player) {
        this.player.update(time, delta);
        
        // Update interaction system (only if inventory and fishing minigame are closed)
        if (this.interactionSystem && !this.inventoryUI.isInventoryOpen() && !this.fishingMinigameUI.isMinigameActive()) {
          const playerPos = this.player.getPosition();
          this.interactionSystem.update(playerPos.x, playerPos.y);
        }
      }
      
      // Update sun position based on time (stationary with ground)
      if (this.sun && this.sun.active && this.timeWeather) {
        const timeProgress = this.timeWeather.getTimeProgress();
        const worldWidth = GameConfig.WORLD_WIDTH * GameConfig.TILE_SIZE;
        // Sun moves across the sky but stays with world scroll
        const sunX = worldWidth * 0.2 + (worldWidth * 0.6 * timeProgress);
        const sunY = 100 + Math.sin(timeProgress * Math.PI) * 150;
        // Update sun position
        this.sun.x = sunX;
        this.sun.y = sunY;
        // Ensure sun is visible
        if (!this.sun.visible) {
          this.sun.setVisible(true);
        }
      }
      
      // Update sky overlay for day/night
      if (this.skyOverlay && this.skyOverlay.active && this.timeWeather) {
        const lightLevel = this.timeWeather.getLightLevel();
        this.skyOverlay.setAlpha(1 - lightLevel);
      }
      
      // Update fishing minigame
      if (this.fishingMinigameUI.isMinigameActive()) {
        const result = this.fishingMinigameUI.update(delta);
        if (result.finished) {
          if (result.success) {
            // Success - catch the fish
            const fishingResult = this.fishing.updateFishing(5000); // Simulate successful catch
            if (fishingResult.caught) {
              console.log(`Caught a ${fishingResult.fish?.name}!`);
              this.inventoryUI.refresh();
            }
          } else {
            // Failed - lose the attempt
            this.fishing.stopFishing();
            console.log('Fish got away!');
          }
        }
      }
      
      // Update HUD
      if (this.timeText && this.timeWeather) {
        const hour = Math.floor(this.timeWeather.getHour());
        const minute = Math.floor(this.timeWeather.getMinute());
        const timeOfDay = this.timeWeather.getTimeOfDay();
        this.timeText.setText(`Time: ${hour.toString().padStart(2, '0')}:${minute.toString().padStart(2, '0')} (${timeOfDay})`);
      }
      
      if (this.weatherText && this.timeWeather) {
        this.weatherText.setText(`Weather: ${this.timeWeather.getWeather()}`);
      }
      
      // Equipment key
      if (this.equipmentKey?.isDown) {
        // TODO: Open equipment menu
        console.log('Equipment menu (to be implemented)');
      }
      
      // Controller support for inventory (Y button on Xbox controller)
      if (this.input.gamepad?.gamepads && this.input.gamepad.gamepads.length > 0) {
        const pad = this.input.gamepad.gamepads[0];
        if (pad.Y && pad.Y.isDown) {
          if (!this.inventoryUI.isInventoryOpen()) {
            this.inventoryUI.open();
          }
        }
      }
      
    } catch (error) {
      console.error('Error in GameScene update():', error);
    }
  }

  private setupCollisions(): void {
    // Setup collision for all collision objects
    this.collisionObjects.forEach(obj => {
      if (obj && obj.body) {
        this.physics.add.collider(this.player.sprite, obj);
      }
    });
  }

  private setupInteractions(): void {
    // House entry interaction
    if (this.houseSprite) {
      this.interactionSystem.registerInteraction({
        id: 'house-entry',
        x: this.houseX,
        y: this.houseY - 20,
        radius: 80,
        label: 'enter house',
        action: () => {
          this.enterHouse();
        },
        key: 'E',
      });
    }
    
    // Pond fishing interaction
    this.interactionSystem.registerInteraction({
      id: 'pond-fishing',
      x: this.pondX,
      y: this.pondY,
      radius: 100,
      label: 'fish',
      action: () => {
        if (this.fishing.canFish() && !this.fishing.isCurrentlyFishing() && !this.fishingMinigameUI.isMinigameActive()) {
          this.fishing.startFishing();
          this.fishingMinigameUI.start();
        }
      },
      key: 'F',
    });
  }

  private enterHouse(): void {
    console.log('Entering house...');
    // Store player position for when returning
    const playerPos = this.player.getPosition();
    
    // Pass player data to interior scene
    this.scene.launch('HouseInteriorScene', {
      player: this.player,
      equipment: this.equipment,
      inventory: this.inventory,
      returnPosition: playerPos,
    });
    this.scene.pause('GameScene');
  }
}
