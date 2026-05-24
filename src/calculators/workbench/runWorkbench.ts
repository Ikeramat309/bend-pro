/**
 * FILE: src/calculators/workbench/runWorkbench.ts
 *
 * PURPOSE:
 * Orchestrator — connects inputs → TEMP engine → formatters → warnings.
 *
 * CalculatorWorkbench.tsx calls this file.
 * This file calls the temporary offset engine.
 *
 * Important:
 * - CalculatorWorkbench.tsx is UI only.
 * - tempOffsetEngine.ts creates raw math output.
 * - This file creates formatted display output.
 */

import type { AngleOption } from '@/components/AngleSelector';

import { formatNumber } from '@/engine/formattingEngine';
import { validateAll, validateAngle, validateLengthInches, validateNumber } from '@/engine/validationEngine';

import { tempCalculateOffsetBend } from './tempOffsetEngine';
import type {
  CalculatorType,
  WorkbenchFormattedResult,
  WorkbenchInputs,
  WorkbenchResult,
} from './types';

const UNSUPPORTED_CONDUIT_COMBOS: { type: string; sizeId: string }[] = [
  { type: 'PVC', sizeId: '4' },
];

function gcd(a: number, b: number): number {
  return b === 0 ? a : gcd(b, a % b);
}

/**
 * Format inches as inches only.
 *
 * Example:
 * 12    -> 12"
 * 18    -> 18"
 * 1.5   -> 1 1/2"
 *
 * We do NOT show feet here because conduit bend layout is clearer in inches.
 */
function formatImperialInchesOnly(inches: number, rounding: WorkbenchInputs['rounding']): string {
  if (!Number.isFinite(inches)) return '—';

  const precision =
    rounding === '1/4'
      ? 4
      : rounding === '1/8'
        ? 8
        : 16;

  const rounded =
    rounding === 'exact'
      ? inches
      : Math.round(inches * precision) / precision;

  const whole = Math.floor(rounded);
  const fraction = rounded - whole;

  if (Math.abs(fraction) < 0.000001) {
    return `${whole}"`;
  }

  const numerator = Math.round(fraction * precision);

  if (numerator === precision) {
    return `${whole + 1}"`;
  }

  const divisor = gcd(numerator, precision);
  const top = numerator / divisor;
  const bottom = precision / divisor;

  return whole > 0 ? `${whole} ${top}/${bottom}"` : `${top}/${bottom}"`;
}

/**
 * Format metric as mm only.
 *
 * Raw engine values are always inches.
 * So metric display converts inches → mm.
 */
function formatMetricMmOnly(inches: number, rounding: WorkbenchInputs['rounding']): string {
  if (!Number.isFinite(inches)) return '—';

  const mm = inches * 25.4;

  if (rounding === '5mm') {
    return `${Math.round(mm / 5) * 5} mm`;
  }

  if (rounding === '10mm') {
    return `${Math.round(mm / 10) * 10} mm`;
  }

  if (rounding === 'exact') {
    return `${Number(mm.toFixed(2))} mm`;
  }

  return `${Math.round(mm)} mm`;
}

/**
 * Main display formatter for workbench lengths.
 *
 * Imperial:
 * - inches only
 *
 * Metric:
 * - mm only
 */
function formatLengthFromInches(inches: number, inputs: WorkbenchInputs): string {
  if (inputs.unit === 'metric') {
    return formatMetricMmOnly(inches, inputs.rounding);
  }

  return formatImperialInchesOnly(inches, inputs.rounding);
}

function collectOffsetWarnings(inputs: WorkbenchInputs): string[] {
  const warnings: string[] = [];

  const offsetNum = Number(inputs.offsetHeight);
  const firstMarkNum = Number(inputs.firstMark);
  const offsetInches = inputs.unit === 'metric' ? offsetNum / 25.4 : offsetNum;

  const offsetValidation = validateAll(
    validateNumber(inputs.offsetHeight, 'offsetHeight', {
      allowZero: false,
      allowNegative: false,
    }),
    Number.isFinite(offsetInches)
      ? validateLengthInches(offsetInches, 'offsetHeight', { allowZero: false })
      : validateNumber(NaN, 'offsetHeight'),
  );

  const firstMarkValidation = validateAll(
    validateNumber(inputs.firstMark, 'firstMark', {
      allowZero: true,
      allowNegative: false,
    }),
  );

  for (const issue of offsetValidation.issues) {
    warnings.push(issue.message);
  }

  for (const issue of firstMarkValidation.issues) {
    warnings.push(issue.message);
  }

  if (offsetNum <= 0 || inputs.offsetHeight === '' || inputs.offsetHeight === '0') {
    warnings.push('Offset height must be greater than 0.');
  }

  if (firstMarkNum < 0) {
    warnings.push('First mark cannot be negative.');
  }

  if (!inputs.angle) {
    warnings.push('Bend angle not selected.');
  } else {
    const angleCheck = validateAngle(inputs.angle, 'angle');

    for (const issue of angleCheck.issues) {
      warnings.push(issue.message);
    }
  }

  if (
    UNSUPPORTED_CONDUIT_COMBOS.some(
      (combo) => combo.type === inputs.conduitType && combo.sizeId === inputs.conduitSizeId,
    )
  ) {
    warnings.push('Unsupported conduit/bender combination.');
  }

  return [...new Set(warnings)];
}

