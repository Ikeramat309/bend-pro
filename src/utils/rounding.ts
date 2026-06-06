/**
 * Display helpers for rounding options.
 */
import type { RoundingOption } from '@/core/types';

export function getRoundingLabel(rounding: RoundingOption): string {
  return rounding === 'exact' ? 'exact' : `${rounding} rounding`;
}
