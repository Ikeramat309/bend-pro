import {
  adjustLengthInputByInches,
  formatInchesForLengthInput,
  LENGTH_STEP_DELTAS_INCHES,
} from './lengthAdjustment';

describe('formatInchesForLengthInput', () => {
  it('formats mixed numbers without a trailing quote', () => {
    expect(formatInchesForLengthInput(12.375)).toBe('12 3/8');
  });

  it('returns empty for non-positive values', () => {
    expect(formatInchesForLengthInput(0)).toBe('');
  });
});

describe('adjustLengthInputByInches', () => {
  it('adds sixteenth-inch steps from a whole number', () => {
    expect(adjustLengthInputByInches('12', LENGTH_STEP_DELTAS_INCHES.plusSixteenth)).toBe('12 1/16');
  });

  it('subtracts quarter-inch steps', () => {
    expect(adjustLengthInputByInches('12 1/2', LENGTH_STEP_DELTAS_INCHES.minusQuarter)).toBe('12 1/4');
  });

  it('clamps at zero for length fields', () => {
    expect(adjustLengthInputByInches('1/16', LENGTH_STEP_DELTAS_INCHES.minusSixteenth)).toBe('');
  });

  it('respects explicit max bounds', () => {
    expect(adjustLengthInputByInches('10', LENGTH_STEP_DELTAS_INCHES.plusOne, { maxInches: 10 })).toBe('10');
  });
});
