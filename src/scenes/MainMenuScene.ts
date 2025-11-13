export class MainMenuScene extends Phaser.Scene {
  private spaceKey?: Phaser.Input.Keyboard.Key;
  private enterKey?: Phaser.Input.Keyboard.Key;

  constructor() {
    super({ key: 'MainMenuScene' });
  }

  public create(): void {
    const { width, height } = this.cameras.main;
    
    // Clear any existing input
    this.input.keyboard?.removeAllListeners();
    
    // Title
    this.add.text(width / 2, height / 2 - 150, 'Home-a-Gatchi', {
      fontSize: '64px',
      color: '#ffffff',
      fontStyle: 'bold',
    }).setOrigin(0.5);
    
    // Subtitle
    this.add.text(width / 2, height / 2 - 80, 'A 2D Open World Tamagotchi Adventure', {
      fontSize: '20px',
      color: '#cccccc',
    }).setOrigin(0.5);
    
    // Create New Game button as a simple interactive zone
    const newGameZone = this.add.zone(width / 2, height / 2 + 20, 250, 60);
    newGameZone.setInteractive({ useHandCursor: true });
    
    const newGameBg = this.add.rectangle(width / 2, height / 2 + 20, 250, 60, 0x4169E1);
    const newGameText = this.add.text(width / 2, height / 2 + 20, 'New Game', {
      fontSize: '28px',
      color: '#ffffff',
      fontStyle: 'bold',
    }).setOrigin(0.5);
    
    newGameZone.on('pointerover', () => {
      newGameBg.setFillStyle(0x5A7AE8);
    });
    
    newGameZone.on('pointerout', () => {
      newGameBg.setFillStyle(0x4169E1);
    });
    
    newGameZone.on('pointerdown', () => {
      console.log('New Game button clicked!');
      this.startGame();
    });
    
    // Load Game button
    const loadGameZone = this.add.zone(width / 2, height / 2 + 100, 250, 60);
    loadGameZone.setInteractive({ useHandCursor: true });
    
    const loadGameBg = this.add.rectangle(width / 2, height / 2 + 100, 250, 60, 0x666666);
    const loadGameText = this.add.text(width / 2, height / 2 + 100, 'Load Game', {
      fontSize: '28px',
      color: '#ffffff',
      fontStyle: 'bold',
    }).setOrigin(0.5);
    
    loadGameZone.on('pointerover', () => {
      loadGameBg.setFillStyle(0x777777);
    });
    
    loadGameZone.on('pointerout', () => {
      loadGameBg.setFillStyle(0x666666);
    });
    
    loadGameZone.on('pointerdown', () => {
      console.log('Load Game button clicked!');
      // TODO: Implement load game
    });
    
    // Instructions
    this.add.text(width / 2, height - 80, 'Press SPACE or ENTER to start', {
      fontSize: '18px',
      color: '#aaaaaa',
    }).setOrigin(0.5);
    
    this.add.text(width / 2, height - 50, 'Click "New Game" or use keyboard', {
      fontSize: '14px',
      color: '#888888',
    }).setOrigin(0.5);
    
    // Keyboard input
    if (this.input.keyboard) {
      this.spaceKey = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.SPACE);
      this.enterKey = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.ENTER);
      
      this.spaceKey.on('down', () => {
        console.log('SPACE key pressed!');
        this.startGame();
      });
      
      this.enterKey.on('down', () => {
        console.log('ENTER key pressed!');
        this.startGame();
      });
    }
    
    console.log('MainMenuScene created successfully');
  }

  private startGame(): void {
    console.log('Attempting to start GameScene...');
    try {
      // Stop this scene and start the game scene
      this.scene.stop();
      this.scene.start('GameScene');
      console.log('GameScene start command sent');
    } catch (error) {
      console.error('Error starting game:', error);
    }
  }
}
