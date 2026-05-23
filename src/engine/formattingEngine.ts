/**
 * FILE: src/engine/formattingEngine.ts
 *
 * PURPOSE:
 * Turn numbers into human-readable strings (5' 3 1/4", 45°, 2.5 in).
 *
 * INPUTS:  Canonical inches, degrees, plain numbers.
 * OUTPUTS: Strings safe to show in ResultCard / labels.
 *
 * WHY SEPARATE FROM roundingEngine?
 * Rounding decides the numeric value; formatting decides how it LOOKS.
 *
 * DEPENDENCIES: unitEngine.ts, roundingEngine.ts, types.ts
 */

// IMPORTS
import { denormalizeLength } from './unitEngine';
import { fractionDenominator } from './roundingEngine';
import type { FormatLengthOptions, FractionPrecision, LengthUnit } from './types';

// CONSTANTS
const UNIT_LABELS: Record<LengthUnit, string> = {
  in: 'in',
  ft: 'ft',
  mm: 'mm',
  cm: 'cm',
  m: 'm',
};

// LOGIC — helpers

/** Greatest common divisor — simplifies fractions like 8/16 → 1/2. */
function gcd(a: number, b: number): number {
  let x = Math.abs(Math.trunc(a));
  let y = Math.abs(Math.trunc(b));
  while (y !== 0) {
    const t = y;
    y = x % y;
    x = t;
  }
  return x || 1;
}

function formatFractionPart(
  whole: number,
  fractionalInches: number,
  precision: FractionPrecision,
): string {
  const denom = fractionDenominator(precision);
  const numerator = Math.round(fractionalInches * denom);

  if (numerator === 0) {
    return whole === 0 ? '0' : `${whole}`;
  }
  if (numerator === denom) {
    return `${whole + 1}`;
  }

  const divisor = gcd(numerator, denom);
  const n = numerator / divisor;
  const d = denom / divisor;
  const fraction = `${n}/${d}`;

  if (whole === 0) {
    return fraction;
  }
  return `${whole} ${fraction}`;
}

// EXPORTS — public formatters

/** Imperial-friendly: feet + inches + fraction (e.g. 5' 3 1/4"). */
export function formatFeetInches(
  inches: number,
  precision: FractionPrecision = '1/16',
  showPrimeSymbols = true,
): string {
  if (!Number.isFinite(inches)) {
    return '—';
  }

  const sign = inches < 0 ? '-' : '';
  const absInches = Math.abs(inches);
  const feet = Math.floor(absInches / 12);
  const remaining = absInches - feet * 12;
  const wholeInches = Math.floor(remaining);
  const fractionPart = remaining - wholeInches;
  const inchStr = formatFractionPart(wholeInches, fractionPart, precision);

  if (feet === 0) {
    return `${sign}${inchStr}${showPrimeSymbols ? '"' : ' in'}`;
  }

  const footMark = showPrimeSymbols ? "'" : ' ft';
  const inchMark = showPrimeSymbols ? '"' : ' in';
  return `${sign}${feet}${footMark} ${inchStr}${inchMark}`;
}

/** Primary length formatter — pass inches from calculator, options for display unit. */
export function formatLength(inches: number, options: FormatLengthOptions = {}): string {
  const {
    unit = 'in',
    fractionPrecision = '1/16',
    showUnitSuffix = true,
    maxDecimalPlaces = 4,
  } = options;

  if (!Number.isFinite(inches)) {
    return '—';
  }

  if (unit === 'in' && fractionPrecision) {
    const formatted = formatFeetInches(inches, fractionPrecision, true);
    return showUnitSuffix ? formatted : formatted.replace(/["']/g, '').trim();
  }

  if (unit === 'ft') {
    const feet = denormalizeLength(inches, 'ft');
    const text = feet.toFixed(maxDecimalPlaces).replace(/\.?0+$/, '');
    return showUnitSuffix ? `${text} ${UNIT_LABELS.ft}` : text;
  }

  const value = denormalizeLength(inches, unit);
  const text = value.toFixed(maxDecimalPlaces).replace(/\.?0+$/, '');
  return showUnitSuffix ? `${text} ${UNIT_LABELS[unit]}` : text;
}

export function formatAngle(degrees: number, decimalPlaces = 1, showUnitSuffix = true): string {
  if (!Number.isFinite(degrees)) {
    return '—';
  }
  const text = degrees.toFixed(decimalPlaces).replace(/\.?0+$/, '');
  return showUnitSuffix ? `${text}°` : text;
}

export function formatNumber(value: number, decimalPlaces = 2): string {
  if (!Number.isFinite(value)) {
    return '—';
  }
  return value.toFixed(decimalPlaces).replace(/\.?0+$/, '');
}

export function formatUnitLabel(unit: LengthUnit): string {
  return UNIT_LABELS[unit];
}
