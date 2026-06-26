import { calculateSaddle4 } from './saddle4.engine';
import type { Saddle4EngineInput } from './saddle4.types';
import { toSaddle4CalculationResult } from './saddle4CalculationResult';

function baseInput(overrides: Partial<Saddle4EngineInput> = {}): Saddle4EngineInput {
  return {
    obstructionHeight: 2,
    saddleWidth: 4,
    bendAngle: 22.5,
    benderProfileId: 'generic-hand-bender',
    conduitType: 'EMT',
    tradeSize: '1/2',
    unitSystem: 'imperial',
    roundingPrecision: '1/16',
    ...overrides,
  };
}

describe('toSaddle4CalculationResult', () => {
  test('valid result includes calculator id and primary results', () => {
    const input = baseInput({ distanceToCenter: 30, roundingPrecision: '1/8' });
    const engine = calculateSaddle4(input);
    const result = toSaddle4CalculationResult(input, engine);

    expect(result.calculatorId).toBe('saddle4');
    expect(result.status).toBe('valid');
    expect(result.primaryResults[0].key).toBe('centerMark');
  });

  test('raw and display values are separated', () => {
    const input = baseInput({ distanceToCenter: 30, roundingPrecision: '1/8' });
    const engine = calculateSaddle4(input);
    const result = toSaddle4CalculationResult(input, engine);

    expect(result.rawValuesInches.betweenBends).toBeCloseTo(engine.betweenBends, 3);
    expect(result.displayValues.betweenBends).toBe(engine.betweenBendsFormatted);
  });

  test('invalid result preserves warnings', () => {
    const input = baseInput({ obstructionHeight: 0 });
    const engine = calculateSaddle4(input);
    const result = toSaddle4CalculationResult(input, engine);

    expect(result.status).toBe('invalid');
    expect(result.warnings).toEqual(engine.warnings);
  });

  test('field steps ordered with full mark workflow', () => {
    const input = baseInput({ distanceToCenter: 30, roundingPrecision: '1/8' });
    const engine = calculateSaddle4(input);
    const result = toSaddle4CalculationResult(input, engine);

    expect(result.fieldSteps.map((step) => step.key)).toEqual([
      'centerMark',
      'betweenBends',
      'saddleWidth',
      'outerMark1',
      'innerMark1',
      'innerMark2',
      'outerMark2',
      'shrink',
    ]);
  });

  test('source notes and specific payload preserved', () => {
    const input = baseInput();
    const engine = calculateSaddle4(input);
    const result = toSaddle4CalculationResult(input, engine);

    expect(result.sourceNotes.some((note) => note.key === 'angleTable')).toBe(true);
    expect(result.specific.multiplier).toBe(engine.multiplier);
  });
});
