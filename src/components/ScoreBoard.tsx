/**
 * GemBlast – ScoreBoard Component
 * Displays score, moves left, and last turn score.
 */

import React from 'react';
import { View, Text, StyleSheet } from 'react-native';

export interface ScoreBoardProps {
  score: number;
  bestScore?: number;
  movesLeft: number;
  lastScore: number;
}

export const ScoreBoard: React.FC<ScoreBoardProps> = ({
  score,
  bestScore = 0,
  movesLeft,
  lastScore,
}) => {
  return (
    <View style={styles.container}>
      <View style={styles.stat}>
        <Text style={styles.label}>SCORE</Text>
        <Text style={styles.value}>{score.toLocaleString()}</Text>
      </View>
      <View style={styles.divider} />
      <View style={styles.stat}>
        <Text style={styles.label}>BEST</Text>
        <Text style={[styles.value, styles.bestScore]}>{bestScore.toLocaleString()}</Text>
      </View>
      <View style={styles.divider} />
      <View style={styles.stat}>
        <Text style={styles.label}>MOVES</Text>
        <Text style={[styles.value, movesLeft <= 5 && styles.lowMoves]}>
          {movesLeft}
        </Text>
      </View>
      {lastScore > 0 && (
        <>
          <View style={styles.divider} />
          <View style={styles.stat}>
            <Text style={styles.label}>LAST</Text>
            <Text style={[styles.value, styles.lastScore]}>+{lastScore}</Text>
          </View>
        </>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#16213E',
    borderRadius: 16,
    paddingVertical: 12,
    paddingHorizontal: 24,
    marginBottom: 16,
    borderWidth: 1,
    borderColor: '#4A4A8A',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.4,
    shadowRadius: 4,
    elevation: 6,
  },
  stat: {
    alignItems: 'center',
    minWidth: 80,
  },
  label: {
    color: '#9090C0',
    fontSize: 11,
    fontWeight: '700',
    letterSpacing: 1.5,
    marginBottom: 2,
  },
  value: {
    color: '#FFFFFF',
    fontSize: 26,
    fontWeight: '800',
    letterSpacing: 0.5,
  },
  bestScore: {
    color: '#FFD700',
  },
  lowMoves: {
    color: '#FF5252',
  },
  lastScore: {
    color: '#69F0AE',
    fontSize: 22,
  },
  divider: {
    width: 1,
    height: 40,
    backgroundColor: '#4A4A8A',
    marginHorizontal: 16,
  },
});
