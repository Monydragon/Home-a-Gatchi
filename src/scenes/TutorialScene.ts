export class TutorialScene extends Phaser.Scene {
  constructor() {
    super({ key: 'TutorialScene' });
  }

  public create(): void {
    const { width, height } = this.cameras.main;
    
    // Tutorial content will be implemented in Phase 3
    this.add.text(width / 2, height / 2, 'Tutorial Scene\n(Coming in Phase 3)', {
      fontSize: '32px',
      color: '#ffffff',
      align: 'center',
    }).setOrigin(0.5);
    
    // Skip button
    this.add.text(width / 2, height - 50, 'Press SPACE to skip', {
      fontSize: '16px',
      color: '#aaaaaa',
    }).setOrigin(0.5);
    
    this.input.keyboard?.on('keydown-SPACE', () => {
      this.scene.start('GameScene');
    });
  }
}

