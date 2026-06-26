import type { BenderProfile } from './types';

/**
 * Compact-shoe generic hand bender — lower take-up values for tighter-radius
 * hand bender shoes. Generic field reference, not a manufacturer chart.
 */
export const HAND_BENDER_COMPACT: BenderProfile = {
  id: 'hand-bender-compact',
  name: 'Hand Bender (Compact Shoe)',
  category: 'hand',
  chartKind: 'generic-field-reference',
  description: 'Generic compact-shoe reference — tighter take-up than a standard hand bender.',
  // Generic compact-shoe field reference (~-0.5" vs standard). Not a brand chart.
  emtStub90TakeUpInches: {
    '1/2': 4.5,
    '3/4': 5.5,
    '1': 7.5,
    '1-1/4': 10.5,
  },
};
