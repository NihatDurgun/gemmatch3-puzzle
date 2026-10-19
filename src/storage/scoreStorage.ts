/**
 * GemBlast – Best Score Storage Adapter
 *
 * Provides cross-platform persistence for the best score:
 * - Uses window.localStorage / globalThis.localStorage if available (Web)
 * - Uses an in-memory fallback if localStorage is unavailable or throws (e.g. SSR, restricted iframe, private mode, mobile without AsyncStorage)
 * - Supports an optional custom storage backend (e.g. AsyncStorage adapter)
 */

export interface KeyValueStorage {
  getItem(key: string): string | null | Promise<string | null>;
  setItem(key: string, value: string): void | Promise<void>;
}

export const BEST_SCORE_STORAGE_KEY = 'gemblast_best_score';

// In-memory fallback cache
let memoryStore: Record<string, string> = {};

/**
 * Reset in-memory store (primarily for unit tests).
 */
export function resetMemoryStore(): void {
  memoryStore = {};
}

/**
 * Default web localStorage adapter with safe fallback.
 */
function getWebLocalStorage(): KeyValueStorage | null {
  try {
    if (typeof window !== 'undefined' && window.localStorage) {
      return window.localStorage;
    }
    if (typeof globalThis !== 'undefined' && (globalThis as any).localStorage) {
      return (globalThis as any).localStorage;
    }
  } catch {
    // In restricted contexts accessing localStorage may throw SecurityError
    return null;
  }
  return null;
}

let activeStorage: KeyValueStorage | null = null;

/**
 * Configure or override the storage adapter (e.g. for AsyncStorage on native or testing).
 */
export function setStorageAdapter(adapter: KeyValueStorage | null): void {
  activeStorage = adapter;
}

/**
 * Get the current storage backend, resolving web localStorage or in-memory fallback.
 */
export function getStorageBackend(): KeyValueStorage {
  if (activeStorage) {
    return activeStorage;
  }
  const webStorage = getWebLocalStorage();
  if (webStorage) {
    return webStorage;
  }
  return {
    getItem: (key: string) => memoryStore[key] ?? null,
    setItem: (key: string, value: string) => {
      memoryStore[key] = value;
    },
  };
}

/**
 * Retrieve the saved best score.
 * Returns 0 if none stored or on error/invalid number.
 */
export async function getBestScore(): Promise<number> {
  try {
    const backend = getStorageBackend();
    const raw = await backend.getItem(BEST_SCORE_STORAGE_KEY);
    if (!raw) return 0;
    const parsed = parseInt(raw, 10);
    return Number.isFinite(parsed) && parsed > 0 ? parsed : 0;
  } catch {
    return 0;
  }
}

/**
 * Synchronous best score getter for environments where sync access is guaranteed (web localStorage / memory).
 */
export function getBestScoreSync(): number {
  try {
    const backend = getStorageBackend();
    const result = backend.getItem(BEST_SCORE_STORAGE_KEY);
    if (typeof result === 'string') {
      const parsed = parseInt(result, 10);
      return Number.isFinite(parsed) && parsed > 0 ? parsed : 0;
    }
    return 0;
  } catch {
    return 0;
  }
}

/**
 * Persist a new best score if it exceeds the current best score,
 * or always persist if force is true.
 * Returns the resulting best score.
 */
export async function saveBestScore(newScore: number, force = false): Promise<number> {
  try {
    const safeScore = Math.max(0, Math.floor(newScore));
    const currentBest = await getBestScore();
    if (force || safeScore > currentBest) {
      const backend = getStorageBackend();
      await backend.setItem(BEST_SCORE_STORAGE_KEY, safeScore.toString());
      return safeScore;
    }
    return currentBest;
  } catch {
    return newScore;
  }
}

/**
 * Synchronous save for immediate in-memory / localStorage updates.
 */
export function saveBestScoreSync(newScore: number, force = false): number {
  try {
    const safeScore = Math.max(0, Math.floor(newScore));
    const currentBest = getBestScoreSync();
    if (force || safeScore > currentBest) {
      const backend = getStorageBackend();
      backend.setItem(BEST_SCORE_STORAGE_KEY, safeScore.toString());
      return safeScore;
    }
    return currentBest;
  } catch {
    return newScore;
  }
}
