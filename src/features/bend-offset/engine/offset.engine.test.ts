/**
 * Offset engine tests.
 *
 * Formulas under test:
 * distanceBetweenBends = offsetHeight × multiplier
 * shrink = offsetHeight × shrinkPerInch
 * These tests lock field-critical math — see docs/CALCULATOR_RULES.md.
 */
import type { BendAngle, TradeSize } from '@/core/types';

import { calculateOffset } from './offset.engine';
import type { OffsetEngineInput } from './offset.types';

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

describe('calculateOffset', () => {
  test('reference case: 6" offset at 30° → 12" between bends, 1 1/2" shrink', () => {
    const result = calculateOffset(baseInput());

    expect(result.offsetHeight).toBe(6);
    expect(result.distanceBetweenBends).toBe(12);
    expect(result.shrink).toBe(1.5);
    expect(result.multiplier).toBe(2);
    expect(result.isValid).toBe(true);
    expect(result.warnings).toEqual([]);
    expect(result.distanceBetweenBendsFormatted).toBe('12"');
    expect(result.shrinkFormatted).toBe('1 1/2"');
    expect(result.offsetHeightFormatted).toBe('6"');
  });

  describe('angle table (6" offset height)', () => {
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
        const result = calculateOffset(baseInput({ bendAngle: angle }));

        expect(result.multiplier).toBe(multiplier);
        expect(result.distanceBetweenBends).toBeCloseTo(spacing, 10);
        expect(result.shrink).toBeCloseTo(shrink, 10);
        expect(result.distanceBetweenBendsFormatted).toBe(spacingFormatted);
        expect(result.shrinkFormatted).toBe(shrinkFormatted);
      },
    );
  });

  describe('marks', () => {
    test('mark 2 = mark 1 + distance between bends', () => {
      const result = calculateOffset(baseInput({ mark1: 10 }));

      expect(result.mark1).toBe(10);
      expect(result.mark2).toBe(22);
      expect(result.mark1Formatted).toBe('10"');
      expect(result.mark2Formatted).toBe('22"');
    });

    test('marks are undefined when mark 1 is not provided', () => {
      const result = calculateOffset(baseInput());

      expect(result.mark1).toBeUndefined();
      expect(result.mark2).toBeUndefined();
      expect(result.mark1Formatted).toBeUndefined();
      expect(result.mark2Formatted).toBeUndefined();
    });

    test('negative mark 1 produces a warning', () => {
      const result = calculateOffset(baseInput({ mark1: -1 }));

      expect(result.warnings).toContain('Mark 1 cannot be negative.');
    });
  });

  describe('warnings', () => {
    test('zero offset height is invalid', () => {
      const result = calculateOffset(baseInput({ offsetHeight: 0 }));

      expect(result.isValid).toBe(false);
      expect(result.diagramData).toBeUndefined();
      expect(result.warnings).toContain('Offset height must be greater than 0.');
    });

    test('NaN offset height is invalid', () => {
      const result = calculateOffset(baseInput({ offsetHeight: Number.NaN }));

      expect(result.isValid).toBe(false);
      expect(result.warnings).toContain('Offset height must be greater than 0.');
    });

    test('missing trade size warns', () => {
      const result = calculateOffset(baseInput({ tradeSize: '' as TradeSize }));

      expect(result.warnings).toContain('Please select a conduit size.');
    });

    test('large imperial offset (> 24") warns about practicality', () => {
      const result = calculateOffset(baseInput({ offsetHeight: 25 }));

      expect(result.isValid).toBe(true);
      expect(result.warnings).toContain(
        'This is a large offset. Check if this bend is practical in the field.',
      );
    });

    test('large metric offset (> 600 mm) warns about practicality', () => {
      const result = calculateOffset(
        baseInput({ offsetHeight: 601, unitSystem: 'metric', roundingPrecision: '1mm' }),
      );

      expect(result.warnings).toContain(
        'This is a large offset. Check if this bend is practical in the field.',
      );
    });

    test('60° warns about steepness', () => {
      const result = calculateOffset(baseInput({ bendAngle: 60 }));

      expect(result.warnings).toContain(
        '60° is a steep bend. It creates more shrink and may be harder to pull wire through.',
      );
    });

    test('an angle outside the table is invalid instead of crashing', () => {
      const result = calculateOffset(baseInput({ bendAngle: 15 as BendAngle }));

      expect(result.isValid).toBe(false);
      expect(result.diagramData).toBeUndefined();
      expect(result.distanceBetweenBends).toBe(0);
      expect(result.warnings).toContain('Selected bend angle is not valid.');
    });
  });

  test('metric input converts to inches internally and formats in mm', () => {
    const result = calculateOffset(
      baseInput({ offsetHeight: 152.4, unitSystem: 'metric', roundingPrecision: '1mm' }),
    );

    // 152.4 mm = 6" → spacing 12" = 304.8 mm, shrink 1.5" = 38.1 mm
    expect(result.offsetHeight).toBeCloseTo(6, 10);
    expect(result.distanceBetweenBends).toBeCloseTo(12, 10);
    expect(result.offsetHeightFormatted).toBe('152 mm');
    expect(result.distanceBetweenBendsFormatted).toBe('305 mm');
    expect(result.shrinkFormatted).toBe('38 mm');
  });

  describe('diagramData contract', () => {
    test('present and complete when the calculation is valid', () => {
      const result = calculateOffset(baseInput({ mark1: 10 }));

      expect(result.diagramData).toEqual({
        calculatorType: 'offset',
        offsetHeightInches: 6,
        distanceBetweenBendsInches: 12,
        shrinkInches: 1.5,
        mark1Inches: 10,
        mark2Inches: 22,
        bendAngle: 30,
        display: {
          offsetHeight: '6"',
          distanceBetweenBends: '12"',
          shrink: '1 1/2"',
          mark1: '10"',
          mark2: '22"',
        },
      });
    });

    test('marks are optional in diagramData', () => {
      const data = calculateOffset(baseInput()).diagramData;

      expect(data).toBeDefined();
      expect(data?.mark1Inches).toBeUndefined();
      expect(data?.display.mark1).toBeUndefined();
    });

    test('absent when the calculation is invalid', () => {
      expect(calculateOffset(baseInput({ offsetHeight: 0 })).diagramData).toBeUndefined();
    });
  });
});
