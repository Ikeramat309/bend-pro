/**
 * FILE: src/engine/types.ts
 *
 * PURPOSE:
 * Shared TypeScript shapes used by ALL engine modules (units, rounding, formatting, validation).
 *
 * INPUTS:  None (types only — no runtime logic).
 * OUTPUTS: Exported types that other files import.
 *
 * ARCHITECTURE:
 *   UI (screens) → calculators → engine (this folder) → numbers/strings out
 *
 * WHY THIS FILE EXISTS:
 * TypeScript "types" describe data shape. One shared file prevents duplicate,
 * conflicting definitions across calculators.
 *
 * FUTURE REUSE:
 * Every calculator (Offset, Stub 90, Saddle, etc.) should import from here
 * instead of inventing new unit/validation types.
 */

// =============================================================================
// TYPES — length, units, validation, formatting options
// =============================================================================

/** Internal storage unit for length math (US conduit trade uses inches heavily). */
export type CanonicalLengthUnit = 'in';

/** Units the user may type or see in the UI. */
export type LengthUnit = 'in' | 'ft' | 'mm' | 'cm' | 'm';

/** App-level preference: Imperial vs Metric (drives default display units). */
export type UnitSystem = 'imperial' | 'metric';

/** Bend angles are always stored in degrees. */
export type AngleUnit = 'deg';

/**
 * Fraction steps for imperial display (matches field measuring tapes).
 * BEGINNER NOTE: '1/16' means "round to nearest sixteenth of an inch."
 */
export type FractionPrecision = '1/16' | '1/8' | '1/4' | '1/2';

/** How a number should round when multiple strategies exist. */
export type RoundingMode = 'half-up' | 'half-even' | 'toward-zero' | 'away-from-zero';

/** 'error' blocks calculation; 'warning' is informational (still may calculate). */
export type ValidationSeverity = 'error' | 'warning';

/** One problem found during validation (field + human-readable message). */
export type ValidationIssue = {
  field: string;
  code: string;
  message: string;
  severity: ValidationSeverity;
};

/** Result object returned by validationEngine — UI reads .issues for warnings. */
export type ValidationResult = {
  valid: boolean;
  issues: ValidationIssue[];
};

/** Options passed into formatLength() — all optional with defaults in the engine. */
export type FormatLengthOptions = {
  unit?: LengthUnit;
  fractionPrecision?: FractionPrecision;
  showUnitSuffix?: boolean;
  maxDecimalPlaces?: number;
};

/** Options passed into roundLength() — controls fraction vs decimal rounding. */
export type RoundLengthOptions = {
  unit?: LengthUnit;
  fractionPrecision?: FractionPrecision;
  decimalPlaces?: number;
  mode?: RoundingMode;
};

// =============================================================================
// EXPORTS — types are exported above via `export type`
// =============================================================================
