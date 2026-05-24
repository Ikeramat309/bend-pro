/**
 * FILE: src/calculators/offset/offset.logic.ts
 *
 * PURPOSE:
 * Pure Offset Bend calculation engine.
 *
 * IMPORTANT:
 * No React code belongs here.
 * No buttons, no TextInput, no styling.
 *
 * WHY:
 * Separating math from UI makes this calculator easy to test, reuse, and copy
 * as the template for Stub 90, Saddle, Rolling Offset, etc.
 */

// IMPORTS
import type { BendAngle, OffsetInput, OffsetResult, RoundingOption, Unit } from './offset.types';
import { validateOffsetInput } from './offset.validation';

// =============================================================================
// CONSTANTS — conversion + angle chart
// =============================================================================

const MM_PER_INCH = 25.4;

/**
 * Offset bend chart.
 * multiplier = spacing factor between bends.
 * shrinkPerInch = shrink amount per inch of offset height.
 */
const ANGLE_DATA: Record<BendAngle, { multiplier: number; shrinkPerInch: number }> = {
  10: { multiplier: 6.0, shrinkPerInch: 1 / 16 },
  22.5: { multiplier: 2.6, shrinkPerInch: 3 / 16 },
  30: { multiplier: 2.0, shrinkPerInch: 1 / 4 },
  45: { multiplier: 1.4, shrinkPerInch: 3 / 8 },
  60: { multiplier: 1.2, shrinkPerInch: 1 / 2 },
};

// =============================================================================
// UNIT HELPERS — internal math is always inches
// =============================================================================

function toInches(value: number, unit: Unit): number {
  return unit === 'metric' ? value / MM_PER_INCH : value;
}

function fromInches(value: number, unit: Unit): number {
  return unit === 'metric' ? value * MM_PER_INCH : value;
}

// =============================================================================
// ROUNDING HELPERS — output formatting only
// =============================================================================

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

/**
 * Turns decimal inches into a tape-measure style fraction.
 * Example: 8.25 -> 8 1/4"
 */
function decimalInchesToFraction(value: number, denominator = 16): string {
  const roundedValue = roundToStep(value, 1 / denominator);
  const whole = Math.floor(roundedValue);
  const decimalPart = roundedValue - whole;
  const numerator = Math.round(decimalPart * denominator);

  if (numerator === 0) return `${whole}"`;
  if (numerator === denominator) return `${whole + 1}"`;

  const gcd = (a: number, b: number): number => (b === 0 ? a : gcd(b, a % b));
  const divisor = gcd(numerator, denominator);

  const reducedTop = numerator / divisor;
  const reducedBottom = denominator / divisor;

  return whole > 0 ? `${whole} ${reducedTop}/${reducedBottom}"` : `${reducedTop}/${reducedBottom}"`;
}

/**
 * Formats the result based on the selected unit.
 *
 * IMPORTANT:
 * Metric mode shows only mm.
 * Imperial mode shows only inches/fractions.
 * This prevents mixed-unit confusion.
 */
function formatLength(valueInches: number, unit: Unit, rounding: RoundingOption): string {
  if (unit === 'metric') {
    const mmValue = fromInches(valueInches, unit);
    const step = getMetricStep(rounding);
    const displayValue = step ? roundToStep(mmValue, step) : Number(mmValue.toFixed(2));

    return `${displayValue} mm`;
  }

  const step = getImperialStep(rounding);
  const inchesValue = step ? roundToStep(valueInches, step) : valueInches;

  return decimalInchesToFraction(inchesValue);
}
// Helper Functin for Manual Help
function getBenderNotes(conduitType: string, conduitSize: string, bendAngle: BendAngle): string[] {
  const notes: string[] = [];

  notes.push('Offset math is based on standard field multipliers.');
  notes.push('Use your bender arrow/center mark according to the bender instructions.');

  if (conduitType === 'PVC') {
    notes.push('PVC bends can vary because heat, spring-back, and ovaling affect the final bend.');
  }

  if (conduitType === 'RMC' || conduitType === 'IMC') {
    notes.push('Rigid/IMC may require more force and a larger-radius bender than EMT.');
  }

  if (['2-1/2', '3', '3-1/2', '4', '63', '78', '91', '103'].includes(conduitSize)) {
    notes.push('Large conduit usually needs hydraulic or mechanical bending equipment.');
  }

  if (bendAngle === 30) {
    notes.push('30° is commonly used because the multiplier is simple: offset × 2.');
  }

  if (bendAngle === 60) {
    notes.push('60° creates more shrink and may make wire pulling harder.');
  }

  return notes;
}


