import type { CalculatorSetup } from '@/core/settings/calculatorSetup';
import {
  baseSetupPatchFromLayout,
  formatStoredLengthText,
  isRecord,
  optionalFiniteNumber,
  pickJsonLeaves,
  requiredFiniteNumber,
} from '@/core/sessions/inputSnapshotUtils';
import { sanitizeSetupSnapshot } from '@/core/sessions/sessionSanitize';
import type { CalculatorInputSnapshot, RecentLayout } from '@/core/sessions/sessionTypes';

import type { Saddle3AnglePreset, Saddle3EngineInput } from './saddle3.types';
import { SADDLE3_CONFIG } from '../saddle3.config';

export type Saddle3InputSnapshot = {
  calculatorId: 'saddle3';
  obstructionHeight: number;
  anglePreset: Saddle3AnglePreset;
  distanceToCenter?: number;
};

const ALLOWED_KEYS = [
  'calculatorId',
  'obstructionHeight',
  'anglePreset',
  'distanceToCenter',
] as const;

function isSaddle3Preset(value: unknown): value is Saddle3AnglePreset {
  return (
    typeof value === 'string' &&
    (SADDLE3_CONFIG.validPresets as readonly string[]).includes(value)
  );
}

export function createSaddle3InputSnapshot(input: Saddle3EngineInput): Saddle3InputSnapshot {
  const snapshot: Saddle3InputSnapshot = {
    calculatorId: 'saddle3',
    obstructionHeight: input.obstructionHeight,
    anglePreset: input.anglePreset,
  };

  if (input.distanceToCenter !== undefined && Number.isFinite(input.distanceToCenter)) {
    snapshot.distanceToCenter = input.distanceToCenter;
  }

  return snapshot;
}

export function toStoredInputSnapshot(snapshot: Saddle3InputSnapshot): CalculatorInputSnapshot {
  return { ...snapshot };
}

export function sanitizeSaddle3InputSnapshot(raw: unknown): Saddle3InputSnapshot | null {
  if (!isRecord(raw) || raw.calculatorId !== 'saddle3') {
    return null;
  }

  const obstructionHeight = requiredFiniteNumber(raw.obstructionHeight);
  if (obstructionHeight === undefined || !isSaddle3Preset(raw.anglePreset)) {
    return null;
  }

  pickJsonLeaves(raw, ALLOWED_KEYS);
  return {
    calculatorId: 'saddle3',
    obstructionHeight,
    anglePreset: raw.anglePreset,
    distanceToCenter: optionalFiniteNumber(raw.distanceToCenter),
  };
}

export type Saddle3RestoredFields = {
  obstructionHeightText: string;
  distanceToCenterText: string;
  anglePreset: Saddle3AnglePreset;
};

export function restoreSaddle3FromLayout(
  layout: RecentLayout,
): { setupPatch: Partial<CalculatorSetup>; fields: Saddle3RestoredFields } | null {
  const snap = sanitizeSaddle3InputSnapshot(layout.inputSnapshot);
  if (!snap) {
    return null;
  }

  const setupSnapshot = sanitizeSetupSnapshot(layout.setupSnapshot);
  return {
    setupPatch: baseSetupPatchFromLayout(layout),
    fields: {
      obstructionHeightText: formatStoredLengthText(
        snap.obstructionHeight,
        setupSnapshot.unitSystem,
        setupSnapshot.roundingPrecision,
      ),
      distanceToCenterText: formatStoredLengthText(
        snap.distanceToCenter,
        setupSnapshot.unitSystem,
        setupSnapshot.roundingPrecision,
      ),
      anglePreset: snap.anglePreset,
    },
  };
}
