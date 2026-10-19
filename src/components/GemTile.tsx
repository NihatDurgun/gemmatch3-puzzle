/**
 * GemBlast – GemTile Component
 * Renders a single gem piece on the board.
 */

import React from 'react';
import {
  TouchableOpacity,
  View,
  Text,
  StyleSheet,
  Platform,
  ViewStyle,
} from 'react-native';
import { PieceType } from '../engine/board';

export interface GemTileProps {
  type: PieceType | null;
  row: number;
  col: number;
  selected: boolean;
  tileSize: number;
  onPress: (row: number, col: number) => void;
}

const GEM_COLORS: Record<PieceType, string> = {
  [PieceType.Ruby]: '#E53935',
  [PieceType.Sapphire]: '#1E88E5',
  [PieceType.Emerald]: '#43A047',
  [PieceType.Topaz]: '#FDD835',
  [PieceType.Amethyst]: '#8E24AA',
};

const GEM_EMOJI: Record<PieceType, string> = {
  [PieceType.Ruby]: '💎',
  [PieceType.Sapphire]: '🔷',
  [PieceType.Emerald]: '💚',
  [PieceType.Topaz]: '⭐',
  [PieceType.Amethyst]: '🔮',
};

export const GemTile: React.FC<GemTileProps> = ({
  type,
  row,
  col,
  selected,
  tileSize,
  onPress,
}) => {
  const handlePress = () => onPress(row, col);

  const containerStyle: ViewStyle = {
    width: tileSize,
    height: tileSize,
    padding: 2,
  };

  if (type === null) {
    return <View style={containerStyle} />;
  }

  const bgColor = GEM_COLORS[type];
  const emoji = GEM_EMOJI[type];
  const fontSize = Math.round(tileSize * 0.45);

  return (
    <TouchableOpacity
      style={containerStyle}
      onPress={handlePress}
      activeOpacity={0.75}
      accessibilityLabel={`${type} gem at row ${row + 1}, column ${col + 1}`}
      accessibilityRole="button"
    >
      <View
        style={[
          styles.gem,
          { backgroundColor: bgColor, borderRadius: tileSize * 0.2 },
          selected && styles.selected,
        ]}
      >
        <Text style={[styles.emoji, { fontSize }]}>{emoji}</Text>
      </View>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  gem: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 3,
    elevation: 4,
    ...(Platform.OS === 'web'
      ? { cursor: 'pointer' as any, userSelect: 'none' as any }
      : {}),
  },
  selected: {
    borderWidth: 3,
    borderColor: '#FFFFFF',
    shadowColor: '#FFFFFF',
    shadowOpacity: 0.8,
    shadowRadius: 6,
    elevation: 8,
    transform: [{ scale: 1.08 }],
  },
  emoji: {
    textAlign: 'center',
  },
});
