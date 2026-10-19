/**
 * GemBlast – Gravity Engine
 * Drops pieces down to fill null gaps, then refills from the top.
 */

import { Board, BOARD_SIZE, ALL_PIECE_TYPES, cloneBoard } from './board';

/**
 * Apply gravity: for each column, shift non-null cells to the bottom.
 * Null cells float to the top.
 * Returns a new board.
 */
export function applyGravity(board: Board): Board {
  const next = cloneBoard(board);

  for (let col = 0; col < BOARD_SIZE; col++) {
    // Collect non-null cells in this column (top to bottom order)
    const nonNull = [];
    for (let row = 0; row < BOARD_SIZE; row++) {
      if (next[row][col] !== null) {
        nonNull.push(next[row][col]);
      }
    }

    // Fill from bottom: last elements go to bottom rows
    const nullCount = BOARD_SIZE - nonNull.length;
    for (let row = 0; row < BOARD_SIZE; row++) {
      if (row < nullCount) {
        next[row][col] = null;
      } else {
        next[row][col] = nonNull[row - nullCount];
      }
    }
  }

  return next;
}

/**
 * Refill the board: replace all null cells with random pieces.
 * Returns a new board.
 */
export function refillBoard(board: Board): Board {
  const next = cloneBoard(board);
  const typeCount = ALL_PIECE_TYPES.length;

  for (let row = 0; row < BOARD_SIZE; row++) {
    for (let col = 0; col < BOARD_SIZE; col++) {
      if (next[row][col] === null) {
        next[row][col] =
          ALL_PIECE_TYPES[Math.floor(Math.random() * typeCount)];
      }
    }
  }

  return next;
}
