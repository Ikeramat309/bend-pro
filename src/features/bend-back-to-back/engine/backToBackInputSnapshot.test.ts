import { DEFAULT_CALCULATOR_SETUP } from '@/core/settings/calculatorSetup';
import type { RecentLayout } from '@/core/sessions/sessionTypes';

import type { BackToBackEngineInput } from './backToBack.types';
import {
  createBackToBackInputSnapshot,
  restoreBackToBackFromLayout,
  sanitizeBackToBackInputSnapshot,
} from './backToBackInputSnapshot';

function input(overrides: Partial<BackToBackEngineInput> = {}): BackToBackEngineInput {
  return {
    backToBackDistance: 36,
    benderProfileId: 'generic-hand-bender',
    conduitType: 'EMT',
    tradeSize: '1/2',
    unitSystem: 'imperial',
    roundingPrecision: '1/16',
    ...overrides,
  };
}

function layout(inputSnapshot: Record<string, unknown>): RecentLayout {
  return {
    id: 'layout-1',
    kind: 'recent',
    schemaVersion: 1,
    calculatorId: 'backToBack',
    calculatorTitle: 'Back-to-Back 90',
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
  };
}

describe('Back-to-Back input snapshots', () => {
  test('captures optional first stub and deduct override', () => {
    expect(
      createBackToBackInputSnapshot(
        input({ firstStubLength: 12, deductOverrideInches: 5.25 }),
      ),
    ).toEqual({
      calculatorId: 'backToBack',
      backToBackDistance: 36,
      firstStubLength: 12,
      deductOverrideInches: 5.25,
    });
  });

  test('sanitizer rejects wrong calculator and non-finite required values', () => {
    expect(
      sanitizeBackToBackInputSnapshot({ calculatorId: 'offset', backToBackDistance: 36 }),
    ).toBeNull();
    expect(
      sanitizeBackToBackInputSnapshot({
        calculatorId: 'backToBack',
        backToBackDistance: Number.NaN,
      }),
    ).toBeNull();
  });

  test('restore returns field text and rehydrates the shared deduct override', () => {
    const restored = restoreBackToBackFromLayout(
      layout({
        calculatorId: 'backToBack',
        backToBackDistance: 36,
        firstStubLength: 12,
        deductOverrideInches: 5.25,
      }),
      DEFAULT_CALCULATOR_SETUP,
    );

    expect(restored?.fields).toEqual({
      distanceText: '36"',
      firstStubLengthText: '12"',
      showFirstStubInput: true,
    });
    expect(restored?.setupPatch.stub90DeductOverridesInches?.['1/2']).toBe(5.25);
  });
});
