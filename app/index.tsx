/**
 * GemBlast – Main Game Screen (Expo Router index)
 * Wires together: GameGrid, ScoreBoard, GameOverModal, useGameState
 */

import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  SafeAreaView,
  TouchableOpacity,
  ScrollView,
  useWindowDimensions,
} from 'react-native';
import { useRouter } from 'expo-router';
import { useGameState } from '../src/hooks/useGameState';
import { GameGrid } from '../src/components/GameGrid';
import { ScoreBoard } from '../src/components/ScoreBoard';
import { GameOverModal } from '../src/components/GameOverModal';

export default function GameScreen() {
  const router = useRouter();
  const { state, selectCell, restart } = useGameState();
  const { width } = useWindowDimensions();

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
          <View style={styles.headerActions}>
            <TouchableOpacity
              style={styles.leaderboardBtn}
              onPress={() => router.push('/leaderboard')}
              accessibilityLabel="View leaderboard"
              accessibilityRole="button"
            >
              <Text style={styles.leaderboardText}>🏆 Scores</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={styles.restartBtn}
              onPress={restart}
              accessibilityLabel="Restart game"
              accessibilityRole="button"
            >
              <Text style={styles.restartText}>New Game</Text>
            </TouchableOpacity>
          </View>
        </View>

        {/* Score Board */}
        <View style={[styles.scoreRow, isWide && styles.scoreRowWide]}>
          <ScoreBoard
            score={state.score}
            bestScore={state.bestScore}
            movesLeft={state.movesLeft}
            lastScore={state.lastScore}
          />
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
        onViewLeaderboard={() => router.push('/leaderboard')}
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
  headerActions: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  leaderboardBtn: {
    backgroundColor: '#1E1E3F',
    borderRadius: 12,
    paddingVertical: 8,
    paddingHorizontal: 14,
    borderWidth: 1,
    borderColor: '#3D3D7A',
  },
  leaderboardText: {
    color: '#FFD700',
    fontSize: 14,
    fontWeight: '700',
    letterSpacing: 0.5,
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
    alignItems: 'center',
    marginBottom: 12,
  },
  scoreRowWide: {
    maxWidth: 560,
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
