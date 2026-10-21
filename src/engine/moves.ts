/**
 * GemBlast – Move Counter and Turn-Limit Engine
 * Pure functional utilities for managing moves, turns, limits, and turn-based evaluations.
 */

export interface MoveCounter {
  readonly initialMoves: number;
  readonly remainingMoves: number;
  readonly movesTaken: number;
}

/**
 * Creates an immutable MoveCounter initialized with maxMoves.
 * Normalizes input to non-negative integers.
 */
export function createMoveCounter(maxMoves: number): MoveCounter {
  const safeMax = Math.max(0, Math.floor(maxMoves));
  return {
    initialMoves: safeMax,
    remainingMoves: safeMax,
    movesTaken: 0,
  };
}

/**
 * Decrements moves remaining by an amount (default 1) and increments moves taken.
 * Remaining moves never drop below 0.
 */
export function decrementMoves(counter: MoveCounter, count: number = 1): MoveCounter {
  const decrement = Math.max(0, Math.floor(count));
  const newRemaining = Math.max(0, counter.remainingMoves - decrement);
  const newTaken = counter.movesTaken + (counter.remainingMoves - newRemaining);

  return {
    ...counter,
    remainingMoves: newRemaining,
    movesTaken: newTaken,
  };
}

/**
 * Increments / awards bonus moves.
 */
export function addMoves(counter: MoveCounter, bonus: number): MoveCounter {
  const safeBonus = Math.max(0, Math.floor(bonus));
  return {
    ...counter,
    remainingMoves: counter.remainingMoves + safeBonus,
  };
}

/**
 * Returns true if the player has no moves left.
 */
export function isOutOfMoves(counter: MoveCounter): boolean {
  return counter.remainingMoves <= 0;
}

/**
 * Returns true if the player has at least one move remaining.
 */
export function hasRemainingMoves(counter: MoveCounter): boolean {
  return counter.remainingMoves > 0;
}

/**
 * Returns whether remaining moves are considered low/critical (<= threshold, default 5).
 */
export function isLowOnMoves(counter: MoveCounter, threshold: number = 5): boolean {
  return counter.remainingMoves > 0 && counter.remainingMoves <= threshold;
}

/**
 * Formats remaining moves display string with optional warning indicator.
 */
export function formatMovesDisplay(counter: MoveCounter): string {
  return `${counter.remainingMoves}`;
}
