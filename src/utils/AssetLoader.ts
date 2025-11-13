export class AssetLoader {
  private scene: Phaser.Scene;
  private loadedAssets: Set<string> = new Set();

  constructor(scene: Phaser.Scene) {
    this.scene = scene;
  }

  public loadImage(key: string, path: string): void {
    if (!this.loadedAssets.has(key)) {
      this.scene.load.image(key, path);
      this.loadedAssets.add(key);
    }
  }

  public loadSpriteSheet(key: string, path: string, frameWidth: number, frameHeight: number): void {
    if (!this.loadedAssets.has(key)) {
      this.scene.load.spritesheet(key, path, {
        frameWidth,
        frameHeight,
      });
      this.loadedAssets.add(key);
    }
  }

  public loadAudio(key: string, path: string): void {
    if (!this.loadedAssets.has(key)) {
      this.scene.load.audio(key, path);
      this.loadedAssets.add(key);
    }
  }

  public isLoaded(key: string): boolean {
    return this.loadedAssets.has(key);
  }
}

