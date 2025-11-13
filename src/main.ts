import Phaser from 'phaser';
import { GameScene } from '@scenes/GameScene';
import { MainMenuScene } from '@scenes/MainMenuScene';
import { HouseInteriorScene } from '@scenes/HouseInteriorScene';
import { GameConfig } from '@config/gameConfig';

const config: Phaser.Types.Core.GameConfig = {
  type: Phaser.AUTO,
  width: 1024,
  height: 768,
  parent: 'game-container',
  backgroundColor: '#1a1a1a',
  physics: {
    default: 'arcade',
    arcade: {
      gravity: { y: 0 },
      debug: false,
    },
  },
  scene: [MainMenuScene, GameScene, HouseInteriorScene],
  scale: {
    mode: Phaser.Scale.FIT,
    autoCenter: Phaser.Scale.CENTER_BOTH,
  },
  pixelArt: GameConfig.PIXEL_ART,
  antialias: !GameConfig.PIXEL_ART,
  input: {
    gamepad: true, // Enable gamepad support
    keyboard: true, // Ensure keyboard is enabled
    mouse: true, // Ensure mouse is enabled
  },
};

// Initialize the game
const game = new Phaser.Game(config);

// Log gamepad connection
game.input.gamepad?.on('connected', (pad: Phaser.Input.Gamepad.Gamepad) => {
  console.log('Gamepad connected:', pad.id);
});

export default game;

