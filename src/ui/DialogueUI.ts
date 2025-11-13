import { Dialogue } from '@entities/NPC';

export class DialogueUI {
  private scene: Phaser.Scene;
  private container?: Phaser.GameObjects.Container;
  private dialogueText?: Phaser.GameObjects.Text;
  private nameText?: Phaser.GameObjects.Text;
  private isVisible: boolean = false;

  constructor(scene: Phaser.Scene) {
    this.scene = scene;
  }

  public create(): void {
    const { width, height } = this.scene.cameras.main;
    
    // Create dialogue container (initially hidden)
    this.container = this.scene.add.container(0, 0);
    
    // Background panel
    const bg = this.scene.add.rectangle(width / 2, height - 100, width - 40, 150, 0x000000, 0.9);
    bg.setOrigin(0.5, 0.5);
    bg.setScrollFactor(0);
    bg.setDepth(2000);
    
    // Name text
    this.nameText = this.scene.add.text(width / 2, height - 170, '', {
      fontSize: '18px',
      color: '#FFD700',
      fontStyle: 'bold',
    });
    this.nameText.setOrigin(0.5, 0.5);
    this.nameText.setScrollFactor(0);
    this.nameText.setDepth(2001);
    
    // Dialogue text
    this.dialogueText = this.scene.add.text(width / 2, height - 100, '', {
      fontSize: '16px',
      color: '#ffffff',
      wordWrap: { width: width - 80 },
      align: 'center',
    });
    this.dialogueText.setOrigin(0.5, 0.5);
    this.dialogueText.setScrollFactor(0);
    this.dialogueText.setDepth(2001);
    
    this.container.add([bg, this.nameText, this.dialogueText]);
    this.hide();
  }

  public show(npcName: string, dialogue: Dialogue): void {
    if (!this.container || !this.dialogueText || !this.nameText) return;
    
    this.isVisible = true;
    this.nameText.setText(npcName);
    this.dialogueText.setText(dialogue.text);
    this.container.setVisible(true);
  }

  public hide(): void {
    if (!this.container) return;
    
    this.isVisible = false;
    this.container.setVisible(false);
  }

  public isDialogueVisible(): boolean {
    return this.isVisible;
  }

  public destroy(): void {
    this.container?.destroy();
  }
}

