import type { Saddle4Angle } from './engine/saddle4.types';

/** Defaults and fixed values for the 4-Point Saddle calculator. */
export const SADDLE4_CONFIG = {
  defaultAngle: 22.5 as Saddle4Angle,
  validAngles: [22.5, 30, 45] as const,
  diagramHeight: 300,
  diagramViewBox: '0 0 360 300',
} as const;
