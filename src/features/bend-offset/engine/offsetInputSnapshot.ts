import type { BendAngle } from '@/core/types';
import type { CalculatorInputSnapshot } from '@/core/sessions/sessionTypes';
import {
  isRecord,
  optionalFiniteNumber,
  pickJsonLeaves,
  requiredFiniteNumber,
} from '@/core/sessions/inputSnapshotUtils';

import type { OffsetEngineInput } from './offset.types';
import { OFFSET_CONFIG } from '../offset.config';

export type OffsetInputSnapshot = {
  calculatorId: 'offset';
  offsetHeight: number;
  bendAngle: BendAngle;
  mark1?: number;
  multiplierOverride?: number;
  shrinkPerInchOverride?: number;
};

const ALLOWED_KEYS = [
  'calculatorId',
  'offsetHeight',
  'bendAngle',
  'mark1',
  'multiplierOverride',
  'shrinkPerInchOverride',
] as const;

function isOffsetBendAngle(value: number): value is BendAngle {
  return (OFFSET_CONFIG.validAngles as readonly number[]).includes(value);
}

export function createOffsetInputSnapshot(input: OffsetEngineInput): OffsetInputSnapshot {
  const snapshot: OffsetInputSnapshot = {
    calculatorId: 'offset',
    offsetHeight: input.offsetHeight,
    bendAngle: input.bendAngle,
  };

  if (input.mark1 !== undefined && Number.isFinite(input.mark1)) {
    snapshot.mark1 = input.mark1;
  }
  if (input.multiplierOverride !== undefined && Number.isFinite(input.multiplierOverride)) {
    snapshot.multiplierOverride = input.multiplierOverride;
  }
  if (input.shrinkPerInchOverride !== undefined && Number.isFinite(input.shrinkPerInchOverride)) {
    snapshot.shrinkPerInchOverride = input.shrinkPerInchOverride;
  }

  return snapshot;
}

export function toStoredInputSnapshot(snapshot: OffsetInputSnapshot): CalculatorInputSnapshot {
  return { ...snapshot };
}

export function sanitizeOffsetInputSnapshot(raw: unknown): OffsetInputSnapshot | null {
  if (!isRecord(raw) || raw.calculatorId !== 'offset') {
    return null;
  }

  const offsetHeight = requiredFiniteNumber(raw.offsetHeight);
  const bendAngle = optionalFiniteNumber(raw.bendAngle);
  if (offsetHeight === undefined || bendAngle === undefined || !isOffsetBendAngle(bendAngle)) {
    return null;
  }

  pickJsonLeaves(raw, ALLOWED_KEYS);
  return {
    calculatorId: 'offset',
    offsetHeight,
    bendAngle,
    mark1: optionalFiniteNumber(raw.mark1),
    multiplierOverride: optionalFiniteNumber(raw.multiplierOverride),
    shrinkPerInchOverride: optionalFiniteNumber(raw.shrinkPerInchOverride),
  };
}
