import { calculateRolling } from './rolling.engine';
import type { RollingEngineInput } from './rolling.types';
import { toRollingCalculationResult } from './rollingCalculationResult';

function baseInput(overrides: Partial<RollingEngineInput> = {}): RollingEngineInput {
  return {
    offsetHeight: 6,
    advance: 8,
    bendAngle: 30,
    benderProfileId: 'generic-hand-bender',
    conduitType: 'EMT',
    tradeSize: '1/2',
    unitSystem: 'imperial',
    roundingPrecision: '1/16',
    ...overrides,
  };
}

describe('toRollingCalculationResult', () => {
  test('valid result shape with calculator id and primary results', () => {
    const input = baseInput();
    const engine = calculateRolling(input);
    const result = toRollingCalculationResult(input, engine);

    expect(result.calculatorId).toBe('rolling');
    expect(result.status).toBe('valid');
    expect(result.primaryResults[0].key).toBe('distanceBetweenBends');
    expect(result.warnings).toEqual([]);
  });

  test('raw inch values stay separate from display values', () => {
    const input = baseInput();
    const engine = calculateRolling(input);
    const result = toRollingCalculationResult(input, engine);

    expect(result.rawValuesInches.trueOffset).toBe(10);
    expect(result.displayValues.trueOffset).toBe('10"');
  });

  test('invalid result preserves warnings and skips primary results', () => {
    const input = baseInput({ offsetHeight: 0 });
    const engine = calculateRolling(input);
    const result = toRollingCalculationResult(input, engine);

    expect(result.status).toBe('invalid');
    expect(result.primaryResults).toEqual([]);
    expect(result.warnings).toEqual(engine.warnings);
  });

  test('warnings preserved for steep angle', () => {
    const input = baseInput({ bendAngle: 60 });
    const engine = calculateRolling(input);
    const result = toRollingCalculationResult(input, engine);

    expect(result.status).toBe('warning');
    expect(result.warnings.length).toBeGreaterThan(0);
    expect(result.primaryResults).toHaveLength(1);
  });

  test('field steps are ordered', () => {
    const input = baseInput({ mark1: 24 });
    const engine = calculateRolling(input);
    const result = toRollingCalculationResult(input, engine);

    expect(result.fieldSteps.map((step) => step.key)).toEqual([
      'trueOffset',
      'offsetHeight',
      'offsetRoll',
      'mark1',
      'mark2',
    ]);
    expect(result.fieldSteps.every((step, index) => step.order === index + 1)).toBe(true);
  });

  test('source notes and specific payload preserved', () => {
    const input = baseInput();
    const engine = calculateRolling(input);
    const result = toRollingCalculationResult(input, engine);

    expect(result.sourceNotes.some((note) => note.key === 'benderProfile')).toBe(true);
    expect(result.specific.trueOffset).toBe(engine.trueOffset);
    expect(result.specific.diagramData).toEqual(engine.diagramData);
  });
});
