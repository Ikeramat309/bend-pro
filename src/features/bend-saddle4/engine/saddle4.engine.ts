/**
 * Pure 4-Point Saddle calculation engine.
 *
 * A 4-point saddle is two offsets back-to-back, forming a flat-topped plateau
 * over the obstruction. Four equal-angle bends: rise, level across, drop.
 *
 * Formulas (per offset uses the standard offset multiplier / shrink table):
 * betweenBends    = obstructionHeight × multiplier      (outer ↔ inner spacing)
 * shrinkToCenter  = obstructionHeight × shrinkPerInch   (one offset, before center)
 * shrink (total)  = 2 × shrinkToCenter                  (whole run shortening)
 * centerMark      = distanceToCenter + shrinkToCenter   (when distance given)
 * innerMark1      = centerMark − saddleWidth / 2
 * innerMark2      = centerMark + saddleWidth / 2
 * outerMark1      = innerMark1 − betweenBends
 * outerMark2      = innerMark2 + betweenBends
 *
 * Angles come from the preset table — not bender-specific.
 */
import { toCanonicalInches } from '@/core/measurements';
import { formatMissingBenderProfileWarning, resolveBenderProfile } from '@/data/benders';
import { formatLength } from '@/utils/formatLength';

import type { Saddle4EngineInput, Saddle4EngineResult } from './saddle4.types';
import { getSaddle4AngleData, isSaddle4Angle } from './saddle4AngleData';
import { SADDLE4_CONFIG } from '../saddle4.config';

function collectWarnings(input: Saddle4EngineInput, outerMark1Inches?: number): string[] {
  const warnings: string[] = [];

  if (!Number.isFinite(input.obstructionHeight) || input.obstructionHeight <= 0) {
    warnings.push('Obstruction height must be greater than 0.');
  }

  if (
    input.saddleWidth !== undefined &&
    (!Number.isFinite(input.saddleWidth) || input.saddleWidth <= 0)
  ) {
    warnings.push('Saddle width must be greater than 0.');
  }

  if (
    input.distanceToCenter !== undefined &&
    (!Number.isFinite(input.distanceToCenter) || input.distanceToCenter < 0)
  ) {
    warnings.push('Distance to center cannot be negative.');
  }

  if (!isSaddle4Angle(input.bendAngle)) {
    warnings.push('Selected bend angle is not valid.');
  }

  if (!input.tradeSize) {
    warnings.push('Please select a conduit size.');
  }

  if (outerMark1Inches !== undefined && outerMark1Inches < 0) {
    warnings.push('Distance to center is too small — the first outer mark falls before the pipe start.');
  }

  if (input.unitSystem === 'imperial' && input.obstructionHeight > 12) {
    warnings.push('This is a tall obstruction. Verify the saddle clears and is practical to bend.');
  }

  if (input.unitSystem === 'metric' && input.obstructionHeight > 300) {
    warnings.push('This is a tall obstruction. Verify the saddle clears and is practical to bend.');
  }

  return warnings;
}

