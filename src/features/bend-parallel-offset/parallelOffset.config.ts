import type { BendAngle } from '@/core/types';

/** Product limits and defaults for the consolidated Parallel Offsets workflow. */
export const PARALLEL_OFFSET_CONFIG = {
  defaultMode: 'simple',
  defaultAngle: 30 as BendAngle,
  defaultConduitCount: 3,
  minConduitCount: 2,
  maxConduitCount: 8,
  defaultShiftDirection: 'toward-free-end',
  validAngles: [10, 22.5, 30, 45, 60] as const,
  diagramViewBox: '0 0 360 300',
} as const;

