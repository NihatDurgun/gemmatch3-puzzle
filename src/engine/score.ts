/**
 * GemBlast – Score Engine
 * Score formula: 30 × match_length × 1.5^cascadeLevel
 * cascadeLevel = 0 for the first match in a turn, increments each cascade step.
 */

import { Match } from './match';

/**
 * Calculate the score for a single match at a given cascade level.
 */
export function calculateMatchScore(match: Match, cascadeLevel: number): number {
  return Math.round(30 * match.length * Math.pow(1.5, cascadeLevel));
}

/**
 * Calculate total score for all matches at a given cascade level.
 */
export function calculateTurnScore(matches: Match[], cascadeLevel: number): number {
  return matches.reduce(
    (total, match) => total + calculateMatchScore(match, cascadeLevel),
    0
  );
}
