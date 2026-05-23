/**
 * Workbench runner — isolates calculator logic from UI.
 */

import type { AngleOption } from '@/components/AngleSelector';

import { formatLength, formatNumber } from '@/engine/formattingEngine';
import { roundLength } from '@/engine/roundingEngine';
import { validateAngle, validateLengthInches, validateNumber, validateAll } from '@/engine/validationEngine';
import type { FractionPrecision } from '@/engine/types';

import { tempCalculateOffsetBend } from './tempOffsetEngine';
import type {
  CalculatorType,
  WorkbenchFormattedResult,
  WorkbenchInputs,
  WorkbenchResult,
  WorkbenchRounding,
} from './types';

const UNSUPPORTED_CONDUIT_COMBOS: { type: string; sizeId: string }[] = [
  { type: 'PVC', sizeId: '4' },
];

function roundingToFractionPrecision(rounding: WorkbenchRounding): FractionPrecision | undefined {
  if (rounding === '1/16' || rounding === '1/8' || rounding === '1/4') {
    return rounding;
  }
  return undefined;
}

function formatLengthFromInches(inches: number, inputs: WorkbenchInputs): string {
  if (!Number.isFinite(inches)) {
    return '—';
  }

  if (inputs.rounding === 'exact') {
    return formatLength(inches, {
      unit: inputs.unit === 'metric' ? 'mm' : 'in',
      showUnitSuffix: true,
      maxDecimalPlaces: 4,
    });
  }

  const rounded = roundLength(inches, {
    unit: inputs.unit === 'metric' ? 'mm' : 'in',
    fractionPrecision: inputs.unit === 'imperial' ? roundingToFractionPrecision(inputs.rounding) : undefined,
    decimalPlaces: inputs.unit === 'metric' ? 0 : 4,
  });

  return formatLength(rounded, {
    unit: inputs.unit === 'metric' ? 'mm' : 'in',
    fractionPrecision: inputs.unit === 'imperial' ? roundingToFractionPrecision(inputs.rounding) : undefined,
    showUnitSuffix: true,
  });
}

function collectOffsetWarnings(inputs: WorkbenchInputs): string[] {
  const warnings: string[] = [];

  const offsetNum = Number(inputs.offsetHeight);
  const firstMarkNum = Number(inputs.firstMark);

  const offsetInches =
    inputs.unit === 'metric' ? offsetNum / 25.4 : offsetNum;

  const offsetValidation = validateAll(
    validateNumber(inputs.offsetHeight, 'offsetHeight', { allowZero: false, allowNegative: false }),
    Number.isFinite(offsetInches)
      ? validateLengthInches(offsetInches, 'offsetHeight', { allowZero: false })
      : validateNumber(NaN, 'offsetHeight'),
  );

  const firstMarkValidation = validateAll(
    validateNumber(inputs.firstMark, 'firstMark', { allowZero: true, allowNegative: false }),
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
      (c) => c.type === inputs.conduitType && c.sizeId === inputs.conduitSizeId,
    )
  ) {
    warnings.push('Unsupported conduit/bender combination.');
  }

  return [...new Set(warnings)];
}

function formatOffsetResult(raw: NonNullable<ReturnType<typeof tempCalculateOffsetBend>>, inputs: WorkbenchInputs): WorkbenchFormattedResult {
  return {
    spacing: formatLengthFromInches(raw.spacingIn, inputs),
    shrink: formatLengthFromInches(raw.shrinkIn, inputs),
    firstMark: formatLengthFromInches(raw.firstMarkOutIn, inputs),
    secondMark: formatLengthFromInches(raw.secondMarkIn, inputs),
    multiplier: formatNumber(raw.multiplier, 3),
    conduitSize: `${inputs.conduitType} ${inputs.conduitSizeId}${inputs.unit === 'imperial' ? '"' : ' mm'}`,
  };
}

export function runWorkbench(calculatorType: CalculatorType, inputs: WorkbenchInputs): WorkbenchResult {
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
