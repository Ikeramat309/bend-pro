import type { UnitSystem } from '@/core/types';

import { MM_PER_INCH } from './constants';

export function inchesToMm(inches: number): number {
  return inches * MM_PER_INCH;
}

export function mmToInches(mm: number): number {
  return mm / MM_PER_INCH;
}

/** Converts a length entered in the user's unit system to internal inches. */
export function toCanonicalInches(value: number, unitSystem: UnitSystem): number {
  return unitSystem === 'metric' ? mmToInches(value) : value;
}

/** Converts internal inches to the user's display unit. */
export function fromCanonicalInches(valueInches: number, unitSystem: UnitSystem): number {
  return unitSystem === 'metric' ? inchesToMm(valueInches) : valueInches;
}

/** Rounds a display-unit value for compact decimal fields (override sheets). */
export function formatDisplayDecimal(value: number, decimals = 3): string {
  const factor = 10 ** decimals;
  return String(Math.round(value * factor) / factor);
}

/** Formats canonical inches as a decimal string in the active unit system. */
export function formatCanonicalLengthForDisplay(
  inches: number,
  unitSystem: UnitSystem,
  decimals = 3,
): string {
  return formatDisplayDecimal(fromCanonicalInches(inches, unitSystem), decimals);
}
