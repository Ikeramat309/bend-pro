/**
 * Standard two-45 compound-90 field layout.
 *
 * Published field multipliers first locate the back/outside of conduit.
 * Center-to-center spacing deducts one-half of nominal EMT outside diameter:
 *
 * round at a corner: diameter × 2.4 + 2 × clearance − OD / 2
 * wall-aligned box: (height + width) × 1.414 + 2 × clearance − OD / 2
 * square set on a corner: side × 3 + 2 × clearance − OD / 2
 */
import { toCanonicalInches } from '@/core/measurements';
import { formatMissingBenderProfileWarning, resolveBenderProfile } from '@/data/benders';
import { getEmtOutsideDiameterInches } from '@/data/emt';
import { formatLength } from '@/utils/formatLength';

import type {
  Compound90EngineInput,
  Compound90EngineResult,
  Compound90Shape,
} from './compound90.types';

export const COMPOUND90_BEND_ANGLE = 45 as const;

export const COMPOUND90_SHAPE_DATA: Record<
  Compound90Shape,
  { label: string; multiplier: number; formulaLabel: string }
> = {
  circle: {
    label: 'Round',
    multiplier: 2.4,
    formulaLabel: 'Diameter × 2.4 + 2 × clearance − 1/2 EMT OD',
  },
  box: {
    label: 'Box / Rectangle',
    multiplier: 1.414,
    formulaLabel: '(Height + Width) × 1.414 + 2 × clearance − 1/2 EMT OD',
  },
  diamond: {
    label: 'Square on Point',
    multiplier: 3,
    formulaLabel: 'Side × 3 + 2 × clearance − 1/2 EMT OD',
  },
};

function isPositiveFinite(value: number | undefined): value is number {
  return value !== undefined && Number.isFinite(value) && value > 0;
}

function collectWarnings(input: Compound90EngineInput): string[] {
  const warnings: string[] = [];

  if (!isPositiveFinite(input.primaryDimension)) {
    warnings.push('Obstruction dimension must be greater than 0.');
  }
  if (input.shape === 'box' && !isPositiveFinite(input.secondaryDimension)) {
    warnings.push('Box width must be greater than 0.');
  }
  if (
    input.clearance !== undefined &&
    (!Number.isFinite(input.clearance) || input.clearance < 0)
  ) {
    warnings.push('Clearance cannot be negative.');
  }
  if (
    input.firstMark !== undefined &&
    (!Number.isFinite(input.firstMark) || input.firstMark < 0)
  ) {
    warnings.push('First bend mark cannot be negative.');
  }
  if (!input.tradeSize) {
    warnings.push('Please select a conduit size.');
  }
  if (input.conduitType !== 'EMT') {
    warnings.push('Compound 90 currently supports EMT only.');
  }

  const tallThreshold = input.unitSystem === 'imperial' ? 24 : 600;
  if (isPositiveFinite(input.primaryDimension) && input.primaryDimension > tallThreshold) {
    warnings.push('Large obstruction: verify conduit length and the two 45° bends before marking.');
  }

  return warnings;
}

