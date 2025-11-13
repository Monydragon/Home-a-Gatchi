export const GameConfig = {
  // Tile and world settings
  TILE_SIZE: 32,
  WORLD_WIDTH: 50, // tiles
  WORLD_HEIGHT: 50, // tiles
  
  // Camera settings
  CAMERA_FOLLOW_SPEED: 0.1,
  CAMERA_ZOOM: 1.5,
  
  // Player settings
  PLAYER_SPEED: 150,
  PLAYER_SPRITE_SIZE: 32,
  
  // Game timing
  GAME_SPEED: 1.0,
  
  // Rendering
  PIXEL_ART: true,
  ANTI_ALIAS: false,
} as const;

