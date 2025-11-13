export class SceneManager {
  private game: Phaser.Game;
  private currentSceneName: string = '';

  constructor(game: Phaser.Game) {
    this.game = game;
  }

  public start(sceneKey: string, data?: any): void {
    this.currentSceneName = sceneKey;
    this.game.scene.start(sceneKey, data);
  }

  public switch(sceneKey: string, data?: any): void {
    this.game.scene.switch(this.currentSceneName, sceneKey, data);
  }

  public getCurrentScene(): Phaser.Scene | null {
    return this.game.scene.getScene(this.currentSceneName);
  }

  public getCurrentSceneName(): string {
    return this.currentSceneName;
  }
}

