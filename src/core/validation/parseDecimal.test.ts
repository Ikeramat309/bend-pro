import {
  parseStrictDecimal,
  parseStrictNonNegativeDecimal,
  parseStrictPositiveDecimal,
} from '@/core/validation/parseDecimal';

describe('parseStrictDecimal', () => {
  test.each([
    ['2', 2],
    ['2.5', 2.5],
    ['.5', 0.5],
    ['12.', 12],
    ['0', 0],
    ['  3.25  ', 3.25],
  ])('%s → %s', (text, expected) => {
    expect(parseStrictDecimal(text)).toBe(expected);
  });

  test.each([
    '',
    '   ',
    '2abc',
    'abc2',
    'abc',
    '-1',
    '1-2',
    '12,5',
    '1 2',
  ])('%s → undefined', (text) => {
    expect(parseStrictDecimal(text)).toBeUndefined();
  });
});

describe('parseStrictPositiveDecimal', () => {
  test.each([
    ['2', 2],
    ['2.5', 2.5],
    ['.5', 0.5],
  ])('%s → %s', (text, expected) => {
    expect(parseStrictPositiveDecimal(text)).toBe(expected);
  });

  test.each(['', '0', '-1', '2abc', 'abc2'])('%s → undefined', (text) => {
    expect(parseStrictPositiveDecimal(text)).toBeUndefined();
  });
});

describe('parseStrictNonNegativeDecimal', () => {
  test.each([
    ['0', 0],
    ['2', 2],
    ['.5', 0.5],
  ])('%s → %s', (text, expected) => {
    expect(parseStrictNonNegativeDecimal(text)).toBe(expected);
  });

  test.each(['', '-0.1', '-1', '2abc'])('%s → undefined', (text) => {
    expect(parseStrictNonNegativeDecimal(text)).toBeUndefined();
  });
});

describe('override-style validation', () => {
  const MAX = 10;

  function isValidOverride(text: string): boolean {
    const isBlank = text.trim() === '';
    const parsed = parseStrictPositiveDecimal(text);
    return isBlank || (parsed !== undefined && parsed <= MAX);
  }

  test.each([
    ['', true],
    ['2', true],
    ['2.5', true],
    ['.5', true],
    ['10', true],
    ['10.1', false],
    ['2abc', false],
    ['abc2', false],
    ['-1', false],
    ['0', false],
  ])('%s valid=%s', (text, expected) => {
    expect(isValidOverride(text)).toBe(expected);
  });
});
