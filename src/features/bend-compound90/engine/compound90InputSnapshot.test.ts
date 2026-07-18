import type { RecentLayout } from '@/core/sessions';

import {
  createCompound90InputSnapshot,
  restoreCompound90FromLayout,
  sanitizeCompound90InputSnapshot,
} from './compound90InputSnapshot';

describe('compound90 input snapshots', () => {
  test('round-trips the shape and optional marks', () => {
    const snapshot = createCompound90InputSnapshot({
      shape: 'box',
      primaryDimension: 2,
      secondaryDimension: 4,
      clearance: 0.5,
      firstMark: 20,
      benderProfileId: 'generic-hand-bender',
      conduitType: 'EMT',
      tradeSize: '1/2',
      unitSystem: 'imperial',
      roundingPrecision: '1/16',
    });
    expect(sanitizeCompound90InputSnapshot(snapshot)).toEqual(snapshot);
  });

  test('migrates a legacy square to the equivalent square-on-point method', () => {
    const layout = {
      calculatorId: 'compound90',
      inputSnapshot: {
        calculatorId: 'compound90',
        shape: 'square',
        primaryDimension: 4,
      },
      setupSnapshot: {
        unitSystem: 'imperial',
        roundingPrecision: '1/16',
        conduitType: 'EMT',
        tradeSize: '1/2',
        benderProfileId: 'generic-hand-bender',
      },
    } as unknown as RecentLayout;
    expect(restoreCompound90FromLayout(layout)?.fields).toMatchObject({
      shape: 'diamond',
      primaryDimensionText: '4"',
      clearanceText: '',
    });
  });
});
