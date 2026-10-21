/**
 * GemBlast – Hint Engine Tests
 */

import { PieceType, BOARD_SIZE } from '../board';
import { findPossibleMoves, findHint } from '../hint';

const R = PieceType.Ruby;
const S = PieceType.Sapphire;
const E = PieceType.Emerald;
const T = PieceType.Topaz;
const A = PieceType.Amethyst;

describe('Hint Engine', () => {
  it('returns empty array and null hint when no valid moves exist', () => {
    // Construct a board with strictly no 3-in-a-row possible with any swap.
    // Repeating pattern of 3 distinct gem types per row and column shifted:
    // row 0: R, S, E, R, S, E, R, S
    // row 1: E, R, S, E, R, S, E, R
    // row 2: S, E, R, S, E, R, S, E
    // Any swap between two adjacent elements cannot create 3 identical in a row.
    const pattern = [R, S, E];
    const board = Array.from({ length: BOARD_SIZE }, (_, r) =>
      Array.from({ length: BOARD_SIZE }, (_, c) => pattern[(r * 2 + c) % 3])
    );

    const moves = findPossibleMoves(board);
    expect(moves).toEqual([]);

    const hint = findHint(board);
    expect(hint).toBeNull();
  });

  it('finds a horizontal swap move that completes a horizontal match', () => {
    const pattern = [R, S, E];
    const board = Array.from({ length: BOARD_SIZE }, (_, r) =>
      Array.from({ length: BOARD_SIZE }, (_, c) => pattern[(r * 2 + c) % 3])
    );

    // Place [T, T, S, T] on row 0: swapping (0, 2) and (0, 3) gives [T, T, T, S]
    board[0][0] = T;
    board[0][1] = T;
    board[0][2] = S;
    board[0][3] = T;

    const moves = findPossibleMoves(board);
    expect(moves.length).toBeGreaterThanOrEqual(1);

    const targetMove = moves.find(
      (m) =>
        (m.from.row === 0 && m.from.col === 2 && m.to.row === 0 && m.to.col === 3) ||
        (m.from.row === 0 && m.from.col === 3 && m.to.row === 0 && m.to.col === 2)
    );
    expect(targetMove).toBeDefined();

    const hint = findHint(board);
    expect(hint).not.toBeNull();
    expect(hint).toEqual(moves[0]);
  });

  it('finds a vertical swap move that completes a vertical match', () => {
    const pattern = [R, S, E];
    const board = Array.from({ length: BOARD_SIZE }, (_, r) =>
      Array.from({ length: BOARD_SIZE }, (_, c) => pattern[(r * 2 + c) % 3])
    );

    // Col 0: row 0 = T, row 1 = T, row 2 = S, row 3 = T
    // Swapping (2, 0) and (3, 0) gives T, T, T
    board[0][0] = T;
    board[1][0] = T;
    board[2][0] = S;
    board[3][0] = T;

    const moves = findPossibleMoves(board);
    const targetMove = moves.find(
      (m) =>
        (m.from.row === 2 && m.from.col === 0 && m.to.row === 3 && m.to.col === 0) ||
        (m.from.row === 3 && m.from.col === 0 && m.to.row === 2 && m.to.col === 0)
    );
    expect(targetMove).toBeDefined();

    const hint = findHint(board);
    expect(hint).not.toBeNull();
  });
});
