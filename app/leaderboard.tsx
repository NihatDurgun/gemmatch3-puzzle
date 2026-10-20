/**
 * GemBlast – Leaderboard Screen (Expo Router /leaderboard)
 * Responsive ranked list of top 10 local scores, empty state, and clear scores action with confirmation.
 */

import React, { useState, useEffect, useCallback } from 'react';
import {
  View,
  Text,
  StyleSheet,
  SafeAreaView,
  TouchableOpacity,
  ScrollView,
  Alert,
  Platform,
  useWindowDimensions,
} from 'react-native';
import { useRouter } from 'expo-router';
import {
  LeaderboardEntry,
  getLeaderboard,
  clearLeaderboard,
} from '../src/storage/leaderboardStorage';

export default function LeaderboardScreen() {
  const router = useRouter();
  const { width } = useWindowDimensions();
  const [entries, setEntries] = useState<LeaderboardEntry[]>([]);
  const [loading, setLoading] = useState(true);
  const [showClearConfirm, setShowClearConfirm] = useState(false);

  const isWide = width >= 640;

  const loadScores = useCallback(async () => {
    setLoading(true);
    try {
      const data = await getLeaderboard();
      setEntries(data);
    } catch {
      setEntries([]);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadScores();
  }, [loadScores]);

  const handleClearScores = useCallback(async () => {
    await clearLeaderboard();
    setEntries([]);
    setShowClearConfirm(false);
  }, []);

  const requestClear = () => {
    if (Platform.OS === 'web') {
      setShowClearConfirm(true);
    } else {
      Alert.alert(
        'Clear Leaderboard',
        'Are you sure you want to clear all top scores? This cannot be undone.',
        [
          { text: 'Cancel', style: 'cancel' },
          {
            text: 'Clear',
            style: 'destructive',
            onPress: handleClearScores,
          },
        ]
      );
    }
  };

  const formatDate = (isoString: string): string => {
    try {
      const d = new Date(isoString);
      if (isNaN(d.getTime())) return isoString;
      return d.toLocaleDateString(undefined, {
        month: 'short',
        day: 'numeric',
        year: 'numeric',
      });
    } catch {
      return isoString;
    }
  };

  const getRankBadge = (rank: number) => {
    switch (rank) {
      case 1:
        return '🥇';
      case 2:
        return '🥈';
      case 3:
        return '🥉';
      default:
        return `#${rank}`;
    }
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={[styles.container, isWide && styles.containerWide]}>
        {/* Header Bar */}
        <View style={styles.header}>
          <TouchableOpacity
            style={styles.backButton}
            onPress={() => router.back()}
            accessibilityLabel="Back to game"
            accessibilityRole="button"
          >
            <Text style={styles.backButtonText}>← Back</Text>
          </TouchableOpacity>

          <Text style={styles.title}>🏆 Leaderboard</Text>

          {entries.length > 0 ? (
            <TouchableOpacity
              style={styles.clearHeaderBtn}
              onPress={requestClear}
              accessibilityLabel="Clear leaderboard scores"
              accessibilityRole="button"
            >
              <Text style={styles.clearHeaderBtnText}>Clear</Text>
            </TouchableOpacity>
          ) : (
            <View style={styles.headerSpacer} />
          )}
        </View>

        {/* Confirmation Banner for Web / In-app */}
        {showClearConfirm && (
          <View style={styles.confirmBanner}>
            <Text style={styles.confirmBannerText}>
              Are you sure you want to clear all top scores?
            </Text>
            <View style={styles.confirmActions}>
              <TouchableOpacity
                style={[styles.confirmBtn, styles.cancelBtn]}
                onPress={() => setShowClearConfirm(false)}
                accessibilityRole="button"
              >
                <Text style={styles.cancelBtnText}>Cancel</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={[styles.confirmBtn, styles.deleteBtn]}
                onPress={handleClearScores}
                accessibilityRole="button"
              >
                <Text style={styles.deleteBtnText}>Clear All</Text>
              </TouchableOpacity>
            </View>
          </View>
        )}

        {/* Main Content List / Empty State */}
        <ScrollView
          contentContainerStyle={styles.scrollContent}
          showsVerticalScrollIndicator={false}
        >
          {loading ? (
            <View style={styles.centerContainer}>
              <Text style={styles.loadingText}>Loading scores...</Text>
            </View>
          ) : entries.length === 0 ? (
            <View style={styles.emptyContainer}>
              <Text style={styles.emptyIcon}>🎮</Text>
              <Text style={styles.emptyTitle}>No Scores Yet</Text>
              <Text style={styles.emptySubtitle}>
                Play a game of GemBlast to set your first high score on the leaderboard!
              </Text>
              <TouchableOpacity
                style={styles.playNowBtn}
                onPress={() => router.back()}
                accessibilityLabel="Play GemBlast now"
                accessibilityRole="button"
              >
                <Text style={styles.playNowBtnText}>Play Game</Text>
              </TouchableOpacity>
            </View>
          ) : (
            <View style={styles.listCard}>
              <View style={styles.tableHeader}>
                <Text style={[styles.tableCol, styles.colRank]}>Rank</Text>
                <Text style={[styles.tableCol, styles.colScore]}>Score</Text>
                <Text style={[styles.tableCol, styles.colDate]}>Date</Text>
              </View>

              {entries.map((item, index) => {
                const rank = index + 1;
                const isTop3 = rank <= 3;
                return (
                  <View
                    key={item.id || index}
                    style={[
                      styles.tableRow,
                      index % 2 === 1 && styles.tableRowAlt,
                      rank === 1 && styles.topRow,
                    ]}
                  >
                    <View style={styles.colRank}>
                      <Text
                        style={[
                          styles.rankText,
                          isTop3 && styles.topRankText,
                        ]}
                      >
                        {getRankBadge(rank)}
                      </Text>
                    </View>
                    <View style={styles.colScore}>
                      <Text
                        style={[
                          styles.scoreText,
                          isTop3 && styles.topScoreText,
                        ]}
                      >
                        {item.score.toLocaleString()}
                      </Text>
                    </View>
                    <View style={styles.colDate}>
                      <Text style={styles.dateText}>{formatDate(item.date)}</Text>
                    </View>
                  </View>
                );
              })}
            </View>
          )}
        </ScrollView>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#0F0F1E',
  },
  container: {
    flex: 1,
    width: '100%',
    alignSelf: 'center',
    paddingHorizontal: 16,
    paddingTop: 16,
  },
  containerWide: {
    maxWidth: 560,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingBottom: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#25254A',
  },
  backButton: {
    paddingVertical: 8,
    paddingHorizontal: 12,
    borderRadius: 8,
    backgroundColor: '#1E1E3F',
  },
  backButtonText: {
    color: '#D0BCFF',
    fontSize: 14,
    fontWeight: '600',
  },
  title: {
    fontSize: 22,
    fontWeight: '800',
    color: '#FFD700',
    letterSpacing: 0.5,
  },
  clearHeaderBtn: {
    paddingVertical: 8,
    paddingHorizontal: 12,
    borderRadius: 8,
    backgroundColor: 'rgba(239, 68, 68, 0.15)',
    borderWidth: 1,
    borderColor: 'rgba(239, 68, 68, 0.3)',
  },
  clearHeaderBtnText: {
    color: '#F87171',
    fontSize: 13,
    fontWeight: '600',
  },
  headerSpacer: {
    width: 60,
  },
  confirmBanner: {
    backgroundColor: '#1F1A30',
    borderColor: '#7F1D1D',
    borderWidth: 1,
    borderRadius: 12,
    padding: 14,
    marginTop: 12,
  },
  confirmBannerText: {
    color: '#FCA5A5',
    fontSize: 14,
    fontWeight: '600',
    textAlign: 'center',
    marginBottom: 10,
  },
  confirmActions: {
    flexDirection: 'row',
    justifyContent: 'center',
    gap: 12,
  },
  confirmBtn: {
    paddingVertical: 6,
    paddingHorizontal: 16,
    borderRadius: 6,
  },
  cancelBtn: {
    backgroundColor: '#374151',
  },
  cancelBtnText: {
    color: '#E5E7EB',
    fontSize: 13,
    fontWeight: '600',
  },
  deleteBtn: {
    backgroundColor: '#DC2626',
  },
  deleteBtnText: {
    color: '#FFFFFF',
    fontSize: 13,
    fontWeight: '600',
  },
  scrollContent: {
    flexGrow: 1,
    paddingVertical: 20,
  },
  centerContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingTop: 60,
  },
  loadingText: {
    color: '#9090C0',
    fontSize: 15,
  },
  emptyContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 60,
    paddingHorizontal: 24,
  },
  emptyIcon: {
    fontSize: 54,
    marginBottom: 16,
  },
  emptyTitle: {
    fontSize: 20,
    fontWeight: '700',
    color: '#FFFFFF',
    marginBottom: 8,
  },
  emptySubtitle: {
    fontSize: 14,
    color: '#9090C0',
    textAlign: 'center',
    lineHeight: 20,
    marginBottom: 24,
    maxWidth: 320,
  },
  playNowBtn: {
    backgroundColor: '#8B5CF6',
    paddingVertical: 12,
    paddingHorizontal: 28,
    borderRadius: 12,
    shadowColor: '#8B5CF6',
    shadowOpacity: 0.3,
    shadowOffset: { width: 0, height: 4 },
    shadowRadius: 8,
  },
  playNowBtnText: {
    color: '#FFFFFF',
    fontSize: 15,
    fontWeight: '700',
  },
  listCard: {
    backgroundColor: '#16162D',
    borderRadius: 16,
    borderWidth: 1,
    borderColor: '#2D2D5A',
    overflow: 'hidden',
  },
  tableHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 12,
    paddingHorizontal: 16,
    backgroundColor: '#1E1E3F',
    borderBottomWidth: 1,
    borderBottomColor: '#2D2D5A',
  },
  tableCol: {
    color: '#9090C0',
    fontSize: 12,
    fontWeight: '700',
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  tableRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 14,
    paddingHorizontal: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#212143',
  },
  tableRowAlt: {
    backgroundColor: '#131326',
  },
  topRow: {
    backgroundColor: 'rgba(255, 215, 0, 0.05)',
  },
  colRank: {
    width: 60,
    alignItems: 'flex-start',
  },
  colScore: {
    flex: 1,
    alignItems: 'flex-start',
  },
  colDate: {
    width: 100,
    alignItems: 'flex-end',
  },
  rankText: {
    color: '#A0A0D0',
    fontSize: 15,
    fontWeight: '700',
  },
  topRankText: {
    fontSize: 18,
  },
  scoreText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '700',
  },
  topScoreText: {
    color: '#FFD700',
    fontWeight: '800',
  },
  dateText: {
    color: '#7070A0',
    fontSize: 12,
    textAlign: 'right',
  },
});
