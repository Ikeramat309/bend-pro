/**
 * FILE: src/engine/unitEngine.ts
 *
 * PURPOSE:
 * Convert lengths between units. All calculators store math in INCHES internally,
 * then convert for display (metric mm, imperial fractions, etc.).
 *
 * INPUTS:  Numbers + unit labels (e.g. 48, 'in').
 * OUTPUTS: Normalized inch values, or values in a target unit.
 *
 * DATA FLOW:
 *   User types "150" in mm → normalizeLength() → inches for formulas
 *   Formula result in inches → denormalizeLength() → mm for ResultCard
 *
 * DEPENDENCIES: ./types.ts
 *
 * FUTURE REUSE: Offset, Stub 90, Rolling Offset, Voltage Drop — all use this.
 */

// IMPORTS
import type { AngleUnit, CanonicalLengthUnit, LengthUnit, UnitSystem } from './types';

// CONSTANTS — single source of truth for conversion factors
/** Every calculator converts TO this unit before doing math. */
export const CANONICAL_LENGTH_UNIT: CanonicalLengthUnit = 'in';
export const CANONICAL_ANGLE_UNIT: AngleUnit = 'deg';

const INCHES_PER_FOOT = 12;
const MM_PER_INCH = 25.4;

/**
 * Multiply user value by these factors to get inches.
 * BEGINNER NOTE: Record<LengthUnit, number> is a TypeScript map:
 * each unit key ('in', 'mm', ...) maps to a conversion factor.
 */
const LENGTH_TO_INCHES: Record<LengthUnit, number> = {
  in: 1,
  ft: INCHES_PER_FOOT,
  mm: 1 / MM_PER_INCH,
  cm: 10 / MM_PER_INCH,
  m: 1000 / MM_PER_INCH,
};

const UNIT_SYSTEM_DEFAULTS: Record<UnitSystem, LengthUnit> = {
  imperial: 'in',
  metric: 'mm',
};

const METRIC_UNITS: LengthUnit[] = ['mm', 'cm', 'm'];
const IMPERIAL_UNITS: LengthUnit[] = ['in', 'ft'];

// LOGIC — pure functions (no React, no UI)

export function defaultLengthUnit(system: UnitSystem): LengthUnit {
  return UNIT_SYSTEM_DEFAULTS[system];
}

export function isMetricUnit(unit: LengthUnit): boolean {
  return METRIC_UNITS.includes(unit);
}

export function isImperialUnit(unit: LengthUnit): boolean {
  return IMPERIAL_UNITS.includes(unit);
}

export function isLengthUnitForSystem(unit: LengthUnit, system: UnitSystem): boolean {
  return system === 'metric' ? isMetricUnit(unit) : isImperialUnit(unit);
}

/** Convert any supported length into canonical inches. */
export function toInches(value: number, fromUnit: LengthUnit): number {
  if (!Number.isFinite(value)) {
    return NaN;
  }
  return value * LENGTH_TO_INCHES[fromUnit];
}

/** Convert canonical inches into the requested unit. */
export function fromInches(inches: number, toUnit: LengthUnit): number {
  if (!Number.isFinite(inches)) {
    return NaN;
  }
  return inches / LENGTH_TO_INCHES[toUnit];
}

/** Convert between any two supported length units. */
export function convertLength(value: number, fromUnit: LengthUnit, toUnit: LengthUnit): number {
  if (fromUnit === toUnit) {
    return value;
  }
  return fromInches(toInches(value, fromUnit), toUnit);
}

/**
 * Call at calculator INPUT boundary (when user submits a field).
 * BEGINNER NOTE: "normalize" = convert to our standard internal format.
 */
export function normalizeLength(value: number, unit: LengthUnit): number {
  return toInches(value, unit);
}

/** Call at calculator OUTPUT boundary (before formattingEngine runs). */
export function denormalizeLength(inches: number, unit: LengthUnit): number {
  return fromInches(inches, unit);
}

/** Angles stay in degrees; these helpers keep input/output symmetric. */
export function normalizeAngle(degrees: number): number {
  return degrees;
}

export function denormalizeAngle(degrees: number): number {
  return degrees;
}

// EXPORTS — functions exported inline above
