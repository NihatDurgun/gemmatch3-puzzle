export const GAME_TITLE = 'GemBlast';
export const BOARD_SIZE = 8;
export const GEM_TYPES = ['ruby', 'sapphire', 'emerald', 'topaz', 'amethyst'] as const;
export type GemType = typeof GEM_TYPES[number];

export interface Position {
  row: number;
  col: number;
}
