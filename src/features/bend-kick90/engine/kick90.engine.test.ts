/**
 * Kick 90 engine tests.
 *
 * Formulas under test:
 * distanceBetweenBends = kickRise × multiplier
 * shrink = kickRise × shrinkPerInch
 */
import type { BendAngle, TradeSize } from '@/core/types';

import { calculateKick90 } from './kick90.engine';
import type { Kick90EngineInput } from './kick90.types';

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

describe('calculateKick90', () => {
  test('reference case: 6" kick rise at 30° → 12" between bends, 1 1/2" shrink', () => {
    const result = calculateKick90(baseInput());

    expect(result.isValid).toBe(true);
    expect(result.kickRise).toBe(6);
    expect(result.distanceBetweenBends).toBe(12);
    expect(result.shrink).toBe(1.5);
    expect(result.multiplier).toBe(2);
    expect(result.shrinkPerInch).toBe(0.25);
    expect(result.distanceBetweenBendsFormatted).toBe('12"');
    expect(result.shrinkFormatted).toBe('1 1/2"');
    expect(result.kickRiseFormatted).toBe('6"');
  });

  describe('angle table (6" kick rise)', () => {
    const cases: {
      angle: BendAngle;
      multiplier: number;
      spacing: number;
      shrink: number;
      spacingFormatted: string;
      shrinkFormatted: string;
    }[] = [
      { angle: 10, multiplier: 6.0, spacing: 36, shrink: 0.375, spacingFormatted: '36"', shrinkFormatted: '3/8"' },
      { angle: 22.5, multiplier: 2.6, spacing: 15.6, shrink: 1.125, spacingFormatted: '15 5/8"', shrinkFormatted: '1 1/8"' },
      { angle: 30, multiplier: 2.0, spacing: 12, shrink: 1.5, spacingFormatted: '12"', shrinkFormatted: '1 1/2"' },
      { angle: 45, multiplier: 1.4, spacing: 8.4, shrink: 2.25, spacingFormatted: '8 3/8"', shrinkFormatted: '2 1/4"' },
      { angle: 60, multiplier: 1.2, spacing: 7.2, shrink: 3, spacingFormatted: '7 3/16"', shrinkFormatted: '3"' },
    ];

    test.each(cases)(
      '$angle° → multiplier $multiplier, spacing $spacingFormatted, shrink $shrinkFormatted',
      ({ angle, multiplier, spacing, shrink, spacingFormatted, shrinkFormatted }) => {
        const result = calculateKick90(baseInput({ bendAngle: angle }));

        expect(result.multiplier).toBe(multiplier);
        expect(result.distanceBetweenBends).toBeCloseTo(spacing, 10);
        expect(result.shrink).toBeCloseTo(shrink, 10);
        expect(result.distanceBetweenBendsFormatted).toBe(spacingFormatted);
        expect(result.shrinkFormatted).toBe(shrinkFormatted);
      },
    );
  });

  test('mark 2 = mark 1 + distance between bends', () => {
    const result = calculateKick90(baseInput({ mark1: 12 }));

    expect(result.mark1).toBe(12);
    expect(result.mark2).toBe(24);
    expect(result.mark1Formatted).toBe('12"');
    expect(result.mark2Formatted).toBe('24"');
  });

  test('multiplier override replaces the table value', () => {
    const result = calculateKick90(baseInput({ multiplierOverride: 2.1 }));

    expect(result.multiplier).toBe(2.1);
    expect(result.distanceBetweenBends).toBeCloseTo(12.6, 10);
    expect(result.isMultiplierOverridden).toBe(true);
  });

  test('shrink override replaces the table shrink rate', () => {
    const result = calculateKick90(baseInput({ shrinkPerInchOverride: 0.3125 }));

    expect(result.shrinkPerInch).toBe(0.3125);
    expect(result.shrink).toBeCloseTo(1.875, 10);
    expect(result.isShrinkOverridden).toBe(true);
  });

  test('zero kick rise is invalid', () => {
    const result = calculateKick90(baseInput({ kickRise: 0 }));

    expect(result.isValid).toBe(false);
    expect(result.diagramData).toBeUndefined();
    expect(result.warnings).toContain('Kick rise must be greater than 0.');
  });

  test('NaN kick rise is invalid', () => {
    const result = calculateKick90(baseInput({ kickRise: Number.NaN }));

    expect(result.isValid).toBe(false);
    expect(result.diagramData).toBeUndefined();
    expect(result.warnings).toContain('Kick rise must be greater than 0.');
  });

  test('negative mark 1 produces a warning', () => {
    const result = calculateKick90(baseInput({ mark1: -1 }));

    expect(result.warnings).toContain('Mark 1 cannot be negative.');
  });

  test('60° warns about steepness', () => {
    const result = calculateKick90(baseInput({ bendAngle: 60 }));

    expect(result.warnings).toContain(
      '60° is a steep bend. It creates more shrink and may be harder to pull wire through.',
    );
  });

  test('invalid angle is invalid', () => {
    const result = calculateKick90(baseInput({ bendAngle: 15 as BendAngle }));

    expect(result.isValid).toBe(false);
    expect(result.diagramData).toBeUndefined();
    expect(result.warnings).toContain('Selected bend angle is not valid.');
  });

  test('metric input converts to inches internally', () => {
    const result = calculateKick90(
      baseInput({
        kickRise: 152.4,
        unitSystem: 'metric',
        roundingPrecision: '1mm',
      }),
    );

    expect(result.kickRise).toBeCloseTo(6, 2);
    expect(result.distanceBetweenBends).toBeCloseTo(12, 2);
    expect(result.shrink).toBeCloseTo(1.5, 2);
  });

  test('diagramData includes kick layout values when valid', () => {
    const result = calculateKick90(baseInput({ mark1: 10 }));

    expect(result.diagramData).toEqual({
      calculatorType: 'kick90',
      kickRiseInches: 6,
      distanceBetweenBendsInches: 12,
      shrinkInches: 1.5,
      mark1Inches: 10,
      mark2Inches: 22,
      bendAngle: 30,
      display: {
        kickRise: '6"',
        distanceBetweenBends: '12"',
        shrink: '1 1/2"',
        mark1: '10"',
        mark2: '22"',
      },
    });
  });

  test('missing trade size warns', () => {
    const result = calculateKick90(baseInput({ tradeSize: '' as TradeSize }));

    expect(result.warnings).toContain('Please select a conduit size.');
  });

  test('unknown bender profile id emits fallback warning', () => {
    const result = calculateKick90(baseInput({ benderProfileId: 'missing-profile-id' }));

    expect(
      result.warnings.some((warning) => warning.includes('Saved bender was not found')),
    ).toBe(true);
  });
});
