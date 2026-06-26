import type { CalculatorInputSnapshot } from '@/core/sessions/sessionTypes';
import {
  isRecord,
  optionalNonNegativeNumber,
  pickJsonLeaves,
  requiredFiniteNumber,
} from '@/core/sessions/inputSnapshotUtils';

import type { SegmentEngineInput } from './segment.types';

export type SegmentInputSnapshot = {
  calculatorId: 'segment';
  radius: number;
  totalAngle: number;
  degreesPerBend: number;
  startOffset?: number;
};

const ALLOWED_KEYS = [
  'calculatorId',
  'radius',
  'totalAngle',
  'degreesPerBend',
  'startOffset',
] as const;

export function createSegmentInputSnapshot(input: SegmentEngineInput): SegmentInputSnapshot {
  const snapshot: SegmentInputSnapshot = {
    calculatorId: 'segment',
    radius: input.radius,
    totalAngle: input.totalAngle,
    degreesPerBend: input.degreesPerBend,
  };

  if (input.startOffset !== undefined && Number.isFinite(input.startOffset)) {
    snapshot.startOffset = input.startOffset;
  }

  return snapshot;
}

export function toStoredInputSnapshot(snapshot: SegmentInputSnapshot): CalculatorInputSnapshot {
  return { ...snapshot };
}

export function sanitizeSegmentInputSnapshot(raw: unknown): SegmentInputSnapshot | null {
  if (!isRecord(raw) || raw.calculatorId !== 'segment') {
    return null;
  }

  const radius = requiredFiniteNumber(raw.radius);
  const totalAngle = requiredFiniteNumber(raw.totalAngle);
  const degreesPerBend = requiredFiniteNumber(raw.degreesPerBend);
  if (radius === undefined || totalAngle === undefined || degreesPerBend === undefined) {
    return null;
  }

  pickJsonLeaves(raw, ALLOWED_KEYS);
  return {
    calculatorId: 'segment',
    radius,
    totalAngle,
    degreesPerBend,
    startOffset: optionalNonNegativeNumber(raw.startOffset),
  };
}
