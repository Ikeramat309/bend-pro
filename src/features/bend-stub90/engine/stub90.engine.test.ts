/**
 * Stub 90 engine tests.
 *
 * Formula under test: deductMark = stubLength - deduct (take-up).
 * These tests lock field-critical math — see docs/CALCULATOR_RULES.md.
 */
import type { TradeSize } from '@/core/types';

import { calculateStub90 } from './stub90.engine';
import type { Stub90EngineInput } from './stub90.types';

function baseInput(overrides: Partial<Stub90EngineInput> = {}): Stub90EngineInput {
  return {
    stubHeight: 12,
    benderProfileId: 'generic-hand-bender',
    conduitType: 'EMT',
    tradeSize: '1/2',
    unitSystem: 'imperial',
    roundingPrecision: '1/16',
    ...overrides,
  };
}

describe('calculateStub90', () => {
  test('reference case: 12" stub on 1/2" EMT → deduct 5", mark at 7"', () => {
    const result = calculateStub90(baseInput());

    expect(result.stubHeight).toBe(12);
    expect(result.deduct).toBe(5);
    expect(result.deductMark).toBe(7);
    expect(result.deductSource).toBe('profile-chart');
    expect(result.bendAngle).toBe(90);
    expect(result.isValidDeductMark).toBe(true);
    expect(result.warnings).toEqual([]);
    expect(result.deductMarkFormatted).toBe('7"');
    expect(result.stubHeightFormatted).toBe('12"');
    expect(result.deductFormatted).toBe('5"');
    expect(result.benderProfileUsed.id).toBe('generic-hand-bender');
  });

  describe('deduct per trade size (generic hand bender)', () => {
    const cases: { tradeSize: TradeSize; deduct: number; mark: number }[] = [
      { tradeSize: '1/2', deduct: 5, mark: 7 },
      { tradeSize: '3/4', deduct: 6, mark: 6 },
      { tradeSize: '1', deduct: 8, mark: 4 },
    ];

    test.each(cases)('$tradeSize" EMT → deduct $deduct", mark $mark"', ({ tradeSize, deduct, mark }) => {
      const result = calculateStub90(baseInput({ tradeSize }));

      expect(result.deduct).toBe(deduct);
      expect(result.deductMark).toBe(mark);
      expect(result.warnings).toEqual([]);
    });
  });

  test('unlisted trade size falls back to default deduct without a warning', () => {
    const result = calculateStub90(baseInput({ tradeSize: '1-1/4' }));

    expect(result.deduct).toBe(5);
    expect(result.deductMark).toBe(7);
    expect(result.deductSource).toBe('default-fallback');
    expect(result.warnings).toEqual([]);
  });

  test('unknown bender profile id falls back to the generic profile', () => {
    const result = calculateStub90(baseInput({ benderProfileId: 'does-not-exist' }));

    expect(result.benderProfileUsed.id).toBe('generic-hand-bender');
    expect(result.deduct).toBe(5);
  });

  describe('invalid inputs', () => {
    test('zero stub length is invalid', () => {
      const result = calculateStub90(baseInput({ stubHeight: 0 }));

      expect(result.isValidDeductMark).toBe(false);
      expect(result.deductMark).toBeUndefined();
      expect(result.deductMarkFormatted).toBeUndefined();
      expect(result.diagramData).toBeUndefined();
      expect(result.warnings).toEqual(['Enter a stub length greater than 0.']);
    });

    test('NaN stub length is invalid', () => {
      const result = calculateStub90(baseInput({ stubHeight: Number.NaN }));

      expect(result.isValidDeductMark).toBe(false);
      expect(result.warnings).toContain('Enter a stub length greater than 0.');
    });

    test('stub length below deduct is invalid with a field-friendly warning', () => {
      const result = calculateStub90(baseInput({ stubHeight: 4 }));

      expect(result.isValidDeductMark).toBe(false);
      expect(result.deductMark).toBeUndefined();
      expect(result.diagramData).toBeUndefined();
      expect(result.warnings).toEqual(['Stub length must be greater than deduct.']);
    });

    test('stub length exactly equal to deduct is invalid (mark would be 0)', () => {
      const result = calculateStub90(baseInput({ stubHeight: 5 }));

      expect(result.isValidDeductMark).toBe(false);
      expect(result.warnings).toEqual(['Stub length must be greater than deduct.']);
    });
  });

  describe('deduct override', () => {
    test('override replaces the profile chart value', () => {
      const result = calculateStub90(baseInput({ deductOverrideInches: 5.25 }));

      expect(result.deduct).toBe(5.25);
      expect(result.deductSource).toBe('override');
      expect(result.deductMark).toBe(6.75);
      expect(result.isDeductOverridden).toBe(true);
      expect(result.deductMarkFormatted).toBe('6 3/4"');
      expect(result.warnings).toEqual([]);
    });

    test('override suppresses the unlisted-size fallback source', () => {
      const result = calculateStub90(baseInput({ tradeSize: '1-1/4', deductOverrideInches: 11 }));

      expect(result.deduct).toBe(11);
      expect(result.deductSource).toBe('override');
      expect(result.warnings).toEqual([]);
    });

    test('non-positive or non-finite override is ignored', () => {
      for (const bad of [0, -2, Number.NaN, Number.POSITIVE_INFINITY]) {
        const result = calculateStub90(baseInput({ deductOverrideInches: bad }));

        expect(result.deduct).toBe(5);
        expect(result.isDeductOverridden).toBe(false);
      }
    });

    test('no override uses the profile value and reports not overridden', () => {
      expect(calculateStub90(baseInput()).isDeductOverridden).toBe(false);
    });
  });

  test('uses custom bender profile deduct from stored profile', () => {
    const result = calculateStub90(
      baseInput({
        benderProfileId: 'custom-shop',
        customBenderProfiles: [
          {
            id: 'custom-shop',
            name: 'Shop bender',
            emtStub90TakeUpInches: { '1/2': 5.75 },
          },
        ],
      }),
    );

    expect(result.deduct).toBe(5.75);
    expect(result.benderProfileUsed.name).toBe('Shop bender');
    expect(result.benderProfileUsed.category).toBe('custom');
  });

  test('optional leg length passes through and formats', () => {
    const result = calculateStub90(baseInput({ legLength: 20 }));

    expect(result.legLength).toBe(20);
    expect(result.legLengthFormatted).toBe('20"');
    expect(result.diagramData?.legLengthInches).toBe(20);
    expect(result.diagramData?.display.leg).toBe('20"');
  });

  test('metric input converts to inches internally and formats in mm', () => {
    const result = calculateStub90(
      baseInput({ stubHeight: 254, unitSystem: 'metric', roundingPrecision: '1mm' }),
    );

    // 254 mm = 10", deduct 5" → mark 5" = 127 mm
    expect(result.stubHeight).toBe(10);
    expect(result.deductMark).toBe(5);
    expect(result.deductMarkFormatted).toBe('127 mm');
    expect(result.stubHeightFormatted).toBe('254 mm');
  });

  test('rounding precision applies to formatted results', () => {
    const result = calculateStub90(baseInput({ stubHeight: 12.1, roundingPrecision: '1/8' }));

    // mark = 7.1" → nearest 1/8" = 7 1/8"
    expect(result.deductMark).toBeCloseTo(7.1);
    expect(result.deductMarkFormatted).toBe('7 1/8"');
  });

  describe('diagramData contract', () => {
    test('present and complete when the calculation is valid', () => {
      const result = calculateStub90(baseInput());

      expect(result.diagramData).toEqual({
        calculatorType: 'stub90',
        stubHeightInches: 12,
        deductInches: 5,
        deductMarkInches: 7,
        legLengthInches: undefined,
        bendAngle: 90,
        display: {
          stubLength: '12"',
          deduct: '5"',
          deductMark: '7"',
          leg: undefined,
        },
      });
    });

    test('absent when the calculation is invalid', () => {
      expect(calculateStub90(baseInput({ stubHeight: 0 })).diagramData).toBeUndefined();
      expect(calculateStub90(baseInput({ stubHeight: 3 })).diagramData).toBeUndefined();
    });
  });
});
