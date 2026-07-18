/**
 * Pure Parallel Offsets calculation engine.
 *
 * Conduit field method:
 *   shift per conduit = center-to-center spacing × tan(bend angle ÷ 2)
 *
 * Full-layout offset geometry:
 *   distance between bends = offset height ÷ sin(bend angle)
 *
 * The same longitudinal shift is applied to both bend marks on a conduit, so
 * distance between bends does not change across the rack. This calculator is
 * for equal-size conduit bent with the same shoe radius and bend angle.
 *
 * Worked example: 2" C-C spacing, 30° bends, 4 conduits, 6" offset.
 *   shift = 2 × tan(15°) = 0.5359"
 *   total rack shift = 0.5359 × (4 - 1) = 1.6077"
 *   distance between bends = 6 ÷ sin(30°) = 12"
 */
import { toCanonicalInches } from '@/core/measurements';
import {
  formatMissingBenderProfileWarning,
  resolveBenderProfile,
} from '@/data/benders';
import { formatLength } from '@/utils/formatLength';

import { PARALLEL_OFFSET_CONFIG } from '../parallelOffset.config';
import type {
  ParallelOffsetConduitLayout,
  ParallelOffsetEngineInput,
  ParallelOffsetEngineResult,
  ParallelOffsetMode,
  ParallelOffsetShiftDirection,
} from './parallelOffset.types';

function isMode(value: unknown): value is ParallelOffsetMode {
  return value === 'simple' || value === 'layout';
}

function isDirection(value: unknown): value is ParallelOffsetShiftDirection {
  return value === 'toward-free-end' || value === 'away-from-free-end';
}

function isValidAngle(value: number): boolean {
  return (PARALLEL_OFFSET_CONFIG.validAngles as readonly number[]).includes(value);
}

function format(
  inches: number,
  input: Pick<ParallelOffsetEngineInput, 'unitSystem' | 'roundingPrecision'>,
): string {
  return formatLength(inches, input.unitSystem, input.roundingPrecision);
}

function collectWarnings(input: ParallelOffsetEngineInput): string[] {
  const warnings: string[] = [];
  if (!isMode(input.mode)) warnings.push('Selected parallel-offset mode is not valid.');
  if (!Number.isFinite(input.centerSpacing) || input.centerSpacing <= 0) {
    warnings.push('Center-to-center spacing must be greater than 0.');
  }
  if (!isValidAngle(input.bendAngle)) warnings.push('Selected bend angle is not valid.');
  if (input.conduitType !== 'EMT') warnings.push('Parallel Offsets currently supports EMT only.');
  if (!input.tradeSize) warnings.push('Please select a conduit size.');

  if (input.mode === 'layout') {
    if (!Number.isFinite(input.offsetHeight) || (input.offsetHeight ?? 0) <= 0) {
      warnings.push('Offset height must be greater than 0 for a full layout.');
    }
    if (
      !Number.isInteger(input.conduitCount) ||
      (input.conduitCount ?? 0) < PARALLEL_OFFSET_CONFIG.minConduitCount ||
      (input.conduitCount ?? 0) > PARALLEL_OFFSET_CONFIG.maxConduitCount
    ) {
      warnings.push(
        `Conduit count must be a whole number from ${PARALLEL_OFFSET_CONFIG.minConduitCount} to ${PARALLEL_OFFSET_CONFIG.maxConduitCount}.`,
      );
    }
    if (!isDirection(input.shiftDirection)) {
      warnings.push('Choose whether the outer conduit marks move toward or away from the free end.');
    }
    if (input.baseMark !== undefined && (!Number.isFinite(input.baseMark) || input.baseMark < 0)) {
      warnings.push('Pipe 1 Mark 1 cannot be negative.');
    }
  }

  if (input.bendAngle === 60) {
    warnings.push('60° is a steep offset. Keep every conduit at the same angle and shoe radius.');
  }
  if (input.unitSystem === 'imperial' && input.centerSpacing > 12) {
    warnings.push('This is unusually wide conduit spacing. Confirm the center-to-center measurement.');
  }
  if (input.unitSystem === 'metric' && input.centerSpacing > 300) {
    warnings.push('This is unusually wide conduit spacing. Confirm the center-to-center measurement.');
  }
  return warnings;
}

