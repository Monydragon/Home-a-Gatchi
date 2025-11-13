import { TileMap } from './TileMap';
import { CameraController } from './CameraController';
import { GameConfig } from '@config/gameConfig';

export class WorldMap {
  private scene: Phaser.Scene;
  private tileMap: TileMap;
  private cameraController: CameraController;
  private worldWidth: number;
  private worldHeight: number;

  constructor(scene: Phaser.Scene) {
    this.scene = scene;
    this.worldWidth = GameConfig.WORLD_WIDTH;
    this.worldHeight = GameConfig.WORLD_HEIGHT;
    this.tileMap = new TileMap(scene, this.worldWidth, this.worldHeight);
    this.cameraController = new CameraController(scene);
  }

  public initialize(): void {
    // Create the procedural map
    this.tileMap.createProceduralMap();
    
    // Set camera bounds
    const worldPixelWidth = this.worldWidth * GameConfig.TILE_SIZE;
    const worldPixelHeight = this.worldHeight * GameConfig.TILE_SIZE;
    this.cameraController.setBounds(worldPixelWidth, worldPixelHeight);
  }

  public getCameraController(): CameraController {
    return this.cameraController;
  }

  public getTileMap(): TileMap {
    return this.tileMap;
  }

  public getWorldWidth(): number {
    return this.worldWidth * GameConfig.TILE_SIZE;
  }

  public getWorldHeight(): number {
    return this.worldHeight * GameConfig.TILE_SIZE;
  }
}

