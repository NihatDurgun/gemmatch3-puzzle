/**
 * GemBlast – Level & Target Objective Engine
 * Handles level objectives, target scores, move limits, and win/loss game state evaluation.
 */

export interface LevelConfig {
  levelNumber: number;
  moveLimit: number;
  targetScore: number;
}

export type LevelStatus = 'in_progress' | 'won' | 'lost';

export interface LevelState {
  levelNumber: number;
  movesRemaining: number;
  targetScore: number;
  currentScore: number;
  status: LevelStatus;
}

/**
 * Initializes a new LevelState given a LevelConfig.
 */
export function initLevel(config: LevelConfig): LevelState {
  return {
    levelNumber: config.levelNumber,
    movesRemaining: config.moveLimit,
    targetScore: config.targetScore,
    currentScore: 0,
    status: 'in_progress',
  };
}

/**
 * Evaluates current level status given score and moves remaining.
 * Win condition: score >= targetScore (can be won even if moves remain).
 * Loss condition: movesRemaining <= 0 AND score < targetScore.
 * In-progress: movesRemaining > 0 AND score < targetScore.
 */
export function evaluateLevelStatus(
  currentScore: number,
  targetScore: number,
  movesRemaining: number
): LevelStatus {
  if (currentScore >= targetScore) {
    return 'won';
  }
  if (movesRemaining <= 0) {
    return 'lost';
  }
  return 'in_progress';
}

/**
 * Pure state reducer when a player consumes a move and earns points.
 */
export function applyMoveResult(
  state: LevelState,
  earnedScore: number
): LevelState {
  if (state.status !== 'in_progress') {
    return state;
  }

  const nextMoves = Math.max(0, state.movesRemaining - 1);
  const nextScore = state.currentScore + Math.max(0, earnedScore);
  const nextStatus = evaluateLevelStatus(nextScore, state.targetScore, nextMoves);

  return {
    ...state,
    movesRemaining: nextMoves,
    currentScore: nextScore,
    status: nextStatus,
  };
}

/**
 * Returns preset level configuration by level number (1-indexed).
 */
export function getPresetLevel(levelNumber: number): LevelConfig {
  const safeLevel = Math.max(1, Math.floor(levelNumber));
  // Baseline: Level 1 has 20 moves, target 1000 score. Each level adds difficulty.
  const moveLimit = Math.max(12, 22 - Math.min(10, safeLevel));
  const targetScore = safeLevel * 1000 + (safeLevel - 1) * 250;

  return {
    levelNumber: safeLevel,
    moveLimit,
    targetScore,
  };
}
