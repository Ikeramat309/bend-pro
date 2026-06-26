import { snapshotSetupFromInput } from '@/core/calculations';
import { DEFAULT_CALCULATOR_SETUP, patchCalculatorSetup } from '@/core/settings/calculatorSetup';
import { parseLengthInput } from '@/core/measurements';
import { createRecentLayout } from '@/core/sessions/recentLayoutsService';

import { calculateOffset } from './offset.engine';
import {
  createOffsetInputSnapshot,
  restoreOffsetFromLayout,
  sanitizeOffsetInputSnapshot,
  toStoredInputSnapshot,
} from './offsetInputSnapshot';

describe('offsetInputSnapshot', () => {
  test('createOffsetInputSnapshot captures calculator inputs only', () => {
    const snapshot = createOffsetInputSnapshot({
      offsetHeight: 6,
      mark1: 24,
      bendAngle: 30,
      benderProfileId: 'generic-hand-bender',
      conduitType: 'EMT',
      tradeSize: '1/2',
      unitSystem: 'imperial',
      roundingPrecision: '1/16',
      multiplierOverride: 2.1,
    });

    expect(snapshot).toEqual({
      calculatorId: 'offset',
      offsetHeight: 6,
      bendAngle: 30,
      mark1: 24,
      multiplierOverride: 2.1,
    });
    expect(snapshot).not.toHaveProperty('benderProfileId');
  });

  test('toStoredInputSnapshot is JSON-safe for sessions storage', () => {
    const stored = toStoredInputSnapshot(
      createOffsetInputSnapshot({
        offsetHeight: 6,
        bendAngle: 45,
        benderProfileId: 'x',
        conduitType: 'EMT',
        tradeSize: '1/2',
        unitSystem: 'imperial',
        roundingPrecision: '1/16',
      }),
    );

    expect(JSON.parse(JSON.stringify(stored)).calculatorId).toBe('offset');
  });

  test('sanitizeOffsetInputSnapshot rejects corrupt snapshots', () => {
    expect(sanitizeOffsetInputSnapshot(null)).toBeNull();
    expect(sanitizeOffsetInputSnapshot({ calculatorId: 'stub90' })).toBeNull();
    expect(sanitizeOffsetInputSnapshot({ calculatorId: 'offset', offsetHeight: 0, bendAngle: 30 })).toBeNull();
  });

  test('sanitizeOffsetInputSnapshot ignores unknown keys', () => {
    const sanitized = sanitizeOffsetInputSnapshot({
      calculatorId: 'offset',
      offsetHeight: 6,
      bendAngle: 30,
      extra: 'ignore',
      nested: { bad: true },
    });

    expect(sanitized).toEqual({
      calculatorId: 'offset',
      offsetHeight: 6,
      bendAngle: 30,
    });
  });
});

describe('offset snapshot with engine', () => {
  test('stable calculator id through calculation pipeline', () => {
    const input = {
      offsetHeight: 6,
      bendAngle: 30 as const,
      benderProfileId: 'generic-hand-bender',
      conduitType: 'EMT' as const,
      tradeSize: '1/2' as const,
      unitSystem: 'imperial' as const,
      roundingPrecision: '1/16' as const,
    };
    calculateOffset(input);
    const snapshot = createOffsetInputSnapshot(input);
    const setup = snapshotSetupFromInput(input);

    expect(snapshot.calculatorId).toBe('offset');
    expect(setup.benderProfileId).toBe('generic-hand-bender');
  });
});

describe('offset restore round-trip', () => {
  test('restoreOffsetFromLayout reproduces the stored input snapshot', () => {
    const engineInput = {
      offsetHeight: 6,
      mark1: 24,
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

    const original = createOffsetInputSnapshot(engineInput);
    const layout = createRecentLayout({
      calculatorId: 'offset',
      calculatorTitle: 'Basic Offset',
      inputSnapshot: toStoredInputSnapshot(original),
      setupSnapshot: snapshotSetupFromInput(engineInput),
    });

    const restored = restoreOffsetFromLayout(layout, DEFAULT_CALCULATOR_SETUP);
    expect(restored).not.toBeNull();

    const patchedSetup = patchCalculatorSetup(DEFAULT_CALCULATOR_SETUP, restored!.setupPatch);
    const mark1Parsed = restored!.fields.mark1Text
      ? parseLengthInput(restored!.fields.mark1Text)
      : undefined;

    const roundTrip = createOffsetInputSnapshot({
      offsetHeight: parseLengthInput(restored!.fields.offsetHeightText) ?? Number.NaN,
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
