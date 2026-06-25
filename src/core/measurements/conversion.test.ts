import {
  MM_PER_INCH,
  formatCanonicalLengthForDisplay,
  fromCanonicalInches,
  inchesToMm,
  mmToInches,
  parsePositiveLengthToCanonicalInches,
  toCanonicalInches,
} from '@/core/measurements';

describe('MM_PER_INCH', () => {
  test('is the standard conversion constant', () => {
    expect(MM_PER_INCH).toBe(25.4);
  });
});

describe('inchesToMm / mmToInches', () => {
  test('convert 1 inch to millimetres', () => {
    expect(inchesToMm(1)).toBe(25.4);
  });

  test('convert 25.4 mm to inches', () => {
    expect(mmToInches(25.4)).toBe(1);
  });

  test('round-trip preserves value', () => {
    expect(mmToInches(inchesToMm(6.125))).toBeCloseTo(6.125);
  });
});

describe('toCanonicalInches / fromCanonicalInches', () => {
  test('imperial values pass through unchanged', () => {
    expect(toCanonicalInches(12, 'imperial')).toBe(12);
    expect(fromCanonicalInches(12, 'imperial')).toBe(12);
  });

  test('metric input converts to inches for engine math', () => {
    expect(toCanonicalInches(25.4, 'metric')).toBe(1);
    expect(toCanonicalInches(254, 'metric')).toBe(10);
  });

  test('canonical inches convert to metric for display', () => {
    expect(fromCanonicalInches(1, 'metric')).toBe(25.4);
    expect(fromCanonicalInches(2, 'metric')).toBe(50.8);
  });

  test('round-trip through canonical inches in metric mode', () => {
    const enteredMm = 152.4;
    const inches = toCanonicalInches(enteredMm, 'metric');
    expect(fromCanonicalInches(inches, 'metric')).toBeCloseTo(enteredMm);
  });
});

describe('parsePositiveLengthToCanonicalInches', () => {
  test('parses imperial fractions to inches', () => {
    expect(parsePositiveLengthToCanonicalInches('6', 'imperial')).toBe(6);
    expect(parsePositiveLengthToCanonicalInches('3/8', 'imperial')).toBe(0.375);
  });

  test('parses metric decimals to inches', () => {
    expect(parsePositiveLengthToCanonicalInches('25.4', 'metric')).toBe(1);
  });

  test('rejects empty, zero, and junk input', () => {
    expect(parsePositiveLengthToCanonicalInches('', 'imperial')).toBeUndefined();
    expect(parsePositiveLengthToCanonicalInches('0', 'imperial')).toBeUndefined();
    expect(parsePositiveLengthToCanonicalInches('2abc', 'imperial')).toBeUndefined();
    expect(parsePositiveLengthToCanonicalInches('abc2', 'metric')).toBeUndefined();
  });
});

describe('formatCanonicalLengthForDisplay', () => {
  test('formats imperial inches as a compact decimal', () => {
    expect(formatCanonicalLengthForDisplay(6.125, 'imperial')).toBe('6.125');
  });

  test('formats canonical inches in metric display units', () => {
    expect(formatCanonicalLengthForDisplay(1, 'metric')).toBe('25.4');
  });
});
