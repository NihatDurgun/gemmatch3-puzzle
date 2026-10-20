/**
 * GemBlast – Swap Engine Tests
 */

import { PieceType, emptyBoard } from '../board';
import { swapPieces, validateSwap } from '../swap';

const R = PieceType.Ruby;
const S = PieceType.Sapphire;
const E = PieceType.Emerald;
const T = PieceType.Topaz;
const A = PieceType.Amethyst;

/** Build a board where row 0 = [R,R,S,E,T,A,S,E], rest = S */
function makeTestBoard() {
  const board = Array.from({ length: 8 }, () => Array(8).fill(S) as PieceType[]);
  // Set up a scenario where swapping (0,2) and (0,3) would create R,R,R
  board[0][0] = R;
  board[0][1] = R;
  board[0][2] = S; // will be swapped with (0,3)
  board[0][3] = R;
  board[0][4] = E;
  board[0][5] = T;
  board[0][6] = A;
  board[0][7] = E;
  return board;
}

describe('swapPieces', () => {
  it('swaps two adjacent cells', () => {
    const board = makeTestBoard();
    const after = swapPieces(board, 0, 0, 0, 1);
    expect(after[0][0]).toBe(R); // same type
    expect(after[0][1]).toBe(R); // same type
    // Actually swap different types
    const b2 = Array.from({ length: 8 }, () => Array(8).fill(S) as PieceType[]);
    b2[0][0] = R;
    b2[0][1] = E;
    const after2 = swapPieces(b2, 0, 0, 0, 1);
    expect(after2[0][0]).toBe(E);
    expect(after2[0][1]).toBe(R);
  });

  it('does not mutate the original board', () => {
    const board = makeTestBoard();
    const original00 = board[0][0];
    const original01 = board[0][1];
    swapPieces(board, 0, 0, 0, 1);
    expect(board[0][0]).toBe(original00);
    expect(board[0][1]).toBe(original01);
  });

  it('can swap non-adjacent cells (swapPieces does not validate)', () => {
    const board = makeTestBoard();
    const after = swapPieces(board, 0, 0, 7, 7);
    expect(after[0][0]).toBe(S); // was S at [7][7]
    expect(after[7][7]).toBe(R); // was R at [0][0]
  });
});

describe('validateSwap', () => {
  it('returns invalid for out-of-bounds positions', () => {
    const board = makeTestBoard();
    const result = validateSwap(board, -1, 0, 0, 0);
    expect(result.valid).toBe(false);
    expect(result.board).toBe(board); // same reference = original
  });

  it('returns invalid for non-adjacent positions', () => {
    const board = makeTestBoard();
    const result = validateSwap(board, 0, 0, 0, 2);
    expect(result.valid).toBe(false);
  });

  it('returns invalid when swap creates no match', () => {
    // Build a board where no swap of (0,0)↔(0,1) creates a match
    const board = Array.from({ length: 8 }, (_, r) =>
      Array.from({ length: 8 }, (_, c) => ((r + c) % 2 === 0 ? S : T) as PieceType)
    );
    board[0][0] = R;
    board[0][1] = E;
    // No surrounding rubies or emeralds to form a match
    const result = validateSwap(board, 0, 0, 0, 1);
    expect(result.valid).toBe(false);
    // Board returned unchanged
    expect(result.board[0][0]).toBe(R);
    expect(result.board[0][1]).toBe(E);
  });

  it('returns valid when swap creates a horizontal match', () => {
    // Board: row0 = [R, R, S, R, ...S]  – swap (0,2) and (0,3) → R,R,R,S
    // Actually: swap (0,2)=S with (0,1)=R won't help. Let's set up correctly.
    // row0: [R, R, E, R, S, S, S, S] – swap (0,2)↔(0,3) → [R,R,R,E,...]
    const board = Array.from({ length: 8 }, () =>
      Array(8).fill(S) as PieceType[]
    );
    board[0][0] = R;
    board[0][1] = R;
    board[0][2] = E; // will be swapped with col 3
    board[0][3] = R;
    // After swap: [R, R, R, E, S, S, S, S] → match!
    const result = validateSwap(board, 0, 2, 0, 3);
    expect(result.valid).toBe(true);
    expect(result.board[0][2]).toBe(R);
    expect(result.board[0][3]).toBe(E);
  });

  it('returns valid when swap creates a vertical match', () => {
    const board = Array.from({ length: 8 }, () =>
      Array(8).fill(S) as PieceType[]
    );
    board[0][0] = R;
    board[1][0] = R;
    board[2][0] = E; // swap with row 3
    board[3][0] = R;
    // After swap (2,0)↔(3,0): col 0 = [R,R,R,E,...] → vertical match
    const result = validateSwap(board, 2, 0, 3, 0);
    expect(result.valid).toBe(true);
  });

  it('does not decrement moves on invalid swap (board unchanged)', () => {
    const board = Array.from({ length: 8 }, (_, r) =>
      Array.from({ length: 8 }, (_, c) => ((r + c) % 2 === 0 ? S : T) as PieceType)
    );
    board[0][0] = R;
    board[0][1] = E;
    const result = validateSwap(board, 0, 0, 0, 1);
    expect(result.valid).toBe(false);
    // Caller checks result.valid before decrementing moves
    // Board must be original
    expect(result.board[0][0]).toBe(R);
    expect(result.board[0][1]).toBe(E);
  });
});
