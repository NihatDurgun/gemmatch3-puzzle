/**
 * GemBlast – Hint Engine Tests
 */

import { PieceType, Board } from '../board';
import { findPossibleMoves, getHint } from '../hint';

const R = PieceType.Ruby;
const S = PieceType.Sapphire;
const E = PieceType.Emerald;
const T = PieceType.Topaz;
const A = PieceType.Amethyst;

/**
 * Creates an 8x8 checkerboard pattern of alternating pieces that contains no 3-in-a-row
 * and no possible swaps that create a match.
 */
function createDeadlockedBoard(): Board {
  // Alternating pattern with 4 piece types ensuring no 3 in a row even after any swap:
  // Row 0: R S R S R S R S
  // Row 1: E T E T E T E T
  // Row 2: R S R S R S R S
  // Row 3: E T E T E T E T
  // Any orthogonal swap brings an E into an R-S row or an R into an E-T row, never making 3 of the same type.
  const board: Board = [];
  for (let r = 0; r < 8; r++) {
    const row = [];
    for (let c = 0; c < 8; c++) {
      if (r % 2 === 0) {
        row.push(c % 2 === 0 ? R : S);
      } else {
        row.push(c % 2 === 0 ? E : T);
      }
    }
    board.push(row);
  }
  return board;
}

describe('Hint Engine', () => {
  describe('findPossibleMoves', () => {
    it('returns empty array when board has no valid moves (deadlock)', () => {
      const board = createDeadlockedBoard();
      const moves = findPossibleMoves(board);
      expect(moves).toEqual([]);
    });

    it('finds a single horizontal swap that produces a match', () => {
      const board = createDeadlockedBoard();
      // Introduce exactly one valid move:
      // Row 0: R, R, E, A, ... where swapping (0,2) and (0,3) makes R, R, R if (0,3) is R
      // Let's explicitly setup:
      board[0][0] = R;
      board[0][1] = R;
      board[0][2] = S;
      board[0][3] = R;
      // Swapping (0, 2) and (0, 3) gives R, R, R at row 0 col 0..2
      const moves = findPossibleMoves(board);
      expect(moves.length).toBe(1);
      expect(moves[0]).toEqual({
        r1: 0,
        c1: 2,
        r2: 0,
        c2: 3,
      });
    });

    it('finds a vertical swap that produces a match', () => {
      const board = createDeadlockedBoard();
      board[0][0] = R;
      board[1][0] = R;
      board[2][0] = S;
      board[3][0] = R;
      // Swapping (2,0) and (3,0) gives vertical R, R, R
      const moves = findPossibleMoves(board);
      expect(moves.length).toBe(1);
      expect(moves[0]).toEqual({
        r1: 2,
        c1: 0,
        r2: 3,
        c2: 0,
      });
    });

    it('finds multiple valid moves on a board with several opportunities', () => {
      const board = createDeadlockedBoard();
      // Setup horizontal match move at row 0:
      board[0][0] = R;
      board[0][1] = R;
      board[0][2] = S;
      board[0][3] = R;

      // Setup vertical match move at col 7:
      board[5][7] = A;
      board[6][7] = A;
      board[7][7] = E;
      board[7][6] = A; // swapping (7,6) and (7,7) brings A into (7,7) making vertical A,A,A at (5,7),(6,7),(7,7)

      const moves = findPossibleMoves(board);
      expect(moves.length).toBeGreaterThanOrEqual(2);
      expect(moves).toContainEqual({
        r1: 0,
        c1: 2,
        r2: 0,
        c2: 3,
      });
      expect(moves).toContainEqual({
        r1: 7,
        c1: 6,
        r2: 7,
        c2: 7,
      });
    });
  });

  describe('getHint', () => {
    it('returns null when no valid moves exist', () => {
      const board = createDeadlockedBoard();
      const hint = getHint(board);
      expect(hint).toBeNull();
    });

    it('returns the first move when one or more valid moves exist', () => {
      const board = createDeadlockedBoard();
      board[0][0] = R;
      board[0][1] = R;
      board[0][2] = S;
      board[0][3] = R;

      const hint = getHint(board);
      expect(hint).toEqual({
        r1: 0,
        c1: 2,
        r2: 0,
        c2: 3,
      });
    });
  });
});
