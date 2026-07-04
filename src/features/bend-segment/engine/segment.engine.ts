/**
 * Pure Segment Bend calculation engine.
 *
 * A segment bend approximates an arc (radius R, total angle Θ) with N equal
 * "shots" of α° each, spaced evenly along the conduit.
 *
 * Formulas:
 * numberOfBends N  = round(totalAngle / requestedDegreesPerBend)   (min 1)
 * degreesPerBend α = totalAngle / N                                (closes Θ exactly)
 * spacing S        = (π / 180) × radius × α                        (arc length per shot)
 * developedLength  = (π / 180) × radius × totalAngle = N × S       (conduit consumed)
 *
 * Marks are staggered a half-space (S/2) in from each end of the bend group,
 * so the arc is centered: mark i (1-based) = startOffset + (i − 0.5) × S.
 *
 * This is geometric — radius and angle only. It does not depend on the bender
 * shoe, so no deduct/take-up is applied.
 */
import { toCanonicalInches } from '@/core/measurements';
import { formatMissingBenderProfileWarning, resolveBenderProfile } from '@/data/benders';
import { formatLength } from '@/utils/formatLength';

import type { SegmentEngineInput, SegmentEngineResult } from './segment.types';

const DEG_TO_RAD = Math.PI / 180;

/** Trim trailing zeros from a degree value for display (e.g. 10, 12.5, 7.5). */
function formatDegrees(value: number): string {
  const rounded = Math.round(value * 10) / 10;
  const text = Number.isInteger(rounded) ? String(rounded) : rounded.toFixed(1);
  return `${text}°`;
}

function collectWarnings(
  input: SegmentEngineInput,
  numberOfBends: number,
  effectiveDegreesPerBend: number,
): string[] {
  const warnings: string[] = [];

  if (!Number.isFinite(input.radius) || input.radius <= 0) {
    warnings.push('Radius must be greater than 0.');
  }

  if (!Number.isFinite(input.totalAngle) || input.totalAngle <= 0) {
    warnings.push('Total angle must be greater than 0.');
  }

  if (!Number.isFinite(input.degreesPerBend) || input.degreesPerBend <= 0) {
    warnings.push('Degrees per bend must be greater than 0.');
  }

  if (
    input.startOffset !== undefined &&
    (!Number.isFinite(input.startOffset) || input.startOffset < 0)
  ) {
    warnings.push('Start of bend cannot be negative.');
  }

  // Fitting to a whole number of shots changed the angle per shot.
  if (
    Number.isFinite(input.degreesPerBend) &&
    input.degreesPerBend > 0 &&
    Number.isFinite(input.totalAngle) &&
    input.totalAngle > 0 &&
    Math.abs(effectiveDegreesPerBend - input.degreesPerBend) > 0.05
  ) {
    warnings.push(
      `Adjusted to ${numberOfBends} bends at ${formatDegrees(effectiveDegreesPerBend)} each to complete ${formatDegrees(input.totalAngle)} exactly.`,
    );
  }

  if (numberOfBends > 40) {
    warnings.push('That is a lot of shots. Consider a larger degrees-per-bend to speed up the bend.');
  }

  if (Number.isFinite(input.totalAngle) && input.totalAngle > 120) {
    warnings.push('Large total angle — verify this segment bend is practical for your run.');
  }

  if (!input.tradeSize) {
    warnings.push('Please select a conduit size.');
  }

  return warnings;
}

export function calculateSegment(input: SegmentEngineInput): SegmentEngineResult {
  const { profile: benderProfile, isFallback: isProfileFallback } = resolveBenderProfile(
    input.benderProfileId,
    input.customBenderProfiles ?? [],
  );

  const radiusInches = toCanonicalInches(input.radius || 0, input.unitSystem);
  const totalAngle = input.totalAngle || 0;
  const requestedDegreesPerBend = input.degreesPerBend || 0;

  const inputsPositive =
    radiusInches > 0 && totalAngle > 0 && requestedDegreesPerBend > 0;

  const numberOfBends = inputsPositive
    ? Math.max(1, Math.round(totalAngle / requestedDegreesPerBend))
    : 0;
  const degreesPerBend = numberOfBends > 0 ? totalAngle / numberOfBends : 0;

  const spacingInches = radiusInches * degreesPerBend * DEG_TO_RAD;
  const developedLengthInches = radiusInches * totalAngle * DEG_TO_RAD;

  const startOffsetInches =
    input.startOffset !== undefined ? toCanonicalInches(input.startOffset, input.unitSystem) : undefined;

  const marksInches =
    inputsPositive && startOffsetInches !== undefined
      ? Array.from({ length: numberOfBends }, (_, i) => startOffsetInches + (i + 0.5) * spacingInches)
      : undefined;
  const firstMarkInches = marksInches?.[0];
  const lastMarkInches = marksInches ? marksInches[marksInches.length - 1] : undefined;

  const warnings = collectWarnings(input, numberOfBends, degreesPerBend);
  if (isProfileFallback) {
    warnings.push(formatMissingBenderProfileWarning(benderProfile.name));
  }
  const isValid = inputsPositive;

  const fmt = (value: number) => formatLength(value, input.unitSystem, input.roundingPrecision);
  const fmtOpt = (value?: number) => (value !== undefined ? fmt(value) : undefined);

  const radiusFormatted = fmt(radiusInches);
  const totalAngleFormatted = formatDegrees(totalAngle);
  const numberOfBendsFormatted = String(numberOfBends);
  const degreesPerBendFormatted = formatDegrees(degreesPerBend);
  const spacingFormatted = fmt(spacingInches);
  const developedLengthFormatted = fmt(developedLengthInches);
  const firstMarkFormatted = fmtOpt(firstMarkInches);
  const lastMarkFormatted = fmtOpt(lastMarkInches);

  return {
    radius: radiusInches,
    totalAngle,
    numberOfBends,
    degreesPerBend,
    requestedDegreesPerBend,
    spacing: spacingInches,
    developedLength: developedLengthInches,
    startOffset: startOffsetInches,
    firstMark: firstMarkInches,
    lastMark: lastMarkInches,
    marks: marksInches,
    isValid,
    warnings,
    benderProfileUsed: {
      id: benderProfile.id,
      name: benderProfile.name,
      category: benderProfile.category,
    },
    diagramData: isValid
      ? {
          calculatorType: 'segment',
          radiusInches,
          totalAngle,
          numberOfBends,
          degreesPerBend,
          spacingInches,
          developedLengthInches,
          startOffsetInches,
          marksInches,
          display: {
            radius: radiusFormatted,
            totalAngle: totalAngleFormatted,
            numberOfBends: numberOfBendsFormatted,
            degreesPerBend: degreesPerBendFormatted,
            spacing: spacingFormatted,
            developedLength: developedLengthFormatted,
            firstMark: firstMarkFormatted,
            lastMark: lastMarkFormatted,
          },
        }
      : undefined,

    radiusFormatted,
    totalAngleFormatted,
    numberOfBendsFormatted,
    degreesPerBendFormatted,
    spacingFormatted,
    developedLengthFormatted,
    firstMarkFormatted,
    lastMarkFormatted,
  };
}
