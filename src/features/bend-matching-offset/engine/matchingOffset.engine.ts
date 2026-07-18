/**
 * Pure Matching Offset calculation engine.
 *
 * Both modes solve the same right triangle measured between bend centers:
 *
 * Match Centers:
 *   bendAngle = atan(offsetHeight / adjacent)
 *   distanceBetweenBends = hypot(offsetHeight, adjacent)
 *
 * Match Bends:
 *   bendAngle = asin(offsetHeight / referenceDistanceBetweenBends)
 *   adjacent = sqrt(referenceDistanceBetweenBends² - offsetHeight²)
 *
 * Both:
 *   shrink = distanceBetweenBends - adjacent
 *          = offsetHeight × tan(bendAngle / 2)
 *
 * These are centerline/cosecant formulas. Bender radius, springback, and
 * manufacturer chart corrections are intentionally not applied.
 */
import { toCanonicalInches } from '@/core/measurements';
import {
  formatMissingBenderProfileWarning,
  resolveBenderProfile,
} from '@/data/benders';
import { formatLength } from '@/utils/formatLength';

import { MATCHING_OFFSET_CONFIG } from '../matchingOffset.config';
import type {
  MatchingOffsetEngineInput,
  MatchingOffsetEngineResult,
  MatchingOffsetMode,
} from './matchingOffset.types';

const RAD_TO_DEG = 180 / Math.PI;
const DEG_TO_RAD = Math.PI / 180;
const ANGLE_EPSILON = 1e-9;
const COMMON_ANGLE_EPSILON = 1e-7;

function isMatchingOffsetMode(value: unknown): value is MatchingOffsetMode {
  return value === 'centers' || value === 'bends';
}

export function formatMatchingOffsetAngle(angleDegrees: number): string {
  if (!Number.isFinite(angleDegrees) || angleDegrees <= 0) {
    return '—';
  }
  const digits = angleDegrees < 10 ? 2 : 1;
  return `${Number(angleDegrees.toFixed(digits))}°`;
}

function nearestCommonFieldAngle(angleDegrees: number): number {
  return MATCHING_OFFSET_CONFIG.commonFieldAnglesDegrees.reduce((nearest, candidate) =>
    Math.abs(candidate - angleDegrees) < Math.abs(nearest - angleDegrees)
      ? candidate
      : nearest,
  );
}

function collectBasicWarnings(input: MatchingOffsetEngineInput): string[] {
  const warnings: string[] = [];

  if (!isMatchingOffsetMode(input.mode)) {
    warnings.push('Select how you want to match the offset.');
  }
  if (!Number.isFinite(input.offsetHeight) || input.offsetHeight <= 0) {
    warnings.push('Offset height must be greater than 0.');
  }
  if (input.mode === 'centers' && (!Number.isFinite(input.adjacent) || input.adjacent <= 0)) {
    warnings.push('Adjacent distance must be greater than 0.');
  }
  if (
    input.mode === 'bends' &&
    (!Number.isFinite(input.referenceDistanceBetweenBends) ||
      input.referenceDistanceBetweenBends <= 0)
  ) {
    warnings.push('Reference distance between bends must be greater than 0.');
  }
  if (input.conduitType !== 'EMT') {
    warnings.push('Matching Offset currently supports EMT only.');
  }
  if (!input.tradeSize) {
    warnings.push('Please select a conduit size.');
  }

  const largeOffsetLimit = input.unitSystem === 'metric' ? 600 : 24;
  if (Number.isFinite(input.offsetHeight) && input.offsetHeight > largeOffsetLimit) {
    warnings.push('This is a large offset. Check that the bend is practical in the field.');
  }

  return warnings;
}

