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

import type { RollingEngineInput } from './rolling.types';
import { ROLLING_CONFIG } from '../rolling.config';

export type RollingInputSnapshot = {
  calculatorId: 'rolling';
  offsetHeight: number;
  advance: number;
  bendAngle: BendAngle;
  mark1?: number;
  multiplierOverride?: number;
  shrinkPerInchOverride?: number;
};

const ALLOWED_KEYS = [
  'calculatorId',
  'offsetHeight',
  'advance',
  'bendAngle',
  'mark1',
  'multiplierOverride',
  'shrinkPerInchOverride',
] as const;

function isRollingBendAngle(value: number): value is BendAngle {
  return (ROLLING_CONFIG.validAngles as readonly number[]).includes(value);
}

export function createRollingInputSnapshot(input: RollingEngineInput): RollingInputSnapshot {
  const snapshot: RollingInputSnapshot = {
    calculatorId: 'rolling',
    offsetHeight: input.offsetHeight,
    advance: input.advance,
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

export function toStoredInputSnapshot(snapshot: RollingInputSnapshot): CalculatorInputSnapshot {
  return { ...snapshot };
}

export function sanitizeRollingInputSnapshot(raw: unknown): RollingInputSnapshot | null {
  if (!isRecord(raw) || raw.calculatorId !== 'rolling') {
    return null;
  }

  const offsetHeight = requiredFiniteNumber(raw.offsetHeight);
  const advance = requiredFiniteNumber(raw.advance);
  const bendAngle = optionalFiniteNumber(raw.bendAngle);
  if (
    offsetHeight === undefined ||
    advance === undefined ||
    bendAngle === undefined ||
    !isRollingBendAngle(bendAngle)
  ) {
    return null;
  }

  pickJsonLeaves(raw, ALLOWED_KEYS);
  return {
    calculatorId: 'rolling',
    offsetHeight,
    advance,
    bendAngle,
    mark1: optionalFiniteNumber(raw.mark1),
    multiplierOverride: optionalFiniteNumber(raw.multiplierOverride),
    shrinkPerInchOverride: optionalFiniteNumber(raw.shrinkPerInchOverride),
  };
}

export type RollingRestoredFields = {
  offsetHeightText: string;
  offsetRollText: string;
  mark1Text: string;
  bendAngle: BendAngle;
};

export function restoreRollingFromLayout(
  layout: RecentLayout,
  currentSetup: CalculatorSetup,
): { setupPatch: Partial<CalculatorSetup>; fields: RollingRestoredFields } | null {
  const snap = sanitizeRollingInputSnapshot(layout.inputSnapshot);
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
      offsetRollText: formatStoredLengthText(
        snap.advance,
        setupSnapshot.unitSystem,
        setupSnapshot.roundingPrecision,
      ),
      mark1Text: formatStoredLengthText(snap.mark1, setupSnapshot.unitSystem, setupSnapshot.roundingPrecision),
      bendAngle: snap.bendAngle,
    },
  };
}
