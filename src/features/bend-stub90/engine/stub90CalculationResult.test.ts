import { calculateStub90 } from './stub90.engine';
import type { Stub90EngineInput } from './stub90.types';
import { toStub90CalculationResult } from './stub90CalculationResult';

function baseInput(overrides: Partial<Stub90EngineInput> = {}): Stub90EngineInput {
  return {
    stubHeight: 36,
    benderProfileId: 'generic-hand-bender',
    conduitType: 'EMT',
    tradeSize: '1/2',
    unitSystem: 'imperial',
    roundingPrecision: '1/16',
    ...overrides,
  };
}

describe('toStub90CalculationResult', () => {
  test('valid result includes calculator id and deduct mark as primary', () => {
    const input = baseInput();
    const engine = calculateStub90(input);
    const result = toStub90CalculationResult(input, engine);

    expect(result.calculatorId).toBe('stub90');
    expect(result.status).toBe('valid');
    expect(result.primaryResults[0].key).toBe('deductMark');
    expect(result.secondaryResults[0].key).toBe('deduct');
  });

  test('raw inch values stay separate from display strings', () => {
    const input = baseInput();
    const engine = calculateStub90(input);
    const result = toStub90CalculationResult(input, engine);

    expect(result.rawValuesInches.deductMark).toBe(engine.deductMark);
    expect(result.displayValues.deductMark).toBe(engine.deductMarkFormatted);
    expect(result.primaryResults[0].inches).toBe(engine.deductMark);
    expect(result.primaryResults[0].display).toBe(engine.deductMarkFormatted);
  });

  test('stub shorter than deduct is invalid with warnings preserved', () => {
    const input = baseInput({ stubHeight: 2 });
    const engine = calculateStub90(input);
    const result = toStub90CalculationResult(input, engine);

    expect(result.status).toBe('invalid');
    expect(result.primaryResults).toEqual([]);
    expect(result.warnings).toEqual(engine.warnings);
    expect(result.warnings.some((warning) => warning.includes('deduct'))).toBe(true);
  });

  test('field step documents deduct mark for valid runs', () => {
    const input = baseInput();
    const engine = calculateStub90(input);
    const result = toStub90CalculationResult(input, engine);

    expect(result.fieldSteps[0].key).toBe('deductMark');
    expect(result.fieldSteps[0].display).toBe(engine.deductMarkFormatted);
  });

  test('source notes describe deduct provenance', () => {
    const input = baseInput();
    const engine = calculateStub90(input);
    const result = toStub90CalculationResult(input, engine);

    expect(result.sourceNotes.some((note) => note.key === 'deduct')).toBe(true);
    expect(result.specific.deductSource).toBe(engine.deductSource);
  });
});
