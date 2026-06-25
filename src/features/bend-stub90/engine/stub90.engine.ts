/**
 * Pure Stub 90 calculation engine.
 *
 * Formula:
 * deductMark = stubLength - deduct (take-up)
 */
import { toCanonicalInches } from '@/core/measurements';
import { getBenderProfile, resolveEffectiveStub90DeductInches } from '@/data/benders';
import { formatLength } from '@/utils/formatLength';

import type { Stub90EngineInput, Stub90EngineResult } from './stub90.types';

export function calculateStub90(input: Stub90EngineInput): Stub90EngineResult {
  const warnings: string[] = [];
  const benderProfile = getBenderProfile(input.benderProfileId, input.customBenderProfiles ?? []);
  const {
    deductInches,
    source: deductSource,
  } = resolveEffectiveStub90DeductInches(
    benderProfile,
    input.tradeSize,
    input.deductOverrideInches,
  );
  const isDeductOverridden = deductSource === 'override';
  const stubHeightInches = toCanonicalInches(input.stubHeight || 0, input.unitSystem);
  const legLengthInches =
    input.legLength !== undefined ? toCanonicalInches(input.legLength, input.unitSystem) : undefined;
  const deductMarkInches = stubHeightInches - deductInches;
  const isValidDeductMark =
    Number.isFinite(input.stubHeight) && input.stubHeight > 0 && deductMarkInches > 0;

  if (!Number.isFinite(input.stubHeight) || input.stubHeight <= 0) {
    warnings.push('Enter a stub length greater than 0.');
  }

  if (Number.isFinite(input.stubHeight) && input.stubHeight > 0 && deductMarkInches <= 0) {
    warnings.push('Stub length must be greater than deduct.');
  }

  const stubHeightFormatted = formatLength(stubHeightInches, input.unitSystem, input.roundingPrecision);
  const deductFormatted = formatLength(deductInches, input.unitSystem, input.roundingPrecision);
  const deductMarkFormatted = isValidDeductMark
    ? formatLength(deductMarkInches, input.unitSystem, input.roundingPrecision)
    : undefined;
  const legLengthFormatted =
    legLengthInches !== undefined
      ? formatLength(legLengthInches, input.unitSystem, input.roundingPrecision)
      : undefined;

  return {
    stubHeight: stubHeightInches,
    deduct: deductInches,
    deductSource,
    deductMark: isValidDeductMark ? deductMarkInches : undefined,
    legLength: legLengthInches,
    bendAngle: 90,
    isValidDeductMark,
    isDeductOverridden,
    warnings,
    benderProfileUsed: {
      id: benderProfile.id,
      name: benderProfile.name,
      category: benderProfile.category,
    },
    diagramData:
      isValidDeductMark && deductMarkFormatted
        ? {
            calculatorType: 'stub90',
            stubHeightInches,
            deductInches,
            deductMarkInches,
            legLengthInches,
            bendAngle: 90,
            display: {
              stubLength: stubHeightFormatted,
              deduct: deductFormatted,
              deductMark: deductMarkFormatted,
              leg: legLengthFormatted,
            },
          }
        : undefined,

    stubHeightFormatted,
    deductFormatted,
    deductMarkFormatted,
    legLengthFormatted,
  };
}
