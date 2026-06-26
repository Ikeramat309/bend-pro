import type { BendAngle } from '@/core/types';
import type { CalculatorSetup } from '@/core/settings/calculatorSetup';
import {
  baseSetupPatchFromLayout,
  formatStoredLengthText,
  isRecord,
  mergeOffsetAngleOverrides,
  optionalFiniteNumber,
  pickJsonLeaves,
  requiredFiniteNumber,
} from '@/core/sessions/inputSnapshotUtils';
import { sanitizeSetupSnapshot } from '@/core/sessions/sessionSanitize';
import type { CalculatorInputSnapshot, RecentLayout } from '@/core/sessions/sessionTypes';

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

export type OffsetRestoredFields = {
  offsetHeightText: string;
  mark1Text: string;
  bendAngle: BendAngle;
};

export function restoreOffsetFromLayout(
  layout: RecentLayout,
  currentSetup: CalculatorSetup,
): { setupPatch: Partial<CalculatorSetup>; fields: OffsetRestoredFields } | null {
  const snap = sanitizeOffsetInputSnapshot(layout.inputSnapshot);
  if (!snap) {
    return null;
  }

  const setupSnapshot = sanitizeSetupSnapshot(layout.setupSnapshot);
  return {
    setupPatch: {
      ...baseSetupPatchFromLayout(layout),
      ...mergeOffsetAngleOverrides(
        currentSetup,
        snap.bendAngle,
        snap.multiplierOverride,
        snap.shrinkPerInchOverride,
      ),
    },
    fields: {
      offsetHeightText: formatStoredLengthText(
        snap.offsetHeight,
        setupSnapshot.unitSystem,
        setupSnapshot.roundingPrecision,
      ),
      mark1Text: formatStoredLengthText(snap.mark1, setupSnapshot.unitSystem, setupSnapshot.roundingPrecision),
      bendAngle: snap.bendAngle,
    },
  };
}
