import { GameConfig } from '@config/gameConfig';

export class TileMap {
  private scene: Phaser.Scene;
  private tilemap?: Phaser.Tilemaps.Tilemap;
  private tileset?: Phaser.Tilemaps.Tileset;
  private groundLayer?: Phaser.Tilemaps.TilemapLayer;
  private collisionLayer?: Phaser.Tilemaps.TilemapLayer;
  private worldWidth: number;
  private worldHeight: number;

  constructor(scene: Phaser.Scene, worldWidth: number, worldHeight: number) {
    this.scene = scene;
    this.worldWidth = worldWidth;
    this.worldHeight = worldHeight;
  }

  public createProceduralMap(): void {
    try {
      // Create a blank tilemap
      this.tilemap = this.scene.make.tilemap({
        tileWidth: GameConfig.TILE_SIZE,
        tileHeight: GameConfig.TILE_SIZE,
        width: this.worldWidth,
        height: this.worldHeight,
      });

      // Create textures using graphics
      // Grass texture
      if (!this.scene.textures.exists('grass')) {
        const grassGraphics = this.scene.add.graphics();
        grassGraphics.fillStyle(0x90EE90, 1); // Light green
        grassGraphics.fillRect(0, 0, GameConfig.TILE_SIZE, GameConfig.TILE_SIZE);
        grassGraphics.generateTexture('grass', GameConfig.TILE_SIZE, GameConfig.TILE_SIZE);
        grassGraphics.destroy();
      }

      // Dark grass texture
      if (!this.scene.textures.exists('darkGrass')) {
        const darkGrassGraphics = this.scene.add.graphics();
        darkGrassGraphics.fillStyle(0x7CCD7C, 1); // Darker green
        darkGrassGraphics.fillRect(0, 0, GameConfig.TILE_SIZE, GameConfig.TILE_SIZE);
        darkGrassGraphics.generateTexture('darkGrass', GameConfig.TILE_SIZE, GameConfig.TILE_SIZE);
        darkGrassGraphics.destroy();
      }

      // Path texture
      if (!this.scene.textures.exists('path')) {
        const pathGraphics = this.scene.add.graphics();
        pathGraphics.fillStyle(0xD2B48C, 1); // Tan/brown
        pathGraphics.fillRect(0, 0, GameConfig.TILE_SIZE, GameConfig.TILE_SIZE);
        pathGraphics.generateTexture('path', GameConfig.TILE_SIZE, GameConfig.TILE_SIZE);
        pathGraphics.destroy();
      }

    // Create a single combined tileset with all tile types
    // This avoids issues with multiple tilesets and tile indexing
    if (!this.scene.textures.exists('combinedTiles')) {
      const combinedGraphics = this.scene.add.graphics();
      // Tile 0: Light grass
      combinedGraphics.fillStyle(0x90EE90, 1);
      combinedGraphics.fillRect(0, 0, GameConfig.TILE_SIZE, GameConfig.TILE_SIZE);
      // Tile 1: Dark grass
      combinedGraphics.fillStyle(0x7CCD7C, 1);
      combinedGraphics.fillRect(GameConfig.TILE_SIZE, 0, GameConfig.TILE_SIZE, GameConfig.TILE_SIZE);
      // Tile 2: Path
      combinedGraphics.fillStyle(0xD2B48C, 1);
      combinedGraphics.fillRect(GameConfig.TILE_SIZE * 2, 0, GameConfig.TILE_SIZE, GameConfig.TILE_SIZE);
      combinedGraphics.generateTexture('combinedTiles', GameConfig.TILE_SIZE * 3, GameConfig.TILE_SIZE);
      combinedGraphics.destroy();
    }

    // Add the combined tileset - specify it has 3 tiles horizontally
    this.tileset = this.tilemap.addTilesetImage('combinedTiles', 'combinedTiles', GameConfig.TILE_SIZE, GameConfig.TILE_SIZE, 0, 0, 0, 1, 3);

    // Create ground layer with procedural generation
    const groundData: number[][] = [];
    for (let y = 0; y < this.worldHeight; y++) {
      groundData[y] = [];
      for (let x = 0; x < this.worldWidth; x++) {
        // Create a simple pattern with paths
        const noise = (x * 0.1 + y * 0.1) % 1;
        if (x % 5 === 0 || y % 5 === 0) {
          groundData[y][x] = 2; // Path
        } else if (noise > 0.7) {
          groundData[y][x] = 1; // Dark grass
        } else {
          groundData[y][x] = 0; // Light grass
        }
      }
    }

    // Create layer with single tileset
    this.groundLayer = this.tilemap.createBlankLayer('ground', this.tileset, 0, 0, this.worldWidth, this.worldHeight);
    
    // Fill the layer with data
    if (this.groundLayer && this.tileset) {
      for (let y = 0; y < this.worldHeight; y++) {
        for (let x = 0; x < this.worldWidth; x++) {
          const tileIndex = groundData[y][x];
          // firstgid is 1-based, so we add it to our 0-based index
          const globalTileIndex = this.tileset.firstgid + tileIndex;
          this.groundLayer.putTileAt(globalTileIndex, x, y);
        }
      }
      this.groundLayer.setDepth(0);
    }

    // Create collision layer (empty for now, can be populated later)
    if (this.tileset) {
      this.collisionLayer = this.tilemap.createBlankLayer('collision', this.tileset, 0, 0, this.worldWidth, this.worldHeight);
      if (this.collisionLayer) {
        this.collisionLayer.setVisible(false);
        this.collisionLayer.setDepth(10);
      }
    }
    } catch (error) {
      console.error('Error creating procedural map:', error);
      throw error;
    }
  }

  public getCollisionLayer(): Phaser.Tilemaps.TilemapLayer | undefined {
    return this.collisionLayer;
  }

  public getGroundLayer(): Phaser.Tilemaps.TilemapLayer | undefined {
    return this.groundLayer;
  }

  public getTilemap(): Phaser.Tilemaps.Tilemap | undefined {
    return this.tilemap;
  }
}

