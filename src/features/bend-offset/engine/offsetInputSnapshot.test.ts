import { snapshotSetupFromInput } from '@/core/calculations';

import { calculateOffset } from './offset.engine';
import {
  createOffsetInputSnapshot,
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
