# GemBlast 💎

> Maintainer note (conflict test): this block was added directly on main.


## Project status

- **8×8 Grid Generation**: Deterministic starting board generation with 5 distinct gem types guaranteed to have zero pre-existing matches (`src/engine/board.ts`).
- **Swap Validation & Rollback**: Orthogonal neighbor swapping with automatic rollback on non-matching moves without move penalty (`src/engine/swap.ts`).
- **Match Detection & Cascades**: Full horizontal and vertical match-3, 4, 5, and multi-line detection with gravity-driven piece drops, refills, and recursive cascade resolution (`src/engine/match.ts`, `src/engine/gravity.ts`, `src/engine/cascade.ts`).
- **Combo Scoring Engine**: Dynamic score multipliers for larger matches and multi-stage cascade chains (`src/engine/score.ts`).
- **Cross-Platform Interactive UI**: Responsive React Native / Expo UI supporting mobile touch and web mouse click-to-select and click-to-swap controls.
- **Game Lifecycle & Progression**: Move countdown limit (30 moves), real-time score display, and Game Over modal with instant restart functionality.

GemBlast is an autonomous, cross-platform match-3 puzzle game built with **TypeScript**, **React Native**, and **Expo** (supporting Web, iOS, and Android). It delivers smooth, responsive touch and mouse interactions, dynamic match cascades, a custom visual identity, and a deterministic pure-TypeScript engine.

---

## 🎮 Game Overview & Features

- **Custom Identity & Theme**: Rich jewel/gemstone theme featuring Ruby, Sapphire, Emerald, Topaz, and Amethyst. No third-party trademarks or proprietary assets.
- **8×8 Grid with 5 Gem Types**: Standard puzzle board with randomized initial configurations guaranteed to have zero pre-existing matches.
- **Valid Move Validation**:
  - Orthogonal adjacent swapping (horizontal and vertical).
  - Web mouse click-to-select and click-to-swap; Mobile tap-to-select and tap-to-swap.
  - Invalid swaps (swaps yielding no 3+ match) automatically roll back and do not decrement moves.
- **Cascading & Gravity Engine**:
  - Horizontal & vertical match-3, match-4, and match-5 detection.
  - T-shape and L-shape multi-line match resolution.
  - Pieces clear, pieces fall straight down due to gravity, and empty top slots refill with new gems.
  - Cascades repeat recursively/iteratively until the board reaches equilibrium.
- **Rules & Progression**:
  - Fixed 30 moves per game.
  - Dynamic score multipliers (higher points for 4-match, 5-match, and chain cascades).
  - Game Over dialog when moves hit zero, with instant restart support.
- **Responsive Layout**:
  - Seamless adaptation across mobile phones, tablets, and desktop browsers.

---

## 🏗️ Architecture & Engine Modules

The core game logic lives under `src/engine/` as pure, side-effect-free TypeScript functions:

| File | Description |
| :--- | :--- |
| `src/engine/board.ts` | 8×8 board generation, cell models, adjacency checking, cloning, empty board creation. Ensures starting board has no pre-existing runs. |
| `src/engine/match.ts` | `findMatches(board)` detects horizontal and vertical 3+, 4+, 5+ runs, returning matched cell coordinates and lengths. |
| `src/engine/swap.ts` | `swapPieces(board, r1, c1, r2, c2)` swaps cells and validates if a swap generates at least one match. Rolls back if invalid. |
| `src/engine/gravity.ts` | `applyGravity(board)` shifts remaining pieces down to fill empty gaps, and `refillBoard(board)` generates new gems at top slots. |
| `src/engine/cascade.ts` | `resolveCascade(board)` drives the full loop: match detection -> clearing -> gravity -> refill until no further matches occur. |
| `src/engine/score.ts` | Dynamic scoring calculations based on match size and cascade combo multipliers. |

---

## 🚀 Getting Started

### Prerequisites

- [Node.js](https://nodejs.org/) (v18 or v20 recommended)
- `npm` or `yarn`

### Installation

```bash
# Clone the repository
git clone <repo-url>
cd gemblast

# Install dependencies
npm install
```

---

## 💻 Running the App

### Web (Browser)
```bash
npm run web
# Or: npx expo start --web
```
Open [http://localhost:8081](http://localhost:8081) in any browser.

### Mobile (iOS / Android with Expo Go)
```bash
npm start
```
Scan the QR code in the terminal using the Expo Go app on iOS or Android.

---

## 🧪 Testing & Quality Checks

Run the Jest test suite:
```bash
npm test
```

Run TypeScript strict type checking:
```bash
npm run typecheck
```

Export static web bundle:
```bash
npm run build:web
```

<!-- Verified GemBlast match-3 engine and UI specification -->
