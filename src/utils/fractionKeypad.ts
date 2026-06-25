/**
 * Field fraction keypad — builds tape-measure strings for parseLengthInput.
 *
 * Supports whole numbers, fractions, and mixed numbers (e.g. "12 3/8").
 * Does not validate final parse; screens use parseLengthInput for that.
 */

export type FractionQuickKey = '1/2' | '1/4' | '3/4' | '1/8' | '3/8' | '5/8' | '7/8';

export type FractionKey =
  | '0'
  | '1'
  | '2'
  | '3'
  | '4'
  | '5'
  | '6'
  | '7'
  | '8'
  | '9'
  | 'space'
  | 'slash'
  | 'backspace'
  | 'clear'
  | FractionQuickKey;

const QUICK_FRACTIONS: FractionQuickKey[] = ['1/2', '1/4', '3/4', '1/8', '3/8', '5/8', '7/8'];

export function isFractionQuickKey(key: FractionKey): key is FractionQuickKey {
  return (QUICK_FRACTIONS as string[]).includes(key);
}

function fractionSegment(text: string): string {
  const lastSpace = text.lastIndexOf(' ');
  return lastSpace >= 0 ? text.slice(lastSpace + 1) : text;
}

function appendDigit(current: string, digit: string): string {
  const segment = fractionSegment(current);
  if (segment.includes('/')) {
    const [, denominator = ''] = segment.split('/');
    if (denominator.length >= 2) return current;
    return current + digit;
  }
  return current + digit;
}

function appendSpace(current: string): string {
  const trimmed = current.trimEnd();
  if (trimmed === '') return current;
  if (trimmed.endsWith(' ') || trimmed.endsWith('/')) return current;
  if (!/\d$/.test(trimmed)) return current;
  return `${trimmed} `;
}

function appendSlash(current: string): string {
  const trimmed = current.trimEnd();
  if (trimmed === '') return current;
  const segment = fractionSegment(trimmed);
  if (segment.includes('/')) return current;
  if (!/\d$/.test(segment)) return current;
  return `${trimmed}/`;
}

function appendQuickFraction(current: string, fraction: FractionQuickKey): string {
  const trimmed = current.trimEnd();
  if (trimmed === '') return fraction;

  const segment = fractionSegment(trimmed);
  if (segment.includes('/')) {
    const prefix = trimmed.slice(0, trimmed.length - segment.length);
    return `${prefix}${fraction}`;
  }

  if (/\d$/.test(trimmed)) {
    if (trimmed.includes(' ') && /^\d+$/.test(segment)) {
      const prefix = trimmed.slice(0, trimmed.length - segment.length);
      return `${prefix}${fraction}`;
    }
    return `${trimmed} ${fraction}`;
  }

  return fraction;
}

/** Apply a keypad tap to the current field text. */
export function applyFractionKey(current: string, key: FractionKey): string {
  if (key === 'clear') return '';
  if (key === 'backspace') return current.slice(0, -1);
  if (key === 'space') return appendSpace(current);
  if (key === 'slash') return appendSlash(current);
  if (isFractionQuickKey(key)) return appendQuickFraction(current, key);
  return appendDigit(current, key);
}

/** Common trade fractions shown on the field keypad. */
export const FRACTION_KEYPAD_QUICK_KEYS: FractionQuickKey[] = ['1/2', '1/4', '3/4', '3/8'];
