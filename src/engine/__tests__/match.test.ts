/**
 * GemBlast – Match Detection Tests
 */

import { PieceType } from '../board';
import { findMatches, removeMatches, matchedCells } from '../match';

const R = PieceType.Ruby;
const S = PieceType.Sapphire;
const E = PieceType.Emerald;
const T = PieceType.Topaz;
const A = PieceType.Amethyst;

/** Build an 8x8 board from an 8-row array of 8-cell arrays */
function makeBoard(rows: Array<Array<PieceType | null>>) {
  // Pad to 8x8 if needed
  const board = Array.from({ length: 8 }, (_, r) =>
    Array.from({ length: 8 }, (_, c) => rows[r]?.[c] ?? S)
  );
  return board;
}

describe('findMatches – horizontal', () => {
  it('detects a horizontal run of 3', () => {
    const board = makeBoard([
      [R, R, R, S, S, S, S, S],
      [S, S, S, S, S, S, S, S],
      [S, S, S, S, S, S, S, S],
      [S, S, S, S, S, S, S, S],
      [S, S, S, S, S, S, S, S],
      [S, S, S, S, S, S, S, S],
      [S, S, S, S, S, S, S, S],
      [S, S, S, S, S, S, S, S],
    ]);
    const matches = findMatches(board);
    const hMatches = matches.filter((m) => m.direction === 'horizontal');
    expect(hMatches.length).toBeGreaterThanOrEqual(1);
    const rubyMatch = hMatches.find((m) => m.type === R);
    expect(rubyMatch).toBeDefined();
    expect(rubyMatch!.length).toBe(3);
    expect(rubyMatch!.cells).toHaveLength(3);
  });

  it('detects a horizontal run of 4', () => {
    const board = makeBoard([
      [R, R, R, R, S, S, S, S],
      [S, S, S, S, S, S, S, S],
      [S, S, S, S, S, S, S, S],
      [S, S, S, S, S, S, S, S],
      [S, S, S, S, S, S, S, S],
      [S, S, S, S, S, S, S, S],
      [S, S, S, S, S, S, S, S],
      [S, S, S, S, S, S, S, S],
    ]);
    const matches = findMatches(board);
    const rubyMatch = matches.find(
      (m) => m.type === R && m.direction === 'horizontal'
    );
    expect(rubyMatch).toBeDefined();
    expect(rubyMatch!.length).toBe(4);
  });

  it('detects a horizontal run of 5', () => {
    const board = makeBoard([
      [R, R, R, R, R, S, S, S],
      [S, S, S, S, S, S, S, S],
      [S, S, S, S, S, S, S, S],
      [S, S, S, S, S, S, S, S],
      [S, S, S, S, S, S, S, S],
      [S, S, S, S, S, S, S, S],
      [S, S, S, S, S, S, S, S],
      [S, S, S, S, S, S, S, S],
    ]);
    const matches = findMatches(board);
    const rubyMatch = matches.find(
      (m) => m.type === R && m.direction === 'horizontal'
    );
    expect(rubyMatch).toBeDefined();
    expect(rubyMatch!.length).toBe(5);
  });

  it('does not detect a run of 2', () => {
    const board = makeBoard([
      [R, R, S, S, S, S, S, S],
      [S, S, S, S, S, S, S, S],
      [S, S, S, S, S, S, S, S],
      [S, S, S, S, S, S, S, S],
      [S, S, S, S, S, S, S, S],
      [S, S, S, S, S, S, S, S],
      [S, S, S, S, S, S, S, S],
      [S, S, S, S, S, S, S, S],
    ]);
    const matches = findMatches(board);
    const rubyMatch = matches.find(
      (m) => m.type === R && m.direction === 'horizontal'
    );
    expect(rubyMatch).toBeUndefined();
  });
});

describe('findMatches – vertical', () => {
  it('detects a vertical run of 3', () => {
    const board = makeBoard([
      [R, S, S, S, S, S, S, S],
      [R, S, S, S, S, S, S, S],
      [R, S, S, S, S, S, S, S],
      [S, S, S, S, S, S, S, S],
      [S, S, S, S, S, S, S, S],
      [S, S, S, S, S, S, S, S],
      [S, S, S, S, S, S, S, S],
      [S, S, S, S, S, S, S, S],
    ]);
    const matches = findMatches(board);
    const vMatch = matches.find(
      (m) => m.type === R && m.direction === 'vertical'
    );
    expect(vMatch).toBeDefined();
    expect(vMatch!.length).toBe(3);
  });

  it('detects a vertical run of 5', () => {
    const board = makeBoard([
      [E, S, S, S, S, S, S, S],
      [E, S, S, S, S, S, S, S],
      [E, S, S, S, S, S, S, S],
      [E, S, S, S, S, S, S, S],
      [E, S, S, S, S, S, S, S],
      [S, S, S, S, S, S, S, S],
      [S, S, S, S, S, S, S, S],
      [S, S, S, S, S, S, S, S],
    ]);
    const matches = findMatches(board);
    const vMatch = matches.find(
      (m) => m.type === E && m.direction === 'vertical'
    );
    expect(vMatch).toBeDefined();
    expect(vMatch!.length).toBe(5);
  });
});

describe('findMatches – null handling', () => {
  it('skips null cells', () => {
    const board = makeBoard([
      [R, null, R, R, R, S, S, S],
      [S, S, S, S, S, S, S, S],
      [S, S, S, S, S, S, S, S],
      [S, S, S, S, S, S, S, S],
      [S, S, S, S, S, S, S, S],
      [S, S, S, S, S, S, S, S],
      [S, S, S, S, S, S, S, S],
      [S, S, S, S, S, S, S, S],
    ]);
    const matches = findMatches(board);
    // R at col 0 is isolated; R at cols 2,3,4 form a run of 3
    const rubyMatches = matches.filter((m) => m.type === R);
    expect(rubyMatches.some((m) => m.length >= 3)).toBe(true);
    // No match should span the null
    rubyMatches.forEach((m) => {
      m.cells.forEach(({ col }) => expect(col).not.toBe(1));
    });
  });
});

describe('removeMatches', () => {
  it('sets matched cells to null', () => {
    const board = makeBoard([
      [R, R, R, S, S, S, S, S],
      [S, S, S, S, S, S, S, S],
      [S, S, S, S, S, S, S, S],
      [S, S, S, S, S, S, S, S],
      [S, S, S, S, S, S, S, S],
      [S, S, S, S, S, S, S, S],
      [S, S, S, S, S, S, S, S],
      [S, S, S, S, S, S, S, S],
    ]);
    const matches = findMatches(board);
    const after = removeMatches(board, matches);
    // The ruby cells should be null
    const rubyMatch = matches.find((m) => m.type === R);
    expect(rubyMatch).toBeDefined();
    for (const { row, col } of rubyMatch!.cells) {
      expect(after[row][col]).toBeNull();
    }
    // Original board unchanged
    expect(board[0][0]).toBe(R);
  });
});

describe('matchedCells', () => {
  it('returns a set of "row,col" strings', () => {
    const matches = [
      {
        cells: [
          { row: 0, col: 0 },
          { row: 0, col: 1 },
          { row: 0, col: 2 },
        ],
        type: R,
        direction: 'horizontal' as const,
        length: 3,
      },
    ];
    const set = matchedCells(matches);
    expect(set.has('0,0')).toBe(true);
    expect(set.has('0,1')).toBe(true);
    expect(set.has('0,2')).toBe(true);
    expect(set.size).toBe(3);
  });
});
