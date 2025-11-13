export interface Quest {
  id: string;
  title: string;
  description: string;
  type: 'fetch' | 'defeat' | 'minigame' | 'social';
  targetId?: string;
  targetQuantity?: number;
  currentProgress: number;
  completed: boolean;
  rewards: {
    currency: number;
    experience: number;
    items?: { id: string; quantity: number }[];
  };
}

export class QuestSystem {
  private activeQuests: Map<string, Quest> = new Map();
  private completedQuests: Set<string> = new Set();

  public addQuest(quest: Quest): void {
    this.activeQuests.set(quest.id, quest);
  }

  public getQuest(questId: string): Quest | undefined {
    return this.activeQuests.get(questId);
  }

  public updateQuestProgress(questId: string, progress: number): void {
    const quest = this.activeQuests.get(questId);
    if (quest && !quest.completed) {
      quest.currentProgress += progress;
      if (quest.targetQuantity && quest.currentProgress >= quest.targetQuantity) {
        this.completeQuest(questId);
      }
    }
  }

  public completeQuest(questId: string): void {
    const quest = this.activeQuests.get(questId);
    if (quest) {
      quest.completed = true;
      quest.currentProgress = quest.targetQuantity || 1;
      this.completedQuests.add(questId);
      // Quest rewards will be distributed by the game manager
    }
  }

  public getActiveQuests(): Quest[] {
    return Array.from(this.activeQuests.values()).filter(q => !q.completed);
  }

  public getCompletedQuests(): Quest[] {
    return Array.from(this.activeQuests.values()).filter(q => q.completed);
  }

  public isQuestCompleted(questId: string): boolean {
    return this.completedQuests.has(questId);
  }
}

