/**
 * Pure Offset calculation engine.
 *
 * Formulas:
 * distanceBetweenBends = offsetHeight × multiplier
 * shrink = offsetHeight × shrinkPerInch
 */
import type { BendAngle, UnitSystem } from '@/core/types';
import { getBenderProfile } from '@/data/benders';
import { formatLength } from '@/utils/formatLength';

import type { OffsetEngineInput, OffsetEngineResult } from './offset.types';
import { OFFSET_CONFIG } from '../offset.config';

const MM_PER_INCH = 25.4;

const ANGLE_DATA: Record<BendAngle, { multiplier: number; shrinkPerInch: number }> = {
  10: { multiplier: 6.0, shrinkPerInch: 1 / 16 },
  22.5: { multiplier: 2.6, shrinkPerInch: 3 / 16 },
  30: { multiplier: 2.0, shrinkPerInch: 1 / 4 },
  45: { multiplier: 1.4, shrinkPerInch: 3 / 8 },
  60: { multiplier: 1.2, shrinkPerInch: 1 / 2 },
};

function toInches(value: number, unitSystem: UnitSystem): number {
  return unitSystem === 'metric' ? value / MM_PER_INCH : value;
}

function collectWarnings(input: OffsetEngineInput): string[] {
  const warnings: string[] = [];

  if (!Number.isFinite(input.offsetHeight) || input.offsetHeight <= 0) {
    warnings.push('Offset height must be greater than 0.');
  }

  if (
    input.firstMark !== undefined &&
    (!Number.isFinite(input.firstMark) || input.firstMark < 0)
  ) {
    warnings.push('Mark 1 cannot be negative.');
  }

  if (!OFFSET_CONFIG.validAngles.includes(input.bendAngle as (typeof OFFSET_CONFIG.validAngles)[number])) {
    warnings.push('Selected bend angle is not valid.');
  }

  if (!input.tradeSize) {
    warnings.push('Please select a conduit size.');
  }

  if (input.unitSystem === 'imperial' && input.offsetHeight > 24) {
    warnings.push('This is a large offset. Check if this bend is practical in the field.');
  }

  if (input.unitSystem === 'metric' && input.offsetHeight > 600) {
    warnings.push('This is a large offset. Check if this bend is practical in the field.');
  }

  if (input.bendAngle === 60) {
    warnings.push('60° is a steep bend. It creates more shrink and may be harder to pull wire through.');
  }

  return warnings;
}

export function calculateOffset(input: OffsetEngineInput): OffsetEngineResult {
  const warnings = collectWarnings(input);
  const benderProfile = getBenderProfile(input.benderProfileId);
  const angleInfo = ANGLE_DATA[input.bendAngle];

  const offsetHeightInches = toInches(input.offsetHeight || 0, input.unitSystem);
  const spacingInches = offsetHeightInches * angleInfo.multiplier;
  const shrinkInches = offsetHeightInches * angleInfo.shrinkPerInch;

  const firstMarkInches =
    input.firstMark !== undefined ? toInches(input.firstMark, input.unitSystem) : undefined;
  const secondMarkInches =
    firstMarkInches !== undefined ? firstMarkInches + spacingInches : undefined;

  const isValid = Number.isFinite(input.offsetHeight) && input.offsetHeight > 0;

  return {
    offsetHeight: offsetHeightInches,
    distanceBetweenBends: spacingInches,
    shrink: shrinkInches,
    mark1: firstMarkInches,
    mark2: secondMarkInches,
    bendAngle: input.bendAngle,
    multiplier: angleInfo.multiplier,
    isValid,
    warnings,
    benderProfileUsed: {
      id: benderProfile.id,
      name: benderProfile.name,
      category: benderProfile.category,
    },

    offsetHeightFormatted: formatLength(offsetHeightInches, input.unitSystem, input.roundingPrecision),
    distanceBetweenBendsFormatted: formatLength(spacingInches, input.unitSystem, input.roundingPrecision),
    shrinkFormatted: formatLength(shrinkInches, input.unitSystem, input.roundingPrecision),
    mark1Formatted:
      firstMarkInches !== undefined
        ? formatLength(firstMarkInches, input.unitSystem, input.roundingPrecision)
        : undefined,
    mark2Formatted:
      secondMarkInches !== undefined
        ? formatLength(secondMarkInches, input.unitSystem, input.roundingPrecision)
        : undefined,
  };
}
