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

import type { Saddle4Angle, Saddle4EngineInput } from './saddle4.types';
import { SADDLE4_CONFIG } from '../saddle4.config';

export type Saddle4InputSnapshot = {
  calculatorId: 'saddle4';
  obstructionHeight: number;
  bendAngle: Saddle4Angle;
  saddleWidth?: number;
  distanceToCenter?: number;
};

const ALLOWED_KEYS = [
  'calculatorId',
  'obstructionHeight',
  'bendAngle',
  'saddleWidth',
  'distanceToCenter',
] as const;

function isSaddle4Angle(value: unknown): value is Saddle4Angle {
  return typeof value === 'number' && (SADDLE4_CONFIG.validAngles as readonly number[]).includes(value);
}

export function createSaddle4InputSnapshot(input: Saddle4EngineInput): Saddle4InputSnapshot {
  const snapshot: Saddle4InputSnapshot = {
    calculatorId: 'saddle4',
    obstructionHeight: input.obstructionHeight,
    bendAngle: input.bendAngle,
  };

  if (input.saddleWidth !== undefined && Number.isFinite(input.saddleWidth)) {
    snapshot.saddleWidth = input.saddleWidth;
  }
  if (input.distanceToCenter !== undefined && Number.isFinite(input.distanceToCenter)) {
    snapshot.distanceToCenter = input.distanceToCenter;
  }

  return snapshot;
}

export function toStoredInputSnapshot(snapshot: Saddle4InputSnapshot): CalculatorInputSnapshot {
  return { ...snapshot };
}

export function sanitizeSaddle4InputSnapshot(raw: unknown): Saddle4InputSnapshot | null {
  if (!isRecord(raw) || raw.calculatorId !== 'saddle4') {
    return null;
  }

  const obstructionHeight = requiredFiniteNumber(raw.obstructionHeight);
  if (obstructionHeight === undefined || !isSaddle4Angle(raw.bendAngle)) {
    return null;
  }

  pickJsonLeaves(raw, ALLOWED_KEYS);
  return {
    calculatorId: 'saddle4',
    obstructionHeight,
    bendAngle: raw.bendAngle,
    saddleWidth: optionalFiniteNumber(raw.saddleWidth),
    distanceToCenter: optionalFiniteNumber(raw.distanceToCenter),
  };
}

export type Saddle4RestoredFields = {
  obstructionHeightText: string;
  saddleWidthText: string;
  showSaddleWidthInput: boolean;
  distanceToCenterText: string;
  bendAngle: Saddle4Angle;
};

export function restoreSaddle4FromLayout(
  layout: RecentLayout,
): { setupPatch: Partial<CalculatorSetup>; fields: Saddle4RestoredFields } | null {
  const snap = sanitizeSaddle4InputSnapshot(layout.inputSnapshot);
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
      saddleWidthText: formatStoredLengthText(
        snap.saddleWidth,
        setupSnapshot.unitSystem,
        setupSnapshot.roundingPrecision,
      ),
      showSaddleWidthInput: snap.saddleWidth !== undefined,
      distanceToCenterText: formatStoredLengthText(
        snap.distanceToCenter,
        setupSnapshot.unitSystem,
        setupSnapshot.roundingPrecision,
      ),
      bendAngle: snap.bendAngle,
    },
  };
}
