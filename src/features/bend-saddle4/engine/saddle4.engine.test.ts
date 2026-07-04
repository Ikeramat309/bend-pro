import { calculateSaddle4 } from './saddle4.engine';
import type { Saddle4EngineInput } from './saddle4.types';

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

describe('calculateSaddle4', () => {
  test('reference case: 2" obstruction, 4" wide, 22.5°, center at 30"', () => {
    const result = calculateSaddle4(
      baseInput({ obstructionHeight: 2, saddleWidth: 4, distanceToCenter: 30, roundingPrecision: '1/8' }),
    );

    expect(result.isValid).toBe(true);
    expect(result.betweenBends).toBeCloseTo(2 * 2.6, 3);
    expect(result.shrinkToCenter).toBeCloseTo(2 * (3 / 16), 4);
    expect(result.shrink).toBeCloseTo(2 * 2 * (3 / 16), 4);
    expect(result.centerMark).toBeCloseTo(30 + 2 * (3 / 16), 4);
    expect(result.innerMark1).toBeCloseTo(result.centerMark! - 2, 4);
    expect(result.innerMark2).toBeCloseTo(result.centerMark! + 2, 4);
    expect(result.outerMark1).toBeCloseTo(result.innerMark1! - result.betweenBends, 4);
    expect(result.outerMark2).toBeCloseTo(result.innerMark2! + result.betweenBends, 4);
    expect(result.centerMarkFormatted).toBe('30 3/8"');
    expect(result.bendAngle).toBe(22.5);
  });

  test('computes between bends from obstruction height alone', () => {
    const result = calculateSaddle4(baseInput({ saddleWidth: undefined, obstructionHeight: 2 }));

    expect(result.isValid).toBe(true);
    expect(result.betweenBends).toBeCloseTo(2 * 2.6, 3);
    expect(result.saddleWidth).toBeUndefined();
    expect(result.saddleWidthFormatted).toBeUndefined();
    expect(result.diagramData).toBeDefined();
    expect(result.diagramData?.saddleWidthInches).toBeUndefined();
  });

  test('computes spacing and shrink without distance to center', () => {
    const result = calculateSaddle4(baseInput({ obstructionHeight: 3, saddleWidth: 6 }));

    expect(result.centerMark).toBeUndefined();
    expect(result.outerMark1).toBeUndefined();
    expect(result.betweenBends).toBeCloseTo(3 * 2.6, 3);
    expect(result.shrink).toBeCloseTo(2 * 3 * (3 / 16), 4);
    expect(result.diagramData).toBeDefined();
  });

  test('30° uses multiplier 2.0 and shrink 1/4 per offset', () => {
    const result = calculateSaddle4(baseInput({ bendAngle: 30, obstructionHeight: 3 }));

    expect(result.betweenBends).toBeCloseTo(6, 4);
    expect(result.shrinkToCenter).toBeCloseTo(0.75, 4);
    expect(result.shrink).toBeCloseTo(1.5, 4);
    expect(result.bendAngle).toBe(30);
  });

  test('45° uses multiplier 1.4 and shrink 3/8 per offset', () => {
    const result = calculateSaddle4(baseInput({ bendAngle: 45, obstructionHeight: 2 }));

    expect(result.betweenBends).toBeCloseTo(2 * 1.4, 4);
    expect(result.shrink).toBeCloseTo(2 * 2 * (3 / 8), 4);
  });

  test('invalid obstruction height produces warnings and no diagram', () => {
    const result = calculateSaddle4(baseInput({ obstructionHeight: 0 }));

    expect(result.isValid).toBe(false);
    expect(result.warnings).toContain('Obstruction height must be greater than 0.');
    expect(result.diagramData).toBeUndefined();
  });

  test('invalid bend angle produces warning and invalid result without diagram', () => {
    const result = calculateSaddle4(
      baseInput({ bendAngle: 15 as Saddle4EngineInput['bendAngle'] }),
    );

    expect(result.isValid).toBe(false);
    expect(result.warnings).toContain('Selected bend angle is not valid.');
    expect(result.diagramData).toBeUndefined();
  });

  test('invalid saddle width produces a warning but keeps offset results', () => {
    const result = calculateSaddle4(baseInput({ saddleWidth: 0 }));

    expect(result.isValid).toBe(true);
    expect(result.betweenBends).toBeCloseTo(2 * 2.6, 3);
    expect(result.warnings).toContain('Saddle width must be greater than 0.');
    expect(result.diagramData).toBeDefined();
  });

  test('distance too small warns that the first outer mark falls before the pipe start', () => {
    const result = calculateSaddle4(baseInput({ distanceToCenter: 2 }));

    expect(result.outerMark1!).toBeLessThan(0);
    expect(result.warnings).toContain(
      'Distance to center is too small — the first outer mark falls before the pipe start.',
    );
  });

  test('negative distance to center is rejected', () => {
    const result = calculateSaddle4(baseInput({ distanceToCenter: -1 }));

    expect(result.warnings).toContain('Distance to center cannot be negative.');
  });

  test('metric input converts to inches internally', () => {
    const result = calculateSaddle4(
      baseInput({
        obstructionHeight: 50.8,
        saddleWidth: 101.6,
        unitSystem: 'metric',
        roundingPrecision: '1mm',
        distanceToCenter: 762,
      }),
    );

    expect(result.obstructionHeight).toBeCloseTo(2, 2);
    expect(result.saddleWidth).toBeCloseTo(4, 2);
    expect(result.centerMark).toBeCloseTo(30 + 2 * (3 / 16), 2);
  });
});
