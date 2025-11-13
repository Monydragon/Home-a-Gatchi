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
    // Use seeded random for consistent but varied generation
    const seed = Math.random() * 1000;
    const groundData: number[][] = [];
    
    // Generate road network (main paths)
    const roadMap: boolean[][] = [];
    for (let y = 0; y < this.worldHeight; y++) {
      roadMap[y] = [];
      for (let x = 0; x < this.worldWidth; x++) {
        roadMap[y][x] = false;
      }
    }
    
    // Create main roads (horizontal and vertical)
    const numMainRoads = 3 + Math.floor(Math.random() * 3); // 3-5 main roads
    for (let i = 0; i < numMainRoads; i++) {
      const isHorizontal = Math.random() > 0.5;
      const pos = Math.floor(Math.random() * (isHorizontal ? this.worldHeight : this.worldWidth));
      
      if (isHorizontal) {
        for (let x = 0; x < this.worldWidth; x++) {
          // Road width of 2-3 tiles
          for (let offset = -1; offset <= 1; offset++) {
            if (pos + offset >= 0 && pos + offset < this.worldHeight) {
              roadMap[pos + offset][x] = true;
            }
          }
        }
      } else {
        for (let y = 0; y < this.worldHeight; y++) {
          for (let offset = -1; offset <= 1; offset++) {
            if (pos + offset >= 0 && pos + offset < this.worldWidth) {
              roadMap[y][pos + offset] = true;
            }
          }
        }
      }
    }
    
    // Create connecting paths
    const numConnections = 5 + Math.floor(Math.random() * 5);
    for (let i = 0; i < numConnections; i++) {
      const startX = Math.floor(Math.random() * this.worldWidth);
      const startY = Math.floor(Math.random() * this.worldHeight);
      const endX = Math.floor(Math.random() * this.worldWidth);
      const endY = Math.floor(Math.random() * this.worldHeight);
      
      // Simple pathfinding - draw line between points
      const steps = Math.max(Math.abs(endX - startX), Math.abs(endY - startY));
      for (let step = 0; step <= steps; step++) {
        const t = steps > 0 ? step / steps : 0;
        const x = Math.floor(startX + (endX - startX) * t);
        const y = Math.floor(startY + (endY - startY) * t);
        
        if (x >= 0 && x < this.worldWidth && y >= 0 && y < this.worldHeight) {
          roadMap[y][x] = true;
          // Add width to path
          for (let offset = -1; offset <= 1; offset++) {
            if (x + offset >= 0 && x + offset < this.worldWidth) {
              roadMap[y][x + offset] = true;
            }
            if (y + offset >= 0 && y + offset < this.worldHeight) {
              roadMap[y + offset][x] = true;
            }
          }
        }
      }
    }
    
    // Generate terrain with varied grass
    for (let y = 0; y < this.worldHeight; y++) {
      groundData[y] = [];
      for (let x = 0; x < this.worldWidth; x++) {
        if (roadMap[y][x]) {
          groundData[y][x] = 2; // Path/Road
        } else {
          // Use Perlin-like noise for grass variation
          const noiseX = (x + seed) * 0.1;
          const noiseY = (y + seed) * 0.1;
          const noise = (Math.sin(noiseX) * Math.cos(noiseY) + 1) / 2; // 0-1 range
          
          // More varied grass patterns
          if (noise > 0.65) {
            groundData[y][x] = 1; // Dark grass
          } else {
            groundData[y][x] = 0; // Light grass
          }
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
      this.groundLayer.setDepth(0); // Ground layer
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

