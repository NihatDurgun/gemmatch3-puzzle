/**
 * GemBlast – Game Mode Evaluator
 * Pure engine functions to evaluate game status based on move limits and target scores.
 */

export type GameStatus = 'playing' | 'won' | 'lost';

export interface GameModeConfig {
  targetScore: number;
  moveLimit: number;
}

export interface GameModeState {
  currentScore: number;
  movesRemaining: number;
  targetScore: number;
}

/**
 * Check if the player has reached or exceeded the target score.
 */
export function isTargetReached(currentScore: number, targetScore: number): boolean {
  return currentScore >= targetScore;
}

/**
 * Check if available moves have been exhausted (0 or fewer).
 */
export function isMovesDepleted(movesRemaining: number): boolean {
  return movesRemaining <= 0;
}

/**
 * Evaluates the current game status.
 * - 'won' if currentScore >= targetScore (reached target score wins even if movesRemaining === 0)
 * - 'lost' if movesRemaining <= 0 and currentScore < targetScore
 * - 'playing' if currentScore < targetScore and movesRemaining > 0
 */
export function evaluateGameStatus(
  currentScore: number,
  targetScore: number,
  movesRemaining: number
): GameStatus {
  if (isTargetReached(currentScore, targetScore)) {
    return 'won';
  }
  if (isMovesDepleted(movesRemaining)) {
    return 'lost';
  }
  return 'playing';
}