export function calculateCompound90(input: Compound90EngineInput): Compound90EngineResult {
  const { profile: benderProfile, isFallback } = resolveBenderProfile(
    input.benderProfileId,
    input.customBenderProfiles ?? [],
  );
  const warnings = collectWarnings(input);
  if (isFallback) {
    warnings.push(formatMissingBenderProfileWarning(benderProfile.name));
  }

  const hasPrimary = isPositiveFinite(input.primaryDimension);
  const hasSecondary = isPositiveFinite(input.secondaryDimension);
  const firstMarkIsValid =
    input.firstMark === undefined || (Number.isFinite(input.firstMark) && input.firstMark >= 0);
  const clearanceIsValid =
    input.clearance === undefined ||
    (Number.isFinite(input.clearance) && input.clearance >= 0);
  const primaryDimensionInches = toCanonicalInches(
    hasPrimary ? input.primaryDimension : 0,
    input.unitSystem,
  );
  const secondaryDimensionInches =
    input.shape === 'box' && hasSecondary
      ? toCanonicalInches(input.secondaryDimension!, input.unitSystem)
      : undefined;
  const clearanceInches =
    input.clearance !== undefined && Number.isFinite(input.clearance) && input.clearance >= 0
      ? toCanonicalInches(input.clearance, input.unitSystem)
      : 0;
  const shapeData = COMPOUND90_SHAPE_DATA[input.shape];
  const conduitOutsideDiameterInches =
    input.conduitType === 'EMT' ? getEmtOutsideDiameterInches(input.tradeSize) : undefined;
  const distanceBasis =
    input.shape === 'box'
      ? primaryDimensionInches + (secondaryDimensionInches ?? 0)
      : primaryDimensionInches;
  const backOfConduitDistanceInches =
    distanceBasis * shapeData.multiplier + clearanceInches * 2;
  const calculatedDistanceBetweenBendsInches =
    conduitOutsideDiameterInches === undefined
      ? Number.NaN
      : backOfConduitDistanceInches - conduitOutsideDiameterInches / 2;
  const firstMarkInches =
    input.firstMark !== undefined && Number.isFinite(input.firstMark) && input.firstMark >= 0
      ? toCanonicalInches(input.firstMark, input.unitSystem)
      : undefined;
  const calculatedSecondMarkInches =
    firstMarkInches !== undefined
      ? firstMarkInches + calculatedDistanceBetweenBendsInches
      : undefined;
  const finiteLayout =
    Number.isFinite(backOfConduitDistanceInches) &&
    Number.isFinite(calculatedDistanceBetweenBendsInches) &&
    calculatedDistanceBetweenBendsInches > 0 &&
    (calculatedSecondMarkInches === undefined || Number.isFinite(calculatedSecondMarkInches));
  const isValid =
    hasPrimary &&
    (input.shape !== 'box' || hasSecondary) &&
    clearanceIsValid &&
    firstMarkIsValid &&
    conduitOutsideDiameterInches !== undefined &&
    finiteLayout;
  if (conduitOutsideDiameterInches === undefined) {
    warnings.push('No nominal EMT outside diameter is available for the selected size.');
  } else if (!finiteLayout && hasPrimary && (input.shape !== 'box' || hasSecondary)) {
    warnings.push('Calculated bend spacing is outside the supported numeric range.');
  }
  const distanceBetweenBendsInches = isValid ? calculatedDistanceBetweenBendsInches : 0;
  const secondMarkInches =
    isValid && calculatedSecondMarkInches !== undefined ? calculatedSecondMarkInches : undefined;
  const fmt = (value: number) => formatLength(value, input.unitSystem, input.roundingPrecision);
  const primaryDimensionFormatted = fmt(primaryDimensionInches);
  const secondaryDimensionFormatted =
    secondaryDimensionInches !== undefined ? fmt(secondaryDimensionInches) : undefined;
  const clearanceFormatted = fmt(clearanceInches);
  const backOfConduitDistanceFormatted = fmt(
    Number.isFinite(backOfConduitDistanceInches) ? backOfConduitDistanceInches : 0,
  );
  const conduitOutsideDiameterFormatted = fmt(conduitOutsideDiameterInches ?? 0);
  const distanceBetweenBendsFormatted = fmt(distanceBetweenBendsInches);
  const firstMarkFormatted = firstMarkInches !== undefined ? fmt(firstMarkInches) : undefined;
  const secondMarkFormatted = secondMarkInches !== undefined ? fmt(secondMarkInches) : undefined;

  return {
    shape: input.shape,
    primaryDimension: primaryDimensionInches,
    secondaryDimension: secondaryDimensionInches,
    clearance: clearanceInches,
    backOfConduitDistance: Number.isFinite(backOfConduitDistanceInches)
      ? backOfConduitDistanceInches
      : 0,
    conduitOutsideDiameter: conduitOutsideDiameterInches ?? 0,
    distanceBetweenBends: distanceBetweenBendsInches,
    firstMark: firstMarkInches,
    secondMark: secondMarkInches,
    bendAngle: COMPOUND90_BEND_ANGLE,
    distanceMultiplier: shapeData.multiplier,
    isValid,
    warnings,
    benderProfileUsed: {
      id: benderProfile.id,
      name: benderProfile.name,
      category: benderProfile.category,
    },
    diagramData: isValid
      ? {
          calculatorType: 'compound90',
          shape: input.shape,
          primaryDimensionInches,
          secondaryDimensionInches,
          clearanceInches,
          conduitOutsideDiameterInches: conduitOutsideDiameterInches!,
          distanceBetweenBendsInches,
          firstMarkInches,
          secondMarkInches,
          bendAngle: COMPOUND90_BEND_ANGLE,
          display: {
            shape: shapeData.label,
            primaryDimension: primaryDimensionFormatted,
            secondaryDimension: secondaryDimensionFormatted,
            clearance: clearanceFormatted,
            conduitOutsideDiameter: conduitOutsideDiameterFormatted,
            distanceBetweenBends: distanceBetweenBendsFormatted,
            firstMark: firstMarkFormatted,
            secondMark: secondMarkFormatted,
          },
        }
      : undefined,
    primaryDimensionFormatted,
    secondaryDimensionFormatted,
    clearanceFormatted,
    backOfConduitDistanceFormatted,
    conduitOutsideDiameterFormatted,
    distanceBetweenBendsFormatted,
    firstMarkFormatted,
    secondMarkFormatted,
  };
}
