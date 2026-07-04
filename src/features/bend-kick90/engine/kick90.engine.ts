/**
 * Pure Kick 90 calculation engine.
 *
 * A kick is a small-angle bend laid out from a 90° bend reference using the
 * standard offset multiplier method on the kick rise.
 *
 * Formulas:
 * distanceBetweenBends = kickRise × multiplier
 * shrink = kickRise × shrinkPerInch
 * mark2 = mark1 + distanceBetweenBends            (when mark 1 given)
 *
 * Multiplier and shrink use the standard offset angle table — not bender-specific.
 */
import { toCanonicalInches } from '@/core/measurements';
import { formatMissingBenderProfileWarning, resolveBenderProfile } from '@/data/benders';
import { formatLength } from '@/utils/formatLength';

import type { Kick90EngineInput, Kick90EngineResult } from './kick90.types';
import { getKick90AngleData } from './kick90AngleData';

function collectWarnings(input: Kick90EngineInput, kickRiseInches: number): string[] {
  const warnings: string[] = [];

  if (!Number.isFinite(input.kickRise) || input.kickRise <= 0) {
    warnings.push('Kick rise must be greater than 0.');
  }

  if (input.mark1 !== undefined && (!Number.isFinite(input.mark1) || input.mark1 < 0)) {
    warnings.push('Mark 1 cannot be negative.');
  }

  if (!getKick90AngleData(input.bendAngle)) {
    warnings.push('Selected bend angle is not valid.');
  }

  if (!input.tradeSize) {
    warnings.push('Please select a conduit size.');
  }

  if (input.unitSystem === 'imperial' && kickRiseInches > 24) {
    warnings.push('This is a large kick. Check if this bend is practical in the field.');
  }

  if (input.unitSystem === 'metric' && kickRiseInches > 600) {
    warnings.push('This is a large kick. Check if this bend is practical in the field.');
  }

  if (input.bendAngle === 60) {
    warnings.push('60° is a steep bend. It creates more shrink and may be harder to pull wire through.');
  }

  return warnings;
}

export function calculateKick90(input: Kick90EngineInput): Kick90EngineResult {
  const { profile: benderProfile, isFallback: isProfileFallback } = resolveBenderProfile(
    input.benderProfileId,
    input.customBenderProfiles ?? [],
  );

  const angleInfo = getKick90AngleData(input.bendAngle);
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

  const kickRiseInches = toCanonicalInches(input.kickRise || 0, input.unitSystem);
  const spacingInches = kickRiseInches * effectiveMultiplier;
  const shrinkInches = kickRiseInches * effectiveShrinkPerInch;

  const mark1Inches =
    input.mark1 !== undefined ? toCanonicalInches(input.mark1, input.unitSystem) : undefined;
  const mark2Inches = mark1Inches !== undefined ? mark1Inches + spacingInches : undefined;

  const isValid = Number.isFinite(input.kickRise) && input.kickRise > 0 && angleInfo !== undefined;

  const resolvedWarnings = collectWarnings(input, kickRiseInches);
  if (isProfileFallback) {
    resolvedWarnings.push(formatMissingBenderProfileWarning(benderProfile.name));
  }

  const fmt = (value: number) => formatLength(value, input.unitSystem, input.roundingPrecision);
  const fmtOpt = (value?: number) => (value !== undefined ? fmt(value) : undefined);

  const kickRiseFormatted = fmt(kickRiseInches);
  const distanceBetweenBendsFormatted = fmt(spacingInches);
  const shrinkFormatted = fmt(shrinkInches);
  const mark1Formatted = fmtOpt(mark1Inches);
  const mark2Formatted = fmtOpt(mark2Inches);

  return {
    kickRise: kickRiseInches,
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
          calculatorType: 'kick90',
          kickRiseInches,
          distanceBetweenBendsInches: spacingInches,
          shrinkInches,
          mark1Inches,
          mark2Inches,
          bendAngle: input.bendAngle,
          display: {
            kickRise: kickRiseFormatted,
            distanceBetweenBends: distanceBetweenBendsFormatted,
            shrink: shrinkFormatted,
            mark1: mark1Formatted,
            mark2: mark2Formatted,
          },
        }
      : undefined,

    kickRiseFormatted,
    distanceBetweenBendsFormatted,
    shrinkFormatted,
    mark1Formatted,
    mark2Formatted,
  };
}
