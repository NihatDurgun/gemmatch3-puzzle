import { GAME_TITLE, BOARD_SIZE, GEM_TYPES } from '../src/engine/types';

describe('Project harness & engine constants', () => {
  it('has valid game title and board configuration', () => {
    expect(GAME_TITLE).toBe('GemBlast');
    expect(BOARD_SIZE).toBe(8);
    expect(GEM_TYPES.length).toBeGreaterThanOrEqual(5);
  });
});
