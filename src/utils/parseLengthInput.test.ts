/**
 * parseLengthInput tests — tape-measure input is field-critical:
 * electricians measure in fractions, not decimals.
 */
import { hasPositiveLengthInput, parseLengthInput } from './parseLengthInput';

describe('parseLengthInput', () => {
  describe('decimals', () => {
    test.each([
      ['12', 12],
      ['12.5', 12.5],
      ['.5', 0.5],
      ['12.', 12],
      ['0', 0],
    ])('%s → %d', (text, expected) => {
      expect(parseLengthInput(text)).toBe(expected);
    });
  });

  describe('fractions and mixed numbers', () => {
    test.each([
      ['3/8', 0.375],
      ['1/2', 0.5],
      ['12 3/8', 12.375],
      ['12-3/8', 12.375],
      ['12  3/8', 12.375],
      ['12 3 / 8', 12.375],
      ['29 1/2', 29.5],
    ])('%s → %d', (text, expected) => {
      expect(parseLengthInput(text)).toBe(expected);
    });
  });

  describe('trailing unit markers', () => {
    test.each([
      ['12"', 12],
      ['12 3/8"', 12.375],
      ['12 in', 12],
      ['12in', 12],
      ['12 IN.', 12],
    ])('%s → %d', (text, expected) => {
      expect(parseLengthInput(text)).toBe(expected);
    });
  });

  describe('whitespace and empties', () => {
    test.each([['', undefined], ['   ', undefined], ['  12 3/8  ', 12.375]])(
      '%j → %j',
      (text, expected) => {
        expect(parseLengthInput(text as string)).toBe(expected);
      },
    );
  });

  describe('rejected input', () => {
    test.each([
      'abc',
      '12 3', // incomplete mixed number
      '3/0', // zero denominator
      '12 3/0',
      '/8',
      '1/2/3',
      '-5', // lengths are unsigned
      '12,5', // decimal comma not supported (documented limitation)
      '1 2 3',
    ])('%s → undefined', (text) => {
      expect(parseLengthInput(text)).toBeUndefined();
    });
  });
});

describe('hasPositiveLengthInput', () => {
  test.each([
    ['12 3/8', true],
    ['3/8', true],
    ['0', false],
    ['', false],
    ['abc', false],
  ])('%j → %j', (text, expected) => {
    expect(hasPositiveLengthInput(text as string)).toBe(expected);
  });
});
