/**
 * GemBlast – Game Mode Evaluator Tests
 */

import {
  evaluateGameStatus,
  isMovesDepleted,
  isTargetReached,
} from '../gameMode';

describe('Game Mode Evaluator Engine', () => {
  describe('isTargetReached', () => {
    it('returns true when current score equals target score', () => {
      expect(isTargetReached(1000, 1000)).toBe(true);
    });

    it('returns true when current score exceeds target score', () => {
      expect(isTargetReached(1500, 1000)).toBe(true);
    });

    it('returns false when current score is below target score', () => {
      expect(isTargetReached(950, 1000)).toBe(false);
    });
  });

  describe('isMovesDepleted', () => {
    it('returns true when remaining moves are 0', () => {
      expect(isMovesDepleted(0)).toBe(true);
    });

    it('returns true when remaining moves are negative', () => {
      expect(isMovesDepleted(-1)).toBe(true);
    });

    it('returns false when remaining moves are positive', () => {
      expect(isMovesDepleted(1)).toBe(false);
      expect(isMovesDepleted(15)).toBe(false);
    });
  });

  describe('evaluateGameStatus', () => {
    const targetScore = 2000;

    it('returns "playing" when score is below target and moves remain', () => {
      expect(evaluateGameStatus(500, targetScore, 10)).toBe('playing');
      expect(evaluateGameStatus(0, targetScore, 1)).toBe('playing');
    });

    it('returns "won" when current score reaches target with moves remaining', () => {
      expect(evaluateGameStatus(2000, targetScore, 5)).toBe('won');
      expect(evaluateGameStatus(2500, targetScore, 3)).toBe('won');
    });

    it('returns "won" when target is reached on the exact last move (0 moves remaining)', () => {
      expect(evaluateGameStatus(2000, targetScore, 0)).toBe('won');
      expect(evaluateGameStatus(2100, targetScore, 0)).toBe('won');
    });

    it('returns "lost" when moves are exhausted and target score is not reached', () => {
      expect(evaluateGameStatus(1900, targetScore, 0)).toBe('lost');
      expect(evaluateGameStatus(0, targetScore, 0)).toBe('lost');
    });

    it('returns "lost" when moves are negative and target is not reached', () => {
      expect(evaluateGameStatus(1500, targetScore, -1)).toBe('lost');
    });
  });
});
