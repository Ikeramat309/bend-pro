/**
 * Pure Back-to-Back 90 layout engine.
 *
 * Published hand-bender workflow:
 * 1. Optional first stub: firstDeductMark = firstStubLength - deduct.
 * 2. After forming the first 90, measure the requested back-to-back distance
 *    from its back and align that mark with the bender's star for the second 90.
 *
 * Therefore second90Mark = backToBackDistance. This is deliberately a direct
 * field measurement, not a computed gain/setback approximation.
 */
import { toCanonicalInches } from '@/core/measurements';
import {
  formatMissingBenderProfileWarning,
  resolveBenderProfile,
  resolveEffectiveStub90DeductInches,
} from '@/data/benders';
import { formatLength } from '@/utils/formatLength';

import type { BackToBackEngineInput, BackToBackEngineResult } from './backToBack.types';

function missingChartWarning(profileName: string, tradeSize: string): string {
  return `${profileName} has no stub 90 deduct for ${tradeSize}" EMT. Set a custom deduct or remove First Stub Length.`;
}

export function calculateBackToBack(input: BackToBackEngineInput): BackToBackEngineResult {
  const warnings: string[] = [];
  const { profile: benderProfile, isFallback: isProfileFallback } = resolveBenderProfile(
    input.benderProfileId,
    input.customBenderProfiles ?? [],
  );

  const distanceInputIsValid =
    Number.isFinite(input.backToBackDistance) && input.backToBackDistance > 0;
  const backToBackDistanceInches = distanceInputIsValid
    ? toCanonicalInches(input.backToBackDistance, input.unitSystem)
    : 0;

  if (!distanceInputIsValid) {
    warnings.push('Enter a back-to-back distance greater than 0.');
  }

  const hasFirstStubInput = input.firstStubLength !== undefined;
  const firstStubInputIsValid =
    !hasFirstStubInput ||
    (Number.isFinite(input.firstStubLength) && (input.firstStubLength ?? 0) > 0);
  const firstStubLengthInches =
    hasFirstStubInput && firstStubInputIsValid
      ? toCanonicalInches(input.firstStubLength!, input.unitSystem)
      : undefined;

  if (hasFirstStubInput && !firstStubInputIsValid) {
    warnings.push('Enter a first stub length greater than 0, or remove First Stub Length.');
  }

  let deductInches: number | undefined;
  let deductSource: BackToBackEngineResult['deductSource'] = 'not-needed';
  let firstDeductMarkInches: number | undefined;

  if (hasFirstStubInput && firstStubInputIsValid) {
    if (isProfileFallback) {
      warnings.push(formatMissingBenderProfileWarning(benderProfile.name));
    }
    const resolved = resolveEffectiveStub90DeductInches(
      benderProfile,
      input.tradeSize,
      input.deductOverrideInches,
    );
    deductInches = resolved.deductInches;
    deductSource = resolved.source;

    if (deductSource === 'missing-chart') {
      warnings.push(missingChartWarning(benderProfile.name, input.tradeSize));
    } else if (deductInches !== undefined && firstStubLengthInches !== undefined) {
      const mark = firstStubLengthInches - deductInches;
      if (mark > 0) {
        firstDeductMarkInches = mark;
      } else {
        warnings.push('First stub length must be greater than deduct.');
      }
    }
  }

  const isValid = distanceInputIsValid && firstStubInputIsValid;
  const isFirstStubLayoutValid =
    hasFirstStubInput && firstStubInputIsValid && firstDeductMarkInches !== undefined;
  const isDeductOverridden = deductSource === 'override';

  const backToBackDistanceFormatted = formatLength(
    backToBackDistanceInches,
    input.unitSystem,
    input.roundingPrecision,
  );
  const second90MarkFormatted = isValid ? backToBackDistanceFormatted : undefined;
  const firstStubLengthFormatted =
    firstStubLengthInches !== undefined && firstStubInputIsValid
      ? formatLength(firstStubLengthInches, input.unitSystem, input.roundingPrecision)
      : undefined;
  const deductFormatted =
    deductInches !== undefined
      ? formatLength(deductInches, input.unitSystem, input.roundingPrecision)
      : undefined;
  const firstDeductMarkFormatted =
    firstDeductMarkInches !== undefined
      ? formatLength(firstDeductMarkInches, input.unitSystem, input.roundingPrecision)
      : undefined;

  return {
    backToBackDistance: backToBackDistanceInches,
    second90Mark: isValid ? backToBackDistanceInches : undefined,
    firstStubLength: firstStubLengthInches,
    deduct: deductInches,
    deductSource,
    firstDeductMark: firstDeductMarkInches,
    bendAngle: 90,
    isValid,
    isFirstStubLayoutValid,
    isDeductOverridden,
    warnings,
    benderProfileUsed: {
      id: benderProfile.id,
      name: benderProfile.name,
      category: benderProfile.category,
    },
    diagramData:
      isValid && second90MarkFormatted
        ? {
            calculatorType: 'backToBack',
            backToBackDistanceInches,
            second90MarkInches: backToBackDistanceInches,
            firstStubLengthInches,
            firstDeductMarkInches,
            deductInches,
            bendAngle: 90,
            display: {
              backToBackDistance: backToBackDistanceFormatted,
              second90Mark: second90MarkFormatted,
              firstStubLength: firstStubLengthFormatted,
              firstDeductMark: firstDeductMarkFormatted,
              deduct: deductFormatted,
            },
          }
        : undefined,
    backToBackDistanceFormatted,
    second90MarkFormatted,
    firstStubLengthFormatted,
    deductFormatted,
    firstDeductMarkFormatted,
  };
}
