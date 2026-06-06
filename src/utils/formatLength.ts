/**
 * Formats a length in inches for calculator result display.
 *
 * Imperial: tape-measure fractions (e.g. 8 1/4").
 * Metric: millimetres with the selected rounding step.
 */
import type { RoundingOption, UnitSystem } from '@/core/types';

const MM_PER_INCH = 25.4;

function fromInches(valueInches: number, unitSystem: UnitSystem): number {
  return unitSystem === 'metric' ? valueInches * MM_PER_INCH : valueInches;
}

function roundToStep(value: number, step: number): number {
  return Math.round(value / step) * step;
}

function getImperialStep(rounding: RoundingOption): number | null {
  if (rounding === '1/16') return 1 / 16;
  if (rounding === '1/8') return 1 / 8;
  if (rounding === '1/4') return 1 / 4;
  return null;
}

function getMetricStep(rounding: RoundingOption): number | null {
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
  const fraction =
    whole > 0 ? `${whole} ${reducedTop}/${reducedBottom}"` : `${reducedTop}/${reducedBottom}"`;

  return `${sign}${fraction}`;
}

export function formatLength(
  valueInches: number,
  unitSystem: UnitSystem,
  rounding: RoundingOption,
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
