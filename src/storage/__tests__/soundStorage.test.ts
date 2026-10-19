/**
 * GemBlast – Sound Preference Storage Adapter Unit Tests
 *
 * Covers:
 * - In-memory fallback storage
 * - getMuted / setMuted async and sync
 * - parseMutedValue and formatMutedValue pure helpers
 * - toggleMuted helper
 * - Custom storage adapter override
 * - LocalStorage integration and error resilience
 */

import {
  SOUND_MUTED_STORAGE_KEY,
  resetSoundMemoryStore,
  setSoundStorageAdapter,
  getSoundStorageBackend,
  parseMutedValue,
  formatMutedValue,
  getMuted,
  getMutedSync,
  setMuted,
  setMutedSync,
  toggleMuted,
} from '../soundStorage';
import { KeyValueStorage, resetMemoryStore } from '../scoreStorage';

describe('soundStorage', () => {
  const originalLocalStorage = (globalThis as any).localStorage;

  beforeEach(() => {
    setSoundStorageAdapter(null);
    resetSoundMemoryStore();
    resetMemoryStore();
    delete (globalThis as any).localStorage;
  });

  afterEach(() => {
    setSoundStorageAdapter(null);
    resetSoundMemoryStore();
    resetMemoryStore();
    if (originalLocalStorage !== undefined) {
      (globalThis as any).localStorage = originalLocalStorage;
    } else {
      delete (globalThis as any).localStorage;
    }
  });

  describe('Pure helper functions', () => {
    it('parseMutedValue correctly parses values', () => {
      expect(parseMutedValue('true')).toBe(true);
      expect(parseMutedValue('false')).toBe(false);
      expect(parseMutedValue(null)).toBe(false);
      expect(parseMutedValue(undefined)).toBe(false);
      expect(parseMutedValue('')).toBe(false);
      expect(parseMutedValue('random')).toBe(false);
    });

    it('formatMutedValue correctly formats booleans', () => {
      expect(formatMutedValue(true)).toBe('true');
      expect(formatMutedValue(false)).toBe('false');
    });
  });

  describe('In-memory fallback store', () => {
    it('defaults to false (unmuted) when unset', async () => {
      expect(await getMuted()).toBe(false);
      expect(getMutedSync()).toBe(false);
    });

    it('saves and retrieves muted state asynchronously', async () => {
      await setMuted(true);
      expect(await getMuted()).toBe(true);

      await setMuted(false);
      expect(await getMuted()).toBe(false);
    });

    it('saves and retrieves muted state synchronously', () => {
      setMutedSync(true);
      expect(getMutedSync()).toBe(true);

      setMutedSync(false);
      expect(getMutedSync()).toBe(false);
    });

    it('toggles muted state', async () => {
      expect(await getMuted()).toBe(false);

      const state1 = await toggleMuted();
      expect(state1).toBe(true);
      expect(await getMuted()).toBe(true);

      const state2 = await toggleMuted();
      expect(state2).toBe(false);
      expect(await getMuted()).toBe(false);
    });

    it('clears state on resetSoundMemoryStore', async () => {
      await setMuted(true);
      expect(await getMuted()).toBe(true);

      resetSoundMemoryStore();
      // When storage adapter is memory fallback
      setSoundStorageAdapter({
        getItem: () => null,
        setItem: () => {},
      });
      expect(await getMuted()).toBe(false);
    });
  });

  describe('Custom storage adapter override', () => {
    it('uses custom storage adapter when configured', async () => {
      const customStore: Record<string, string> = {};
      const customAdapter: KeyValueStorage = {
        getItem: jest.fn((key: string) => customStore[key] ?? null),
        setItem: jest.fn((key: string, value: string) => {
          customStore[key] = value;
        }),
      };

      setSoundStorageAdapter(customAdapter);
      expect(getSoundStorageBackend()).toBe(customAdapter);

      await setMuted(true);
      expect(customAdapter.setItem).toHaveBeenCalledWith(SOUND_MUTED_STORAGE_KEY, 'true');
      expect(await getMuted()).toBe(true);
      expect(getMutedSync()).toBe(true);
    });

    it('handles async custom adapter', async () => {
      const asyncStore: Record<string, string> = {};
      const asyncAdapter: KeyValueStorage = {
        getItem: jest.fn(async (key: string) => asyncStore[key] ?? null),
        setItem: jest.fn(async (key: string, value: string) => {
          asyncStore[key] = value;
        }),
      };

      setSoundStorageAdapter(asyncAdapter);
      await setMuted(true);
      expect(await getMuted()).toBe(true);
    });

    it('handles errors in custom adapter gracefully', async () => {
      const failingAdapter: KeyValueStorage = {
        getItem: jest.fn(() => {
          throw new Error('Storage read error');
        }),
        setItem: jest.fn(() => {
          throw new Error('Storage write error');
        }),
      };

      setSoundStorageAdapter(failingAdapter);
      expect(await getMuted()).toBe(false);
      expect(getMutedSync()).toBe(false);
      expect(await setMuted(true)).toBe(true);
    });
  });

  describe('LocalStorage integration', () => {
    it('uses localStorage when available', async () => {
      const mockStore: Record<string, string> = {};
      (globalThis as any).localStorage = {
        getItem: (k: string) => mockStore[k] ?? null,
        setItem: (k: string, v: string) => {
          mockStore[k] = v;
        },
      };

      await setMuted(true);
      expect(mockStore[SOUND_MUTED_STORAGE_KEY]).toBe('true');
      expect(await getMuted()).toBe(true);
      expect(getMutedSync()).toBe(true);
    });
  });
});
