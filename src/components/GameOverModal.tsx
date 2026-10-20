/**
 * GemBlast – GameOverModal Component
 * Displays final score and restart button when game ends.
 */

import React from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  Modal,
} from 'react-native';

export interface GameOverModalProps {
  visible: boolean;
  score: number;
  onRestart: () => void;
  onViewLeaderboard?: () => void;
}

export const GameOverModal: React.FC<GameOverModalProps> = ({
  visible,
  score,
  onRestart,
  onViewLeaderboard,
}) => {
  return (
    <Modal
      visible={visible}
      transparent
      animationType="fade"
      statusBarTranslucent
    >
      <View style={styles.overlay}>
        <View style={styles.card}>
          <Text style={styles.title}>💥 Game Over!</Text>
          <Text style={styles.subtitle}>You've used all your moves.</Text>
          <View style={styles.scoreContainer}>
            <Text style={styles.scoreLabel}>FINAL SCORE</Text>
            <Text style={styles.scoreValue}>{score.toLocaleString()}</Text>
          </View>
          <View style={styles.buttonRow}>
            {onViewLeaderboard && (
              <TouchableOpacity
                style={[styles.button, styles.leaderboardButton]}
                onPress={onViewLeaderboard}
                activeOpacity={0.8}
                accessibilityLabel="View leaderboard scores"
                accessibilityRole="button"
              >
                <Text style={styles.leaderboardButtonText}>🏆 Scores</Text>
              </TouchableOpacity>
            )}
            <TouchableOpacity
              style={styles.button}
              onPress={onRestart}
              activeOpacity={0.8}
              accessibilityLabel="Restart game"
              accessibilityRole="button"
            >
              <Text style={styles.buttonText}>🔄 Play Again</Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.75)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  card: {
    backgroundColor: '#16213E',
    borderRadius: 24,
    padding: 36,
    alignItems: 'center',
    borderWidth: 2,
    borderColor: '#4A4A8A',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.6,
    shadowRadius: 16,
    elevation: 16,
    minWidth: 280,
    maxWidth: 360,
  },
  title: {
    fontSize: 32,
    fontWeight: '900',
    color: '#FFFFFF',
    marginBottom: 8,
    textAlign: 'center',
  },
  subtitle: {
    fontSize: 14,
    color: '#9090C0',
    marginBottom: 28,
    textAlign: 'center',
  },
  scoreContainer: {
    alignItems: 'center',
    marginBottom: 32,
    backgroundColor: '#0F3460',
    borderRadius: 16,
    paddingVertical: 16,
    paddingHorizontal: 32,
    borderWidth: 1,
    borderColor: '#4A4A8A',
  },
  scoreLabel: {
    fontSize: 12,
    fontWeight: '700',
    color: '#9090C0',
    letterSpacing: 2,
    marginBottom: 4,
  },
  scoreValue: {
    fontSize: 48,
    fontWeight: '900',
    color: '#FFD700',
    letterSpacing: 1,
  },
  buttonRow: {
    flexDirection: 'column',
    gap: 12,
    width: '100%',
  },
  button: {
    backgroundColor: '#8E24AA',
    borderRadius: 16,
    paddingVertical: 14,
    paddingHorizontal: 32,
    shadowColor: '#8E24AA',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.5,
    shadowRadius: 8,
    elevation: 8,
    alignItems: 'center',
  },
  buttonText: {
    fontSize: 18,
    fontWeight: '800',
    color: '#FFFFFF',
    letterSpacing: 0.5,
  },
  leaderboardButton: {
    backgroundColor: '#1E1E3F',
    borderWidth: 1,
    borderColor: '#FFD700',
    shadowColor: '#FFD700',
    shadowOpacity: 0.2,
  },
  leaderboardButtonText: {
    fontSize: 16,
    fontWeight: '800',
    color: '#FFD700',
    letterSpacing: 0.5,
  },
});