export function calculateParallelOffset(
  input: ParallelOffsetEngineInput,
): ParallelOffsetEngineResult {
  const warnings = collectWarnings(input);
  const { profile: benderProfile, isFallback } = resolveBenderProfile(
    input.benderProfileId,
    input.customBenderProfiles ?? [],
  );
  if (isFallback) warnings.push(formatMissingBenderProfileWarning(benderProfile.name));
  const angleRadians = (input.bendAngle * Math.PI) / 180;
  const adjustmentFactor = Math.tan(angleRadians / 2);
  const centerSpacingInches = toCanonicalInches(
    Number.isFinite(input.centerSpacing) ? input.centerSpacing : 0,
    input.unitSystem,
  );
  const calculatedAdjustmentPerConduit = centerSpacingInches * adjustmentFactor;

  const mode = isMode(input.mode) ? input.mode : PARALLEL_OFFSET_CONFIG.defaultMode;
  const shiftDirection = isDirection(input.shiftDirection)
    ? input.shiftDirection
    : PARALLEL_OFFSET_CONFIG.defaultShiftDirection;
  const requestedCount = input.conduitCount ?? PARALLEL_OFFSET_CONFIG.defaultConduitCount;
  const conduitCount =
    mode === 'layout' && Number.isInteger(requestedCount)
      ? Math.min(
          Math.max(requestedCount, PARALLEL_OFFSET_CONFIG.minConduitCount),
          PARALLEL_OFFSET_CONFIG.maxConduitCount,
        )
      : PARALLEL_OFFSET_CONFIG.defaultConduitCount;
  const calculatedTotalRackShift = calculatedAdjustmentPerConduit * (conduitCount - 1);

  const offsetHeightInches =
    mode === 'layout' && input.offsetHeight !== undefined && Number.isFinite(input.offsetHeight)
      ? toCanonicalInches(input.offsetHeight, input.unitSystem)
      : undefined;
  const calculatedDistanceBetweenBends =
    offsetHeightInches !== undefined && offsetHeightInches > 0 && isValidAngle(input.bendAngle)
      ? offsetHeightInches / Math.sin(angleRadians)
      : undefined;
  const derivedValuesAreFinite =
    Number.isFinite(calculatedAdjustmentPerConduit) &&
    Number.isFinite(calculatedTotalRackShift) &&
    (mode === 'simple' || Number.isFinite(calculatedDistanceBetweenBends));
  if (!derivedValuesAreFinite) {
    warnings.push('Calculated parallel layout is outside the supported numeric range.');
  }
  const adjustmentPerConduit = derivedValuesAreFinite ? calculatedAdjustmentPerConduit : 0;
  const totalRackShift = derivedValuesAreFinite ? calculatedTotalRackShift : 0;
  const distanceBetweenBends =
    derivedValuesAreFinite && calculatedDistanceBetweenBends !== undefined
      ? calculatedDistanceBetweenBends
      : undefined;
  const baseMarkInches =
    mode === 'layout' && input.baseMark !== undefined && Number.isFinite(input.baseMark)
      ? toCanonicalInches(input.baseMark, input.unitSystem)
      : undefined;
  const sign = shiftDirection === 'toward-free-end' ? -1 : 1;

  let absoluteMarksFit = true;
  let generatedMarksAreFinite = true;
  const conduits: ParallelOffsetConduitLayout[] = Array.from(
    { length: mode === 'layout' ? conduitCount : 0 },
    (_, index) => {
      const cumulativeShift = adjustmentPerConduit * index;
      const signedShift = sign * cumulativeShift;
      const candidateMark1 = baseMarkInches !== undefined ? baseMarkInches + signedShift : undefined;
      const mark1 =
        candidateMark1 !== undefined && Number.isFinite(candidateMark1) && candidateMark1 >= 0
          ? candidateMark1
          : undefined;
      if (candidateMark1 !== undefined && (!Number.isFinite(candidateMark1) || candidateMark1 < 0)) {
        absoluteMarksFit = false;
        if (!Number.isFinite(candidateMark1)) generatedMarksAreFinite = false;
      }
      const candidateMark2 =
        mark1 !== undefined && distanceBetweenBends !== undefined
          ? mark1 + distanceBetweenBends
          : undefined;
      const mark2 =
        candidateMark2 === undefined || Number.isFinite(candidateMark2)
          ? candidateMark2
          : undefined;
      if (candidateMark2 !== undefined && !Number.isFinite(candidateMark2)) {
        generatedMarksAreFinite = false;
      }

      return {
        conduitNumber: index + 1,
        cumulativeShift,
        signedShift,
        mark1,
        mark2,
        display: {
          cumulativeShift: format(cumulativeShift, input),
          mark1: mark1 !== undefined ? format(mark1, input) : undefined,
          mark2: mark2 !== undefined ? format(mark2, input) : undefined,
        },
      };
    },
  );

  if (!absoluteMarksFit && generatedMarksAreFinite) {
    warnings.push(
      'Pipe 1 Mark 1 is too close to the free end for this direction. Relative shifts are shown; negative absolute marks are omitted.',
    );
  }

  const isValid =
    isMode(input.mode) &&
    Number.isFinite(input.centerSpacing) &&
    input.centerSpacing > 0 &&
    isValidAngle(input.bendAngle) &&
    input.conduitType === 'EMT' &&
    Boolean(input.tradeSize) &&
    derivedValuesAreFinite &&
    generatedMarksAreFinite &&
    (mode === 'simple' ||
      (offsetHeightInches !== undefined &&
        offsetHeightInches > 0 &&
        Number.isInteger(input.conduitCount) &&
        (input.conduitCount ?? 0) >= PARALLEL_OFFSET_CONFIG.minConduitCount &&
        (input.conduitCount ?? 0) <= PARALLEL_OFFSET_CONFIG.maxConduitCount &&
        isDirection(input.shiftDirection)));

  const centerSpacingFormatted = format(centerSpacingInches, input);
  const adjustmentPerConduitFormatted = format(adjustmentPerConduit, input);
  const totalRackShiftFormatted = format(totalRackShift, input);
  const offsetHeightFormatted =
    offsetHeightInches !== undefined ? format(offsetHeightInches, input) : undefined;
  const distanceBetweenBendsFormatted =
    distanceBetweenBends !== undefined ? format(distanceBetweenBends, input) : undefined;

  return {
    mode,
    bendAngle: input.bendAngle,
    centerSpacing: centerSpacingInches,
    adjustmentFactor,
    adjustmentPerConduit,
    totalRackShift,
    offsetHeight: offsetHeightInches,
    distanceBetweenBends,
    conduitCount,
    shiftDirection,
    conduits,
    isValid,
    warnings,
    benderProfileUsed: {
      id: benderProfile.id,
      name: benderProfile.name,
      category: benderProfile.category,
    },
    diagramData: isValid
      ? {
          calculatorType: 'parallel-offset',
          mode,
          bendAngle: input.bendAngle,
          centerSpacingInches,
          adjustmentPerConduitInches: adjustmentPerConduit,
          totalRackShiftInches: totalRackShift,
          offsetHeightInches,
          distanceBetweenBendsInches: distanceBetweenBends,
          conduitCount,
          shiftDirection,
          conduits,
          display: {
            centerSpacing: centerSpacingFormatted,
            adjustmentPerConduit: adjustmentPerConduitFormatted,
            totalRackShift: totalRackShiftFormatted,
            offsetHeight: offsetHeightFormatted,
            distanceBetweenBends: distanceBetweenBendsFormatted,
          },
        }
      : undefined,
    centerSpacingFormatted,
    adjustmentPerConduitFormatted,
    totalRackShiftFormatted,
    offsetHeightFormatted,
    distanceBetweenBendsFormatted,
  };
}