export function calculateMatchingOffset(
  input: MatchingOffsetEngineInput,
): MatchingOffsetEngineResult {
  const warnings = collectBasicWarnings(input);
  const { profile: benderProfile, isFallback } = resolveBenderProfile(
    input.benderProfileId,
    input.customBenderProfiles ?? [],
  );
  if (isFallback) {
    warnings.push(formatMissingBenderProfileWarning(benderProfile.name));
  }

  const offsetHeightInches = toCanonicalInches(
    Number.isFinite(input.offsetHeight) ? input.offsetHeight : 0,
    input.unitSystem,
  );

  let distanceBetweenBendsInches = 0;
  let adjacentInches = 0;
  let bendAngleDegrees = 0;
  let hasSolvableTriangle = offsetHeightInches > 0;

  if (input.mode === 'centers') {
    adjacentInches = toCanonicalInches(
      Number.isFinite(input.adjacent) ? input.adjacent : 0,
      input.unitSystem,
    );
    hasSolvableTriangle = hasSolvableTriangle && adjacentInches > 0;
    if (hasSolvableTriangle) {
      distanceBetweenBendsInches = Math.hypot(offsetHeightInches, adjacentInches);
      bendAngleDegrees = Math.atan2(offsetHeightInches, adjacentInches) * RAD_TO_DEG;
    }
  } else if (input.mode === 'bends') {
    distanceBetweenBendsInches = toCanonicalInches(
      Number.isFinite(input.referenceDistanceBetweenBends)
        ? input.referenceDistanceBetweenBends
        : 0,
      input.unitSystem,
    );
    if (offsetHeightInches >= distanceBetweenBendsInches && distanceBetweenBendsInches > 0) {
      warnings.push('Offset height must be less than the reference distance between bends.');
      hasSolvableTriangle = false;
    } else {
      hasSolvableTriangle = hasSolvableTriangle && distanceBetweenBendsInches > 0;
    }
    if (hasSolvableTriangle) {
      const ratio = offsetHeightInches / distanceBetweenBendsInches;
      bendAngleDegrees = Math.asin(Math.min(1, Math.max(-1, ratio))) * RAD_TO_DEG;
      adjacentInches = Math.sqrt(
        Math.max(
          0,
          distanceBetweenBendsInches ** 2 - offsetHeightInches ** 2,
        ),
      );
    }
  } else {
    hasSolvableTriangle = false;
  }

  if (
    hasSolvableTriangle &&
    bendAngleDegrees > MATCHING_OFFSET_CONFIG.maximumOffsetAngleDegrees + ANGLE_EPSILON
  ) {
    warnings.push(
      `Calculated bend angle is greater than ${MATCHING_OFFSET_CONFIG.maximumOffsetAngleDegrees}°. Increase the center distance or reduce the offset height.`,
    );
    hasSolvableTriangle = false;
  }
  if (
    hasSolvableTriangle &&
    bendAngleDegrees < MATCHING_OFFSET_CONFIG.shallowAngleWarningDegrees
  ) {
    warnings.push('This is a very shallow bend. Use a protractor and verify both bend centers.');
  }
  if (
    hasSolvableTriangle &&
    bendAngleDegrees > MATCHING_OFFSET_CONFIG.steepAngleWarningDegrees
  ) {
    warnings.push('This is a steep offset. Expect more shrink and a harder wire pull.');
  }

  const nearestCommonAngleDegrees = nearestCommonFieldAngle(bendAngleDegrees);
  const isCommonAngle =
    hasSolvableTriangle &&
    Math.abs(bendAngleDegrees - nearestCommonAngleDegrees) <= COMMON_ANGLE_EPSILON;
  if (hasSolvableTriangle && !isCommonAngle) {
    warnings.push(
      `Exact ${formatMatchingOffsetAngle(bendAngleDegrees)} match needs an angle tool and a calibrated bend-center reference. Do not round to ${formatMatchingOffsetAngle(nearestCommonAngleDegrees)}.`,
    );
  }

  const shrinkInches = hasSolvableTriangle
    ? Math.max(0, distanceBetweenBendsInches - adjacentInches)
    : 0;
  const multiplier = hasSolvableTriangle
    ? distanceBetweenBendsInches / offsetHeightInches
    : 0;
  const shrinkPerInch = hasSolvableTriangle ? shrinkInches / offsetHeightInches : 0;
  const isValid =
    hasSolvableTriangle &&
    input.conduitType === 'EMT' &&
    Boolean(input.tradeSize) &&
    Number.isFinite(distanceBetweenBendsInches) &&
    Number.isFinite(adjacentInches) &&
    Number.isFinite(shrinkInches) &&
    Number.isFinite(bendAngleDegrees);

  const offsetHeightFormatted = formatLength(
    offsetHeightInches,
    input.unitSystem,
    input.roundingPrecision,
  );
  const distanceBetweenBendsFormatted = formatLength(
    distanceBetweenBendsInches,
    input.unitSystem,
    input.roundingPrecision,
  );
  const adjacentFormatted = formatLength(
    adjacentInches,
    input.unitSystem,
    input.roundingPrecision,
  );
  const shrinkFormatted = formatLength(
    shrinkInches,
    input.unitSystem,
    input.roundingPrecision,
  );
  const bendAngleFormatted = formatMatchingOffsetAngle(bendAngleDegrees);
  const comparisonAngleRadians = nearestCommonAngleDegrees * DEG_TO_RAD;
  const comparisonDistanceBetweenBendsInches = hasSolvableTriangle
    ? offsetHeightInches / Math.sin(comparisonAngleRadians)
    : 0;
  const comparisonAdjacentInches = hasSolvableTriangle
    ? offsetHeightInches / Math.tan(comparisonAngleRadians)
    : 0;
  const comparison =
    hasSolvableTriangle && !isCommonAngle
      ? {
          angleDegrees: nearestCommonAngleDegrees,
          distanceBetweenBends: comparisonDistanceBetweenBendsInches,
          adjacent: comparisonAdjacentInches,
          distanceBetweenBendsDelta:
            comparisonDistanceBetweenBendsInches - distanceBetweenBendsInches,
          adjacentDelta: comparisonAdjacentInches - adjacentInches,
          angleFormatted: formatMatchingOffsetAngle(nearestCommonAngleDegrees),
          distanceBetweenBendsFormatted: formatLength(
            comparisonDistanceBetweenBendsInches,
            input.unitSystem,
            input.roundingPrecision,
          ),
          adjacentFormatted: formatLength(
            comparisonAdjacentInches,
            input.unitSystem,
            input.roundingPrecision,
          ),
          distanceBetweenBendsDeltaFormatted: formatLength(
            Math.abs(comparisonDistanceBetweenBendsInches - distanceBetweenBendsInches),
            input.unitSystem,
            input.roundingPrecision,
          ),
          adjacentDeltaFormatted: formatLength(
            Math.abs(comparisonAdjacentInches - adjacentInches),
            input.unitSystem,
            input.roundingPrecision,
          ),
        }
      : undefined;
  const angleExecution = {
    isCommonAngle,
    requiresAngleTool: !isCommonAngle,
    nearestCommonAngleDegrees,
    nearestCommonAngleFormatted: formatMatchingOffsetAngle(nearestCommonAngleDegrees),
    comparison,
  };

  return {
    mode: input.mode,
    offsetHeight: offsetHeightInches,
    distanceBetweenBends: distanceBetweenBendsInches,
    adjacent: adjacentInches,
    shrink: shrinkInches,
    bendAngleDegrees,
    angleExecution,
    multiplier,
    shrinkPerInch,
    isValid,
    warnings,
    benderProfileUsed: {
      id: benderProfile.id,
      name: benderProfile.name,
      category: benderProfile.category,
    },
    diagramData: isValid
      ? {
          calculatorType: 'matchingOffset',
          mode: input.mode,
          offsetHeightInches,
          distanceBetweenBendsInches,
          adjacentInches,
          shrinkInches,
          bendAngleDegrees,
          angleExecution,
          display: {
            offsetHeight: offsetHeightFormatted,
            distanceBetweenBends: distanceBetweenBendsFormatted,
            adjacent: adjacentFormatted,
            shrink: shrinkFormatted,
            bendAngle: bendAngleFormatted,
            angleMethod: isCommonAngle ? 'COMMON ANGLE' : 'ANGLE TOOL',
          },
        }
      : undefined,
    offsetHeightFormatted,
    distanceBetweenBendsFormatted,
    adjacentFormatted,
    shrinkFormatted,
    bendAngleFormatted,
  };
}
