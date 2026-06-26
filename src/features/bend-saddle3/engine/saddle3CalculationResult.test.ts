import { calculateSaddle3 } from './saddle3.engine';
import type { Saddle3EngineInput } from './saddle3.types';
import { toSaddle3CalculationResult } from './saddle3CalculationResult';

function baseInput(overrides: Partial<Saddle3EngineInput> = {}): Saddle3EngineInput {
  return {
    obstructionHeight: 2,
    anglePreset: '22.5-45',
    benderProfileId: 'generic-hand-bender',
    conduitType: 'EMT',
    tradeSize: '1/2',
    unitSystem: 'imperial',
    roundingPrecision: '1/16',
    ...overrides,
  };
}

describe('toSaddle3CalculationResult', () => {
  test('valid result includes calculator id and primary results', () => {
    const input = baseInput({ distanceToCenter: 24 });
    const engine = calculateSaddle3(input);
    const result = toSaddle3CalculationResult(input, engine);

    expect(result.calculatorId).toBe('saddle3');
    expect(result.status).toBe('valid');
    expect(result.primaryResults[0].key).toBe('centerMark');
  });

  test('raw and display values are separated', () => {
    const input = baseInput({ distanceToCenter: 24, roundingPrecision: '1/8' });
    const engine = calculateSaddle3(input);
    const result = toSaddle3CalculationResult(input, engine);

    expect(result.rawValuesInches.centerMark).toBeCloseTo(engine.centerMark!, 3);
    expect(result.displayValues.centerMark).toBe(engine.centerMarkFormatted);
  });

  test('invalid result preserves warnings', () => {
    const input = baseInput({ obstructionHeight: 0 });
    const engine = calculateSaddle3(input);
    const result = toSaddle3CalculationResult(input, engine);

    expect(result.status).toBe('invalid');
    expect(result.primaryResults).toEqual([]);
    expect(result.warnings).toEqual(engine.warnings);
  });

  test('field steps ordered when marks exist', () => {
    const input = baseInput({ distanceToCenter: 24, roundingPrecision: '1/8' });
    const engine = calculateSaddle3(input);
    const result = toSaddle3CalculationResult(input, engine);

    expect(result.fieldSteps.map((step) => step.key)).toEqual([
      'centerMark',
      'centerToSide',
      'sideMark1',
      'sideMark2',
      'shrink',
    ]);
  });

  test('source notes explain missing mark workflow without distance', () => {
    const input = baseInput();
    const engine = calculateSaddle3(input);
    const result = toSaddle3CalculationResult(input, engine);

    expect(result.sourceNotes.some((note) => note.key === 'markWorkflow')).toBe(true);
    expect(result.specific.anglePreset).toBe('22.5-45');
  });
});
