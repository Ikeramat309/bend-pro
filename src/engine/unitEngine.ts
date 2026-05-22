import type { AngleUnit, CanonicalLengthUnit, LengthUnit, UnitSystem } from './types';

/** All length values in calculators are stored in inches unless converted at the boundary. */
export const CANONICAL_LENGTH_UNIT: CanonicalLengthUnit = 'in';
export const CANONICAL_ANGLE_UNIT: AngleUnit = 'deg';

const INCHES_PER_FOOT = 12;
const MM_PER_INCH = 25.4;

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

/** Normalize user input to canonical inches for engine math. */
export function normalizeLength(value: number, unit: LengthUnit): number {
  return toInches(value, unit);
}

/** Present canonical inches in the user's preferred display unit. */
export function denormalizeLength(inches: number, unit: LengthUnit): number {
  return fromInches(inches, unit);
}

/** Angles are always degrees; this exists for symmetry at calculator boundaries. */
export function normalizeAngle(degrees: number): number {
  return degrees;
}

export function denormalizeAngle(degrees: number): number {
  return degrees;
}
