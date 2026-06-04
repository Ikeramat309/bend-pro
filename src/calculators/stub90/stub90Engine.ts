/**
 * Pure Stub 90 calculation engine.
 *
 * Formula:
 * firstMark = stubHeight - deduct
 */
import { getBenderProfile } from '@/data/benderProfiles';

import type { Stub90EngineInput, Stub90EngineResult } from './stub90Types';

const MM_PER_INCH = 25.4;
const GENERIC_DEDUCT_INCHES = 5;

function toInches(value: number, unitSystem: Stub90EngineInput['unitSystem']): number {
  return unitSystem === 'metric' ? value / MM_PER_INCH : value;
}

function fromInches(value: number, unitSystem: Stub90EngineInput['unitSystem']): number {
  return unitSystem === 'metric' ? value * MM_PER_INCH : value;
}

function roundToStep(value: number, step: number): number {
  return Math.round(value / step) * step;
}

function getImperialStep(rounding: Stub90EngineInput['roundingPrecision']): number | null {
  if (rounding === '1/16') return 1 / 16;
  if (rounding === '1/8') return 1 / 8;
  if (rounding === '1/4') return 1 / 4;
  return null;
}

function getMetricStep(rounding: Stub90EngineInput['roundingPrecision']): number | null {
  if (rounding === '1mm') return 1;
  if (rounding === '5mm') return 5;
  if (rounding === '10mm') return 10;
  return null;
}

function decimalInchesToFraction(value: number, denominator = 16): string {
  const sign = value < 0 ? '-' : '';
  const roundedValue = roundToStep(Math.abs(value), 1 / denominator);
  const whole = Math.floor(roundedValue);
  const decimalPart = roundedValue - whole;
  const numerator = Math.round(decimalPart * denominator);

  if (numerator === 0) return `${sign}${whole}"`;
  if (numerator === denominator) return `${sign}${whole + 1}"`;

  const gcd = (a: number, b: number): number => (b === 0 ? a : gcd(b, a % b));
  const divisor = gcd(numerator, denominator);
  const reducedTop = numerator / divisor;
  const reducedBottom = denominator / divisor;
  const fraction = whole > 0 ? `${whole} ${reducedTop}/${reducedBottom}"` : `${reducedTop}/${reducedBottom}"`;

  return `${sign}${fraction}`;
}

function formatLength(
  valueInches: number,
  unitSystem: Stub90EngineInput['unitSystem'],
  rounding: Stub90EngineInput['roundingPrecision'],
): string {
  if (unitSystem === 'metric') {
    const mmValue = fromInches(valueInches, unitSystem);
    const step = getMetricStep(rounding);
    const displayValue = step ? roundToStep(mmValue, step) : Number(mmValue.toFixed(2));

    return `${displayValue} mm`;
  }

  const step = getImperialStep(rounding);
  const inchesValue = step ? roundToStep(valueInches, step) : valueInches;

  return decimalInchesToFraction(inchesValue);
}

export function calculateStub90Engine(input: Stub90EngineInput): Stub90EngineResult {
  const warnings: string[] = [];
  const benderProfile = getBenderProfile(input.benderProfileId);
  const profileDeduct = benderProfile.stub90TakeUpInchesByTradeSize?.[input.tradeSize];
  const deductInches = profileDeduct ?? GENERIC_DEDUCT_INCHES;
  const stubHeightInches = toInches(input.stubHeight || 0, input.unitSystem);
  const legLengthInches =
    input.legLength !== undefined ? toInches(input.legLength, input.unitSystem) : undefined;
  const firstMarkInches = stubHeightInches - deductInches;
  const isValidFirstMark =
    Number.isFinite(input.stubHeight) && input.stubHeight > 0 && firstMarkInches > 0;

  if (!Number.isFinite(input.stubHeight) || input.stubHeight <= 0) {
    warnings.push('Enter a stub height greater than 0.');
  }

  if (profileDeduct === undefined) {
    warnings.push('Using generic deduct because this trade size is not in the selected bender profile.');
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
