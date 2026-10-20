/**
 * GemBlast – Leaderboard Storage Adapter Unit Tests
 *
 * Covers:
 * - Empty state retrieval
 * - Ranking logic (descending order, top 10 limit)
 * - Tie breaking (most recent date first)
 * - Record score async and sync
 * - Invalid / non-positive score rejection
 * - Clear scores functionality
 * - Custom storage adapter override and error resilience
 */

import {
  LEADERBOARD_STORAGE_KEY,
  MAX_LEADERBOARD_ENTRIES,
  LeaderboardEntry,
  rankLeaderboardEntries,
  getLeaderboard,
  getLeaderboardSync,
  recordScore,
  recordScoreSync,
  clearLeaderboard,
  clearLeaderboardSync,
  resetLeaderboardMemoryStore,
  setLeaderboardStorageAdapter,
} from '../leaderboardStorage';
import { KeyValueStorage, resetMemoryStore } from '../scoreStorage';

describe('leaderboardStorage', () => {
  const originalLocalStorage = (globalThis as any).localStorage;

  beforeEach(() => {
    setLeaderboardStorageAdapter(null);
    resetLeaderboardMemoryStore();
    resetMemoryStore();
    delete (globalThis as any).localStorage;
  });

  afterEach(() => {
    setLeaderboardStorageAdapter(null);
    resetLeaderboardMemoryStore();
    resetMemoryStore();
    if (originalLocalStorage !== undefined) {
      (globalThis as any).localStorage = originalLocalStorage;
    } else {
      delete (globalThis as any).localStorage;
    }
  });

  describe('Pure helper rankLeaderboardEntries', () => {
    it('sorts scores descending', () => {
      const items: LeaderboardEntry[] = [
        { id: '1', score: 100, date: '2026-01-01T00:00:00Z' },
        { id: '2', score: 500, date: '2026-01-02T00:00:00Z' },
        { id: '3', score: 250, date: '2026-01-03T00:00:00Z' },
      ];
      const ranked = rankLeaderboardEntries(items);
      expect(ranked.map((r) => r.score)).toEqual([500, 250, 100]);
    });

    it('limits to top 10 entries by default', () => {
      const items: LeaderboardEntry[] = Array.from({ length: 15 }, (_, i) => ({
        id: `id-${i}`,
        score: (i + 1) * 100,
        date: new Date().toISOString(),
      }));
      const ranked = rankLeaderboardEntries(items);
      expect(ranked).toHaveLength(10);
      expect(ranked[0].score).toBe(1500);
      expect(ranked[9].score).toBe(600);
    });

    it('breaks ties using latest date first', () => {
      const items: LeaderboardEntry[] = [
        { id: '1', score: 300, date: '2026-01-01T10:00:00Z' },
        { id: '2', score: 300, date: '2026-01-02T10:00:00Z' },
      ];
      const ranked = rankLeaderboardEntries(items);
      expect(ranked[0].id).toBe('2');
      expect(ranked[1].id).toBe('1');
    });

    it('filters out invalid or non-positive scores', () => {
      const items: any[] = [
        { id: '1', score: 0, date: '2026-01-01' },
        { id: '2', score: -10, date: '2026-01-01' },
        { id: '3', score: NaN, date: '2026-01-01' },
        { id: '4', score: 200, date: '2026-01-01' },
      ];
      const ranked = rankLeaderboardEntries(items);
      expect(ranked).toHaveLength(1);
      expect(ranked[0].score).toBe(200);
    });
  });

  describe('Storage CRUD operations', () => {
    it('returns empty list initially', async () => {
      expect(await getLeaderboard()).toEqual([]);
      expect(getLeaderboardSync()).toEqual([]);
    });

    it('records and returns scores in descending order', async () => {
      await recordScore(150);
      await recordScore(450);
      await recordScore(300);

      const list = await getLeaderboard();
      expect(list).toHaveLength(3);
      expect(list.map((e) => e.score)).toEqual([450, 300, 150]);
    });

    it('records scores synchronously with recordScoreSync', () => {
      recordScoreSync(100);
      recordScoreSync(500);
      recordScoreSync(200);

      const list = getLeaderboardSync();
      expect(list.map((e) => e.score)).toEqual([500, 200, 100]);
    });

    it('does not record scores <= 0', async () => {
      await recordScore(0);
      await recordScore(-50);
      expect(await getLeaderboard()).toEqual([]);
    });

    it('keeps only the top 10 scores when more than 10 are added', async () => {
      for (let s = 10; s <= 150; s += 10) {
        await recordScore(s);
      }
      const list = await getLeaderboard();
      expect(list).toHaveLength(10);
      expect(list[0].score).toBe(150);
      expect(list[9].score).toBe(60);
    });

    it('clears scores with clearLeaderboard and clearLeaderboardSync', async () => {
      await recordScore(100);
      await recordScore(200);
      expect(await getLeaderboard()).toHaveLength(2);

      await clearLeaderboard();
      expect(await getLeaderboard()).toEqual([]);

      recordScoreSync(300);
      expect(getLeaderboardSync()).toHaveLength(1);

      clearLeaderboardSync();
      expect(getLeaderboardSync()).toEqual([]);
    });
  });

  describe('Custom storage adapter override & resilience', () => {
    it('delegates to custom storage adapter', async () => {
      const mockStore: Record<string, string> = {};
      const customAdapter: KeyValueStorage = {
        getItem: jest.fn((k: string) => mockStore[k] ?? null),
        setItem: jest.fn((k: string, v: string) => {
          mockStore[k] = v;
        }),
      };

      setLeaderboardStorageAdapter(customAdapter);
      await recordScore(999);

      expect(customAdapter.setItem).toHaveBeenCalledWith(
        LEADERBOARD_STORAGE_KEY,
        expect.stringContaining('999')
      );
      const list = await getLeaderboard();
      expect(list[0].score).toBe(999);
    });

    it('gracefully handles JSON parse errors or adapter crashes', async () => {
      const failingAdapter: KeyValueStorage = {
        getItem: jest.fn(() => 'invalid json {'),
        setItem: jest.fn(() => {
          throw new Error('Disk full');
        }),
      };

      setLeaderboardStorageAdapter(failingAdapter);
      expect(await getLeaderboard()).toEqual([]);
      expect(getLeaderboardSync()).toEqual([]);
    });
  });
});