export function calculateSaddle4(input: Saddle4EngineInput): Saddle4EngineResult {
  const { profile: benderProfile, isFallback: isProfileFallback } = resolveBenderProfile(
    input.benderProfileId,
    input.customBenderProfiles ?? [],
  );
  const angle = isSaddle4Angle(input.bendAngle) ? input.bendAngle : SADDLE4_CONFIG.defaultAngle;
  const angleData = getSaddle4AngleData(angle);

  const obstructionHeightInches = toCanonicalInches(input.obstructionHeight || 0, input.unitSystem);
  const hasSaddleWidth =
    input.saddleWidth !== undefined &&
    Number.isFinite(input.saddleWidth) &&
    input.saddleWidth > 0;
  const saddleWidthInches = hasSaddleWidth
    ? toCanonicalInches(input.saddleWidth!, input.unitSystem)
    : undefined;

  const betweenBendsInches = obstructionHeightInches * angleData.multiplier;
  const shrinkToCenterInches = obstructionHeightInches * angleData.shrinkPerInch;
  const shrinkInches = 2 * shrinkToCenterInches;

  const distanceToCenterInches =
    input.distanceToCenter !== undefined
      ? toCanonicalInches(input.distanceToCenter, input.unitSystem)
      : undefined;

  const halfWidthInches =
    saddleWidthInches !== undefined ? saddleWidthInches / 2 : undefined;
  const centerMarkInches =
    distanceToCenterInches !== undefined ? distanceToCenterInches + shrinkToCenterInches : undefined;
  const innerMark1Inches =
    centerMarkInches !== undefined && halfWidthInches !== undefined
      ? centerMarkInches - halfWidthInches
      : undefined;
  const innerMark2Inches =
    centerMarkInches !== undefined && halfWidthInches !== undefined
      ? centerMarkInches + halfWidthInches
      : undefined;
  const outerMark1Inches =
    innerMark1Inches !== undefined ? innerMark1Inches - betweenBendsInches : undefined;
  const outerMark2Inches =
    innerMark2Inches !== undefined ? innerMark2Inches + betweenBendsInches : undefined;

  const warnings = collectWarnings(input, outerMark1Inches);
  if (isProfileFallback) {
    warnings.push(formatMissingBenderProfileWarning(benderProfile.name));
  }

  const isValid =
    Number.isFinite(input.obstructionHeight) &&
    input.obstructionHeight > 0 &&
    isSaddle4Angle(input.bendAngle);

  const fmt = (value: number) => formatLength(value, input.unitSystem, input.roundingPrecision);
  const fmtOpt = (value?: number) => (value !== undefined ? fmt(value) : undefined);

  const obstructionHeightFormatted = fmt(obstructionHeightInches);
  const saddleWidthFormatted = saddleWidthInches !== undefined ? fmt(saddleWidthInches) : undefined;
  const betweenBendsFormatted = fmt(betweenBendsInches);
  const shrinkFormatted = fmt(shrinkInches);
  const centerMarkFormatted = fmtOpt(centerMarkInches);
  const outerMark1Formatted = fmtOpt(outerMark1Inches);
  const innerMark1Formatted = fmtOpt(innerMark1Inches);
  const innerMark2Formatted = fmtOpt(innerMark2Inches);
  const outerMark2Formatted = fmtOpt(outerMark2Inches);

  return {
    obstructionHeight: obstructionHeightInches,
    saddleWidth: saddleWidthInches,
    betweenBends: betweenBendsInches,
    shrink: shrinkInches,
    shrinkToCenter: shrinkToCenterInches,
    centerMark: centerMarkInches,
    outerMark1: outerMark1Inches,
    innerMark1: innerMark1Inches,
    innerMark2: innerMark2Inches,
    outerMark2: outerMark2Inches,
    bendAngle: angle,
    multiplier: angleData.multiplier,
    shrinkPerInch: angleData.shrinkPerInch,
    isValid,
    warnings,
    benderProfileUsed: {
      id: benderProfile.id,
      name: benderProfile.name,
      category: benderProfile.category,
    },
    diagramData: isValid
      ? {
          calculatorType: 'saddle4',
          obstructionHeightInches,
          saddleWidthInches,
          betweenBendsInches,
          shrinkInches,
          centerMarkInches,
          outerMark1Inches,
          innerMark1Inches,
          innerMark2Inches,
          outerMark2Inches,
          bendAngle: angle,
          display: {
            obstructionHeight: obstructionHeightFormatted,
            ...(saddleWidthFormatted ? { saddleWidth: saddleWidthFormatted } : {}),
            betweenBends: betweenBendsFormatted,
            shrink: shrinkFormatted,
            centerMark: centerMarkFormatted,
            outerMark1: outerMark1Formatted,
            innerMark1: innerMark1Formatted,
            innerMark2: innerMark2Formatted,
            outerMark2: outerMark2Formatted,
          },
        }
      : undefined,

    obstructionHeightFormatted,
    saddleWidthFormatted,
    betweenBendsFormatted,
    shrinkFormatted,
    centerMarkFormatted,
    outerMark1Formatted,
    innerMark1Formatted,
    innerMark2Formatted,
    outerMark2Formatted,
  };
}
