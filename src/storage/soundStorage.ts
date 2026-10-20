/**
 * GemBlast – Sound Preference Storage Adapter
 *
 * Provides cross-platform persistence for sound mute preference:
 * - Uses window.localStorage / globalThis.localStorage if available (Web)
 * - Uses an in-memory fallback if localStorage is unavailable or throws
 * - Supports an optional custom storage backend (e.g. AsyncStorage adapter)
 */

import { KeyValueStorage, getStorageBackend as getScoreStorageBackend } from './scoreStorage';

export const SOUND_MUTED_STORAGE_KEY = 'gemblast_sound_muted';

// In-memory fallback cache
let memoryStore: Record<string, string> = {};

/**
 * Reset in-memory store (primarily for unit tests).
 */
export function resetSoundMemoryStore(): void {
  memoryStore = {};
}

let activeStorage: KeyValueStorage | null = null;

/**
 * Configure or override the storage adapter (e.g. for testing or custom persistence).
 */
export function setSoundStorageAdapter(adapter: KeyValueStorage | null): void {
  activeStorage = adapter;
}

/**
 * Get the current storage backend, resolving custom adapter, web localStorage or in-memory fallback.
 */
export function getSoundStorageBackend(): KeyValueStorage {
  if (activeStorage) {
    return activeStorage;
  }
  // Try to use scoreStorage's backend resolution, but fallback to local memoryStore if none
  try {
    const backend = getScoreStorageBackend();
    if (backend) {
      return backend;
    }
  } catch {
    // ignore
  }
  return {
    getItem: (key: string) => memoryStore[key] ?? null,
    setItem: (key: string, value: string) => {
      memoryStore[key] = value;
    },
  };
}

/**
 * Pure helper to parse muted boolean from a string representation.
 * Returns true if stored string is 'true', false otherwise.
 */
export function parseMutedValue(raw: string | null | undefined): boolean {
  return raw === 'true';
}

/**
 * Pure helper to format muted boolean to a string representation.
 */
export function formatMutedValue(muted: boolean): string {
  return muted ? 'true' : 'false';
}

/**
 * Retrieve whether sound is muted asynchronously.
 * Returns false by default (unmuted).
 */
export async function getMuted(): Promise<boolean> {
  try {
    const backend = getSoundStorageBackend();
    const raw = await backend.getItem(SOUND_MUTED_STORAGE_KEY);
    return parseMutedValue(raw);
  } catch {
    return false;
  }
}

/**
 * Synchronous getter for sound mute preference.
 * Returns false by default (unmuted).
 */
export function getMutedSync(): boolean {
  try {
    const backend = getSoundStorageBackend();
    const result = backend.getItem(SOUND_MUTED_STORAGE_KEY);
    if (typeof result === 'string') {
      return parseMutedValue(result);
    }
    return false;
  } catch {
    return false;
  }
}

/**
 * Persist the sound mute preference asynchronously.
 */
export async function setMuted(muted: boolean): Promise<boolean> {
  try {
    const backend = getSoundStorageBackend();
    await backend.setItem(SOUND_MUTED_STORAGE_KEY, formatMutedValue(muted));
    return muted;
  } catch {
    return muted;
  }
}

/**
 * Persist the sound mute preference synchronously.
 */
export function setMutedSync(muted: boolean): boolean {
  try {
    const backend = getSoundStorageBackend();
    backend.setItem(SOUND_MUTED_STORAGE_KEY, formatMutedValue(muted));
    return muted;
  } catch {
    return muted;
  }
}

/**
 * Toggle the mute setting and return the new state.
 */
export async function toggleMuted(): Promise<boolean> {
  const current = await getMuted();
  const next = !current;
  await setMuted(next);
  return next;
}
