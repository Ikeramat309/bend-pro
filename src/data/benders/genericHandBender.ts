import type { BenderProfile } from './types';

/**
 * Generic hand bender — default EMT profile for Bend Pro.
 *
 * Take-up values are approximate generic field references for stub 90° bends.
 * They are not tied to a specific manufacturer shoe chart.
 */
export const GENERIC_HAND_BENDER: BenderProfile = {
  id: 'generic-hand-bender',
  name: 'Generic Hand Bender',
  category: 'hand',
  emtStub90TakeUpInches: {
    '1/2': 5,
    '3/4': 6,
    '1': 8,
  },
};
