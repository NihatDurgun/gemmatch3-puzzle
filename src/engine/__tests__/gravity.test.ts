/**
 * GemBlast – Gravity Engine Tests
 */

import { PieceType, BOARD_SIZE } from '../board';
import { applyGravity, refillBoard } from '../gravity';

const R = PieceType.Ruby;
const S = PieceType.Sapphire;
const E = PieceType.Emerald;
const ALL_TYPES = Object.values(PieceType);

describe('applyGravity', () => {
  it('drops pieces to the bottom, nulls float to top', () => {
    const board = Array.from({ length: 8 }, () =>
      Array(8).fill(S) as (PieceType | null)[]
    );
    // Column 0: [R, null, null, S, S, S, S, S]
    board[0][0] = R;
    board[1][0] = null;
    board[2][0] = null;
    // rest of col 0 is S

    const after = applyGravity(board);

    // Top 2 should be null
    expect(after[0][0]).toBeNull();
    expect(after[1][0]).toBeNull();
    // Then R, then S's
    expect(after[2][0]).toBe(R);
  });

  it('handles a fully null column', () => {
    const board = Array.from({ length: 8 }, () =>
      Array(8).fill(null) as (PieceType | null)[]
    );
    const after = applyGravity(board);
    for (let row = 0; row < BOARD_SIZE; row++) {
      expect(after[row][0]).toBeNull();
    }
  });

  it('handles a fully filled column (no nulls)', () => {
    const board = Array.from({ length: 8 }, () =>
      Array(8).fill(S) as (PieceType | null)[]
    );
    const after = applyGravity(board);
    for (let row = 0; row < BOARD_SIZE; row++) {
      expect(after[row][0]).toBe(S);
    }
  });

  it('does not mutate the original board', () => {
    const board = Array.from({ length: 8 }, () =>
      Array(8).fill(S) as (PieceType | null)[]
    );
    board[0][0] = null;
    applyGravity(board);
    expect(board[0][0]).toBeNull(); // original unchanged
  });

  it('preserves piece order (top-to-bottom within non-null pieces)', () => {
    const board = Array.from({ length: 8 }, () =>
      Array(8).fill(null) as (PieceType | null)[]
    );
    // Col 0: [R, null, E, null, null, null, null, null]
    board[0][0] = R;
    board[2][0] = E;
    const after = applyGravity(board);
    // Should be: [null, null, null, null, null, null, R, E]
    expect(after[6][0]).toBe(R);
    expect(after[7][0]).toBe(E);
    for (let r = 0; r < 6; r++) {
      expect(after[r][0]).toBeNull();
    }
  });
});

describe('refillBoard', () => {
  it('fills all null cells with valid piece types', () => {
    const board = Array.from({ length: 8 }, () =>
      Array(8).fill(null) as (PieceType | null)[]
    );
    const after = refillBoard(board);
    for (let row = 0; row < BOARD_SIZE; row++) {
      for (let col = 0; col < BOARD_SIZE; col++) {
        expect(after[row][col]).not.toBeNull();
        expect(ALL_TYPES).toContain(after[row][col]);
      }
    }
  });

  it('does not overwrite non-null cells', () => {
    const board = Array.from({ length: 8 }, () =>
      Array(8).fill(null) as (PieceType | null)[]
    );
    board[7][7] = R;
    const after = refillBoard(board);
    expect(after[7][7]).toBe(R);
  });

  it('does not mutate the original board', () => {
    const board = Array.from({ length: 8 }, () =>
      Array(8).fill(null) as (PieceType | null)[]
    );
    refillBoard(board);
    expect(board[0][0]).toBeNull();
  });
});
