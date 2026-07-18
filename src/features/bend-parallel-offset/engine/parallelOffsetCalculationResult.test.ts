import { calculateParallelOffset } from './parallelOffset.engine';
import type { ParallelOffsetEngineInput } from './parallelOffset.types';
import { toParallelOffsetCalculationResult } from './parallelOffsetCalculationResult';

const input: ParallelOffsetEngineInput = {
  mode: 'layout',
  centerSpacing: 2,
  offsetHeight: 6,
  conduitCount: 4,
  baseMark: 20,
  shiftDirection: 'away-from-free-end',
  bendAngle: 30,
  benderProfileId: 'generic-hand-bender',
  conduitType: 'EMT',
  tradeSize: '1/2',
  unitSystem: 'imperial',
  roundingPrecision: '1/16',
};

describe('toParallelOffsetCalculationResult', () => {
  test('maps the hero, layout values, field steps, and source notes', () => {
    const engine = calculateParallelOffset(input);
    const result = toParallelOffsetCalculationResult(input, engine);

    expect(result.calculatorId).toBe('parallelOffset');
    expect(result.status).toBe('valid');
    expect(result.primaryResults[0].key).toBe('adjustmentPerConduit');
    expect(result.secondaryResults.map((item) => item.key)).toEqual([
      'distanceBetweenBends',
      'totalRackShift',
    ]);
    expect(result.fieldSteps).toHaveLength(4);
    expect(result.sourceNotes.some((note) => note.key === 'parallelShiftFormula')).toBe(true);
  });

  test('keeps invalid runs out of result rows', () => {
    const badInput = { ...input, centerSpacing: 0 };
    const result = toParallelOffsetCalculationResult(
      badInput,
      calculateParallelOffset(badInput),
    );

    expect(result.status).toBe('invalid');
    expect(result.primaryResults).toEqual([]);
    expect(result.fieldSteps).toEqual([]);
  });
});

