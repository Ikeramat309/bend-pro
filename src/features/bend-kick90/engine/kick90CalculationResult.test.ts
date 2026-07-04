import { calculateKick90 } from './kick90.engine';
import type { Kick90EngineInput } from './kick90.types';
import { toKick90CalculationResult } from './kick90CalculationResult';

function baseInput(overrides: Partial<Kick90EngineInput> = {}): Kick90EngineInput {
  return {
    kickRise: 6,
    bendAngle: 30,
    benderProfileId: 'generic-hand-bender',
    conduitType: 'EMT',
    tradeSize: '1/2',
    unitSystem: 'imperial',
    roundingPrecision: '1/16',
    ...overrides,
  };
}

describe('toKick90CalculationResult', () => {
  test('valid result shape with calculator id and primary results', () => {
    const input = baseInput();
    const engine = calculateKick90(input);
    const result = toKick90CalculationResult(input, engine);

    expect(result.calculatorId).toBe('kick90');
    expect(result.status).toBe('valid');
    expect(result.primaryResults[0].key).toBe('distanceBetweenBends');
    expect(result.warnings).toEqual([]);
  });

  test('raw inch values stay separate from display values', () => {
    const input = baseInput();
    const engine = calculateKick90(input);
    const result = toKick90CalculationResult(input, engine);

    expect(result.rawValuesInches.kickRise).toBe(6);
    expect(result.displayValues.kickRise).toBe('6"');
  });

  test('invalid result preserves warnings and skips primary results', () => {
    const input = baseInput({ kickRise: 0 });
    const engine = calculateKick90(input);
    const result = toKick90CalculationResult(input, engine);

    expect(result.status).toBe('invalid');
    expect(result.primaryResults).toEqual([]);
    expect(result.warnings).toEqual(engine.warnings);
  });

  test('warnings preserved for steep angle', () => {
    const input = baseInput({ bendAngle: 60 });
    const engine = calculateKick90(input);
    const result = toKick90CalculationResult(input, engine);

    expect(result.status).toBe('warning');
    expect(result.warnings.length).toBeGreaterThan(0);
    expect(result.primaryResults).toHaveLength(1);
  });

  test('field steps are ordered when mark 1 is set', () => {
    const input = baseInput({ mark1: 10 });
    const engine = calculateKick90(input);
    const result = toKick90CalculationResult(input, engine);

    expect(result.fieldSteps.map((step) => step.key)).toEqual(['kickRise', 'mark1', 'mark2']);
    expect(result.fieldSteps.every((step, index) => step.order === index + 1)).toBe(true);
  });

  test('source notes and specific payload preserved', () => {
    const input = baseInput();
    const engine = calculateKick90(input);
    const result = toKick90CalculationResult(input, engine);

    expect(result.sourceNotes.some((note) => note.key === 'benderProfile')).toBe(true);
    expect(result.specific.multiplier).toBe(engine.multiplier);
    expect(result.specific.diagramData).toEqual(engine.diagramData);
  });
});
