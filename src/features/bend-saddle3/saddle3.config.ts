import type { Saddle3AnglePreset } from './engine/saddle3.types';

/** Defaults and fixed values for the 3-Point Saddle calculator. */
export const SADDLE3_CONFIG = {
  defaultPreset: '22.5-45' as Saddle3AnglePreset,
  validPresets: ['22.5-45', '30-60', '45-90'] as const,
  diagramHeight: 300,
  diagramViewBox: '0 0 360 300',
} as const;
