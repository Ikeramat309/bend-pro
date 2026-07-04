/**
 * Standard offset angle table — multiplier and shrink-per-inch constants.
 *
 * Generic field references, not manufacturer-specific. The engine reads
 * this table; UI override sheets show these as the default chart values.
 */
import type { BendAngle } from '@/core/types';

import { KICK90_CONFIG } from '../kick90.config';

export type Kick90AngleRow = {
  multiplier: number;
  shrinkPerInch: number;
};

export const KICK90_ANGLE_DATA: Record<BendAngle, Kick90AngleRow> = {
  10: { multiplier: 6.0, shrinkPerInch: 1 / 16 },
  22.5: { multiplier: 2.6, shrinkPerInch: 3 / 16 },
  30: { multiplier: 2.0, shrinkPerInch: 1 / 4 },
  45: { multiplier: 1.4, shrinkPerInch: 3 / 8 },
  60: { multiplier: 1.2, shrinkPerInch: 1 / 2 },
};

export function isKick90BendAngle(value: unknown): value is BendAngle {
  return (KICK90_CONFIG.validAngles as readonly number[]).includes(Number(value));
}

export function getKick90AngleData(angle: BendAngle): Kick90AngleRow | undefined {
  return KICK90_ANGLE_DATA[angle];
}

/** Display-friendly multiplier (trims trailing zeros). */
export function formatKick90Multiplier(value: number): string {
  const rounded = Math.round(value * 100) / 100;
  return Number.isInteger(rounded) ? String(rounded) : String(rounded);
}
