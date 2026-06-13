/** Defaults and fixed values for the Segment Bend calculator. */
export const SEGMENT_CONFIG = {
  defaultTotalAngle: 90,
  defaultDegreesPerBend: 10,
  /** Above this many shots, the diagram thins the ticks it draws (math is unchanged). */
  maxRenderedTicks: 18,
  diagramHeight: 232,
  diagramViewBox: '0 0 360 232',
} as const;
