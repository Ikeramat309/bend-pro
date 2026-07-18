import type { MatchingOffsetMode } from './engine/matchingOffset.types';

/** Fixed product and presentation limits for Matching Offset. */
export const MATCHING_OFFSET_CONFIG = {
  defaultMode: 'centers' as MatchingOffsetMode,
  maximumOffsetAngleDegrees: 60,
  shallowAngleWarningDegrees: 5,
  steepAngleWarningDegrees: 45,
  /** Generic field reference angles, not a promise about a selected bender. */
  commonFieldAnglesDegrees: [10, 15, 22.5, 30, 45, 60],
  diagramViewBox: '0 0 360 300',
  diagramHeight: 300,
} as const;

export const MATCHING_OFFSET_MODES: readonly MatchingOffsetMode[] = ['centers', 'bends'];
