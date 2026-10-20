/**
 * GemBlast – useGameState Hook
 * Manages the full game state: board, score, moves, selection, and game-over.
 */

import { useState, useCallback, useEffect } from 'react';
import { Board, createBoard } from '../engine/board';
import { validateSwap } from '../engine/swap';
import { resolveCascade } from '../engine/cascade';
import { getBestScore, getBestScoreSync, saveBestScore } from '../storage/scoreStorage';

export type GamePhase = 'playing' | 'animating' | 'gameover';

export interface GameState {
  board: Board;
  score: number;
  bestScore: number;
  movesLeft: number;
  phase: GamePhase;
  selectedCell: { row: number; col: number } | null;
  lastScore: number;
}

const INITIAL_MOVES = 30;

export function useGameState() {
  const [state, setState] = useState<GameState>(() => ({
    board: createBoard(),
    score: 0,
    bestScore: getBestScoreSync(),
    movesLeft: INITIAL_MOVES,
    phase: 'playing',
    selectedCell: null,
    lastScore: 0,
  }));

  // Ensure async storage adapter (e.g. AsyncStorage or async backend) is loaded on mount
  useEffect(() => {
    let mounted = true;
    getBestScore().then((loadedBest) => {
      if (mounted && loadedBest > 0) {
        setState((prev) => ({
          ...prev,
          bestScore: Math.max(prev.bestScore, loadedBest),
        }));
      }
    });
    return () => {
      mounted = false;
    };
  }, []);

  /** Select or swap a cell */
  const selectCell = useCallback(
    (row: number, col: number) => {
      setState((prev) => {
        if (prev.phase !== 'playing') return prev;

        // No cell selected yet — select this one
        if (prev.selectedCell === null) {
          return { ...prev, selectedCell: { row, col } };
        }

        const { row: r1, col: c1 } = prev.selectedCell;

        // Tapped the same cell — deselect
        if (r1 === row && c1 === col) {
          return { ...prev, selectedCell: null };
        }

        // Attempt swap
        const result = validateSwap(prev.board, r1, c1, row, col);

        if (!result.valid) {
          // If not adjacent, select the new cell instead
          const dr = Math.abs(r1 - row);
          const dc = Math.abs(c1 - col);
          if (dr + dc > 1) {
            return { ...prev, selectedCell: { row, col } };
          }
          // Adjacent but no match — deselect, no move consumed
          return { ...prev, selectedCell: null };
        }

        // Valid swap — resolve cascade
        const { board: finalBoard, totalScore } = resolveCascade(result.board);
        const newMoves = prev.movesLeft - 1;
        const newScore = prev.score + totalScore;
        const phase: GamePhase = newMoves <= 0 ? 'gameover' : 'playing';
        const bestScore = Math.max(prev.bestScore, newScore);

        if (phase === 'gameover' && newScore > prev.bestScore) {
          saveBestScore(newScore);
        }

        return {
          board: finalBoard,
          score: newScore,
          bestScore,
          movesLeft: newMoves,
          phase,
          selectedCell: null,
          lastScore: totalScore,
        };
      });
    },
    []
  );

  /** Restart the game */
  const restart = useCallback(() => {
    setState((prev) => ({
      board: createBoard(),
      score: 0,
      bestScore: prev.bestScore,
      movesLeft: INITIAL_MOVES,
      phase: 'playing',
      selectedCell: null,
      lastScore: 0,
    }));
  }, []);

  return { state, selectCell, restart };
}
