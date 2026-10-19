/**
 * GemBlast – Match Detection Engine
 * Finds all horizontal and vertical runs of 3, 4, or 5 matching pieces.
 */

import { Board, BOARD_SIZE, PieceType } from './board';

export interface Match {
  cells: Array<{ row: number; col: number }>;
  type: PieceType;
  direction: 'horizontal' | 'vertical';
  length: number;
}

/**
 * Find all matches (runs of 3+) in the board.
 * Returns an array of Match objects. Overlapping matches are each reported.
 */
export function findMatches(board: Board): Match[] {
  const matches: Match[] = [];

  // Horizontal scan
  for (let row = 0; row < BOARD_SIZE; row++) {
    let col = 0;
    while (col < BOARD_SIZE) {
      const cell = board[row][col];
      if (cell === null) {
        col++;
        continue;
      }
      let end = col + 1;
      while (end < BOARD_SIZE && board[row][end] === cell) {
        end++;
      }
      const length = end - col;
      if (length >= 3) {
        const cells = [];
        for (let c = col; c < end; c++) {
          cells.push({ row, col: c });
        }
        matches.push({ cells, type: cell, direction: 'horizontal', length });
      }
      col = end;
    }
  }

  // Vertical scan
  for (let col = 0; col < BOARD_SIZE; col++) {
    let row = 0;
    while (row < BOARD_SIZE) {
      const cell = board[row][col];
      if (cell === null) {
        row++;
        continue;
      }
      let end = row + 1;
      while (end < BOARD_SIZE && board[end][col] === cell) {
        end++;
      }
      const length = end - row;
      if (length >= 3) {
        const cells = [];
        for (let r = row; r < end; r++) {
          cells.push({ row: r, col });
        }
        matches.push({ cells, type: cell, direction: 'vertical', length });
      }
      row = end;
    }
  }

  return matches;
}

/**
 * Remove matched cells from the board.
 * Returns a new board with matched positions set to null.
 */
export function removeMatches(board: Board, matches: Match[]): Board {
  const next = board.map((row) => [...row]);
  for (const match of matches) {
    for (const { row, col } of match.cells) {
      next[row][col] = null;
    }
  }
  return next;
}

/**
 * Get the set of unique cells covered by all matches.
 */
export function matchedCells(
  matches: Match[]
): Set<string> {
  const set = new Set<string>();
  for (const match of matches) {
    for (const { row, col } of match.cells) {
      set.add(`${row},${col}`);
    }
  }
  return set;
}
