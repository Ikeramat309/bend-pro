import { calculateBackToBack } from './backToBack.engine';
import type { BackToBackEngineInput } from './backToBack.types';
import { toBackToBackCalculationResult } from './backToBackCalculationResult';

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

describe('toBackToBackCalculationResult', () => {
  test('makes the direct star measurement the single primary result', () => {
    const engineInput = input();
    const result = toBackToBackCalculationResult(
      engineInput,
      calculateBackToBack(engineInput),
    );

    expect(result.calculatorId).toBe('backToBack');
    expect(result.status).toBe('valid');
    expect(result.primaryResults).toEqual([
      expect.objectContaining({ key: 'second90Mark', inches: 36, display: '36"' }),
    ]);
    expect(result.secondaryResults).toEqual([]);
    expect(result.specific.directStarMeasurement).toBe(true);
  });

  test('adds first deduct mark and deduct when optional first stub is usable', () => {
    const engineInput = input({ firstStubLength: 12 });
    const result = toBackToBackCalculationResult(
      engineInput,
      calculateBackToBack(engineInput),
    );

    expect(result.secondaryResults.map((item) => item.key)).toEqual([
      'firstDeductMark',
      'deduct',
    ]);
    expect(result.fieldSteps.map((step) => step.key)).toEqual([
      'firstDeductMark',
      'second90Mark',
    ]);
    expect(result.sourceNotes.some((note) => note.key === 'benderProfile')).toBe(true);
  });

  test('invalid distance has no primary result and preserves warnings', () => {
    const engineInput = input({ backToBackDistance: 0 });
    const engineResult = calculateBackToBack(engineInput);
    const result = toBackToBackCalculationResult(engineInput, engineResult);

    expect(result.status).toBe('invalid');
    expect(result.primaryResults).toEqual([]);
    expect(result.secondaryResults).toEqual([]);
    expect(result.warnings).toEqual(engineResult.warnings);
  });

  test('missing optional stub chart is a warning while the second mark remains usable', () => {
    const engineInput = input({ firstStubLength: 24, tradeSize: '1-1/2' });
    const result = toBackToBackCalculationResult(
      engineInput,
      calculateBackToBack(engineInput),
    );

    expect(result.status).toBe('warning');
    expect(result.primaryResults[0].key).toBe('second90Mark');
    expect(result.secondaryResults).toEqual([]);
  });
});
