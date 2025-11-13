import { BaseEntity } from './BaseEntity';

export interface Dialogue {
  text: string;
  choices?: { text: string; action: () => void }[];
}

export class NPC extends BaseEntity {
  private name: string;
  private dialogues: Dialogue[];
  private currentDialogueIndex: number = 0;
  private isQuestGiver: boolean = false;

  constructor(
    scene: Phaser.Scene,
    x: number,
    y: number,
    name: string,
    dialogues: Dialogue[] = []
  ) {
    super(scene, x, y, 'npc');
    this.name = name;
    this.dialogues = dialogues;
  }

  public update(time: number, delta: number): void {
    // NPC update logic
  }

  public getName(): string {
    return this.name;
  }

  public getCurrentDialogue(): Dialogue | null {
    if (this.dialogues.length === 0) return null;
    return this.dialogues[this.currentDialogueIndex] || null;
  }

  public setQuestGiver(isQuestGiver: boolean): void {
    this.isQuestGiver = isQuestGiver;
  }

  public isQuestGiverNPC(): boolean {
    return this.isQuestGiver;
  }
}

