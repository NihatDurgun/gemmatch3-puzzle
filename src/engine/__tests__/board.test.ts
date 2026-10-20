/**
 * GemBlast – Board Engine Tests
 */

import {
  BOARD_SIZE,
  PieceType,
  ALL_PIECE_TYPES,
  createBoard,
  emptyBoard,
  cloneBoard,
  areAdjacent,
  inBounds,
} from '../board';
import { findMatches } from '../match';

describe('emptyBoard', () => {
  it('creates an 8x8 board of nulls', () => {
    const board = emptyBoard();
    expect(board.length).toBe(BOARD_SIZE);
    board.forEach((row) => {
      expect(row.length).toBe(BOARD_SIZE);
      row.forEach((cell) => expect(cell).toBeNull());
    });
  });
});

describe('cloneBoard', () => {
  it('returns a deep copy', () => {
    const board = emptyBoard();
    board[0][0] = PieceType.Ruby;
    const clone = cloneBoard(board);
    expect(clone[0][0]).toBe(PieceType.Ruby);
    // Mutate clone, original unchanged
    clone[0][0] = PieceType.Sapphire;
    expect(board[0][0]).toBe(PieceType.Ruby);
  });
});

describe('createBoard', () => {
  it('creates an 8x8 board', () => {
    const board = createBoard();
    expect(board.length).toBe(BOARD_SIZE);
    board.forEach((row) => expect(row.length).toBe(BOARD_SIZE));
  });

  it('has no null cells', () => {
    const board = createBoard();
    board.forEach((row) =>
      row.forEach((cell) => expect(cell).not.toBeNull())
    );
  });

  it('only contains valid PieceTypes', () => {
    const board = createBoard();
    board.forEach((row) =>
      row.forEach((cell) =>
        expect(ALL_PIECE_TYPES).toContain(cell)
      )
    );
  });

  it('has no pre-existing 3+ matches (run 10 times)', () => {
    for (let i = 0; i < 10; i++) {
      const board = createBoard();
      const matches = findMatches(board);
      expect(matches).toHaveLength(0);
    }
  });
});

describe('areAdjacent', () => {
  it('returns true for horizontally adjacent cells', () => {
    expect(areAdjacent(0, 0, 0, 1)).toBe(true);
    expect(areAdjacent(3, 4, 3, 5)).toBe(true);
  });

  it('returns true for vertically adjacent cells', () => {
    expect(areAdjacent(0, 0, 1, 0)).toBe(true);
    expect(areAdjacent(5, 3, 6, 3)).toBe(true);
  });

  it('returns false for diagonal cells', () => {
    expect(areAdjacent(0, 0, 1, 1)).toBe(false);
  });

  it('returns false for non-adjacent cells', () => {
    expect(areAdjacent(0, 0, 0, 2)).toBe(false);
    expect(areAdjacent(0, 0, 2, 0)).toBe(false);
  });

  it('returns false for same cell', () => {
    expect(areAdjacent(3, 3, 3, 3)).toBe(false);
  });
});

describe('inBounds', () => {
  it('returns true for valid positions', () => {
    expect(inBounds(0, 0)).toBe(true);
    expect(inBounds(7, 7)).toBe(true);
    expect(inBounds(4, 4)).toBe(true);
  });

  it('returns false for out-of-bounds positions', () => {
    expect(inBounds(-1, 0)).toBe(false);
    expect(inBounds(0, -1)).toBe(false);
    expect(inBounds(8, 0)).toBe(false);
    expect(inBounds(0, 8)).toBe(false);
  });
});