/**
 * Converts raw engine result into formatted UI result.
 *
 * This is the exact data used by:
 * result.formatted.spacing
 * result.formatted.shrink
 * result.formatted.firstMark
 * result.formatted.secondMark
 */
function formatOffsetResult(
  raw: NonNullable<ReturnType<typeof tempCalculateOffsetBend>>,
  inputs: WorkbenchInputs,
): WorkbenchFormattedResult {
  return {
    spacing: formatLengthFromInches(raw.spacingIn, inputs),
    shrink: formatLengthFromInches(raw.shrinkIn, inputs),
    firstMark: formatLengthFromInches(raw.firstMarkOutIn, inputs),
    secondMark: formatLengthFromInches(raw.secondMarkIn, inputs),
    multiplier: formatNumber(raw.multiplier, 3),
    conduitSize: `${inputs.conduitType} ${inputs.conduitSizeId}${inputs.unit === 'imperial' ? '"' : ' mm'}`,
  };
}

/**
 * Main function called by CalculatorWorkbench.tsx.
 */
export function runWorkbench(
  calculatorType: CalculatorType,
  inputs: WorkbenchInputs,
): WorkbenchResult {
  if (calculatorType !== 'offset-bend') {
    return {
      raw: { calculator: calculatorType, status: 'coming-soon' },
      formatted: null,
      warnings: [],
      available: false,
    };
  }

  const warnings = collectOffsetWarnings(inputs);
  const raw = tempCalculateOffsetBend(inputs);

  if (!raw) {
    return {
      raw: { calculator: 'offset-bend', status: 'coming-soon' },
      formatted: null,
      warnings: warnings.length ? warnings : ['Unable to calculate — check inputs.'],
      available: false,
    };
  }

  return {
    raw,
    formatted: formatOffsetResult(raw, inputs),
    warnings,
    available: true,
  };
}

/**
 * Quick-fill buttons on workbench.
 * These are for testing only, not the final customer screen.
 */
export const WORKBENCH_PRESETS: Record<
  import('./types').WorkbenchPresetId,
  { label: string; calculatorType: CalculatorType; inputs: Partial<WorkbenchInputs> }
> = {
  'small-offset': {
    label: 'Small Offset',
    calculatorType: 'offset-bend',
    inputs: {
      offsetHeight: '6',
      firstMark: '12',
      angle: 30 as AngleOption,
      conduitType: 'EMT',
      conduitSizeId: '1/2',
      unit: 'imperial',
      rounding: '1/16',
    },
  },

  'standard-offset': {
    label: 'Standard Offset',
    calculatorType: 'offset-bend',
    inputs: {
      offsetHeight: '12',
      firstMark: '24',
      angle: 30 as AngleOption,
      conduitType: 'EMT',
      conduitSizeId: '3/4',
      unit: 'imperial',
      rounding: '1/16',
    },
  },

  'metric-offset': {
    label: 'Metric Offset',
    calculatorType: 'offset-bend',
    inputs: {
      offsetHeight: '150',
      firstMark: '600',
      angle: 45 as AngleOption,
      conduitType: 'IMC',
      conduitSizeId: '27',
      unit: 'metric',
      rounding: '5mm',
    },
  },

  'bad-input': {
    label: 'Bad Input Test',
    calculatorType: 'offset-bend',
    inputs: {
      offsetHeight: '0',
      firstMark: '-6',
      angle: null,
      conduitType: 'PVC',
      conduitSizeId: '4',
      unit: 'imperial',
      rounding: 'exact',
    },
  },
};