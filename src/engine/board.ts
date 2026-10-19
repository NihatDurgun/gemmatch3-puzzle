/**
 * GemBlast – Board Engine
 * Pure TypeScript, no side effects. All functions return new objects.
 */

export const BOARD_SIZE = 8;

export enum PieceType {
  Ruby = 'Ruby',
  Sapphire = 'Sapphire',
  Emerald = 'Emerald',
  Topaz = 'Topaz',
  Amethyst = 'Amethyst',
}

export const ALL_PIECE_TYPES: PieceType[] = [
  PieceType.Ruby,
  PieceType.Sapphire,
  PieceType.Emerald,
  PieceType.Topaz,
  PieceType.Amethyst,
];

export type Cell = PieceType | null;

/** 8×8 grid – row-major: board[row][col] */
export type Board = Cell[][];

/** Create an empty 8×8 board */
export function emptyBoard(): Board {
  return Array.from({ length: BOARD_SIZE }, () =>
    Array(BOARD_SIZE).fill(null)
  );
}

/** Deep-clone a board */
export function cloneBoard(board: Board): Board {
  return board.map((row) => [...row]);
}

/**
 * Create a new board with no pre-existing 3+ matches.
 * Uses rejection-sampling per cell: pick a random type that doesn't
 * create a horizontal or vertical run of 3 with already-placed cells.
 */
export function createBoard(): Board {
  const board: Board = emptyBoard();

  for (let row = 0; row < BOARD_SIZE; row++) {
    for (let col = 0; col < BOARD_SIZE; col++) {
      const forbidden = new Set<PieceType>();

      // Check horizontal: if col >= 2 and previous two are same type, forbid it
      if (
        col >= 2 &&
        board[row][col - 1] !== null &&
        board[row][col - 1] === board[row][col - 2]
      ) {
        forbidden.add(board[row][col - 1] as PieceType);
      }

      // Check vertical: if row >= 2 and previous two are same type, forbid it
      if (
        row >= 2 &&
        board[row - 1][col] !== null &&
        board[row - 1][col] === board[row - 2][col]
      ) {
        forbidden.add(board[row - 1][col] as PieceType);
      }

      const available = ALL_PIECE_TYPES.filter((t) => !forbidden.has(t));
      // available should always have at least 3 types (5 total, max 2 forbidden)
      board[row][col] = available[Math.floor(Math.random() * available.length)];
    }
  }

  return board;
}

/** Check if two positions are orthogonally adjacent */
export function areAdjacent(
  r1: number,
  c1: number,
  r2: number,
  c2: number
): boolean {
  return (
    (Math.abs(r1 - r2) === 1 && c1 === c2) ||
    (Math.abs(c1 - c2) === 1 && r1 === r2)
  );
}

/** Check if a position is within the board */
export function inBounds(row: number, col: number): boolean {
  return row >= 0 && row < BOARD_SIZE && col >= 0 && col < BOARD_SIZE;
}
