import { calculateBackToBack } from './backToBack.engine';
import type { BackToBackEngineInput } from './backToBack.types';

function baseInput(overrides: Partial<BackToBackEngineInput> = {}): BackToBackEngineInput {
  return {
    backToBackDistance: 36,
    benderProfileId: 'generic-hand-bender',
    conduitType: 'EMT',
    tradeSize: '1/2',
    unitSystem: 'imperial',
    roundingPrecision: '1/16',
    ...overrides,
  };
}

describe('calculateBackToBack', () => {
  test('reference case: 36" back-to-back transfers directly to the star mark', () => {
    const result = calculateBackToBack(baseInput());

    expect(result.isValid).toBe(true);
    expect(result.second90Mark).toBe(36);
    expect(result.second90MarkFormatted).toBe('36"');
    expect(result.deductSource).toBe('not-needed');
    expect(result.warnings).toEqual([]);
  });

  test('optional first stub: 12" minus 5" deduct gives a 7" first mark', () => {
    const result = calculateBackToBack(baseInput({ firstStubLength: 12 }));

    expect(result.second90Mark).toBe(36);
    expect(result.deduct).toBe(5);
    expect(result.firstDeductMark).toBe(7);
    expect(result.firstDeductMarkFormatted).toBe('7"');
    expect(result.isFirstStubLayoutValid).toBe(true);
  });

  test('second mark does not change with trade size or deduct override', () => {
    const result = calculateBackToBack(
      baseInput({
        backToBackDistance: 42.5,
        firstStubLength: 16,
        tradeSize: '1',
        deductOverrideInches: 8.25,
      }),
    );

    expect(result.second90Mark).toBe(42.5);
    expect(result.deduct).toBe(8.25);
    expect(result.firstDeductMark).toBe(7.75);
    expect(result.isDeductOverridden).toBe(true);
  });

  test.each([0, -1, Number.NaN, Number.POSITIVE_INFINITY])(
    'invalid back-to-back distance %p suppresses field output',
    (distance) => {
      const result = calculateBackToBack(baseInput({ backToBackDistance: distance }));

      expect(result.isValid).toBe(false);
      expect(result.second90Mark).toBeUndefined();
      expect(result.diagramData).toBeUndefined();
      expect(result.warnings).toContain('Enter a back-to-back distance greater than 0.');
    },
  );

  test('invalid optional first stub blocks the combined layout', () => {
    const result = calculateBackToBack(baseInput({ firstStubLength: 0 }));

    expect(result.isValid).toBe(false);
    expect(result.diagramData).toBeUndefined();
    expect(result.warnings).toContain(
      'Enter a first stub length greater than 0, or remove First Stub Length.',
    );
  });

  test('missing first-stub chart stays visible without corrupting second mark', () => {
    const result = calculateBackToBack(
      baseInput({ firstStubLength: 24, tradeSize: '1-1/2' }),
    );

    expect(result.isValid).toBe(true);
    expect(result.second90Mark).toBe(36);
    expect(result.firstDeductMark).toBeUndefined();
    expect(result.deductSource).toBe('missing-chart');
    expect(result.warnings[0]).toContain('has no stub 90 deduct');
  });

  test('first stub not greater than deduct warns and omits only that mark', () => {
    const result = calculateBackToBack(baseInput({ firstStubLength: 5 }));

    expect(result.isValid).toBe(true);
    expect(result.second90Mark).toBe(36);
    expect(result.isFirstStubLayoutValid).toBe(false);
    expect(result.warnings).toContain('First stub length must be greater than deduct.');
  });

  test('metric inputs convert to canonical inches and format back to millimeters', () => {
    const result = calculateBackToBack(
      baseInput({
        backToBackDistance: 914.4,
        firstStubLength: 304.8,
        unitSystem: 'metric',
        roundingPrecision: '1mm',
      }),
    );

    expect(result.second90Mark).toBeCloseTo(36);
    expect(result.firstDeductMark).toBeCloseTo(7);
    expect(result.second90MarkFormatted).toBe('914 mm');
    expect(result.firstDeductMarkFormatted).toBe('178 mm');
  });

  test('extreme finite lengths remain finite and diagram-ready', () => {
    const result = calculateBackToBack(
      baseInput({ backToBackDistance: 1_000_000, firstStubLength: 999_999 }),
    );

    expect(result.isValid).toBe(true);
    expect(Number.isFinite(result.second90Mark)).toBe(true);
    expect(Number.isFinite(result.firstDeductMark)).toBe(true);
    expect(result.diagramData?.second90MarkInches).toBe(1_000_000);
  });

  test('diagram contract contains only engine-computed field values', () => {
    const result = calculateBackToBack(baseInput({ firstStubLength: 12 }));

    expect(result.diagramData).toEqual({
      calculatorType: 'backToBack',
      backToBackDistanceInches: 36,
      second90MarkInches: 36,
      firstStubLengthInches: 12,
      firstDeductMarkInches: 7,
      deductInches: 5,
      bendAngle: 90,
      display: {
        backToBackDistance: '36"',
        second90Mark: '36"',
        firstStubLength: '12"',
        firstDeductMark: '7"',
        deduct: '5"',
      },
    });
  });
});
