/**
 * Pure Stub 90 calculation engine.
 *
 * Formula:
 * deductMark = stubLength - deduct (take-up)
 */
import {
  DEFAULT_EMT_STUB90_TAKE_UP_INCHES,
  getBenderProfile,
  getEmtStub90TakeUpInches,
} from '@/data/benders';
import { formatLength } from '@/utils/formatLength';

import type { Stub90EngineInput, Stub90EngineResult } from './stub90.types';

const MM_PER_INCH = 25.4;

function toInches(value: number, unitSystem: Stub90EngineInput['unitSystem']): number {
  return unitSystem === 'metric' ? value / MM_PER_INCH : value;
}

export function calculateStub90(input: Stub90EngineInput): Stub90EngineResult {
  const warnings: string[] = [];
  const benderProfile = getBenderProfile(input.benderProfileId);
  const profileTakeUp = getEmtStub90TakeUpInches(benderProfile, input.tradeSize);
  const overrideDeduct =
    input.deductOverrideInches !== undefined &&
    Number.isFinite(input.deductOverrideInches) &&
    input.deductOverrideInches > 0
      ? input.deductOverrideInches
      : undefined;
  const isDeductOverridden = overrideDeduct !== undefined;
  const deductInches = overrideDeduct ?? profileTakeUp ?? DEFAULT_EMT_STUB90_TAKE_UP_INCHES;
  const stubHeightInches = toInches(input.stubHeight || 0, input.unitSystem);
  const legLengthInches =
    input.legLength !== undefined ? toInches(input.legLength, input.unitSystem) : undefined;
  const deductMarkInches = stubHeightInches - deductInches;
  const isValidDeductMark =
    Number.isFinite(input.stubHeight) && input.stubHeight > 0 && deductMarkInches > 0;

  if (!Number.isFinite(input.stubHeight) || input.stubHeight <= 0) {
    warnings.push('Enter a stub length greater than 0.');
  }

  if (profileTakeUp === undefined && !isDeductOverridden) {
    warnings.push('Using default take-up because this EMT size is not on the selected bender profile.');
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
