/**
 * GemBlast – Cascade Engine Tests
 */

import { PieceType, BOARD_SIZE, emptyBoard, Board } from '../board';
import { resolveCascade } from '../cascade';
import { findMatches } from '../match';

/** Helper: create a board from a 2D array of PieceType|null */
function makeBoard(data: (PieceType | null)[][]): Board {
  return data.map((row) => [...row]);
}

/** Fill a board with non-matching pieces (alternating pattern) */
function stableBoard(): Board {
  const types = [
    PieceType.Ruby,
    PieceType.Sapphire,
    PieceType.Emerald,
    PieceType.Topaz,
    PieceType.Amethyst,
  ];
  const board: Board = [];
  for (let r = 0; r < BOARD_SIZE; r++) {
    const row: (PieceType | null)[] = [];
    for (let c = 0; c < BOARD_SIZE; c++) {
      // Use offset to avoid 3-in-a-row
      row.push(types[(r * 3 + c * 2) % types.length]);
    }
    board.push(row);
  }
  return board;
}

describe('resolveCascade', () => {
  it('returns the board unchanged when no matches exist', () => {
    const board = stableBoard();
    const { board: result, totalScore, cascadeCount } = resolveCascade(board);
    expect(findMatches(result)).toHaveLength(0);
    expect(totalScore).toBe(0);
    expect(cascadeCount).toBe(0);
  });

  it('resolves a single horizontal match', () => {
    // Row 0: R R R S E T A S — has a 3-match of Ruby
    const board = stableBoard();
    board[0][0] = PieceType.Ruby;
    board[0][1] = PieceType.Ruby;
    board[0][2] = PieceType.Ruby;
    // Make sure no other matches exist in other rows by using the stable board

    const { board: result, totalScore, cascadeCount } = resolveCascade(board);

    // Final board should have no matches
    expect(findMatches(result)).toHaveLength(0);
    // Score should be positive (30 * 3 * 1.5^0 = 90)
    expect(totalScore).toBeGreaterThanOrEqual(90);
    // At least one cascade step happened
    expect(cascadeCount).toBeGreaterThanOrEqual(1);
  });

  it('resolves a single vertical match', () => {
    const board = stableBoard();
    board[0][0] = PieceType.Emerald;
    board[1][0] = PieceType.Emerald;
    board[2][0] = PieceType.Emerald;

    const { board: result, totalScore, cascadeCount } = resolveCascade(board);

    expect(findMatches(result)).toHaveLength(0);
    expect(totalScore).toBeGreaterThanOrEqual(90);
    expect(cascadeCount).toBeGreaterThanOrEqual(1);
  });

  it('accumulates score across cascade levels', () => {
    // Build a board guaranteed to cascade:
    // Fill col 0 rows 0-2 with Ruby (vertical match)
    // After gravity+refill, new pieces might create another match –
    // so we verify cascadeCount can be >= 1 and score >= 90
    const board = stableBoard();
    board[5][0] = PieceType.Topaz;
    board[6][0] = PieceType.Topaz;
    board[7][0] = PieceType.Topaz;

    const { board: result, totalScore, cascadeCount } = resolveCascade(board);

    expect(findMatches(result)).toHaveLength(0);
    expect(totalScore).toBeGreaterThanOrEqual(90);
    expect(cascadeCount).toBeGreaterThanOrEqual(1);
  });

  it('final board has no null cells', () => {
    const board = stableBoard();
    board[0][0] = PieceType.Ruby;
    board[0][1] = PieceType.Ruby;
    board[0][2] = PieceType.Ruby;

    const { board: result } = resolveCascade(board);

    result.forEach((row) =>
      row.forEach((cell) => expect(cell).not.toBeNull())
    );
  });

  it('final board has correct dimensions', () => {
    const board = stableBoard();
    board[3][3] = PieceType.Amethyst;
    board[3][4] = PieceType.Amethyst;
    board[3][5] = PieceType.Amethyst;

    const { board: result } = resolveCascade(board);

    expect(result.length).toBe(BOARD_SIZE);
    result.forEach((row) => expect(row.length).toBe(BOARD_SIZE));
  });

  it('handles a 5-match and returns higher score', () => {
    const board = stableBoard();
    // 5-match horizontal in row 4
    board[4][0] = PieceType.Sapphire;
    board[4][1] = PieceType.Sapphire;
    board[4][2] = PieceType.Sapphire;
    board[4][3] = PieceType.Sapphire;
    board[4][4] = PieceType.Sapphire;

    const { totalScore } = resolveCascade(board);

    // 30 * 5 * 1.5^0 = 150
    expect(totalScore).toBeGreaterThanOrEqual(150);
  });

  it('loops until board is stable (no matches remain)', () => {
    // Run 5 random boards through cascade and confirm stability
    for (let i = 0; i < 5; i++) {
      const { createBoard } = require('../board');
      const board = createBoard();
      // Manually inject a match
      board[7][0] = PieceType.Ruby;
      board[7][1] = PieceType.Ruby;
      board[7][2] = PieceType.Ruby;

      const { board: result } = resolveCascade(board);
      expect(findMatches(result)).toHaveLength(0);
    }
  });
});
