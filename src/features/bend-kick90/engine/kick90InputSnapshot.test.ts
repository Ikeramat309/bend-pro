import { snapshotSetupFromInput } from '@/core/calculations';
import { DEFAULT_CALCULATOR_SETUP, patchCalculatorSetup } from '@/core/settings/calculatorSetup';
import { parseLengthInput } from '@/core/measurements';
import { createRecentLayout } from '@/core/sessions/recentLayoutsService';

import { calculateKick90 } from './kick90.engine';
import {
  createKick90InputSnapshot,
  restoreKick90FromLayout,
  sanitizeKick90InputSnapshot,
  toStoredInputSnapshot,
} from './kick90InputSnapshot';

describe('kick90InputSnapshot', () => {
  test('createKick90InputSnapshot captures calculator inputs only', () => {
    const snapshot = createKick90InputSnapshot({
      kickRise: 6,
      mark1: 10,
      bendAngle: 30,
      benderProfileId: 'generic-hand-bender',
      conduitType: 'EMT',
      tradeSize: '1/2',
      unitSystem: 'imperial',
      roundingPrecision: '1/16',
      multiplierOverride: 2.1,
    });

    expect(snapshot).toEqual({
      calculatorId: 'kick90',
      kickRise: 6,
      bendAngle: 30,
      mark1: 10,
      multiplierOverride: 2.1,
    });
    expect(snapshot).not.toHaveProperty('benderProfileId');
  });

  test('sanitizeKick90InputSnapshot rejects corrupt snapshots', () => {
    expect(sanitizeKick90InputSnapshot(null)).toBeNull();
    expect(sanitizeKick90InputSnapshot({ calculatorId: 'offset' })).toBeNull();
    expect(sanitizeKick90InputSnapshot({ calculatorId: 'kick90', kickRise: 0, bendAngle: 30 })).toBeNull();
  });
});

describe('kick90 restore round-trip', () => {
  test('restoreKick90FromLayout reproduces the stored input snapshot', () => {
    const engineInput = {
      kickRise: 6,
      mark1: 10,
      bendAngle: 30 as const,
      benderProfileId: 'generic-hand-bender',
      conduitType: 'EMT' as const,
      tradeSize: '1/2' as const,
      unitSystem: 'imperial' as const,
      roundingPrecision: '1/16' as const,
      multiplierOverride: 2.1,
      shrinkPerInchOverride: 0.125,
      customBenderProfiles: [],
    };

    calculateKick90(engineInput);
    const original = createKick90InputSnapshot(engineInput);
    const layout = createRecentLayout({
      calculatorId: 'kick90',
      calculatorTitle: 'Kick 90',
      inputSnapshot: toStoredInputSnapshot(original),
      setupSnapshot: snapshotSetupFromInput(engineInput),
    });

    const restored = restoreKick90FromLayout(layout, DEFAULT_CALCULATOR_SETUP);
    expect(restored).not.toBeNull();

    const patchedSetup = patchCalculatorSetup(DEFAULT_CALCULATOR_SETUP, restored!.setupPatch);
    const mark1Parsed = restored!.fields.mark1Text
      ? parseLengthInput(restored!.fields.mark1Text)
      : undefined;

    const roundTrip = createKick90InputSnapshot({
      kickRise: parseLengthInput(restored!.fields.kickRiseText) ?? Number.NaN,
      mark1: mark1Parsed,
      bendAngle: restored!.fields.bendAngle,
      benderProfileId: patchedSetup.benderProfileId,
      conduitType: 'EMT',
      tradeSize: patchedSetup.conduitSize,
      unitSystem: patchedSetup.unit,
      roundingPrecision: patchedSetup.rounding,
      multiplierOverride: patchedSetup.offsetMultiplierOverrides[30],
      shrinkPerInchOverride: patchedSetup.offsetShrinkPerInchOverrides[30],
      customBenderProfiles: [],
    });

    expect(roundTrip).toEqual(original);
  });
});
