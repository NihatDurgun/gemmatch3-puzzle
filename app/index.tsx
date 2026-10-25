import { StatusBar } from 'expo-status-bar';
import { SafeAreaView, StyleSheet, Text, View } from 'react-native';
import { GameGrid } from '../src/components/GameGrid';
import { ScoreBoard } from '../src/components/ScoreBoard';
import { GameOverModal } from '../src/components/GameOverModal';
import { useGameState } from '../src/engine/useGameState';

export default function App() {
  const { board, score, moves, isGameOver, restartGame, handlePressGem } = useGameState();

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar style="light" />
      <View style={styles.header}>
        <Text style={styles.title}>GemBlast</Text>
        <Text style={styles.subtitle}>Match 3 gems</Text>
      </View>
      <View style={styles.gameContainer}>
        <ScoreBoard score={score} moves={moves} />
        <GameGrid board={board} onPressGem={handlePressGem} />
        <GameOverModal visible={isGameOver} score={score} onRestart={restartGame} />
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#0f172a', // Slate 900 from design system
    alignItems: 'center',
    justifyContent: 'center',
  },
  header: {
    marginBottom: 20,
    alignItems: 'center',
  },
  title: {
    fontSize: 48,
    fontWeight: 'bold',
    color: '#f8fafc', // Slate 50 from design system
  },
  subtitle: {
    fontSize: 20,
    color: '#94a3b8', // Slate 400 from design system
  },
  gameContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
});
