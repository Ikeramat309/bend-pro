import { applyFractionKey, type FractionKey } from '@/utils/fractionKeypad';
import { parseLengthInput } from '@/utils/parseLengthInput';

describe('applyFractionKey', () => {
  describe('digits', () => {
    test.each([
      ['', '1', '1'],
      ['12', '3', '123'],
      ['12 ', '3', '12 3'],
      ['12 3/', '8', '12 3/8'],
    ] as const)('"%s" + %s → "%s"', (current, key, expected) => {
      expect(applyFractionKey(current, key)).toBe(expected);
    });
  });

  describe('space and slash', () => {
    test('adds space after whole number', () => {
      expect(applyFractionKey('12', 'space')).toBe('12 ');
    });

    test('ignores duplicate space', () => {
      expect(applyFractionKey('12 ', 'space')).toBe('12 ');
    });

    test('adds slash after numerator', () => {
      expect(applyFractionKey('12 3', 'slash')).toBe('12 3/');
    });

    test('ignores slash without digits', () => {
      expect(applyFractionKey('', 'slash')).toBe('');
    });
  });

  describe('quick fractions', () => {
    test.each([
      ['', '1/2', '1/2'],
      ['12', '3/8', '12 3/8'],
      ['12 1', '3/4', '12 3/4'],
      ['12 1/2', '3/8', '12 3/8'],
    ] as const)('"%s" + %s → "%s"', (current, key, expected) => {
      expect(applyFractionKey(current, key)).toBe(expected);
    });
  });

  describe('backspace and clear', () => {
    test('backspace removes last character', () => {
      expect(applyFractionKey('12 3/8', 'backspace')).toBe('12 3/');
    });

    test('clear resets field', () => {
      expect(applyFractionKey('12 3/8', 'clear')).toBe('');
    });
  });

  describe('parseLengthInput compatibility', () => {
    test('built mixed number parses correctly', () => {
      let value = '';
      for (const key of ['1', '2', 'space', '3', 'slash', '8'] as FractionKey[]) {
        value = applyFractionKey(value, key);
      }
      expect(value).toBe('12 3/8');
      expect(parseLengthInput(value)).toBe(12.375);
    });
  });
});
