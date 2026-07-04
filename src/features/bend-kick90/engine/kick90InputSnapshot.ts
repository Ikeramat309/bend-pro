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

import type { Kick90EngineInput } from './kick90.types';
import { KICK90_CONFIG } from '../kick90.config';

export type Kick90InputSnapshot = {
  calculatorId: 'kick90';
  kickRise: number;
  bendAngle: BendAngle;
  mark1?: number;
  multiplierOverride?: number;
  shrinkPerInchOverride?: number;
};

const ALLOWED_KEYS = [
  'calculatorId',
  'kickRise',
  'bendAngle',
  'mark1',
  'multiplierOverride',
  'shrinkPerInchOverride',
] as const;

function isKick90BendAngle(value: number): value is BendAngle {
  return (KICK90_CONFIG.validAngles as readonly number[]).includes(value);
}

export function createKick90InputSnapshot(input: Kick90EngineInput): Kick90InputSnapshot {
  const snapshot: Kick90InputSnapshot = {
    calculatorId: 'kick90',
    kickRise: input.kickRise,
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

export function toStoredInputSnapshot(snapshot: Kick90InputSnapshot): CalculatorInputSnapshot {
  return { ...snapshot };
}

export function sanitizeKick90InputSnapshot(raw: unknown): Kick90InputSnapshot | null {
  if (!isRecord(raw) || raw.calculatorId !== 'kick90') {
    return null;
  }

  const kickRise = requiredFiniteNumber(raw.kickRise);
  const bendAngle = optionalFiniteNumber(raw.bendAngle);
  if (kickRise === undefined || bendAngle === undefined || !isKick90BendAngle(bendAngle)) {
    return null;
  }

  pickJsonLeaves(raw, ALLOWED_KEYS);
  return {
    calculatorId: 'kick90',
    kickRise,
    bendAngle,
    mark1: optionalFiniteNumber(raw.mark1),
    multiplierOverride: optionalFiniteNumber(raw.multiplierOverride),
    shrinkPerInchOverride: optionalFiniteNumber(raw.shrinkPerInchOverride),
  };
}

export type Kick90RestoredFields = {
  kickRiseText: string;
  mark1Text: string;
  bendAngle: BendAngle;
};

export function restoreKick90FromLayout(
  layout: RecentLayout,
  currentSetup: CalculatorSetup,
): { setupPatch: Partial<CalculatorSetup>; fields: Kick90RestoredFields } | null {
  const snap = sanitizeKick90InputSnapshot(layout.inputSnapshot);
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
      kickRiseText: formatStoredLengthText(
        snap.kickRise,
        setupSnapshot.unitSystem,
        setupSnapshot.roundingPrecision,
      ),
      mark1Text: formatStoredLengthText(snap.mark1, setupSnapshot.unitSystem, setupSnapshot.roundingPrecision),
      bendAngle: snap.bendAngle,
    },
  };
}
