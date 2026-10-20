/**
 * GemBlast – GameGrid Component
 * Renders the 8×8 board with responsive sizing.
 */

import React from 'react';
import { View, StyleSheet, useWindowDimensions } from 'react-native';
import { Board, BOARD_SIZE } from '../engine/board';
import { GemTile } from './GemTile';

export interface GameGridProps {
  board: Board;
  selectedCell: { row: number; col: number } | null;
  onCellPress: (row: number, col: number) => void;
  disabled?: boolean;
}

function useTileSize(): number {
  const { width, height } = useWindowDimensions();
  // Use the smaller dimension to fit the grid
  const available = Math.min(width, height);
  // Responsive breakpoints
  // mobile < 480: fill 95% of width
  // tablet 480-1024: fill 70%
  // desktop > 1024: fixed 480px max
  let gridSize: number;
  if (available < 480) {
    gridSize = available * 0.95;
  } else if (available < 1024) {
    gridSize = Math.min(available * 0.7, 520);
  } else {
    gridSize = 480;
  }
  return Math.floor(gridSize / BOARD_SIZE);
}

export const GameGrid: React.FC<GameGridProps> = ({
  board,
  selectedCell,
  onCellPress,
  disabled = false,
}) => {
  const tileSize = useTileSize();
  const gridSize = tileSize * BOARD_SIZE;

  const handlePress = (row: number, col: number) => {
    if (!disabled) onCellPress(row, col);
  };

  return (
    <View
      style={[
        styles.grid,
        { width: gridSize, height: gridSize },
      ]}
    >
      {board.map((rowArr, rowIdx) =>
        rowArr.map((cell, colIdx) => {
          const isSelected =
            selectedCell !== null &&
            selectedCell.row === rowIdx &&
            selectedCell.col === colIdx;
          return (
            <GemTile
              key={`${rowIdx}-${colIdx}`}
              type={cell}
              row={rowIdx}
              col={colIdx}
              selected={isSelected}
              tileSize={tileSize}
              onPress={handlePress}
            />
          );
        })
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  grid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    backgroundColor: '#1A1A2E',
    borderRadius: 12,
    padding: 4,
    borderWidth: 2,
    borderColor: '#4A4A8A',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.5,
    shadowRadius: 8,
    elevation: 10,
  },
});
