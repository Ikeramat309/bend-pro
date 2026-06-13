/**
 * Standard offset angle table for rolling offset — multiplier and shrink-per-inch.
 *
 * Rolling offset uses the true offset with the same generic field table as the
 * basic offset calculator (not manufacturer-specific).
 */
import type { BendAngle } from '@/core/types';

import { ROLLING_CONFIG } from '../rolling.config';

export type RollingAngleRow = {
  multiplier: number;
  shrinkPerInch: number;
};

export const ROLLING_ANGLE_DATA: Record<BendAngle, RollingAngleRow> = {
  10: { multiplier: 6.0, shrinkPerInch: 1 / 16 },
  22.5: { multiplier: 2.6, shrinkPerInch: 3 / 16 },
  30: { multiplier: 2.0, shrinkPerInch: 1 / 4 },
  45: { multiplier: 1.4, shrinkPerInch: 3 / 8 },
  60: { multiplier: 1.2, shrinkPerInch: 1 / 2 },
};

export function isRollingBendAngle(value: unknown): value is BendAngle {
  return (ROLLING_CONFIG.validAngles as readonly number[]).includes(Number(value));
}

export function getRollingAngleData(angle: BendAngle): RollingAngleRow | undefined {
  return ROLLING_ANGLE_DATA[angle];
}

/** Display-friendly multiplier (trims trailing zeros). */
export function formatRollingMultiplier(value: number): string {
  const rounded = Math.round(value * 100) / 100;
  return Number.isInteger(rounded) ? String(rounded) : String(rounded);
}
