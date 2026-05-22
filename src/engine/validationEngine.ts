import { isLengthUnitForSystem } from './unitEngine';
import type { LengthUnit, UnitSystem, ValidationIssue, ValidationResult } from './types';

export type NumberConstraints = {
  min?: number;
  max?: number;
  allowZero?: boolean;
  allowNegative?: boolean;
  integerOnly?: boolean;
};

export type AngleConstraints = {
  min?: number;
  max?: number;
};

function issue(
  field: string,
  code: string,
  message: string,
  severity: ValidationIssue['severity'] = 'error',
): ValidationIssue {
  return { field, code, message, severity };
}

function mergeResults(...results: ValidationResult[]): ValidationResult {
  const issues = results.flatMap((r) => r.issues);
  return {
    valid: issues.every((i) => i.severity !== 'error'),
    issues,
  };
}

export function validResult(): ValidationResult {
  return { valid: true, issues: [] };
}

export function invalidResult(issues: ValidationIssue[]): ValidationResult {
  return {
    valid: issues.every((i) => i.severity !== 'error'),
    issues,
  };
}

/** Ensure value is a finite number. */
export function validateNumber(
  value: unknown,
  field: string,
  constraints: NumberConstraints = {},
): ValidationResult {
  const issues: ValidationIssue[] = [];

  if (value === '' || value === null || value === undefined) {
    issues.push(issue(field, 'required', `${field} is required.`));
    return invalidResult(issues);
  }

  const num = typeof value === 'number' ? value : Number(value);

  if (!Number.isFinite(num)) {
    issues.push(issue(field, 'not_a_number', `${field} must be a valid number.`));
    return invalidResult(issues);
  }

  const {
    min,
    max,
    allowZero = true,
    allowNegative = false,
    integerOnly = false,
  } = constraints;

  if (!allowNegative && num < 0) {
    issues.push(issue(field, 'negative', `${field} cannot be negative.`));
  }

  if (!allowZero && num === 0) {
    issues.push(issue(field, 'zero', `${field} must be greater than zero.`));
  }

  if (min != null && num < min) {
    issues.push(issue(field, 'min', `${field} must be at least ${min}.`));
  }

  if (max != null && num > max) {
    issues.push(issue(field, 'max', `${field} must be at most ${max}.`));
  }

  if (integerOnly && !Number.isInteger(num)) {
    issues.push(issue(field, 'integer', `${field} must be a whole number.`));
  }

  return issues.length ? invalidResult(issues) : validResult();
}

/** Length inputs: positive, within practical conduit limits (stored as inches after conversion). */
export function validateLengthInches(
  inches: number,
  field: string,
  options: { min?: number; max?: number; allowZero?: boolean } = {},
): ValidationResult {
  const { min = 0, max = 1200, allowZero = false } = options;
  return validateNumber(inches, field, {
    min: allowZero ? min : Math.max(min, 0.001),
    max,
    allowZero,
    allowNegative: false,
  });
}

/** Bend angles: typically 0°–180° for single bends; use max 360 for full rotation. */
export function validateAngle(
  degrees: unknown,
  field: string,
  constraints: AngleConstraints = {},
): ValidationResult {
  const { min = 0, max = 180 } = constraints;
  const base = validateNumber(degrees, field, {
    min,
    max,
    allowZero: true,
    allowNegative: false,
  });

  if (!base.valid) {
    return base;
  }

  const num = Number(degrees);
  if (num > 90 && num <= 180) {
    return mergeResults(base, {
      valid: true,
      issues: [
        issue(
          field,
          'obtuse_angle',
          `${field} is greater than 90° — verify this is intended.`,
          'warning',
        ),
      ],
    });
  }

  return base;
}

export function validateLengthUnit(unit: LengthUnit, system: UnitSystem, field = 'unit'): ValidationResult {
  if (!isLengthUnitForSystem(unit, system)) {
    return invalidResult([
      issue(field, 'unit_mismatch', `${unit} is not valid for ${system} mode.`),
    ]);
  }
  return validResult();
}

/** Run multiple field validators; collect all issues. */
export function validateAll(...checks: ValidationResult[]): ValidationResult {
  return mergeResults(...checks);
}

/** First error message for a field, or undefined. */
export function getFieldError(result: ValidationResult, field: string): string | undefined {
  return result.issues.find((i) => i.field === field && i.severity === 'error')?.message;
}
