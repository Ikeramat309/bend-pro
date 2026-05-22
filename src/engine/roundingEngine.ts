import { fromInches, toInches } from './unitEngine';
import type { FractionPrecision, LengthUnit, RoundLengthOptions, RoundingMode } from './types';

const FRACTION_DENOMINATORS: Record<FractionPrecision, number> = {
  '1/16': 16,
  '1/8': 8,
  '1/4': 4,
  '1/2': 2,
};

function applyRoundingMode(value: number, mode: RoundingMode): number {
  switch (mode) {
    case 'half-even':
      // Banker's rounding at the current precision step is handled per-call.
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

  const result = rounded * step;
  return applyRoundingMode(result, mode);
}

/** Round a plain number to N decimal places. */
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

/** Round to the nearest fraction of an inch (e.g. 1/16"), then return in the requested unit. */
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

/** Round canonical inches, optionally converting to a display unit first. */
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

/** Round bend angles (typically whole degrees or fixed decimals). */
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
