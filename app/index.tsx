/**
 * GemBlast – Main Game Screen (Expo Router index)
 * Wires together: GameGrid, ScoreBoard, GameOverModal, useGameState
 */

import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  SafeAreaView,
  TouchableOpacity,
  ScrollView,
  useWindowDimensions,
} from 'react-native';
import { useGameState } from '../src/hooks/useGameState';
import { GameGrid } from '../src/components/GameGrid';
import { ScoreBoard } from '../src/components/ScoreBoard';
import { GameOverModal } from '../src/components/GameOverModal';
import { getMuted, getMutedSync, toggleMuted } from '../src/storage/soundStorage';

export default function GameScreen() {
  const { state, selectCell, restart } = useGameState();
  const { width } = useWindowDimensions();
  const [muted, setMutedState] = useState<boolean>(() => getMutedSync());

  useEffect(() => {
    let mounted = true;
    getMuted().then((isMuted) => {
      if (mounted) {
        setMutedState(isMuted);
      }
    });
    return () => {
      mounted = false;
    };
  }, []);

  const handleToggleMute = async () => {
    const next = await toggleMuted();
    setMutedState(next);
  };

  const isWide = width >= 768;

  return (
    <SafeAreaView style={styles.safeArea}>
      <ScrollView
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {/* Header */}
        <View style={styles.header}>
          <Text style={styles.logo}>💎 GemBlast</Text>
          <TouchableOpacity
            style={styles.restartBtn}
            onPress={restart}
            accessibilityLabel="Restart game"
            accessibilityRole="button"
          >
            <Text style={styles.restartText}>New Game</Text>
          </TouchableOpacity>
        </View>

        {/* Score Board */}
        <View style={[styles.scoreRow, isWide && styles.scoreRowWide]}>
          <ScoreBoard
            score={state.score}
            bestScore={state.bestScore}
            movesLeft={state.movesLeft}
            lastScore={state.lastScore}
          />
          <TouchableOpacity
            style={styles.muteBtn}
            onPress={handleToggleMute}
            accessibilityLabel={muted ? 'Unmute sound' : 'Mute sound'}
            accessibilityRole="button"
            accessibilityState={{ selected: muted }}
          >
            <Text style={styles.muteIcon}>{muted ? '🔇' : '🔊'}</Text>
          </TouchableOpacity>
        </View>

        {/* Game Grid */}
        <View style={styles.gridContainer}>
          <GameGrid
            board={state.board}
            selectedCell={state.selectedCell}
            onCellPress={selectCell}
            disabled={state.phase !== 'playing'}
          />
        </View>

        {/* Hint text */}
        <Text style={styles.hint}>
          {state.phase === 'playing'
            ? 'Tap a gem, then tap an adjacent gem to swap'
            : state.phase === 'gameover'
            ? 'Game Over! Tap "New Game" to play again'
            : ''}
        </Text>
      </ScrollView>

      {/* Game Over Modal */}
      <GameOverModal
        visible={state.phase === 'gameover'}
        score={state.score}
        onRestart={restart}
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#0F0F1E',
  },
  scrollContent: {
    flexGrow: 1,
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 20,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    width: '100%',
    maxWidth: 560,
    marginBottom: 20,
  },
  logo: {
    fontSize: 28,
    fontWeight: '900',
    color: '#FFD700',
    letterSpacing: 1,
    textShadowColor: '#8E24AA',
    textShadowOffset: { width: 0, height: 2 },
    textShadowRadius: 8,
  },
  restartBtn: {
    backgroundColor: '#1A1A4E',
    borderRadius: 12,
    paddingVertical: 8,
    paddingHorizontal: 16,
    borderWidth: 1,
    borderColor: '#4A4A8A',
  },
  restartText: {
    color: '#9090C0',
    fontSize: 14,
    fontWeight: '700',
    letterSpacing: 0.5,
  },
  scoreRow: {
    width: '100%',
    maxWidth: 560,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 12,
    gap: 8,
  },
  scoreRowWide: {
    maxWidth: 560,
  },
  muteBtn: {
    backgroundColor: '#1A1A4E',
    borderRadius: 12,
    paddingVertical: 8,
    paddingHorizontal: 12,
    borderWidth: 1,
    borderColor: '#4A4A8A',
    alignItems: 'center',
    justifyContent: 'center',
  },
  muteIcon: {
    fontSize: 18,
  },
  gridContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    marginVertical: 8,
  },
  hint: {
    marginTop: 16,
    color: '#6060A0',
    fontSize: 13,
    textAlign: 'center',
    paddingHorizontal: 24,
    letterSpacing: 0.3,
  },
});
