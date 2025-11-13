export class AnimationManager {
  private scene: Phaser.Scene;
  private animations: Set<string> = new Set();

  constructor(scene: Phaser.Scene) {
    this.scene = scene;
  }

  public createAnimation(
    key: string,
    spriteKey: string,
    frames: number[],
    frameRate: number = 10,
    repeat: number = -1
  ): void {
    if (this.animations.has(key)) return;

    this.scene.anims.create({
      key,
      frames: this.scene.anims.generateFrameNumbers(spriteKey, { frames }),
      frameRate,
      repeat,
    });

    this.animations.add(key);
  }

  public playAnimation(sprite: Phaser.GameObjects.Sprite, key: string): void {
    if (this.animations.has(key)) {
      sprite.play(key);
    }
  }

  public hasAnimation(key: string): boolean {
    return this.animations.has(key);
  }
}

