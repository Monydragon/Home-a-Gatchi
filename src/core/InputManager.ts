import { InputConfig } from '@config/inputConfig';

export interface InputState {
  up: boolean;
  down: boolean;
  left: boolean;
  right: boolean;
  interact: boolean;
  inventory: boolean;
  menu: boolean;
  movementX: number;
  movementY: number;
}

export class InputManager {
  private scene: Phaser.Scene;
  private cursors?: Phaser.Types.Input.Keyboard.CursorKeys;
  private wasdKeys?: {
    W: Phaser.Input.Keyboard.Key;
    A: Phaser.Input.Keyboard.Key;
    S: Phaser.Input.Keyboard.Key;
    D: Phaser.Input.Keyboard.Key;
  };
  private interactKey?: Phaser.Input.Keyboard.Key;
  private inventoryKey?: Phaser.Input.Keyboard.Key;
  private menuKey?: Phaser.Input.Keyboard.Key;
  private gamepad?: Phaser.Input.Gamepad.Gamepad;
  
  public inputState: InputState = {
    up: false,
    down: false,
    left: false,
    right: false,
    interact: false,
    inventory: false,
    menu: false,
    movementX: 0,
    movementY: 0,
  };

  constructor(scene: Phaser.Scene) {
    this.scene = scene;
    this.setupKeyboard();
    this.setupGamepad();
  }

  private setupKeyboard(): void {
    // Cursor keys
    this.cursors = this.scene.input.keyboard!.createCursorKeys();
    
    // WASD keys
    this.wasdKeys = this.scene.input.keyboard!.addKeys('W,S,A,D') as {
      W: Phaser.Input.Keyboard.Key;
      A: Phaser.Input.Keyboard.Key;
      S: Phaser.Input.Keyboard.Key;
      D: Phaser.Input.Keyboard.Key;
    };
    
    // Action keys
    this.interactKey = this.scene.input.keyboard!.addKey(Phaser.Input.Keyboard.KeyCodes.E);
    this.inventoryKey = this.scene.input.keyboard!.addKey(Phaser.Input.Keyboard.KeyCodes.I);
    this.menuKey = this.scene.input.keyboard!.addKey(Phaser.Input.Keyboard.KeyCodes.ESC);
  }

  private setupGamepad(): void {
    if (this.scene.input.gamepad) {
      this.scene.input.gamepad.once('connected', (pad: Phaser.Input.Gamepad.Gamepad) => {
        this.gamepad = pad;
        console.log('Gamepad connected:', pad.id);
      });
    }
  }

  public update(): void {
    // Reset input state
    this.inputState.up = false;
    this.inputState.down = false;
    this.inputState.left = false;
    this.inputState.right = false;
    this.inputState.interact = false;
    this.inputState.inventory = false;
    this.inputState.menu = false;
    this.inputState.movementX = 0;
    this.inputState.movementY = 0;

    // Keyboard input
    const up = this.cursors?.up.isDown || this.wasdKeys?.W.isDown;
    const down = this.cursors?.down.isDown || this.wasdKeys?.S.isDown;
    const left = this.cursors?.left.isDown || this.wasdKeys?.A.isDown;
    const right = this.cursors?.right.isDown || this.wasdKeys?.D.isDown;

    // Gamepad input
    if (this.gamepad && this.gamepad.connected) {
      const leftStickX = this.gamepad.leftStick.x;
      const leftStickY = this.gamepad.leftStick.y;
      
      // Apply deadzone
      if (Math.abs(leftStickX) > InputConfig.GAMEPAD.DEADZONE) {
        this.inputState.movementX = leftStickX;
        if (leftStickX < -InputConfig.GAMEPAD.STICK_SENSITIVITY) {
          this.inputState.left = true;
        } else if (leftStickX > InputConfig.GAMEPAD.STICK_SENSITIVITY) {
          this.inputState.right = true;
        }
      }
      
      if (Math.abs(leftStickY) > InputConfig.GAMEPAD.DEADZONE) {
        this.inputState.movementY = -leftStickY; // Invert Y axis
        if (leftStickY < -InputConfig.GAMEPAD.STICK_SENSITIVITY) {
          this.inputState.up = true;
        } else if (leftStickY > InputConfig.GAMEPAD.STICK_SENSITIVITY) {
          this.inputState.down = true;
        }
      }
      
      // D-pad support
      if (this.gamepad.left) this.inputState.left = true;
      if (this.gamepad.right) this.inputState.right = true;
      if (this.gamepad.up) this.inputState.up = true;
      if (this.gamepad.down) this.inputState.down = true;
      
      // Buttons
      if (this.gamepad.A) this.inputState.interact = true;
      if (this.gamepad.X) this.inputState.inventory = true;
      if (this.gamepad.start) this.inputState.menu = true;
    }

    // Combine keyboard and gamepad
    if (up) this.inputState.up = true;
    if (down) this.inputState.down = true;
    if (left) this.inputState.left = true;
    if (right) this.inputState.right = true;

    // Calculate normalized movement vector
    if (this.inputState.movementX === 0 && this.inputState.movementY === 0) {
      if (this.inputState.left) this.inputState.movementX = -1;
      if (this.inputState.right) this.inputState.movementX = 1;
      if (this.inputState.up) this.inputState.movementY = -1;
      if (this.inputState.down) this.inputState.movementY = 1;
    }

    // Normalize diagonal movement
    if (this.inputState.movementX !== 0 && this.inputState.movementY !== 0) {
      const length = Math.sqrt(
        this.inputState.movementX ** 2 + this.inputState.movementY ** 2
      );
      this.inputState.movementX /= length;
      this.inputState.movementY /= length;
    }

    // Action keys
    if (this.interactKey?.isDown) this.inputState.interact = true;
    if (this.inventoryKey?.isDown) this.inputState.inventory = true;
    if (this.menuKey?.isDown) this.inputState.menu = true;
  }

  public getMovementVector(): { x: number; y: number } {
    return {
      x: this.inputState.movementX,
      y: this.inputState.movementY,
    };
  }
}

