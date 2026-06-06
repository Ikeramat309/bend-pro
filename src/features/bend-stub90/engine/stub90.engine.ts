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
  const deductInches = profileTakeUp ?? DEFAULT_EMT_STUB90_TAKE_UP_INCHES;
  const stubHeightInches = toInches(input.stubHeight || 0, input.unitSystem);
  const legLengthInches =
    input.legLength !== undefined ? toInches(input.legLength, input.unitSystem) : undefined;
  const firstMarkInches = stubHeightInches - deductInches;
  const isValidFirstMark =
    Number.isFinite(input.stubHeight) && input.stubHeight > 0 && firstMarkInches > 0;

  if (!Number.isFinite(input.stubHeight) || input.stubHeight <= 0) {
    warnings.push('Enter a stub length greater than 0.');
  }

  if (profileTakeUp === undefined) {
    warnings.push('Using default take-up because this EMT size is not on the selected bender profile.');
  }

  if (Number.isFinite(input.stubHeight) && input.stubHeight > 0 && firstMarkInches <= 0) {
    warnings.push('Stub length must be greater than deduct.');
  }

  return {
    stubHeight: stubHeightInches,
    takeUp: deductInches,
    deduct: deductInches,
    firstMark: isValidFirstMark ? firstMarkInches : undefined,
    legLength: legLengthInches,
    bendAngle: 90,
    isValidFirstMark,
    warnings,
    benderProfileUsed: {
      id: benderProfile.id,
      name: benderProfile.name,
      category: benderProfile.category,
    },
    diagramData: {
      calculatorType: 'stub90',
      stubHeightInches,
      deductInches,
      firstMarkInches,
      legLengthInches,
      bendAngle: 90,
    },

    stubHeightFormatted: formatLength(stubHeightInches, input.unitSystem, input.roundingPrecision),
    takeUpFormatted: formatLength(deductInches, input.unitSystem, input.roundingPrecision),
    deductFormatted: formatLength(deductInches, input.unitSystem, input.roundingPrecision),
    firstMarkFormatted: isValidFirstMark
      ? formatLength(firstMarkInches, input.unitSystem, input.roundingPrecision)
      : undefined,
    legLengthFormatted:
      legLengthInches !== undefined
        ? formatLength(legLengthInches, input.unitSystem, input.roundingPrecision)
        : undefined,
    conduitLengthFormatted: undefined,
  };
}
