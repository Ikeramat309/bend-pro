/**
 * FILE: src/engine/validationEngine.ts
 *
 * PURPOSE:
 * Check user inputs BEFORE running formulas. Returns structured errors/warnings.
 *
 * INPUTS:  Raw field values (often strings from TextInput).
 * OUTPUTS: ValidationResult { valid, issues[] } for UI to display.
 *
 * WHY NOT VALIDATE INSIDE UI COMPONENTS?
 * Same rules must apply in Workbench, final calculators, and future tests.
 * Keeping rules here = one source of truth.
 *
 * DEPENDENCIES: unitEngine.ts, types.ts
 */

// IMPORTS
import { isLengthUnitForSystem } from './unitEngine';
import type { LengthUnit, UnitSystem, ValidationIssue, ValidationResult } from './types';

// TYPES — options objects for validators (local to this file)
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

// LOGIC — internal builders

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

// EXPORTS — public validators

export function validResult(): ValidationResult {
  return { valid: true, issues: [] };
}

export function invalidResult(issues: ValidationIssue[]): ValidationResult {
  return {
    valid: issues.every((i) => i.severity !== 'error'),
    issues,
  };
}

/**
 * Generic number check — used by length and angle validators.
 * BEGINNER NOTE: `unknown` accepts string OR number from TextInput.
 */
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

/** Combine multiple validators — Workbench uses this heavily. */
export function validateAll(...checks: ValidationResult[]): ValidationResult {
  return mergeResults(...checks);
}

export function getFieldError(result: ValidationResult, field: string): string | undefined {
  return result.issues.find((i) => i.field === field && i.severity === 'error')?.message;
}
