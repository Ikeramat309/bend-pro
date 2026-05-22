/** Canonical storage for lengths (US conduit trade standard). */
export type CanonicalLengthUnit = 'in';

/** Supported input/display length units. */
export type LengthUnit = 'in' | 'ft' | 'mm' | 'cm' | 'm';

export type UnitSystem = 'imperial' | 'metric';

export type AngleUnit = 'deg';

/** How fractional inches are shown in the UI. */
export type FractionPrecision = '1/16' | '1/8' | '1/4' | '1/2';

export type RoundingMode = 'half-up' | 'half-even' | 'toward-zero' | 'away-from-zero';

export type ValidationSeverity = 'error' | 'warning';

export type ValidationIssue = {
  field: string;
  code: string;
  message: string;
  severity: ValidationSeverity;
};

export type ValidationResult = {
  valid: boolean;
  issues: ValidationIssue[];
};

export type FormatLengthOptions = {
  unit?: LengthUnit;
  fractionPrecision?: FractionPrecision;
  showUnitSuffix?: boolean;
  maxDecimalPlaces?: number;
};

export type RoundLengthOptions = {
  unit?: LengthUnit;
  fractionPrecision?: FractionPrecision;
  decimalPlaces?: number;
  mode?: RoundingMode;
};
