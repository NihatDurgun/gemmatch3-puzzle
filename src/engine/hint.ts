/**
 * GemBlast – Hint Engine
 * Finds valid moves and hint candidates on a board.
 */

import { Board, BOARD_SIZE } from './board';
import { validateSwap } from './swap';

export interface Position {
  row: number;
  col: number;
}

export interface PossibleMove {
  from: Position;
  to: Position;
}

/**
 * Finds all possible valid adjacent moves on the board that result in a match.
 * Scans each cell and checks swapping to right (col + 1) and down (row + 1)
 * to avoid returning duplicate moves in reverse directions.
 */
export function findPossibleMoves(board: Board): PossibleMove[] {
  const moves: PossibleMove[] = [];

  for (let row = 0; row < BOARD_SIZE; row++) {
    for (let col = 0; col < BOARD_SIZE; col++) {
      // Check horizontal swap with right neighbor
      if (col + 1 < BOARD_SIZE) {
        const swapRight = validateSwap(board, row, col, row, col + 1);
        if (swapRight.valid) {
          moves.push({
            from: { row, col },
            to: { row, col: col + 1 },
          });
        }
      }

      // Check vertical swap with bottom neighbor
      if (row + 1 < BOARD_SIZE) {
        const swapDown = validateSwap(board, row, col, row + 1, col);
        if (swapDown.valid) {
          moves.push({
            from: { row, col },
            to: { row: row + 1, col },
          });
        }
      }
    }
  }

  return moves;
}

/**
 * Returns the first available valid move as a hint, or null if no valid moves exist.
 */
export function findHint(board: Board): PossibleMove | null {
  const moves = findPossibleMoves(board);
  return moves.length > 0 ? moves[0] : null;
}
