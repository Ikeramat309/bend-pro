/**
 * Pure Rolling Offset calculation engine.
 *
 * A rolling offset moves the conduit in two perpendicular directions. The bend
 * is laid out from the true offset — the hypotenuse of the right triangle.
 *
 * Formulas:
 * trueOffset = √(offsetHeight² + advance²)
 * distanceBetweenBends = trueOffset × multiplier
 * shrink = trueOffset × shrinkPerInch
 * mark2 = mark1 + distanceBetweenBends            (when mark 1 given)
 *
 * Multiplier and shrink use the standard offset angle table — not bender-specific.
 */
import { toCanonicalInches } from '@/core/measurements';
import { formatMissingBenderProfileWarning, resolveBenderProfile } from '@/data/benders';
import { formatLength } from '@/utils/formatLength';

import type { RollingEngineInput, RollingEngineResult } from './rolling.types';
import { getRollingAngleData } from './rollingAngleData';

function collectWarnings(input: RollingEngineInput, trueOffsetInches: number): string[] {
  const warnings: string[] = [];

  if (!Number.isFinite(input.offsetHeight) || input.offsetHeight <= 0) {
    warnings.push('Offset height must be greater than 0.');
  }

  if (!Number.isFinite(input.advance) || input.advance <= 0) {
    warnings.push('Offset roll must be greater than 0.');
  }

  if (input.mark1 !== undefined && (!Number.isFinite(input.mark1) || input.mark1 < 0)) {
    warnings.push('Mark 1 cannot be negative.');
  }

  if (!getRollingAngleData(input.bendAngle)) {
    warnings.push('Selected bend angle is not valid.');
  }

  if (!input.tradeSize) {
    warnings.push('Please select a conduit size.');
  }

  if (
    Number.isFinite(input.offsetHeight) &&
    input.offsetHeight > 0 &&
    Number.isFinite(input.advance) &&
    input.advance > 0 &&
    input.advance < input.offsetHeight * 0.05
  ) {
    warnings.push('Offset roll is very small compared to offset height — verify this is a rolling offset.');
  }

  if (input.unitSystem === 'imperial' && trueOffsetInches > 24) {
    warnings.push('This is a large offset. Check if this bend is practical in the field.');
  }

  if (input.unitSystem === 'metric' && trueOffsetInches > 600) {
    warnings.push('This is a large offset. Check if this bend is practical in the field.');
  }

  if (input.bendAngle === 60) {
    warnings.push('60° is a steep bend. It creates more shrink and may be harder to pull wire through.');
  }

  return warnings;
}

export function calculateRolling(input: RollingEngineInput): RollingEngineResult {
  const { profile: benderProfile, isFallback: isProfileFallback } = resolveBenderProfile(
    input.benderProfileId,
    input.customBenderProfiles ?? [],
  );

  const angleInfo = getRollingAngleData(input.bendAngle);
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

  const offsetHeightInches = toCanonicalInches(input.offsetHeight || 0, input.unitSystem);
  const advanceInches = toCanonicalInches(input.advance || 0, input.unitSystem);
  const trueOffsetInches = Math.hypot(offsetHeightInches, advanceInches);

  const spacingInches = trueOffsetInches * effectiveMultiplier;
  const shrinkInches = trueOffsetInches * effectiveShrinkPerInch;

  const mark1Inches =
    input.mark1 !== undefined ? toCanonicalInches(input.mark1, input.unitSystem) : undefined;
  const mark2Inches = mark1Inches !== undefined ? mark1Inches + spacingInches : undefined;

  const isValid =
    Number.isFinite(input.offsetHeight) &&
    input.offsetHeight > 0 &&
    Number.isFinite(input.advance) &&
    input.advance > 0 &&
    angleInfo !== undefined;

  const resolvedWarnings = collectWarnings(input, trueOffsetInches);
  if (isProfileFallback) {
    resolvedWarnings.push(formatMissingBenderProfileWarning(benderProfile.name));
  }

  const fmt = (value: number) => formatLength(value, input.unitSystem, input.roundingPrecision);
  const fmtOpt = (value?: number) => (value !== undefined ? fmt(value) : undefined);

  const offsetHeightFormatted = fmt(offsetHeightInches);
  const advanceFormatted = fmt(advanceInches);
  const trueOffsetFormatted = fmt(trueOffsetInches);
  const distanceBetweenBendsFormatted = fmt(spacingInches);
  const shrinkFormatted = fmt(shrinkInches);
  const mark1Formatted = fmtOpt(mark1Inches);
  const mark2Formatted = fmtOpt(mark2Inches);

  return {
    offsetHeight: offsetHeightInches,
    advance: advanceInches,
    trueOffset: trueOffsetInches,
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
    warnings: resolvedWarnings,
    benderProfileUsed: {
      id: benderProfile.id,
      name: benderProfile.name,
      category: benderProfile.category,
    },
    diagramData: isValid
      ? {
          calculatorType: 'rolling',
          offsetHeightInches,
          advanceInches,
          trueOffsetInches,
          distanceBetweenBendsInches: spacingInches,
          shrinkInches,
          mark1Inches,
          mark2Inches,
          bendAngle: input.bendAngle,
          display: {
            offsetHeight: offsetHeightFormatted,
            advance: advanceFormatted,
            trueOffset: trueOffsetFormatted,
            distanceBetweenBends: distanceBetweenBendsFormatted,
            shrink: shrinkFormatted,
            mark1: mark1Formatted,
            mark2: mark2Formatted,
          },
        }
      : undefined,

    offsetHeightFormatted,
    advanceFormatted,
    trueOffsetFormatted,
    distanceBetweenBendsFormatted,
    shrinkFormatted,
    mark1Formatted,
    mark2Formatted,
  };
}
