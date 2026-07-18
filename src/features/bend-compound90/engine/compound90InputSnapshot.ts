import type { CalculatorSetup } from '@/core/settings/calculatorSetup';
import {
  baseSetupPatchFromLayout,
  formatStoredLengthText,
  isRecord,
  optionalFiniteNumber,
  requiredFiniteNumber,
} from '@/core/sessions/inputSnapshotUtils';
import { sanitizeSetupSnapshot } from '@/core/sessions/sessionSanitize';
import type { CalculatorInputSnapshot, RecentLayout } from '@/core/sessions/sessionTypes';

import type { Compound90EngineInput, Compound90Shape } from './compound90.types';

export type Compound90InputSnapshot = {
  calculatorId: 'compound90';
  shape: Compound90Shape;
  primaryDimension: number;
  secondaryDimension?: number;
  clearance?: number;
  firstMark?: number;
};

function isShape(value: unknown): value is Compound90Shape {
  return value === 'circle' || value === 'box' || value === 'diamond';
}

function migrateLegacyShape(value: unknown): Compound90Shape | null {
  if (isShape(value)) {
    return value;
  }
  // Legacy `square` used the side × 3 diamond formula. Preserve that math
  // when an existing saved layout is reopened. Legacy rectangles were the
  // wall-aligned box method.
  if (value === 'square') {
    return 'diamond';
  }
  if (value === 'rectangle') {
    return 'box';
  }
  return null;
}

export function createCompound90InputSnapshot(
  input: Compound90EngineInput,
): Compound90InputSnapshot {
  return {
    calculatorId: 'compound90',
    shape: input.shape,
    primaryDimension: input.primaryDimension,
    ...(input.secondaryDimension !== undefined && Number.isFinite(input.secondaryDimension)
      ? { secondaryDimension: input.secondaryDimension }
      : {}),
    ...(input.clearance !== undefined && Number.isFinite(input.clearance)
      ? { clearance: input.clearance }
      : {}),
    ...(input.firstMark !== undefined && Number.isFinite(input.firstMark)
      ? { firstMark: input.firstMark }
      : {}),
  };
}

export function toStoredInputSnapshot(
  snapshot: Compound90InputSnapshot,
): CalculatorInputSnapshot {
  return { ...snapshot };
}

export function sanitizeCompound90InputSnapshot(raw: unknown): Compound90InputSnapshot | null {
  if (!isRecord(raw) || raw.calculatorId !== 'compound90') {
    return null;
  }
  const shape = migrateLegacyShape(raw.shape);
  const primaryDimension = requiredFiniteNumber(raw.primaryDimension);
  if (!shape || primaryDimension === undefined) {
    return null;
  }

  return {
    calculatorId: 'compound90',
    shape,
    primaryDimension,
    secondaryDimension: optionalFiniteNumber(raw.secondaryDimension),
    clearance: optionalFiniteNumber(raw.clearance),
    firstMark: optionalFiniteNumber(raw.firstMark),
  };
}

export type Compound90RestoredFields = {
  shape: Compound90Shape;
  primaryDimensionText: string;
  secondaryDimensionText: string;
  clearanceText: string;
  firstMarkText: string;
};

export function restoreCompound90FromLayout(
  layout: RecentLayout,
): { setupPatch: Partial<CalculatorSetup>; fields: Compound90RestoredFields } | null {
  const snapshot = sanitizeCompound90InputSnapshot(layout.inputSnapshot);
  if (!snapshot) {
    return null;
  }
  const setup = sanitizeSetupSnapshot(layout.setupSnapshot);
  const format = (value?: number) =>
    formatStoredLengthText(value, setup.unitSystem, setup.roundingPrecision);

  return {
    setupPatch: baseSetupPatchFromLayout(layout),
    fields: {
      shape: snapshot.shape,
      primaryDimensionText: format(snapshot.primaryDimension),
      secondaryDimensionText: format(snapshot.secondaryDimension),
      clearanceText: format(snapshot.clearance),
      firstMarkText: format(snapshot.firstMark),
    },
  };
}
