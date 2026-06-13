import type { BendAngle } from '@/core/types';

/** Defaults and fixed values for the Rolling Offset calculator. */
export const ROLLING_CONFIG = {
  defaultAngle: 30 as BendAngle,
  validAngles: [10, 22.5, 30, 45, 60] as const,
  diagramHeight: 300,
  diagramViewBox: '0 0 360 300',
} as const;
