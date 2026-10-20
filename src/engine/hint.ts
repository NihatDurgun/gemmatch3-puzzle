/**
 * GemBlast – Hint Detection Engine
 * Scans the board for valid moves that create matches.
 */

import { Board, BOARD_SIZE } from './board';
import { validateSwap } from './swap';

export interface Move {
  r1: number;
  c1: number;
  r2: number;
  c2: number;
}

/**
 * Scan the board for all orthogonal swaps that yield at least one match.
 * Scans only right and down swaps to avoid duplicating symmetrical moves (e.g. (r1,c1)<->(r2,c2)).
 */
export function findPossibleMoves(board: Board): Move[] {
  const possibleMoves: Move[] = [];

  for (let r = 0; r < BOARD_SIZE; r++) {
    for (let c = 0; c < BOARD_SIZE; c++) {
      // Check horizontal swap to the right
      if (c + 1 < BOARD_SIZE) {
        const res = validateSwap(board, r, c, r, c + 1);
        if (res.valid) {
          possibleMoves.push({ r1: r, c1: c, r2: r, c2: c + 1 });
        }
      }

      // Check vertical swap downwards
      if (r + 1 < BOARD_SIZE) {
        const res = validateSwap(board, r, c, r + 1, c);
        if (res.valid) {
          possibleMoves.push({ r1: r, c1: c, r2: r + 1, c2: c });
        }
      }
    }
  }

  return possibleMoves;
}

/**
 * Return the first available valid move, or null if no moves exist (deadlock/shuffle state).
 */
export function getHint(board: Board): Move | null {
  const moves = findPossibleMoves(board);
  return moves.length > 0 ? moves[0] : null;
}
