/**
 * Pure 3-Point Saddle calculation engine.
 *
 * Formulas (standard field layout):
 * centerToSide = obstructionHeight × centerToSideMultiplier
 * shrink = obstructionHeight × shrinkPerInch
 * centerMark = distanceToCenter + shrink            (when distance given)
 * sideMark1 = centerMark − centerToSide
 * sideMark2 = centerMark + centerToSide
 *
 * Bend order: center at centerAngle toward obstruction, each side at sideAngle
 * back to level. Angles come from the preset table — not bender-specific.
 */
import { toCanonicalInches } from '@/core/measurements';
import { formatMissingBenderProfileWarning, resolveBenderProfile } from '@/data/benders';
import { formatLength } from '@/utils/formatLength';

import type { Saddle3EngineInput, Saddle3EngineResult } from './saddle3.types';
import { getSaddle3AngleData, isSaddle3AnglePreset } from './saddle3AngleData';
import { SADDLE3_CONFIG } from '../saddle3.config';

function collectWarnings(input: Saddle3EngineInput): string[] {
  const warnings: string[] = [];

  if (!Number.isFinite(input.obstructionHeight) || input.obstructionHeight <= 0) {
    warnings.push('Obstruction height must be greater than 0.');
  }

  if (
    input.distanceToCenter !== undefined &&
    (!Number.isFinite(input.distanceToCenter) || input.distanceToCenter < 0)
  ) {
    warnings.push('Distance to center cannot be negative.');
  }

  if (!isSaddle3AnglePreset(input.anglePreset)) {
    warnings.push('Selected saddle angle preset is not valid.');
  }

  if (!input.tradeSize) {
    warnings.push('Please select a conduit size.');
  }

  if (input.unitSystem === 'imperial' && input.obstructionHeight > 12) {
    warnings.push('This is a tall obstruction. Verify the saddle clears and is practical to bend.');
  }

  if (input.unitSystem === 'metric' && input.obstructionHeight > 300) {
    warnings.push('This is a tall obstruction. Verify the saddle clears and is practical to bend.');
  }

  return warnings;
}

export function calculateSaddle3(input: Saddle3EngineInput): Saddle3EngineResult {
  const warnings = collectWarnings(input);
  const { profile: benderProfile, isFallback: isProfileFallback } = resolveBenderProfile(
    input.benderProfileId,
    input.customBenderProfiles ?? [],
  );
  if (isProfileFallback) {
    warnings.push(formatMissingBenderProfileWarning(benderProfile.name));
  }
  const preset = isSaddle3AnglePreset(input.anglePreset)
    ? input.anglePreset
    : SADDLE3_CONFIG.defaultPreset;
  const angleData = getSaddle3AngleData(preset);

  const obstructionHeightInches = toCanonicalInches(input.obstructionHeight || 0, input.unitSystem);
  const centerToSideInches = obstructionHeightInches * angleData.centerToSideMultiplier;
  const shrinkInches = obstructionHeightInches * angleData.shrinkPerInch;

  const distanceToCenterInches =
    input.distanceToCenter !== undefined
      ? toCanonicalInches(input.distanceToCenter, input.unitSystem)
      : undefined;

  const centerMarkInches =
    distanceToCenterInches !== undefined ? distanceToCenterInches + shrinkInches : undefined;
  const sideMark1Inches =
    centerMarkInches !== undefined ? centerMarkInches - centerToSideInches : undefined;
  const sideMark2Inches =
    centerMarkInches !== undefined ? centerMarkInches + centerToSideInches : undefined;

  const isValid =
    Number.isFinite(input.obstructionHeight) &&
    input.obstructionHeight > 0 &&
    isSaddle3AnglePreset(input.anglePreset);

  const obstructionHeightFormatted = formatLength(
    obstructionHeightInches,
    input.unitSystem,
    input.roundingPrecision,
  );
  const centerToSideFormatted = formatLength(
    centerToSideInches,
    input.unitSystem,
    input.roundingPrecision,
  );
  const shrinkFormatted = formatLength(shrinkInches, input.unitSystem, input.roundingPrecision);
  const centerMarkFormatted =
    centerMarkInches !== undefined
      ? formatLength(centerMarkInches, input.unitSystem, input.roundingPrecision)
      : undefined;
  const sideMark1Formatted =
    sideMark1Inches !== undefined
      ? formatLength(sideMark1Inches, input.unitSystem, input.roundingPrecision)
      : undefined;
  const sideMark2Formatted =
    sideMark2Inches !== undefined
      ? formatLength(sideMark2Inches, input.unitSystem, input.roundingPrecision)
      : undefined;

  return {
    obstructionHeight: obstructionHeightInches,
    centerToSide: centerToSideInches,
    shrink: shrinkInches,
    centerMark: centerMarkInches,
    sideMark1: sideMark1Inches,
    sideMark2: sideMark2Inches,
    sideAngle: angleData.sideAngle,
    centerAngle: angleData.centerAngle,
    anglePreset: preset,
    isValid,
    warnings,
    benderProfileUsed: {
      id: benderProfile.id,
      name: benderProfile.name,
      category: benderProfile.category,
    },
    diagramData: isValid
      ? {
          calculatorType: 'saddle3',
          obstructionHeightInches,
          centerToSideInches,
          shrinkInches,
          centerMarkInches,
          sideMark1Inches,
          sideMark2Inches,
          sideAngle: angleData.sideAngle,
          centerAngle: angleData.centerAngle,
          display: {
            obstructionHeight: obstructionHeightFormatted,
            centerToSide: centerToSideFormatted,
            shrink: shrinkFormatted,
            centerMark: centerMarkFormatted,
            sideMark1: sideMark1Formatted,
            sideMark2: sideMark2Formatted,
          },
        }
      : undefined,

    obstructionHeightFormatted,
    centerToSideFormatted,
    shrinkFormatted,
    centerMarkFormatted,
    sideMark1Formatted,
    sideMark2Formatted,
  };
}
