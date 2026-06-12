/**
 * Pure Offset calculation engine.
 *
 * Formulas:
 * distanceBetweenBends = offsetHeight × multiplier
 * shrink = offsetHeight × shrinkPerInch
 */
import type { UnitSystem } from '@/core/types';
import { getBenderProfile } from '@/data/benders';
import { formatLength } from '@/utils/formatLength';

import type { OffsetEngineInput, OffsetEngineResult } from './offset.types';
import { getOffsetAngleData } from './offsetAngleData';
import { OFFSET_CONFIG } from '../offset.config';

const MM_PER_INCH = 25.4;

function toInches(value: number, unitSystem: UnitSystem): number {
  return unitSystem === 'metric' ? value / MM_PER_INCH : value;
}

function collectWarnings(input: OffsetEngineInput): string[] {
  const warnings: string[] = [];

  if (!Number.isFinite(input.offsetHeight) || input.offsetHeight <= 0) {
    warnings.push('Offset height must be greater than 0.');
  }

  if (input.mark1 !== undefined && (!Number.isFinite(input.mark1) || input.mark1 < 0)) {
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

  // Guard against angles outside the table (unreachable through the UI,
  // but an unknown angle must produce an invalid result, not a crash).
  const angleInfo = getOffsetAngleData(input.bendAngle);
  const chartMultiplier = angleInfo?.multiplier ?? 0;
  const chartShrinkPerInch = angleInfo?.shrinkPerInch ?? 0;

  const overrideMultiplier =
    input.multiplierOverride !== undefined &&
    Number.isFinite(input.multiplierOverride) &&
    input.multiplierOverride > 0
      ? input.multiplierOverride
      : undefined;
  const isMultiplierOverridden = overrideMultiplier !== undefined;
  const effectiveMultiplier = overrideMultiplier ?? chartMultiplier;

  const overrideShrinkPerInch =
    input.shrinkPerInchOverride !== undefined &&
    Number.isFinite(input.shrinkPerInchOverride) &&
    input.shrinkPerInchOverride > 0
      ? input.shrinkPerInchOverride
      : undefined;
  const isShrinkOverridden = overrideShrinkPerInch !== undefined;
  const effectiveShrinkPerInch = overrideShrinkPerInch ?? chartShrinkPerInch;

  const offsetHeightInches = toInches(input.offsetHeight || 0, input.unitSystem);
  const spacingInches = offsetHeightInches * effectiveMultiplier;
  const shrinkInches = offsetHeightInches * effectiveShrinkPerInch;

  const mark1Inches =
    input.mark1 !== undefined ? toInches(input.mark1, input.unitSystem) : undefined;
  const mark2Inches = mark1Inches !== undefined ? mark1Inches + spacingInches : undefined;

  const isValid =
    Number.isFinite(input.offsetHeight) && input.offsetHeight > 0 && angleInfo !== undefined;

  const offsetHeightFormatted = formatLength(offsetHeightInches, input.unitSystem, input.roundingPrecision);
  const distanceBetweenBendsFormatted = formatLength(spacingInches, input.unitSystem, input.roundingPrecision);
  const shrinkFormatted = formatLength(shrinkInches, input.unitSystem, input.roundingPrecision);
  const mark1Formatted =
    mark1Inches !== undefined
      ? formatLength(mark1Inches, input.unitSystem, input.roundingPrecision)
      : undefined;
  const mark2Formatted =
    mark2Inches !== undefined
      ? formatLength(mark2Inches, input.unitSystem, input.roundingPrecision)
      : undefined;

  return {
    offsetHeight: offsetHeightInches,
    distanceBetweenBends: spacingInches,
    shrink: shrinkInches,
    mark1: mark1Inches,
    mark2: mark2Inches,
    bendAngle: input.bendAngle,
    multiplier: effectiveMultiplier,
    isMultiplierOverridden,
    shrinkPerInch: effectiveShrinkPerInch,
    isShrinkOverridden,
    isValid,
    warnings,
    benderProfileUsed: {
      id: benderProfile.id,
      name: benderProfile.name,
      category: benderProfile.category,
    },
    diagramData: isValid
      ? {
          calculatorType: 'offset',
          offsetHeightInches,
          distanceBetweenBendsInches: spacingInches,
          shrinkInches,
          mark1Inches,
          mark2Inches,
          bendAngle: input.bendAngle,
          display: {
            offsetHeight: offsetHeightFormatted,
            distanceBetweenBends: distanceBetweenBendsFormatted,
            shrink: shrinkFormatted,
            mark1: mark1Formatted,
            mark2: mark2Formatted,
          },
        }
      : undefined,

    offsetHeightFormatted,
    distanceBetweenBendsFormatted,
    shrinkFormatted,
    mark1Formatted,
    mark2Formatted,
  };
}
