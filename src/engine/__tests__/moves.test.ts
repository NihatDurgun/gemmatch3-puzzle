import {
  createMoveCounter,
  decrementMoves,
  addMoves,
  isOutOfMoves,
  hasRemainingMoves,
  isLowOnMoves,
  formatMovesDisplay,
} from '../moves';

describe('Moves Engine', () => {
  test('createMoveCounter initializes with expected values', () => {
    const counter = createMoveCounter(30);
    expect(counter.initialMoves).toBe(30);
    expect(counter.remainingMoves).toBe(30);
    expect(counter.movesTaken).toBe(0);
  });

  test('createMoveCounter handles negative or decimal input safely', () => {
    const negative = createMoveCounter(-5);
    expect(negative.initialMoves).toBe(0);
    expect(negative.remainingMoves).toBe(0);

    const decimal = createMoveCounter(15.8);
    expect(decimal.initialMoves).toBe(15);
    expect(decimal.remainingMoves).toBe(15);
  });

  test('decrementMoves decrements moves remaining and increases moves taken', () => {
    const counter = createMoveCounter(10);
    const next1 = decrementMoves(counter);

    expect(next1.remainingMoves).toBe(9);
    expect(next1.movesTaken).toBe(1);

    const next2 = decrementMoves(next1, 4);
    expect(next2.remainingMoves).toBe(5);
    expect(next2.movesTaken).toBe(5);
  });

  test('decrementMoves clamps at zero and does not overcount taken moves', () => {
    const counter = createMoveCounter(2);
    const next = decrementMoves(counter, 5);

    expect(next.remainingMoves).toBe(0);
    expect(next.movesTaken).toBe(2);
  });

  test('addMoves increases remaining moves', () => {
    const counter = createMoveCounter(5);
    const updated = addMoves(counter, 3);

    expect(updated.remainingMoves).toBe(8);
    expect(updated.movesTaken).toBe(0);
  });

  test('isOutOfMoves and hasRemainingMoves evaluate correctly', () => {
    const withMoves = createMoveCounter(1);
    expect(isOutOfMoves(withMoves)).toBe(false);
    expect(hasRemainingMoves(withMoves)).toBe(true);

    const out = decrementMoves(withMoves);
    expect(isOutOfMoves(out)).toBe(true);
    expect(hasRemainingMoves(out)).toBe(false);
  });

  test('isLowOnMoves checks threshold', () => {
    const counter6 = createMoveCounter(6);
    expect(isLowOnMoves(counter6, 5)).toBe(false);

    const counter5 = createMoveCounter(5);
    expect(isLowOnMoves(counter5, 5)).toBe(true);

    const counter1 = createMoveCounter(1);
    expect(isLowOnMoves(counter1, 5)).toBe(true);

    const counter0 = createMoveCounter(0);
    expect(isLowOnMoves(counter0, 5)).toBe(false);
  });

  test('formatMovesDisplay formats remaining moves correctly', () => {
    const counter = createMoveCounter(12);
    expect(formatMovesDisplay(counter)).toBe('12');
  });
});
