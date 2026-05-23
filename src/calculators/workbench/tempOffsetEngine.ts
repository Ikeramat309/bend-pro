/**
 * FILE: src/calculators/workbench/tempOffsetEngine.ts
 *
 * PURPOSE: TEMPORARY offset bend math for workbench testing ONLY.
 *
 * ⚠️ REPLACE LATER with src/calculators/offset/ when formulas are finalized.
 *
 * INPUTS:  WorkbenchInputs (strings + angle from UI).
 * OUTPUTS: OffsetBendRawResult (numbers in inches) OR null if invalid.
 *
 * DATA FLOW:
 *   UI strings → parseInches() → multiply by angle multiplier → raw object
 *
 * DEPENDENCIES: @/engine/unitEngine, ./types
 */

// IMPORTS
import type { AngleOption } from '@/components/AngleSelector';

import type { OffsetBendRawResult, WorkbenchInputs } from './types';
import { normalizeLength } from '@/engine/unitEngine';

// CONSTANTS — standard offset multipliers (simplified for learning/TEMP)
const MULTIPLIERS: Record<AngleOption, number> = {
  10: 6,
  22.5: 2.6,
  30: 2,
  45: 1.414,
  60: 1.155,
};

// LOGIC

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

// EXPORTS — tempCalculateOffsetBend
