import type { BenderProfile } from './types';

/**
 * Compact-shoe generic hand bender — lower take-up values for tighter-radius
 * hand bender shoes. Generic field reference, not a manufacturer chart.
 */
export const HAND_BENDER_COMPACT: BenderProfile = {
  id: 'hand-bender-compact',
  name: 'Hand Bender (Compact Shoe)',
  category: 'hand',
  description: 'Generic compact-shoe reference — tighter take-up than a standard hand bender.',
  emtStub90TakeUpInches: {
    '1/2': 4.5,
    '3/4': 5.5,
    '1': 7.5,
  },
};
