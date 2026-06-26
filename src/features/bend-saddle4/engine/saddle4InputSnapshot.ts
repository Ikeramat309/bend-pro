import type { CalculatorInputSnapshot } from '@/core/sessions/sessionTypes';
import {
  isRecord,
  optionalFiniteNumber,
  pickJsonLeaves,
  requiredFiniteNumber,
} from '@/core/sessions/inputSnapshotUtils';

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
