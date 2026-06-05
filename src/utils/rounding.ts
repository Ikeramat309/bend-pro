/**
 * Display helpers for rounding options.
 */
import type { RoundingOption } from '@/features/bend-offset/engine/offsetTypes';

export function getRoundingLabel(rounding: RoundingOption): string {
  return rounding === 'exact' ? 'exact' : `${rounding} rounding`;
}
