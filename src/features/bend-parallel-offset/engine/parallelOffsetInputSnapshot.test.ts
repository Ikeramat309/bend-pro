import { snapshotSetupFromInput } from '@/core/calculations';
import { parseLengthInput } from '@/core/measurements';
import { DEFAULT_CALCULATOR_SETUP } from '@/core/settings/calculatorSetup';
import { createRecentLayout } from '@/core/sessions/recentLayoutsService';

import type { ParallelOffsetEngineInput } from './parallelOffset.types';
import {
  createParallelOffsetInputSnapshot,
  restoreParallelOffsetFromLayout,
  sanitizeParallelOffsetInputSnapshot,
  toStoredInputSnapshot,
} from './parallelOffsetInputSnapshot';

const input: ParallelOffsetEngineInput = {
  mode: 'layout',
  centerSpacing: 2,
  offsetHeight: 6,
  conduitCount: 4,
  baseMark: 20,
  shiftDirection: 'toward-free-end',
  bendAngle: 30,
  benderProfileId: 'generic-hand-bender',
  conduitType: 'EMT',
  tradeSize: '1/2',
  unitSystem: 'imperial',
  roundingPrecision: '1/16',
};

describe('parallelOffsetInputSnapshot', () => {
  test('captures only calculator-specific inputs', () => {
    expect(createParallelOffsetInputSnapshot(input)).toEqual({
      calculatorId: 'parallelOffset',
      mode: 'layout',
      centerSpacing: 2,
      bendAngle: 30,
      offsetHeight: 6,
      conduitCount: 4,
      baseMark: 20,
      shiftDirection: 'toward-free-end',
    });
  });

  test('rejects corrupt, partial, and unsupported snapshots', () => {
    expect(sanitizeParallelOffsetInputSnapshot(null)).toBeNull();
    expect(
      sanitizeParallelOffsetInputSnapshot({
        calculatorId: 'parallelOffset',
        mode: 'layout',
        centerSpacing: 2,
        bendAngle: 30,
        offsetHeight: 6,
        conduitCount: 1,
        shiftDirection: 'toward-free-end',
      }),
    ).toBeNull();
  });

  test('restores a full layout without losing its direction or base mark', () => {
    const snapshot = createParallelOffsetInputSnapshot(input);
    const layout = createRecentLayout({
      calculatorId: 'parallelOffset',
      calculatorTitle: 'Parallel Offsets',
      inputSnapshot: toStoredInputSnapshot(snapshot),
      setupSnapshot: snapshotSetupFromInput(input),
    });
    const restored = restoreParallelOffsetFromLayout(layout);

    expect(restored).not.toBeNull();
    expect(parseLengthInput(restored!.fields.centerSpacingText)).toBe(2);
    expect(parseLengthInput(restored!.fields.offsetHeightText)).toBe(6);
    expect(parseLengthInput(restored!.fields.baseMarkText)).toBe(20);
    expect(restored!.fields.shiftDirection).toBe('toward-free-end');
    expect(restored!.setupPatch.unit).toBe(DEFAULT_CALCULATOR_SETUP.unit);
  });
});

