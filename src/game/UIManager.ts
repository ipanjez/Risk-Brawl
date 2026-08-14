import { KillfeedEntry, PlayerState } from '../types';

export class UIManager {
  public killfeedQueue: KillfeedEntry[] = [];
  private nextFeedId = 1;

  public addKillfeed(text: string, type: 'ko' | 'weapon' | 'quiz' | 'esg' | 'system' = 'system') {
    const entry: KillfeedEntry = {
      id: `kf_${this.nextFeedId++}_${Date.now()}`,
      text,
      timestamp: Date.now(),
      type,
    };
    this.killfeedQueue.unshift(entry);
    // Limit queue size
    if (this.killfeedQueue.length > 8) {
      this.killfeedQueue.pop();
    }
  }

  public updateKillfeedQueue(now: number = Date.now()): KillfeedEntry[] {
    // Keep entries for 3.5 seconds
    const activeEntries = this.killfeedQueue.filter((item) => now - item.timestamp < 3500);
    this.killfeedQueue = activeEntries;
    return activeEntries;
  }

  public getSortedLeaderboard(players: PlayerState[]): PlayerState[] {
    return [...players].sort((a, b) => {
      const scoreA = a.knowledgeScore + a.koCount * 30 + a.esgScore;
      const scoreB = b.knowledgeScore + b.koCount * 30 + b.esgScore;
      return scoreB - scoreA;
    });
  }

  public formatTimer(seconds: number): string {
    const mins = Math.floor(Math.max(0, seconds) / 60);
    const secs = Math.floor(Math.max(0, seconds) % 60);
    const mm = mins < 10 ? `0${mins}` : `${mins}`;
    const ss = secs < 10 ? `0${secs}` : `${secs}`;
    return `${mm}:${ss}`;
  }
}
