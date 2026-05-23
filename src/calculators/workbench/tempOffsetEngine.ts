/**
 * TEMP — replace with real offset module in src/calculators/offset/ later.
 * Simplified offset bend math for workbench debugging only.
 */

import type { AngleOption } from '@/components/AngleSelector';

import type { OffsetBendRawResult, WorkbenchInputs } from './types';
import { normalizeLength } from '@/engine/unitEngine';

const MULTIPLIERS: Record<AngleOption, number> = {
  10: 6,
  22.5: 2.6,
  30: 2,
  45: 1.414,
  60: 1.155,
};

function parseInches(value: string, unit: WorkbenchInputs['unit']): number {
  const n = Number(value);
  if (!Number.isFinite(n)) {
    return NaN;
  }
  return normalizeLength(n, unit === 'metric' ? 'mm' : 'in');
}

export function tempCalculateOffsetBend(inputs: WorkbenchInputs): OffsetBendRawResult | null {
  const offsetHeightIn = parseInches(inputs.offsetHeight, inputs.unit);
  const firstMarkIn = parseInches(inputs.firstMark, inputs.unit);

  if (!inputs.angle || !Number.isFinite(offsetHeightIn) || !Number.isFinite(firstMarkIn)) {
    return null;
  }

  const multiplier = MULTIPLIERS[inputs.angle];
  const spacingIn = offsetHeightIn * multiplier;
  const shrinkIn = spacingIn - offsetHeightIn;
  const secondMarkIn = firstMarkIn + spacingIn;

  return {
    calculator: 'offset-bend',
    offsetHeightIn,
    firstMarkIn,
    angleDeg: inputs.angle,
    multiplier,
    spacingIn,
    shrinkIn,
    firstMarkOutIn: firstMarkIn,
    secondMarkIn,
    conduitSizeId: inputs.conduitSizeId,
    conduitType: inputs.conduitType,
    unit: inputs.unit,
    rounding: inputs.rounding,
  };
}
