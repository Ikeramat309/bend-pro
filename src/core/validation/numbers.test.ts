import {
  isFiniteNumber,
  isInInclusiveRange,
  isNonNegativeFinite,
  isPositiveFinite,
} from '@/core/validation/numbers';

describe('finite number guards', () => {
  test('isFiniteNumber', () => {
    expect(isFiniteNumber(1)).toBe(true);
    expect(isFiniteNumber(0)).toBe(true);
    expect(isFiniteNumber(NaN)).toBe(false);
    expect(isFiniteNumber(Infinity)).toBe(false);
    expect(isFiniteNumber('1')).toBe(false);
  });

  test('isPositiveFinite', () => {
    expect(isPositiveFinite(0.5)).toBe(true);
    expect(isPositiveFinite(0)).toBe(false);
    expect(isPositiveFinite(-1)).toBe(false);
  });

  test('isNonNegativeFinite', () => {
    expect(isNonNegativeFinite(0)).toBe(true);
    expect(isNonNegativeFinite(-0.001)).toBe(false);
  });
});

describe('isInInclusiveRange', () => {
  test('accepts boundary values', () => {
    expect(isInInclusiveRange(0, 0, 10)).toBe(true);
    expect(isInInclusiveRange(10, 0, 10)).toBe(true);
    expect(isInInclusiveRange(5, 0, 10)).toBe(true);
  });

  test('rejects out-of-range values', () => {
    expect(isInInclusiveRange(-0.001, 0, 10)).toBe(false);
    expect(isInInclusiveRange(10.001, 0, 10)).toBe(false);
  });
});
