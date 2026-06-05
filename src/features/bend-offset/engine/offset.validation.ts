/**
 * FILE: src/calculators/offset/offset.validation.ts
 *
 * PURPOSE:
 * Checks the Offset Bend input before/while calculation runs.
 *
 * BEGINNER NOTE:
 * Validation is separate from the math so the calculator stays clean.
 * This file answers: "Does the input look reasonable?"
 */

// IMPORTS
import type { BendAngle, OffsetInput, OffsetWarning } from './offset.types';

// =============================================================================
// CONSTANTS — allowed angle values
// =============================================================================

export const VALID_OFFSET_ANGLES: BendAngle[] = [10, 22.5, 30, 45, 60];

// =============================================================================
// VALIDATION FUNCTION
// =============================================================================

/**
 * Returns a list of warnings/errors for the UI.
 * For now these are all displayed as warnings so the screen can still show math.
 */
export function validateOffsetInput(input: OffsetInput): OffsetWarning[] {
  const warnings: OffsetWarning[] = [];

  // Offset height must be a real positive number.
  if (!Number.isFinite(input.offsetHeight) || input.offsetHeight <= 0) {
    warnings.push({
      id: 'invalid-offset-height',
      message: 'Offset height must be greater than 0.',
    });
  }

  // First mark is optional; only validate when the user provided one.
  if (
    input.firstMark !== undefined &&
    (!Number.isFinite(input.firstMark) || input.firstMark < 0)
  ) {
    warnings.push({
      id: 'invalid-first-mark',
      message: 'First mark cannot be negative.',
    });
  }

  // Safety check in case a bad angle gets passed from another screen later.
  if (!VALID_OFFSET_ANGLES.includes(input.bendAngle)) {
    warnings.push({
      id: 'invalid-angle',
      message: 'Selected bend angle is not valid.',
    });
  }

  // Conduit size should exist because later calculators may use it for bender data.
  if (!input.conduitSize) {
    warnings.push({
      id: 'missing-conduit-size',
      message: 'Please select a conduit size.',
    });
  }

  // Large offset warning. This is not a code rule; it is a field practicality warning.
  if (input.unit === 'imperial' && input.offsetHeight > 24) {
    warnings.push({
      id: 'large-offset',
      message: 'This is a large offset. Check if this bend is practical in the field.',
    });
  }

  if (input.unit === 'metric' && input.offsetHeight > 600) {
    warnings.push({
      id: 'large-offset',
      message: 'This is a large offset. Check if this bend is practical in the field.',
    });
  }

  // 60° works, but it is steep and creates more shrink/pull resistance.
  if (input.bendAngle === 60) {
    warnings.push({
      id: 'steep-angle',
      message: '60° is a steep bend. It creates more shrink and may be harder to pull wire through.',
    });
  }

  return warnings;
}

// =============================================================================
// EXPORTS — validateOffsetInput and VALID_OFFSET_ANGLES exported above
// =============================================================================
