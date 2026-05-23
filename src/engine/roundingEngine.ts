/**
 * FILE: src/engine/roundingEngine.ts
 *
 * PURPOSE:
 * Round numbers the way electricians expect (fractions of an inch, decimal places).
 *
 * INPUTS:  Raw inch values or values in any length unit.
 * OUTPUTS: Rounded numbers (still numeric — pass to formattingEngine for strings).
 *
 * DATA FLOW:
 *   formula → roundLength() → formatLength() → ResultCard text
 *
 * DEPENDENCIES: unitEngine.ts, types.ts
 */

// IMPORTS
import { fromInches, toInches } from './unitEngine';
import type { FractionPrecision, LengthUnit, RoundLengthOptions, RoundingMode } from './types';

// CONSTANTS
const FRACTION_DENOMINATORS: Record<FractionPrecision, number> = {
  '1/16': 16,
  '1/8': 8,
  '1/4': 4,
  '1/2': 2,
};

// LOGIC — internal helpers (not exported; calculator UI never calls these directly)

function applyRoundingMode(value: number, mode: RoundingMode): number {
  switch (mode) {
    case 'half-even':
      return value;
    case 'toward-zero':
      return value < 0 ? Math.ceil(value) : Math.floor(value);
    case 'away-from-zero':
      return value < 0 ? Math.floor(value) : Math.ceil(value);
    case 'half-up':
    default:
      return value;
  }
}

/**
 * Core rounding: snap value to nearest multiple of `step`.
 * BEGINNER NOTE: step = 1/16 inch means we round to sixteenths.
 */
function roundWithMode(value: number, step: number, mode: RoundingMode): number {
  if (!Number.isFinite(value) || !Number.isFinite(step) || step <= 0) {
    return NaN;
  }

  const scaled = value / step;
  let rounded: number;

  switch (mode) {
    case 'half-even':
      rounded = Math.round(scaled);
      if (Math.abs(scaled % 1) === 0.5) {
        rounded = rounded % 2 === 0 ? rounded : rounded - Math.sign(scaled);
      }
      break;
    case 'toward-zero':
      rounded = scaled < 0 ? Math.ceil(scaled) : Math.floor(scaled);
      break;
    case 'away-from-zero':
      rounded = scaled < 0 ? Math.floor(scaled) : Math.ceil(scaled);
      break;
    case 'half-up':
    default:
      rounded = Math.round(scaled);
      break;
  }

  return applyRoundingMode(rounded * step, mode);
}

// EXPORTS — public API for calculators

export function roundToDecimal(
  value: number,
  decimalPlaces: number,
  mode: RoundingMode = 'half-up',
): number {
  if (!Number.isFinite(value)) {
    return NaN;
  }
  const step = 10 ** -decimalPlaces;
  return roundWithMode(value, step, mode);
}

export function roundToFraction(
  value: number,
  unit: LengthUnit,
  precision: FractionPrecision,
  mode: RoundingMode = 'half-up',
): number {
  const inches = toInches(value, unit);
  const stepInches = 1 / FRACTION_DENOMINATORS[precision];
  const roundedInches = roundWithMode(inches, stepInches, mode);
  return fromInches(roundedInches, unit);
}

/** Main helper calculators should use after computing a length in inches. */
export function roundLength(
  inches: number,
  options: RoundLengthOptions = {},
): number {
  const {
    unit = 'in',
    fractionPrecision,
    decimalPlaces,
    mode = 'half-up',
  } = options;

  if (!Number.isFinite(inches)) {
    return NaN;
  }

  const inDisplayUnit = fromInches(inches, unit);
  let rounded: number;

  if (fractionPrecision != null) {
    rounded = roundToFraction(inDisplayUnit, unit, fractionPrecision, mode);
  } else if (decimalPlaces != null) {
    rounded = roundToDecimal(inDisplayUnit, decimalPlaces, mode);
  } else {
    rounded = roundToDecimal(inDisplayUnit, 4, mode);
  }

  return toInches(rounded, unit);
}

export function roundAngle(
  degrees: number,
  decimalPlaces = 1,
  mode: RoundingMode = 'half-up',
): number {
  return roundToDecimal(degrees, decimalPlaces, mode);
}

export function fractionDenominator(precision: FractionPrecision): number {
  return FRACTION_DENOMINATORS[precision];
}
