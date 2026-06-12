/**
 * Standard offset angle table — multiplier and shrink-per-inch constants.
 *
 * Generic field references, not manufacturer-specific. The engine reads
 * this table; UI override sheets show these as the default chart values.
 */
import type { BendAngle } from '@/core/types';

import { OFFSET_CONFIG } from '../offset.config';

export type OffsetAngleRow = {
  multiplier: number;
  shrinkPerInch: number;
};

export const OFFSET_ANGLE_DATA: Record<BendAngle, OffsetAngleRow> = {
  10: { multiplier: 6.0, shrinkPerInch: 1 / 16 },
  22.5: { multiplier: 2.6, shrinkPerInch: 3 / 16 },
  30: { multiplier: 2.0, shrinkPerInch: 1 / 4 },
  45: { multiplier: 1.4, shrinkPerInch: 3 / 8 },
  60: { multiplier: 1.2, shrinkPerInch: 1 / 2 },
};

export function isOffsetBendAngle(value: unknown): value is BendAngle {
  return (OFFSET_CONFIG.validAngles as readonly number[]).includes(Number(value));
}

export function getOffsetAngleData(angle: BendAngle): OffsetAngleRow | undefined {
  return OFFSET_ANGLE_DATA[angle];
}

/** Display-friendly multiplier (trims trailing zeros). */
export function formatMultiplier(value: number): string {
  const rounded = Math.round(value * 100) / 100;
  return Number.isInteger(rounded) ? String(rounded) : String(rounded);
}
