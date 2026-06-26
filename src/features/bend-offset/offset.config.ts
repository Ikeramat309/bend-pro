import type { BendAngle } from '@/core/types';

/** Defaults and fixed values for the Offset calculator. */
export const OFFSET_CONFIG = {
  defaultAngle: 30 as BendAngle,
  validAngles: [10, 22.5, 30, 45, 60] as const,
  diagramHeight: 440,
  diagramViewBox: '0 0 300 440',
} as const;
