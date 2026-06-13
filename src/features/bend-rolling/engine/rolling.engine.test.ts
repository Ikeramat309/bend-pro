/**
 * Rolling offset engine tests.
 *
 * Formulas under test:
 * trueOffset = √(offsetHeight² + advance²)
 * distanceBetweenBends = trueOffset × multiplier
 * shrink = trueOffset × shrinkPerInch
 */
import type { BendAngle, TradeSize } from '@/core/types';

import { calculateRolling } from './rolling.engine';
import type { RollingEngineInput } from './rolling.types';

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

describe('calculateRolling', () => {
  test('reference case: 6" height, 8" advance at 30° → true 10", spacing 20", shrink 2 1/2"', () => {
    const result = calculateRolling(baseInput());

    expect(result.isValid).toBe(true);
    expect(result.trueOffset).toBe(10);
    expect(result.distanceBetweenBends).toBe(20);
    expect(result.shrink).toBe(2.5);
    expect(result.multiplier).toBe(2);
    expect(result.shrinkPerInch).toBe(0.25);
    expect(result.trueOffsetFormatted).toBe('10"');
    expect(result.distanceBetweenBendsFormatted).toBe('20"');
    expect(result.shrinkFormatted).toBe('2 1/2"');
  });

  test('true offset is the hypotenuse of offset height and advance', () => {
    const result = calculateRolling(baseInput({ offsetHeight: 3, advance: 4 }));

    expect(result.trueOffset).toBe(5);
    expect(result.distanceBetweenBends).toBeCloseTo(10, 10);
  });

  test('mark 2 = mark 1 + distance between bends', () => {
    const result = calculateRolling(baseInput({ mark1: 12 }));

    expect(result.mark1).toBe(12);
    expect(result.mark2).toBe(32);
    expect(result.mark1Formatted).toBe('12"');
    expect(result.mark2Formatted).toBe('32"');
  });

  test('multiplier override replaces the table value', () => {
    const result = calculateRolling(baseInput({ multiplierOverride: 2.1 }));

    expect(result.multiplier).toBe(2.1);
    expect(result.distanceBetweenBends).toBeCloseTo(21, 10);
    expect(result.isMultiplierOverridden).toBe(true);
  });

  test('shrink override replaces the table shrink rate', () => {
    const result = calculateRolling(baseInput({ shrinkPerInchOverride: 0.3125 }));

    expect(result.shrinkPerInch).toBe(0.3125);
    expect(result.shrink).toBeCloseTo(3.125, 10);
    expect(result.isShrinkOverridden).toBe(true);
  });

  test('zero offset height is invalid', () => {
    const result = calculateRolling(baseInput({ offsetHeight: 0 }));

    expect(result.isValid).toBe(false);
    expect(result.diagramData).toBeUndefined();
    expect(result.warnings).toContain('Offset height must be greater than 0.');
  });

  test('zero advance is invalid', () => {
    const result = calculateRolling(baseInput({ advance: 0 }));

    expect(result.isValid).toBe(false);
    expect(result.warnings).toContain('Offset roll must be greater than 0.');
  });

  test('negative mark 1 produces a warning', () => {
    const result = calculateRolling(baseInput({ mark1: -1 }));

    expect(result.warnings).toContain('Mark 1 cannot be negative.');
  });

  test('60° warns about steepness', () => {
    const result = calculateRolling(baseInput({ bendAngle: 60 }));

    expect(result.warnings).toContain(
      '60° is a steep bend. It creates more shrink and may be harder to pull wire through.',
    );
  });

  test('invalid angle is invalid', () => {
    const result = calculateRolling(baseInput({ bendAngle: 15 as BendAngle }));

    expect(result.isValid).toBe(false);
    expect(result.warnings).toContain('Selected bend angle is not valid.');
  });

  test('metric input converts to inches internally', () => {
    const result = calculateRolling(
      baseInput({
        offsetHeight: 152.4,
        advance: 203.2,
        unitSystem: 'metric',
        roundingPrecision: '1mm',
      }),
    );

    expect(result.offsetHeight).toBeCloseTo(6, 2);
    expect(result.advance).toBeCloseTo(8, 2);
    expect(result.trueOffset).toBeCloseTo(10, 2);
  });

  test('diagramData includes triangle and pipe values when valid', () => {
    const result = calculateRolling(baseInput({ mark1: 10 }));

    expect(result.diagramData).toEqual({
      calculatorType: 'rolling',
      offsetHeightInches: 6,
      advanceInches: 8,
      trueOffsetInches: 10,
      distanceBetweenBendsInches: 20,
      shrinkInches: 2.5,
      mark1Inches: 10,
      mark2Inches: 30,
      bendAngle: 30,
      display: {
        offsetHeight: '6"',
        advance: '8"',
        trueOffset: '10"',
        distanceBetweenBends: '20"',
        shrink: '2 1/2"',
        mark1: '10"',
        mark2: '30"',
      },
    });
  });

  test('missing trade size warns', () => {
    const result = calculateRolling(baseInput({ tradeSize: '' as TradeSize }));

    expect(result.warnings).toContain('Please select a conduit size.');
  });
});
