/**
 * GemBlast – Best Score Storage Adapter Unit Tests
 *
 * Covers:
 * - In-memory fallback storage
 * - Web localStorage adapter behavior
 * - Custom storage adapter override (synchronous and asynchronous)
 * - Best score get / save persistence and edge cases (invalid values, higher/lower scores, force save)
 */

import {
  BEST_SCORE_STORAGE_KEY,
  KeyValueStorage,
  getBestScore,
  getBestScoreSync,
  getStorageBackend,
  resetMemoryStore,
  saveBestScore,
  saveBestScoreSync,
  setStorageAdapter,
} from '../scoreStorage';

describe('scoreStorage', () => {
  const originalLocalStorage = (globalThis as any).localStorage;

  beforeEach(() => {
    // Reset custom adapter and in-memory store before each test
    setStorageAdapter(null);
    resetMemoryStore();
    // Default: remove global localStorage so memory fallback or explicit mock can be tested
    delete (globalThis as any).localStorage;
  });

  afterEach(() => {
    setStorageAdapter(null);
    resetMemoryStore();
    if (originalLocalStorage !== undefined) {
      (globalThis as any).localStorage = originalLocalStorage;
    } else {
      delete (globalThis as any).localStorage;
    }
  });

  describe('In-memory fallback store', () => {
    it('returns default 0 when no best score has been saved', async () => {
      expect(await getBestScore()).toBe(0);
      expect(getBestScoreSync()).toBe(0);
    });

    it('persists and retrieves best score using in-memory store', async () => {
      const saved = await saveBestScore(1500);
      expect(saved).toBe(1500);

      expect(await getBestScore()).toBe(1500);
      expect(getBestScoreSync()).toBe(1500);
    });

    it('only updates score when new score is higher, unless force is true', async () => {
      await saveBestScore(2000);

      // Lower score should not overwrite
      const lowerResult = await saveBestScore(1200);
      expect(lowerResult).toBe(2000);
      expect(await getBestScore()).toBe(2000);

      // Higher score updates
      const higherResult = await saveBestScore(3500);
      expect(higherResult).toBe(3500);
      expect(await getBestScore()).toBe(3500);

      // Force overwrite with lower score
      const forcedResult = await saveBestScore(500, true);
      expect(forcedResult).toBe(500);
      expect(await getBestScore()).toBe(500);
    });

    it('synchronously saves and retrieves best score', () => {
      expect(saveBestScoreSync(800)).toBe(800);
      expect(getBestScoreSync()).toBe(800);

      // Lower score should not overwrite sync
      expect(saveBestScoreSync(400)).toBe(800);
      expect(getBestScoreSync()).toBe(800);

      // Higher score overwrites sync
      expect(saveBestScoreSync(1200)).toBe(1200);
      expect(getBestScoreSync()).toBe(1200);

      // Force overwrite sync
      expect(saveBestScoreSync(100, true)).toBe(100);
      expect(getBestScoreSync()).toBe(100);
    });

    it('handles negative or floating scores safely', async () => {
      await saveBestScore(-50);
      expect(await getBestScore()).toBe(0);

      await saveBestScore(150.7);
      expect(await getBestScore()).toBe(150);
    });

    it('clears persisted scores when resetMemoryStore is called', async () => {
      await saveBestScore(2500);
      expect(await getBestScore()).toBe(2500);

      resetMemoryStore();
      expect(await getBestScore()).toBe(0);
    });
  });

  describe('Web localStorage adapter', () => {
    let mockStore: Record<string, string>;

    beforeEach(() => {
      mockStore = {};
      const mockLocalStorage: KeyValueStorage = {
        getItem: jest.fn((key: string) => mockStore[key] ?? null),
        setItem: jest.fn((key: string, value: string) => {
          mockStore[key] = value;
        }),
      };
      (globalThis as any).localStorage = mockLocalStorage;
    });

    it('uses localStorage when available on globalThis', async () => {
      const backend = getStorageBackend();
      expect(backend).toBe((globalThis as any).localStorage);

      await saveBestScore(3000);
      expect(mockStore[BEST_SCORE_STORAGE_KEY]).toBe('3000');
      expect(await getBestScore()).toBe(3000);
      expect(getBestScoreSync()).toBe(3000);
    });

    it('handles corrupted/non-numeric values in localStorage gracefully', async () => {
      mockStore[BEST_SCORE_STORAGE_KEY] = 'not-a-number';
      expect(await getBestScore()).toBe(0);
      expect(getBestScoreSync()).toBe(0);

      mockStore[BEST_SCORE_STORAGE_KEY] = '-100';
      expect(await getBestScore()).toBe(0);
      expect(getBestScoreSync()).toBe(0);
    });

    it('falls back to memory store if accessing localStorage throws a SecurityError', () => {
      Object.defineProperty(globalThis, 'localStorage', {
        get() {
          throw new Error('SecurityError: Access is denied');
        },
        configurable: true,
      });

      const backend = getStorageBackend();
      expect(backend).toBeDefined();
      backend.setItem('test_key', 'test_val');
      expect(backend.getItem('test_key')).toBe('test_val');
    });
  });

  describe('Custom storage adapter', () => {
    it('supports custom synchronous storage adapter', async () => {
      const customStore: Record<string, string> = {};
      const customAdapter: KeyValueStorage = {
        getItem: jest.fn((key: string) => customStore[key] ?? null),
        setItem: jest.fn((key: string, value: string) => {
          customStore[key] = value;
        }),
      };

      setStorageAdapter(customAdapter);
      expect(getStorageBackend()).toBe(customAdapter);

      await saveBestScore(4200);
      expect(customAdapter.setItem).toHaveBeenCalledWith(BEST_SCORE_STORAGE_KEY, '4200');
      expect(await getBestScore()).toBe(4200);
      expect(getBestScoreSync()).toBe(4200);
    });

    it('supports custom asynchronous storage adapter (e.g. AsyncStorage pattern)', async () => {
      const asyncStore: Record<string, string> = {};
      const asyncAdapter: KeyValueStorage = {
        getItem: jest.fn(async (key: string) => asyncStore[key] ?? null),
        setItem: jest.fn(async (key: string, value: string) => {
          asyncStore[key] = value;
        }),
      };

      setStorageAdapter(asyncAdapter);
      expect(getStorageBackend()).toBe(asyncAdapter);

      const saved = await saveBestScore(5000);
      expect(saved).toBe(5000);
      expect(asyncAdapter.setItem).toHaveBeenCalledWith(BEST_SCORE_STORAGE_KEY, '5000');

      const retrieved = await getBestScore();
      expect(retrieved).toBe(5000);

      // getBestScoreSync returns 0 when adapter returns a Promise instead of a raw string
      expect(getBestScoreSync()).toBe(0);
    });

    it('reverts back to default backend when setStorageAdapter(null) is called', async () => {
      const customAdapter: KeyValueStorage = {
        getItem: jest.fn(() => '9999'),
        setItem: jest.fn(),
      };

      setStorageAdapter(customAdapter);
      expect(await getBestScore()).toBe(9999);

      setStorageAdapter(null);
      expect(await getBestScore()).toBe(0);
    });

    it('handles errors thrown by custom adapter gracefully', async () => {
      const faultyAdapter: KeyValueStorage = {
        getItem: jest.fn(() => {
          throw new Error('Storage read failure');
        }),
        setItem: jest.fn(() => {
          throw new Error('Storage write failure');
        }),
      };

      setStorageAdapter(faultyAdapter);

      expect(await getBestScore()).toBe(0);
      expect(getBestScoreSync()).toBe(0);

      // saveBestScore returns the newScore on catch
      const res = await saveBestScore(100);
      expect(res).toBe(100);
    });
  });
});
