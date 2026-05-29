/**
 * Display helpers for rounding options.
 */
import type { RoundingOption } from '@/calculators/offset/offsetTypes';

export function getRoundingLabel(rounding: RoundingOption): string {
  return rounding === 'exact' ? 'exact' : `${rounding} rounding`;
}
