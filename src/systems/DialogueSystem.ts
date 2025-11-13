import { NPC, Dialogue } from '@entities/NPC';

export class DialogueSystem {
  private currentNPC: NPC | null = null;
  private isDialogueActive: boolean = false;
  private onDialogueEnd?: () => void;

  public startDialogue(npc: NPC, onEnd?: () => void): void {
    this.currentNPC = npc;
    this.isDialogueActive = true;
    this.onDialogueEnd = onEnd;
  }

  public endDialogue(): void {
    this.isDialogueActive = false;
    if (this.onDialogueEnd) {
      this.onDialogueEnd();
    }
    this.currentNPC = null;
  }

  public getCurrentDialogue(): Dialogue | null {
    if (!this.currentNPC || !this.isDialogueActive) return null;
    return this.currentNPC.getCurrentDialogue();
  }

  public isActive(): boolean {
    return this.isDialogueActive;
  }

  public getCurrentNPC(): NPC | null {
    return this.currentNPC;
  }
}

