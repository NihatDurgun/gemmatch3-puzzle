import {
  initLevel,
  evaluateLevelStatus,
  applyMoveResult,
  getPresetLevel,
  LevelConfig,
} from '../level';

describe('Level Engine', () => {
  const sampleConfig: LevelConfig = {
    levelNumber: 1,
    moveLimit: 15,
    targetScore: 500,
  };

  test('initLevel initializes level state properly', () => {
    const state = initLevel(sampleConfig);
    expect(state.levelNumber).toBe(1);
    expect(state.movesRemaining).toBe(15);
    expect(state.targetScore).toBe(500);
    expect(state.currentScore).toBe(0);
    expect(state.status).toBe('in_progress');
  });

  test('evaluateLevelStatus accurately detects win, loss, and in_progress states', () => {
    // In progress
    expect(evaluateLevelStatus(200, 500, 10)).toBe('in_progress');

    // Won when score reaches or exceeds target
    expect(evaluateLevelStatus(500, 500, 5)).toBe('won');
    expect(evaluateLevelStatus(650, 500, 0)).toBe('won');

    // Lost when out of moves and score below target
    expect(evaluateLevelStatus(450, 500, 0)).toBe('lost');
  });

  test('applyMoveResult decrements moves and increments score correctly', () => {
    const state = initLevel(sampleConfig);
    const nextState = applyMoveResult(state, 120);

    expect(nextState.movesRemaining).toBe(14);
    expect(nextState.currentScore).toBe(120);
    expect(nextState.status).toBe('in_progress');
  });

  test('applyMoveResult transitions status to won when target reached', () => {
    const state = initLevel(sampleConfig);
    const wonState = applyMoveResult(state, 550);

    expect(wonState.currentScore).toBe(550);
    expect(wonState.status).toBe('won');
  });

  test('applyMoveResult transitions status to lost when out of moves', () => {
    const state = {
      levelNumber: 1,
      movesRemaining: 1,
      targetScore: 1000,
      currentScore: 100,
      status: 'in_progress' as const,
    };

    const finalState = applyMoveResult(state, 50);
    expect(finalState.movesRemaining).toBe(0);
    expect(finalState.currentScore).toBe(150);
    expect(finalState.status).toBe('lost');
  });

  test('applyMoveResult is no-op if level is not in_progress', () => {
    const state = {
      levelNumber: 1,
      movesRemaining: 0,
      targetScore: 1000,
      currentScore: 150,
      status: 'lost' as const,
    };

    const unchangedState = applyMoveResult(state, 100);
    expect(unchangedState).toEqual(state);
  });

  test('getPresetLevel provides ascending difficulty configs', () => {
    const lvl1 = getPresetLevel(1);
    const lvl2 = getPresetLevel(2);
    const lvl5 = getPresetLevel(5);

    expect(lvl1.levelNumber).toBe(1);
    expect(lvl2.levelNumber).toBe(2);
    expect(lvl2.targetScore).toBeGreaterThan(lvl1.targetScore);
    expect(lvl5.moveLimit).toBeLessThanOrEqual(lvl1.moveLimit);
  });
});
