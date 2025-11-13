export abstract class BaseEntity {
  public sprite: Phaser.GameObjects.Sprite;
  public x: number;
  public y: number;
  public scene: Phaser.Scene;

  constructor(
    scene: Phaser.Scene,
    x: number,
    y: number,
    texture: string,
    frame?: string | number
  ) {
    this.scene = scene;
    this.x = x;
    this.y = y;
    this.sprite = scene.add.sprite(x, y, texture, frame);
  }

  public abstract update(time: number, delta: number): void;

  public setPosition(x: number, y: number): void {
    this.x = x;
    this.y = y;
    this.sprite.setPosition(x, y);
  }

  public getPosition(): { x: number; y: number } {
    return { x: this.x, y: this.y };
  }

  public destroy(): void {
    this.sprite.destroy();
  }
}

