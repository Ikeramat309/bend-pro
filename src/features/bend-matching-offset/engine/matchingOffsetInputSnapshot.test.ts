import { DEFAULT_CALCULATOR_SETUP } from '@/core/settings/calculatorSetup';
import type { RecentLayout } from '@/core/sessions/sessionTypes';

import type { MatchingOffsetEngineInput } from './matchingOffset.types';
import {
  createMatchingOffsetInputSnapshot,
  restoreMatchingOffsetFromLayout,
  sanitizeMatchingOffsetInputSnapshot,
} from './matchingOffsetInputSnapshot';

const input: MatchingOffsetEngineInput = {
  mode: 'centers',
  offsetHeight: 4,
  adjacent: 9,
  benderProfileId: 'generic-hand-bender',
  conduitType: 'EMT',
  tradeSize: '1/2',
  unitSystem: 'imperial',
  roundingPrecision: '1/16',
};

function layout(inputSnapshot: RecentLayout['inputSnapshot']): RecentLayout {
  return {
    id: 'matching-layout',
    schemaVersion: 1,
    calculatorId: 'matchingOffset',
    calculatorTitle: 'Matching Offset',
    inputSnapshot,
    setupSnapshot: {
      unitSystem: 'imperial',
      roundingPrecision: '1/16',
      conduitType: 'EMT',
      tradeSize: '1/2',
      benderProfileId: 'generic-hand-bender',
    },
    warnings: [],
    createdAt: '2026-07-15T00:00:00.000Z',
    updatedAt: '2026-07-15T00:00:00.000Z',
    kind: 'recent',
  };
}

describe('Matching Offset input snapshots', () => {
  it('creates a mode-specific centers snapshot', () => {
    expect(createMatchingOffsetInputSnapshot(input)).toEqual({
      calculatorId: 'matchingOffset',
      mode: 'centers',
      offsetHeight: 4,
      adjacent: 9,
    });
  });

  it('sanitizes a bends snapshot and ignores unknown data', () => {
    expect(
      sanitizeMatchingOffsetInputSnapshot({
        calculatorId: 'matchingOffset',
        mode: 'bends',
        offsetHeight: 6,
        referenceDistanceBetweenBends: 12,
        injected: { nope: true },
      }),
    ).toEqual({
      calculatorId: 'matchingOffset',
      mode: 'bends',
      offsetHeight: 6,
      referenceDistanceBetweenBends: 12,
    });
  });

  it('rejects missing, non-positive, and cross-mode distances', () => {
    expect(
      sanitizeMatchingOffsetInputSnapshot({
        calculatorId: 'matchingOffset',
        mode: 'centers',
        offsetHeight: 4,
        referenceDistanceBetweenBends: 9,
      }),
    ).toBeNull();
    expect(
      sanitizeMatchingOffsetInputSnapshot({
        calculatorId: 'matchingOffset',
        mode: 'bends',
        offsetHeight: 4,
        referenceDistanceBetweenBends: 0,
      }),
    ).toBeNull();
  });

  it('restores the mode and formatted input values', () => {
    const restored = restoreMatchingOffsetFromLayout(
      layout(createMatchingOffsetInputSnapshot(input)),
      DEFAULT_CALCULATOR_SETUP,
    );

    expect(restored?.fields).toEqual({
      mode: 'centers',
      offsetHeightText: '4"',
      referenceText: '9"',
    });
    expect(restored?.setupPatch.conduitSize).toBe('1/2');
  });
});
