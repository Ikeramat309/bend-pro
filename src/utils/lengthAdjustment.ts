import { formatLength } from './formatLength';
import { parseLengthInput } from './parseLengthInput';

const SIXTEENTH_INCH = 1 / 16;

export type LengthAdjustmentBounds = {
  minInches?: number;
  maxInches?: number;
};

/** Format inches as a tape-measure field string (no trailing unit quote). */
export function formatInchesForLengthInput(inches: number): string {
  if (!Number.isFinite(inches) || inches <= 0) return '';
  return formatLength(inches, 'imperial', '1/16').replace(/"$/, '');
}

function roundToSixteenths(inches: number): number {
  return Math.round(inches / SIXTEENTH_INCH) * SIXTEENTH_INCH;
}

function clampInches(value: number, bounds?: LengthAdjustmentBounds): number {
  const min = bounds?.minInches ?? 0;
  let next = Math.max(min, value);
  if (bounds?.maxInches !== undefined) {
    next = Math.min(next, bounds.maxInches);
  }
  return roundToSixteenths(next);
}

/** Adjust a length field string by a delta in inches at 1/16 precision. */
export function adjustLengthInputByInches(
  text: string,
  deltaInches: number,
  bounds?: LengthAdjustmentBounds,
): string {
  const current = parseLengthInput(text) ?? 0;
  const next = clampInches(current + deltaInches, bounds);
  if (next <= 0) return '';
  return formatInchesForLengthInput(next);
}

export const LENGTH_STEP_DELTAS_INCHES = {
  minusOne: -1,
  minusQuarter: -1 / 4,
  minusSixteenth: -SIXTEENTH_INCH,
  plusSixteenth: SIXTEENTH_INCH,
  plusQuarter: 1 / 4,
  plusOne: 1,
} as const;
