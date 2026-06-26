import type { CalculatorSetup } from '@/core/settings/calculatorSetup';
import {
  baseSetupPatchFromLayout,
  formatStoredLengthText,
  isRecord,
  optionalNonNegativeNumber,
  pickJsonLeaves,
  requiredFiniteNumber,
} from '@/core/sessions/inputSnapshotUtils';
import { sanitizeSetupSnapshot } from '@/core/sessions/sessionSanitize';
import type { CalculatorInputSnapshot, RecentLayout } from '@/core/sessions/sessionTypes';

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

export type SegmentRestoredFields = {
  radiusText: string;
  totalAngleText: string;
  degreesPerBendText: string;
  startOffsetText: string;
  showStartInput: boolean;
};

export function restoreSegmentFromLayout(
  layout: RecentLayout,
): { setupPatch: Partial<CalculatorSetup>; fields: SegmentRestoredFields } | null {
  const snap = sanitizeSegmentInputSnapshot(layout.inputSnapshot);
  if (!snap) {
    return null;
  }

  const setupSnapshot = sanitizeSetupSnapshot(layout.setupSnapshot);
  return {
    setupPatch: baseSetupPatchFromLayout(layout),
    fields: {
      radiusText: formatStoredLengthText(snap.radius, setupSnapshot.unitSystem, setupSnapshot.roundingPrecision),
      totalAngleText: String(snap.totalAngle),
      degreesPerBendText: String(snap.degreesPerBend),
      startOffsetText: formatStoredLengthText(
        snap.startOffset,
        setupSnapshot.unitSystem,
        setupSnapshot.roundingPrecision,
      ),
      showStartInput: snap.startOffset !== undefined,
    },
  };
}
