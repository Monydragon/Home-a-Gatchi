import { HUD } from './HUD';
import { DialogueUI } from './DialogueUI';

export class UIManager {
  private scene: Phaser.Scene;
  private hud: HUD;
  private dialogueUI: DialogueUI;

  constructor(scene: Phaser.Scene) {
    this.scene = scene;
    this.hud = new HUD(scene);
    this.dialogueUI = new DialogueUI(scene);
  }

  public create(): void {
    this.hud.create();
    this.dialogueUI.create();
  }

  public getHUD(): HUD {
    return this.hud;
  }

  public getDialogueUI(): DialogueUI {
    return this.dialogueUI;
  }

  public update(): void {
    // Update UI elements
  }

  public destroy(): void {
    this.hud.destroy();
    this.dialogueUI.destroy();
  }
}

