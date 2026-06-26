import type { CalculatorInputSnapshot } from '@/core/sessions/sessionTypes';
import {
  isRecord,
  optionalFiniteNumber,
  pickJsonLeaves,
  requiredFiniteNumber,
} from '@/core/sessions/inputSnapshotUtils';

import type { Stub90EngineInput } from './stub90.types';

export type Stub90InputSnapshot = {
  calculatorId: 'stub90';
  stubHeight: number;
  legLength?: number;
  deductOverrideInches?: number;
};

const ALLOWED_KEYS = ['calculatorId', 'stubHeight', 'legLength', 'deductOverrideInches'] as const;

export function createStub90InputSnapshot(input: Stub90EngineInput): Stub90InputSnapshot {
  const snapshot: Stub90InputSnapshot = {
    calculatorId: 'stub90',
    stubHeight: input.stubHeight,
  };

  if (input.legLength !== undefined && Number.isFinite(input.legLength)) {
    snapshot.legLength = input.legLength;
  }
  if (input.deductOverrideInches !== undefined && Number.isFinite(input.deductOverrideInches)) {
    snapshot.deductOverrideInches = input.deductOverrideInches;
  }

  return snapshot;
}

export function toStoredInputSnapshot(snapshot: Stub90InputSnapshot): CalculatorInputSnapshot {
  return { ...snapshot };
}

export function sanitizeStub90InputSnapshot(raw: unknown): Stub90InputSnapshot | null {
  if (!isRecord(raw) || raw.calculatorId !== 'stub90') {
    return null;
  }

  const stubHeight = requiredFiniteNumber(raw.stubHeight);
  if (stubHeight === undefined) {
    return null;
  }

  pickJsonLeaves(raw, ALLOWED_KEYS);
  return {
    calculatorId: 'stub90',
    stubHeight,
    legLength: optionalFiniteNumber(raw.legLength),
    deductOverrideInches: optionalFiniteNumber(raw.deductOverrideInches),
  };
}
