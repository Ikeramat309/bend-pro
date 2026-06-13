/**
 * Standard 3-point saddle angle table — center-to-side multiplier and shrink
 * per inch of obstruction height.
 *
 * Generic field references (22.5°/45° is the most common field combo).
 * Center bend angle is always double the side bend angle.
 */
import type { Saddle3AnglePreset } from './saddle3.types';
import { SADDLE3_CONFIG } from '../saddle3.config';

export type Saddle3AngleRow = {
  preset: Saddle3AnglePreset;
  sideAngle: number;
  centerAngle: number;
  /** Distance from center mark to each outer mark = height × multiplier. */
  centerToSideMultiplier: number;
  /** Total shrink = height × shrinkPerInch (add to distance-to-center for center mark). */
  shrinkPerInch: number;
  label: string;
};

export const SADDLE3_ANGLE_DATA: Record<Saddle3AnglePreset, Saddle3AngleRow> = {
  '22.5-45': {
    preset: '22.5-45',
    sideAngle: 22.5,
    centerAngle: 45,
    centerToSideMultiplier: 2.613,
    shrinkPerInch: 3 / 16,
    label: '22.5° / 45°',
  },
  '30-60': {
    preset: '30-60',
    sideAngle: 30,
    centerAngle: 60,
    centerToSideMultiplier: 2.0,
    shrinkPerInch: 1 / 4,
    label: '30° / 60°',
  },
  '45-90': {
    preset: '45-90',
    sideAngle: 45,
    centerAngle: 90,
    centerToSideMultiplier: 1.414,
    shrinkPerInch: 3 / 8,
    label: '45° / 90°',
  },
};

export function isSaddle3AnglePreset(value: unknown): value is Saddle3AnglePreset {
  return (SADDLE3_CONFIG.validPresets as readonly string[]).includes(String(value));
}

export function getSaddle3AngleData(preset: Saddle3AnglePreset): Saddle3AngleRow {
  return SADDLE3_ANGLE_DATA[preset];
}

/** Display-friendly multiplier (trims trailing zeros). */
export function formatSaddleMultiplier(value: number): string {
  const rounded = Math.round(value * 1000) / 1000;
  return Number.isInteger(rounded) ? String(rounded) : String(rounded);
}
