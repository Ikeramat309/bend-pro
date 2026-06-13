/**
 * 4-point saddle angle table — multiplier and shrink-per-inch per offset.
 *
 * A 4-point saddle is two offsets, so these constants mirror the standard
 * offset angle table (generic field references, not manufacturer-specific).
 * The same equal angle is used on all four bends.
 */
import type { Saddle4Angle } from './saddle4.types';
import { SADDLE4_CONFIG } from '../saddle4.config';

export type Saddle4AngleRow = {
  angle: Saddle4Angle;
  /** Conduit distance between an outer and inner bend = height × multiplier. */
  multiplier: number;
  /** Shrink per inch of height, per offset. */
  shrinkPerInch: number;
  label: string;
};

export const SADDLE4_ANGLE_DATA: Record<Saddle4Angle, Saddle4AngleRow> = {
  22.5: { angle: 22.5, multiplier: 2.6, shrinkPerInch: 3 / 16, label: '22.5°' },
  30: { angle: 30, multiplier: 2.0, shrinkPerInch: 1 / 4, label: '30°' },
  45: { angle: 45, multiplier: 1.4, shrinkPerInch: 3 / 8, label: '45°' },
};

export function isSaddle4Angle(value: unknown): value is Saddle4Angle {
  return (SADDLE4_CONFIG.validAngles as readonly number[]).includes(Number(value));
}

export function getSaddle4AngleData(angle: Saddle4Angle): Saddle4AngleRow {
  return SADDLE4_ANGLE_DATA[angle];
}