// =============================================================================
// MAIN CALCULATION — Offset Bend
// =============================================================================

export function calculateOffset(input: OffsetInput): OffsetResult {
  // Validation runs first so the UI can show helpful warnings.
  const warnings = validateOffsetInput(input);

  // Get multiplier/shrink chart values for the selected angle.
  const angleInfo = ANGLE_DATA[input.bendAngle];

  // Convert user input to inches for consistent internal math.
  const offsetHeightInches = toInches(input.offsetHeight || 0, input.unit);

  // Core formulas.
  const spacingInches = offsetHeightInches * angleInfo.multiplier;
  const shrinkInches = offsetHeightInches * angleInfo.shrinkPerInch;
  
// Optional layout mode.
// These values only exist if the user entered a first mark.
const firstMarkInches =
  input.firstMark !== undefined
    ? toInches(input.firstMark, input.unit)
    : undefined;

const secondMarkInches =
  firstMarkInches !== undefined
    ? firstMarkInches + spacingInches
    : undefined;

const adjustedFirstMarkInches =
  firstMarkInches !== undefined
    ? firstMarkInches - shrinkInches
    : undefined;

const firstMarkFormatted =
  firstMarkInches !== undefined
    ? formatLength(firstMarkInches, input.unit, input.rounding)
    : undefined;

const secondMarkFormatted =
  secondMarkInches !== undefined
    ? formatLength(secondMarkInches, input.unit, input.rounding)
    : undefined;

const adjustedFirstMarkFormatted =
  adjustedFirstMarkInches !== undefined
    ? formatLength(adjustedFirstMarkInches, input.unit, input.rounding)
    : undefined;

   

    const visualGeometry = {
      calculatorType: 'offset' as const,
      unit: input.unit,
      conduitType: input.conduitType,
      conduitSize: input.conduitSize,
      angleDeg: input.bendAngle,
      offsetHeightInches,
      spacingInches,
      shrinkInches,
      firstMarkInches,
      secondMarkInches,
      adjustedFirstMarkInches,
      points: [
        { x: 0, y: 0 },
        { x: spacingInches / 2, y: offsetHeightInches },
        { x: spacingInches, y: offsetHeightInches },
      ],
    };
  // Return raw inches plus user-friendly formatted strings.
  return {
    offsetHeightInches,
    spacingInches,
    shrinkInches,
    firstMarkInches,
    secondMarkInches,
    adjustedFirstMarkInches,
   

    spacingFormatted: formatLength(spacingInches, input.unit, input.rounding),
    shrinkFormatted: formatLength(shrinkInches, input.unit, input.rounding),
   firstMarkFormatted,
    secondMarkFormatted,
    adjustedFirstMarkFormatted,

    multiplier: angleInfo.multiplier,
    shrinkPerInch: angleInfo.shrinkPerInch,

    steps: [
      'Convert input to inches internally.',
      'Spacing = offset height × multiplier.',
      `Spacing = ${offsetHeightInches.toFixed(3)} × ${angleInfo.multiplier}.`,
      'Shrink = offset height × shrink per inch.',
      `Shrink = ${offsetHeightInches.toFixed(3)} × ${angleInfo.shrinkPerInch}.`,
      firstMarkInches !== undefined
        ? 'Second mark = first mark + spacing.'
        : 'First mark was not entered, so exact mark locations were not calculated.',
      firstMarkInches !== undefined
        ? 'Adjusted first mark = first mark - shrink.'
        : 'Enter a first mark to calculate the second mark and shrink-adjusted first mark.',
    ],
  
    benderNotes: getBenderNotes(input.conduitType, input.conduitSize, input.bendAngle),
    visualGeometry,
    warnings,
  };
}

// =============================================================================
// TEST EXAMPLES — quick checks while building
// =============================================================================

/**
 * Imperial test:
 * offsetHeight = 4 inches
 * angle = 30
 * firstMark = 0
 * Expected:
 * spacing = 8 inches
 * shrink = 1 inch
 * secondMark = 8 inches
 *
 * Metric test:
 * offsetHeight = 100 mm
 * angle = 30
 * firstMark = 0
 * Expected:
 * spacing = 200 mm
 * shrink = about 25 mm
 * secondMark = 200 mm
 */

// =============================================================================
// EXPORTS — calculateOffset exported above
// =============================================================================
