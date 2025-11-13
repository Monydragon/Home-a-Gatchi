export class FishingMinigameUI {
  private container?: Phaser.GameObjects.Container;
  private isActive: boolean = false;
  private scene: Phaser.Scene;
  private progressBar?: Phaser.GameObjects.Rectangle;
  private progressBarBg?: Phaser.GameObjects.Rectangle;
  private fishBar?: Phaser.GameObjects.Rectangle;
  private targetZone?: Phaser.GameObjects.Rectangle;
  private progressText?: Phaser.GameObjects.Text;
  private fishPosition: number = 0.5; // 0-1
  private targetPosition: number = 0.5; // 0-1
  private targetSize: number = 0.2; // Size of target zone
  private fishSpeed: number = 0.01;
  private fishDirection: number = 1;
  private progress: number = 0; // 0-1
  private isHolding: boolean = false;

  constructor(scene: Phaser.Scene) {
    this.scene = scene;
  }

  public start(): void {
    if (this.isActive) return;
    this.isActive = true;
    this.progress = 0;
    this.fishPosition = 0.5;
    this.targetPosition = 0.3 + Math.random() * 0.4; // Random position in middle area
    this.targetSize = 0.15 + Math.random() * 0.1; // Variable size
    this.fishSpeed = 0.005 + Math.random() * 0.01;
    this.fishDirection = Math.random() > 0.5 ? 1 : -1;

    const { width, height } = this.scene.cameras.main;
    const centerX = width / 2;
    const centerY = height / 2;

    // Background overlay
    const overlay = this.scene.add.rectangle(
      centerX,
      centerY,
      width,
      height,
      0x000000,
      0.5
    );
    overlay.setScrollFactor(0);
    overlay.setDepth(2000);

    // Minigame panel
    const panelWidth = 400;
    const panelHeight = 200;
    const panelBg = this.scene.add.rectangle(
      centerX,
      centerY,
      panelWidth,
      panelHeight,
      0x2C3E50,
      1
    );
    panelBg.setStrokeStyle(3, 0x000000, 1);
    panelBg.setScrollFactor(0);
    panelBg.setDepth(2001);

    // Progress bar background
    const barWidth = 350;
    const barHeight = 30;
    this.progressBarBg = this.scene.add.rectangle(
      centerX,
      centerY + 60,
      barWidth,
      barHeight,
      0x34495E,
      1
    );
    this.progressBarBg.setStrokeStyle(2, 0x000000, 1);
    this.progressBarBg.setScrollFactor(0);
    this.progressBarBg.setDepth(2002);

    // Progress bar (green)
    this.progressBar = this.scene.add.rectangle(
      centerX - barWidth / 2,
      centerY + 60,
      0,
      barHeight - 4,
      0x27AE60,
      1
    );
    this.progressBar.setOrigin(0, 0.5);
    this.progressBar.setScrollFactor(0);
    this.progressBar.setDepth(2003);

    // Fishing bar background
    const fishingBarWidth = 350;
    const fishingBarHeight = 40;
    const fishingBarBg = this.scene.add.rectangle(
      centerX,
      centerY - 20,
      fishingBarWidth,
      fishingBarHeight,
      0x34495E,
      1
    );
    fishingBarBg.setStrokeStyle(2, 0x000000, 1);
    fishingBarBg.setScrollFactor(0);
    fishingBarBg.setDepth(2002);

    // Target zone (green area to keep fish in)
    this.targetZone = this.scene.add.rectangle(
      centerX - fishingBarWidth / 2 + (this.targetPosition * fishingBarWidth),
      centerY - 20,
      this.targetSize * fishingBarWidth,
      fishingBarHeight - 4,
      0x27AE60,
      0.5
    );
    this.targetZone.setOrigin(0.5, 0.5);
    this.targetZone.setScrollFactor(0);
    this.targetZone.setDepth(2003);

    // Fish indicator (red)
    this.fishBar = this.scene.add.rectangle(
      centerX - fishingBarWidth / 2 + (this.fishPosition * fishingBarWidth),
      centerY - 20,
      20,
      fishingBarHeight - 4,
      0xE74C3C,
      1
    );
    this.fishBar.setOrigin(0.5, 0.5);
    this.fishBar.setScrollFactor(0);
    this.fishBar.setDepth(2004);

    // Instructions
    const instructions = this.scene.add.text(
      centerX,
      centerY - 70,
      'Hold SPACE to reel in! Keep the red bar in the green zone!',
      {
        fontSize: '14px',
        color: '#ffffff',
        align: 'center',
      }
    );
    instructions.setOrigin(0.5);
    instructions.setScrollFactor(0);
    instructions.setDepth(2002);

    // Progress text
    this.progressText = this.scene.add.text(
      centerX,
      centerY + 90,
      'Progress: 0%',
      {
        fontSize: '16px',
        color: '#ffffff',
        fontStyle: 'bold',
      }
    );
    this.progressText.setOrigin(0.5);
    this.progressText.setScrollFactor(0);
    this.progressText.setDepth(2002);

    this.container = this.scene.add.container(0, 0, [
      overlay,
      panelBg,
      fishingBarBg,
      instructions,
    ]);
  }

  public update(delta: number): { success: boolean; finished: boolean } {
    if (!this.isActive) return { success: false, finished: false };

    // Update fish movement
    this.fishPosition += this.fishSpeed * this.fishDirection * (delta / 16);
    
    // Bounce fish at edges
    if (this.fishPosition <= 0 || this.fishPosition >= 1) {
      this.fishDirection *= -1;
      this.fishPosition = Phaser.Math.Clamp(this.fishPosition, 0, 1);
    }

    // Check if holding space
    const spaceKey = this.scene.input.keyboard?.addKey(Phaser.Input.Keyboard.KeyCodes.SPACE);
    this.isHolding = spaceKey?.isDown || false;

    // Update progress based on whether fish is in target zone
    const targetLeft = this.targetPosition - this.targetSize / 2;
    const targetRight = this.targetPosition + this.targetSize / 2;
    const fishInZone = this.fishPosition >= targetLeft && this.fishPosition <= targetRight;

    if (this.isHolding && fishInZone) {
      // Increase progress when holding and fish is in zone
      this.progress += (delta / 1000) * 0.3; // Fill in ~3 seconds
    } else if (this.isHolding && !fishInZone) {
      // Decrease progress when holding but fish is out of zone
      this.progress -= (delta / 1000) * 0.5; // Lose progress faster
    } else if (!this.isHolding) {
      // Slowly lose progress when not holding
      this.progress -= (delta / 1000) * 0.1;
    }

    this.progress = Phaser.Math.Clamp(this.progress, 0, 1);

    // Update visuals
    if (this.fishBar && this.targetZone && this.progressBar && this.progressText) {
      const { width } = this.scene.cameras.main;
      const centerX = width / 2;
      const fishingBarWidth = 350;
      const barWidth = 350;

      // Update fish position
      this.fishBar.x = centerX - fishingBarWidth / 2 + (this.fishPosition * fishingBarWidth);

      // Update progress bar
      this.progressBar.width = this.progress * (barWidth - 4);

      // Update progress text
      this.progressText.setText(`Progress: ${Math.floor(this.progress * 100)}%`);
    }

    // Check win/lose conditions
    if (this.progress >= 1) {
      this.stop();
      return { success: true, finished: true };
    }

    if (this.progress <= 0) {
      this.stop();
      return { success: false, finished: true };
    }

    return { success: false, finished: false };
  }

  public stop(): void {
    if (!this.isActive) return;
    this.isActive = false;

    if (this.container) {
      this.container.destroy(true);
      this.container = undefined;
    }

    this.progressBar = undefined;
    this.progressBarBg = undefined;
    this.fishBar = undefined;
    this.targetZone = undefined;
    this.progressText = undefined;
  }

  public isMinigameActive(): boolean {
    return this.isActive;
  }
}

