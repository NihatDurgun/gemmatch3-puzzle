/**
 * GemBlast – Leaderboard Storage Adapter
 *
 * Provides cross-platform persistence and ranking for the player's top 10 local scores:
 * - Each score record: { id: string; score: number; date: string }
 * - Ranked descending by score (with tiebreaker on date)
 * - Capped at top 10 entries
 * - Clear scores functionality
 * - Works across web localStorage, AsyncStorage adapters, and in-memory fallback
 */

import { KeyValueStorage, getStorageBackend as getBaseStorageBackend } from './scoreStorage';

export interface LeaderboardEntry {
  id: string;
  score: number;
  date: string; // ISO 8601 string or formatted date
}

export const LEADERBOARD_STORAGE_KEY = 'gemblast_leaderboard';
export const MAX_LEADERBOARD_ENTRIES = 10;

// In-memory fallback
let leaderboardMemoryStore: Record<string, string> = {};

export function resetLeaderboardMemoryStore(): void {
  leaderboardMemoryStore = {};
}

let activeLeaderboardStorage: KeyValueStorage | null = null;

export function setLeaderboardStorageAdapter(adapter: KeyValueStorage | null): void {
  activeLeaderboardStorage = adapter;
}

export function getLeaderboardStorageBackend(): KeyValueStorage {
  if (activeLeaderboardStorage) {
    return activeLeaderboardStorage;
  }
  return getBaseStorageBackend();
}

/**
 * Pure helper to rank and trim scores down to top 10.
 * Sorts descending by score; ties sorted latest date first.
 */
export function rankLeaderboardEntries(entries: LeaderboardEntry[], limit = MAX_LEADERBOARD_ENTRIES): LeaderboardEntry[] {
  return [...entries]
    .filter((e) => typeof e?.score === 'number' && Number.isFinite(e.score) && e.score > 0)
    .sort((a, b) => {
      if (b.score !== a.score) {
        return b.score - a.score;
      }
      return new Date(b.date).getTime() - new Date(a.date).getTime();
    })
    .slice(0, limit);
}

/**
 * Retrieve current leaderboard entries.
 */
export async function getLeaderboard(): Promise<LeaderboardEntry[]> {
  try {
    const backend = getLeaderboardStorageBackend();
    const raw = await backend.getItem(LEADERBOARD_STORAGE_KEY);
    if (!raw) return [];
    const parsed = JSON.parse(raw);
    if (!Array.isArray(parsed)) return [];
    return rankLeaderboardEntries(parsed);
  } catch {
    return [];
  }
}

/**
 * Synchronous get for immediate render / synchronous contexts.
 */
export function getLeaderboardSync(): LeaderboardEntry[] {
  try {
    const backend = getLeaderboardStorageBackend();
    const raw = backend.getItem(LEADERBOARD_STORAGE_KEY);
    if (typeof raw !== 'string') return [];
    const parsed = JSON.parse(raw);
    if (!Array.isArray(parsed)) return [];
    return rankLeaderboardEntries(parsed);
  } catch {
    return [];
  }
}

/**
 * Record a new score and return the updated top 10 ranked entries.
 */
export async function recordScore(score: number, dateStr?: string): Promise<LeaderboardEntry[]> {
  if (score <= 0) {
    return getLeaderboard();
  }
  try {
    const current = await getLeaderboard();
    const newEntry: LeaderboardEntry = {
      id: `${Date.now()}-${Math.random().toString(36).slice(2, 7)}`,
      score: Math.floor(score),
      date: dateStr || new Date().toISOString(),
    };
    const updated = rankLeaderboardEntries([...current, newEntry]);
    const backend = getLeaderboardStorageBackend();
    await backend.setItem(LEADERBOARD_STORAGE_KEY, JSON.stringify(updated));
    return updated;
  } catch {
    return getLeaderboardSync();
  }
}

/**
 * Record a new score synchronously.
 */
export function recordScoreSync(score: number, dateStr?: string): LeaderboardEntry[] {
  if (score <= 0) {
    return getLeaderboardSync();
  }
  try {
    const current = getLeaderboardSync();
    const newEntry: LeaderboardEntry = {
      id: `${Date.now()}-${Math.random().toString(36).slice(2, 7)}`,
      score: Math.floor(score),
      date: dateStr || new Date().toISOString(),
    };
    const updated = rankLeaderboardEntries([...current, newEntry]);
    const backend = getLeaderboardStorageBackend();
    backend.setItem(LEADERBOARD_STORAGE_KEY, JSON.stringify(updated));
    return updated;
  } catch {
    return [];
  }
}

/**
 * Clear all leaderboard scores.
 */
export async function clearLeaderboard(): Promise<void> {
  try {
    const backend = getLeaderboardStorageBackend();
    await backend.setItem(LEADERBOARD_STORAGE_KEY, JSON.stringify([]));
  } catch {
    // Ignore error
  }
}

/**
 * Clear all leaderboard scores synchronously.
 */
export function clearLeaderboardSync(): void {
  try {
    const backend = getLeaderboardStorageBackend();
    backend.setItem(LEADERBOARD_STORAGE_KEY, JSON.stringify([]));
  } catch {
    // Ignore error
  }
}
