import { calculateOffset } from './offset.engine';
import type { OffsetEngineInput } from './offset.types';
import { toOffsetCalculationResult } from './offsetCalculationResult';

function baseInput(overrides: Partial<OffsetEngineInput> = {}): OffsetEngineInput {
  return {
    offsetHeight: 6,
    bendAngle: 30,
    benderProfileId: 'generic-hand-bender',
    conduitType: 'EMT',
    tradeSize: '1/2',
    unitSystem: 'imperial',
    roundingPrecision: '1/16',
    ...overrides,
  };
}

describe('toOffsetCalculationResult', () => {
  test('valid result includes calculator id and primary/secondary layout', () => {
    const input = baseInput();
    const engine = calculateOffset(input);
    const result = toOffsetCalculationResult(input, engine);

    expect(result.calculatorId).toBe('offset');
    expect(result.status).toBe('valid');
    expect(result.primaryResults).toHaveLength(1);
    expect(result.primaryResults[0].key).toBe('distanceBetweenBends');
    expect(result.secondaryResults).toHaveLength(2);
    expect(result.warnings).toEqual([]);
  });

  test('raw inch values stay separate from display strings', () => {
    const input = baseInput();
    const engine = calculateOffset(input);
    const result = toOffsetCalculationResult(input, engine);

    expect(result.rawValuesInches.distanceBetweenBends).toBe(12);
    expect(result.displayValues.distanceBetweenBends).toBe('12"');
    expect(result.primaryResults[0].inches).toBe(12);
    expect(result.primaryResults[0].display).toBe('12"');
  });

  test('invalid input preserves warnings and empty primary results', () => {
    const input = baseInput({ offsetHeight: 0 });
    const engine = calculateOffset(input);
    const result = toOffsetCalculationResult(input, engine);

    expect(result.status).toBe('invalid');
    expect(result.primaryResults).toEqual([]);
    expect(result.secondaryResults).toEqual([]);
    expect(result.warnings.length).toBeGreaterThan(0);
  });

  test('non-blocking warnings keep status warning while results remain', () => {
    const input = baseInput({ bendAngle: 60 });
    const engine = calculateOffset(input);
    const result = toOffsetCalculationResult(input, engine);

    expect(engine.isValid).toBe(true);
    expect(result.status).toBe('warning');
    expect(result.warnings.length).toBeGreaterThan(0);
    expect(result.primaryResults).toHaveLength(1);
  });

  test('mark field steps appear when mark 1 is provided', () => {
    const input = baseInput({ mark1: 24 });
    const engine = calculateOffset(input);
    const result = toOffsetCalculationResult(input, engine);

    expect(result.fieldSteps.map((step) => step.key)).toEqual(['mark1', 'mark2']);
    expect(result.rawValuesInches.mark1).toBe(24);
    expect(result.displayValues.mark1).toBe('24"');
  });

  test('setup snapshot reflects input setup', () => {
    const input = baseInput({ tradeSize: '3/4', unitSystem: 'metric', roundingPrecision: '5mm' });
    const engine = calculateOffset(input);
    const result = toOffsetCalculationResult(input, engine);

    expect(result.setupSnapshot.tradeSize).toBe('3/4');
    expect(result.setupSnapshot.unitSystem).toBe('metric');
    expect(result.setupSnapshot.roundingPrecision).toBe('5mm');
  });

  test('specific payload carries diagram data without changing engine output', () => {
    const input = baseInput();
    const engine = calculateOffset(input);
    const result = toOffsetCalculationResult(input, engine);

    expect(result.specific.diagramData).toEqual(engine.diagramData);
    expect(result.specific.multiplier).toBe(engine.multiplier);
  });
});
