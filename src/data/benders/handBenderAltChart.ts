import type { BenderProfile } from './types';

/**
 * Alternate generic hand-bender chart — slightly higher take-up values cited in
 * some field references and apprentice texts. Not tied to a specific brand.
 */
export const HAND_BENDER_ALT_CHART: BenderProfile = {
  id: 'hand-bender-alt-chart',
  name: 'Hand Bender (Alternate Chart)',
  category: 'hand',
  chartKind: 'generic-field-reference',
  description: 'Alternate generic take-up chart — use when your sticker runs slightly high.',
  emtStub90TakeUpInches: {
    '1/2': 5.5,
    '3/4': 6.5,
    '1': 8.5,
  },
};
