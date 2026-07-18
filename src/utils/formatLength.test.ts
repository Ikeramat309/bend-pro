/**
 * formatLength tests — locks tape-measure fraction formatting and
 * metric rounding, which every calculator result passes through.
 */
import { formatLength } from './formatLength';

describe('formatLength (imperial)', () => {
  test('whole inches have no fraction', () => {
    expect(formatLength(7, 'imperial', '1/16')).toBe('7"');
  });

  test('fractions reduce to lowest terms', () => {
    expect(formatLength(0.5, 'imperial', '1/16')).toBe('1/2"');
    expect(formatLength(7.25, 'imperial', '1/4')).toBe('7 1/4"');
    expect(formatLength(0.375, 'imperial', '1/16')).toBe('3/8"');
  });

  test('values just under a whole inch round up cleanly', () => {
    expect(formatLength(6.97, 'imperial', '1/16')).toBe('7"');
  });

  test('rounding step controls precision', () => {
    expect(formatLength(7.1, 'imperial', '1/8')).toBe('7 1/8"');
    expect(formatLength(7.1, 'imperial', '1/4')).toBe('7"');
  });

  test('"exact" still displays as nearest 1/16 (tape-measure display)', () => {
    expect(formatLength(7.3, 'imperial', 'exact')).toBe('7 5/16"');
  });

  test('negative values keep their sign', () => {
    expect(formatLength(-1.25, 'imperial', '1/16')).toBe('-1 1/4"');
  });
});

describe('formatLength (metric)', () => {
  test('converts inches to millimetres', () => {
    expect(formatLength(1, 'metric', 'exact')).toBe('25.4 mm');
  });

  test('rounding steps apply in millimetres', () => {
    expect(formatLength(1, 'metric', '1mm')).toBe('25 mm');
    expect(formatLength(1, 'metric', '5mm')).toBe('25 mm');
    expect(formatLength(1, 'metric', '10mm')).toBe('30 mm');
  });
});

describe('formatLength extreme values', () => {
  test.each([Number.NaN, Number.POSITIVE_INFINITY, Number.MAX_VALUE])(
    'returns a safe placeholder for %s',
    (value) => {
      expect(formatLength(value, 'imperial', '1/16')).toBe('—');
      expect(formatLength(value, 'metric', '1mm')).toBe('—');
    },
  );
});
