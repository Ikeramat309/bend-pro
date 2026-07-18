import type { CalculatorSetup } from '@/core/settings/calculatorSetup';
import {
  baseSetupPatchFromLayout,
  formatStoredLengthText,
  isRecord,
  optionalFiniteNumber,
  optionalNonNegativeNumber,
  pickJsonLeaves,
  requiredFiniteNumber,
} from '@/core/sessions/inputSnapshotUtils';
import { sanitizeSetupSnapshot } from '@/core/sessions/sessionSanitize';
import type { CalculatorInputSnapshot, RecentLayout } from '@/core/sessions/sessionTypes';

import { PARALLEL_OFFSET_CONFIG } from '../parallelOffset.config';
import type {
  ParallelOffsetEngineInput,
  ParallelOffsetMode,
  ParallelOffsetShiftDirection,
} from './parallelOffset.types';

export type ParallelOffsetInputSnapshot = {
  calculatorId: 'parallelOffset';
  mode: ParallelOffsetMode;
  centerSpacing: number;
  bendAngle: number;
  offsetHeight?: number;
  conduitCount?: number;
  baseMark?: number;
  shiftDirection?: ParallelOffsetShiftDirection;
};

const ALLOWED_KEYS = [
  'calculatorId',
  'mode',
  'centerSpacing',
  'bendAngle',
  'offsetHeight',
  'conduitCount',
  'baseMark',
  'shiftDirection',
] as const;

function isMode(value: unknown): value is ParallelOffsetMode {
  return value === 'simple' || value === 'layout';
}

function isDirection(value: unknown): value is ParallelOffsetShiftDirection {
  return value === 'toward-free-end' || value === 'away-from-free-end';
}

function isAngle(value: unknown): value is number {
  return (
    typeof value === 'number' &&
    (PARALLEL_OFFSET_CONFIG.validAngles as readonly number[]).includes(value)
  );
}

export function createParallelOffsetInputSnapshot(
  input: ParallelOffsetEngineInput,
): ParallelOffsetInputSnapshot {
  const snapshot: ParallelOffsetInputSnapshot = {
    calculatorId: 'parallelOffset',
    mode: input.mode,
    centerSpacing: input.centerSpacing,
    bendAngle: input.bendAngle,
  };
  if (input.mode === 'layout') {
    if (input.offsetHeight !== undefined && Number.isFinite(input.offsetHeight)) {
      snapshot.offsetHeight = input.offsetHeight;
    }
    if (input.conduitCount !== undefined && Number.isFinite(input.conduitCount)) {
      snapshot.conduitCount = input.conduitCount;
    }
    if (input.baseMark !== undefined && Number.isFinite(input.baseMark)) {
      snapshot.baseMark = input.baseMark;
    }
    if (isDirection(input.shiftDirection)) snapshot.shiftDirection = input.shiftDirection;
  }
  return snapshot;
}

export function toStoredInputSnapshot(
  snapshot: ParallelOffsetInputSnapshot,
): CalculatorInputSnapshot {
  return { ...snapshot };
}

export function sanitizeParallelOffsetInputSnapshot(
  raw: unknown,
): ParallelOffsetInputSnapshot | null {
  if (
    !isRecord(raw) ||
    raw.calculatorId !== 'parallelOffset' ||
    !isMode(raw.mode) ||
    !isAngle(raw.bendAngle)
  ) {
    return null;
  }
  const centerSpacing = requiredFiniteNumber(raw.centerSpacing);
  if (centerSpacing === undefined) return null;
  pickJsonLeaves(raw, ALLOWED_KEYS);

  if (raw.mode === 'layout') {
    const offsetHeight = requiredFiniteNumber(raw.offsetHeight);
    const conduitCount = optionalFiniteNumber(raw.conduitCount);
    if (
      offsetHeight === undefined ||
      conduitCount === undefined ||
      !Number.isInteger(conduitCount) ||
      conduitCount < PARALLEL_OFFSET_CONFIG.minConduitCount ||
      conduitCount > PARALLEL_OFFSET_CONFIG.maxConduitCount ||
      !isDirection(raw.shiftDirection)
    ) {
      return null;
    }
    return {
      calculatorId: 'parallelOffset',
      mode: 'layout',
      centerSpacing,
      bendAngle: raw.bendAngle,
      offsetHeight,
      conduitCount,
      baseMark: optionalNonNegativeNumber(raw.baseMark),
      shiftDirection: raw.shiftDirection,
    };
  }

  return {
    calculatorId: 'parallelOffset',
    mode: 'simple',
    centerSpacing,
    bendAngle: raw.bendAngle,
  };
}

export type ParallelOffsetRestoredFields = {
  mode: ParallelOffsetMode;
  centerSpacingText: string;
  offsetHeightText: string;
  bendAngle: number;
  conduitCount: number;
  baseMarkText: string;
  shiftDirection: ParallelOffsetShiftDirection;
};

export function restoreParallelOffsetFromLayout(
  layout: RecentLayout,
): { setupPatch: Partial<CalculatorSetup>; fields: ParallelOffsetRestoredFields } | null {
  const snapshot = sanitizeParallelOffsetInputSnapshot(layout.inputSnapshot);
  if (!snapshot) return null;
  const setup = sanitizeSetupSnapshot(layout.setupSnapshot);

  return {
    setupPatch: baseSetupPatchFromLayout(layout),
    fields: {
      mode: snapshot.mode,
      centerSpacingText: formatStoredLengthText(
        snapshot.centerSpacing,
        setup.unitSystem,
        setup.roundingPrecision,
      ),
      offsetHeightText: formatStoredLengthText(
        snapshot.offsetHeight,
        setup.unitSystem,
        setup.roundingPrecision,
      ),
      bendAngle: snapshot.bendAngle,
      conduitCount: snapshot.conduitCount ?? PARALLEL_OFFSET_CONFIG.defaultConduitCount,
      baseMarkText: formatStoredLengthText(
        snapshot.baseMark,
        setup.unitSystem,
        setup.roundingPrecision,
      ),
      shiftDirection:
        snapshot.shiftDirection ?? PARALLEL_OFFSET_CONFIG.defaultShiftDirection,
    },
  };
}

