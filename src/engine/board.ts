/**
 * GemBlast – Board Engine
 * Pure TypeScript, no side effects. All functions return new objects.
 */

export enum GemType { Red = 0, Green, Blue, Yellow, Purple, Orange, Pink }

export type Gem = { id: string; type: GemType; isEmpty: boolean; };
export type Board = Gem[][];


  const board: Board = [];
  for (let y = 0; y < BOARD_SIZE; y++) {
    board[y] = [];
    for (let x = 0; x < BOARD_SIZE; x++) {
      board[y][x] = { id: `${x}-${y}`, type: Math.floor(Math.random() * (Object.keys(GemType).length / 2)), isEmpty: false };
    }
  }
  return board;
}


export const BOARD_SIZE = 8;

export function getGemAt(board: Board, x: number, y: number): Gem | null {
  if (x < 0 || x >= BOARD_SIZE || y < 0 || y >= BOARD_SIZE) {
    return null;
  }
  return board[y][x];
}

export function setGemAt(board: Board, x: number, y: number, gem: Gem): Board {
  if (x < 0 || x >= BOARD_SIZE || y < 0 || y >= BOARD_SIZE) {
    return board;
  }
  const newBoard = board.map(row => [...row]);
  newBoard[y][x] = gem;
  return newBoard;
}

export function swapGems(board: Board, x1: number, y1: number, x2: number, y2: number): Board {
  const gem1 = getGemAt(board, x1, y1);
  const gem2 = getGemAt(board, x2, y2);

  if (!gem1 || !gem2) {
    return board;
  }

  let newBoard = setGemAt(board, x1, y1, gem2);
  newBoard = setGemAt(newBoard, x2, y2, gem1);
  return newBoard;
}






/** 8×8 grid – row-major: board[row][col] */
export type Board = (Gem | null)[][];

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
