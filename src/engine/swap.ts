/**
 * GemBlast – Swap Engine
 * Validates and performs piece swaps.
 */

import { Board, areAdjacent, inBounds, cloneBoard } from './board';
import { findMatches } from './match';

export interface SwapResult {
  valid: boolean;
  board: Board;
}

/**
 * Swap two cells on the board (pure – returns new board).
 * Does NOT validate adjacency or match result.
 */
export function swapPieces(
  board: Board,
  r1: number,
  c1: number,
  r2: number,
  c2: number
): Board {
  const next = cloneBoard(board);
  const temp = next[r1][c1];
  next[r1][c1] = next[r2][c2];
  next[r2][c2] = temp;
  return next;
}

/**
 * Validate a swap:
 * 1. Both positions must be in-bounds.
 * 2. Positions must be orthogonally adjacent.
 * 3. After swapping, at least one match must exist.
 *
 * Returns { valid, board } where board is the swapped board if valid,
 * or the original board if invalid.
 */
export function validateSwap(
  board: Board,
  r1: number,
  c1: number,
  r2: number,
  c2: number
): SwapResult {
  if (!inBounds(r1, c1) || !inBounds(r2, c2)) {
    return { valid: false, board };
  }
  if (!areAdjacent(r1, c1, r2, c2)) {
    return { valid: false, board };
  }

  const swapped = swapPieces(board, r1, c1, r2, c2);
  const matches = findMatches(swapped);

  if (matches.length === 0) {
    // Invalid move – return original board
    return { valid: false, board };
  }

  return { valid: true, board: swapped };
}
