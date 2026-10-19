/**
 * GemBlast – Cascade Engine
 * Resolves cascades: find matches → remove → gravity → refill → repeat.
 * Stops when no more matches are found.
 */

import { Board } from './board';
import { findMatches, removeMatches } from './match';
import { applyGravity, refillBoard } from './gravity';
import { calculateTurnScore } from './score';

export interface CascadeResult {
  board: Board;
  totalScore: number;
  cascadeCount: number;
}

/**
 * Resolve all cascades starting from the given board.
 * Runs: findMatches → removeMatches → applyGravity → refillBoard
 * until findMatches returns an empty array.
 *
 * @param board - The board after an initial swap (may already have matches)
 * @returns CascadeResult with final board, total score earned, and cascade depth
 */
export function resolveCascade(board: Board): CascadeResult {
  let current = board;
  let totalScore = 0;
  let cascadeLevel = 0;

  while (true) {
    const matches = findMatches(current);
    if (matches.length === 0) {
      break;
    }

    // Accumulate score at current cascade level
    totalScore += calculateTurnScore(matches, cascadeLevel);

    // Remove matched pieces, apply gravity, refill
    const afterRemove = removeMatches(current, matches);
    const afterGravity = applyGravity(afterRemove);
    current = refillBoard(afterGravity);

    cascadeLevel++;
  }

  return { board: current, totalScore, cascadeCount: cascadeLevel };
}
