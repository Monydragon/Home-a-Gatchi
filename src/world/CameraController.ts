import { GameConfig } from '@config/gameConfig';

export class CameraController {
  private camera: Phaser.Cameras.Scene2D.CameraManager;
  private followTarget?: Phaser.GameObjects.GameObject;
  private bounds?: Phaser.Geom.Rectangle;

  constructor(scene: Phaser.Scene) {
    this.camera = scene.cameras.main;
    this.camera.setZoom(GameConfig.CAMERA_ZOOM);
    this.camera.setBackgroundColor(0x87CEEB); // Sky blue background
  }

  public follow(target: Phaser.GameObjects.GameObject): void {
    this.followTarget = target;
    // Start following with smooth interpolation (lerp values between 0-1, higher = smoother)
    // Using 0.1 means the camera will smoothly follow the target
    this.camera.startFollow(target, false, GameConfig.CAMERA_FOLLOW_SPEED, GameConfig.CAMERA_FOLLOW_SPEED);
    // Round pixels for crisp rendering
    this.camera.roundPixels = true;
  }

  public setBounds(width: number, height: number): void {
    this.bounds = new Phaser.Geom.Rectangle(0, 0, width, height);
    this.camera.setBounds(0, 0, width, height);
  }

  public getCamera(): Phaser.Cameras.Scene2D.CameraManager {
    return this.camera;
  }
}

