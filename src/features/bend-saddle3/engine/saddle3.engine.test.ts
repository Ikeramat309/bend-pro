import { calculateSaddle3 } from './saddle3.engine';
import type { Saddle3EngineInput } from './saddle3.types';

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

describe('calculateSaddle3', () => {
  test('reference case: 2" obstruction at 22.5/45 with center at 24"', () => {
    const result = calculateSaddle3(
      baseInput({ obstructionHeight: 2, distanceToCenter: 24, roundingPrecision: '1/8' }),
    );

    expect(result.isValid).toBe(true);
    expect(result.centerToSide).toBeCloseTo(2 * 2.613, 2);
    expect(result.shrink).toBeCloseTo(2 * (3 / 16), 3);
    expect(result.centerMark).toBeCloseTo(24 + 2 * (3 / 16), 3);
    expect(result.sideMark1).toBeCloseTo(result.centerMark! - result.centerToSide, 2);
    expect(result.sideMark2).toBeCloseTo(result.centerMark! + result.centerToSide, 2);
    expect(result.centerMarkFormatted).toBe('24 3/8"');
    expect(result.sideAngle).toBe(22.5);
    expect(result.centerAngle).toBe(45);
  });

  test('computes spacing and shrink without distance to center', () => {
    const result = calculateSaddle3(baseInput({ obstructionHeight: 3 }));

    expect(result.centerMark).toBeUndefined();
    expect(result.centerToSide).toBeCloseTo(3 * 2.613, 2);
    expect(result.shrink).toBeCloseTo(3 * (3 / 16), 3);
    expect(result.diagramData).toBeDefined();
  });

  test('30/60 preset uses its table constants', () => {
    const result = calculateSaddle3(baseInput({ anglePreset: '30-60', obstructionHeight: 4 }));

    expect(result.centerToSide).toBe(8);
    expect(result.shrink).toBe(1);
    expect(result.sideAngle).toBe(30);
    expect(result.centerAngle).toBe(60);
  });

  test('45/90 preset uses sqrt(2) multiplier', () => {
    const result = calculateSaddle3(baseInput({ anglePreset: '45-90', obstructionHeight: 2 }));

    expect(result.centerToSide).toBeCloseTo(2 * 1.414, 2);
    expect(result.shrink).toBeCloseTo(2 * (3 / 8), 3);
  });

  test('invalid obstruction height produces warnings and no diagram', () => {
    const result = calculateSaddle3(baseInput({ obstructionHeight: 0 }));

    expect(result.isValid).toBe(false);
    expect(result.warnings).toContain('Obstruction height must be greater than 0.');
    expect(result.diagramData).toBeUndefined();
  });

  test('negative distance to center is rejected', () => {
    const result = calculateSaddle3(baseInput({ distanceToCenter: -1 }));

    expect(result.warnings).toContain('Distance to center cannot be negative.');
  });

  test('metric input converts to inches internally', () => {
    const result = calculateSaddle3(
      baseInput({
        obstructionHeight: 50.8,
        unitSystem: 'metric',
        roundingPrecision: '1mm',
        distanceToCenter: 609.6,
      }),
    );

    expect(result.obstructionHeight).toBeCloseTo(2, 2);
    expect(result.centerMark).toBeCloseTo(24 + 2 * (3 / 16), 2);
  });
});
