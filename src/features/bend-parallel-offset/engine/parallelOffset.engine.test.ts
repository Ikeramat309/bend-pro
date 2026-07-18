import type { ParallelOffsetEngineInput } from './parallelOffset.types';
import { calculateParallelOffset } from './parallelOffset.engine';

function baseInput(
  overrides: Partial<ParallelOffsetEngineInput> = {},
): ParallelOffsetEngineInput {
  return {
    mode: 'simple',
    centerSpacing: 2,
    bendAngle: 30,
    benderProfileId: 'generic-hand-bender',
    conduitType: 'EMT',
    tradeSize: '1/2',
    unitSystem: 'imperial',
    roundingPrecision: '1/16',
    ...overrides,
  };
}

describe('calculateParallelOffset', () => {
  test('uses the field half-angle tangent method in simple mode', () => {
    const result = calculateParallelOffset(baseInput());

    expect(result.isValid).toBe(true);
    expect(result.adjustmentFactor).toBeCloseTo(Math.tan(Math.PI / 12), 10);
    expect(result.adjustmentPerConduit).toBeCloseTo(0.535898, 6);
    expect(result.adjustmentPerConduitFormatted).toBe('9/16"');
    expect(result.conduits).toEqual([]);
  });

  test('builds absolute marks without changing distance between bends', () => {
    const result = calculateParallelOffset(
      baseInput({
        mode: 'layout',
        offsetHeight: 6,
        conduitCount: 4,
        baseMark: 20,
        shiftDirection: 'away-from-free-end',
      }),
    );

    expect(result.isValid).toBe(true);
    expect(result.distanceBetweenBends).toBeCloseTo(12, 10);
    expect(result.totalRackShift).toBeCloseTo(1.607695, 6);
    expect(result.conduits).toHaveLength(4);
    expect(result.conduits[0].mark1).toBeCloseTo(20, 10);
    expect(result.conduits[3].mark1).toBeCloseTo(21.607695, 6);
    for (const conduit of result.conduits) {
      expect((conduit.mark2 ?? 0) - (conduit.mark1 ?? 0)).toBeCloseTo(12, 10);
    }
  });

  test('subtracts cumulative shifts when marks move toward the free end', () => {
    const result = calculateParallelOffset(
      baseInput({
        mode: 'layout',
        offsetHeight: 6,
        conduitCount: 3,
        baseMark: 20,
        shiftDirection: 'toward-free-end',
      }),
    );

    expect(result.conduits[1].signedShift).toBeLessThan(0);
    expect(result.conduits[2].mark1).toBeCloseTo(18.928203, 6);
  });

  test('converts metric inputs to canonical inches before calculating', () => {
    const result = calculateParallelOffset(
      baseInput({
        mode: 'layout',
        centerSpacing: 50.8,
        offsetHeight: 152.4,
        conduitCount: 2,
        shiftDirection: 'away-from-free-end',
        unitSystem: 'metric',
        roundingPrecision: '1mm',
      }),
    );

    expect(result.centerSpacing).toBeCloseTo(2, 10);
    expect(result.offsetHeight).toBeCloseTo(6, 10);
    expect(result.distanceBetweenBends).toBeCloseTo(12, 10);
  });

  test('preserves a selected custom bender as setup-only trust context', () => {
    const result = calculateParallelOffset(
      baseInput({
        benderProfileId: 'custom-job-bender',
        customBenderProfiles: [
          {
            id: 'custom-job-bender',
            name: 'Job Cart Bender',
            emtStub90TakeUpInches: { '1/2': 5.25 },
          },
        ],
      }),
    );

    expect(result.benderProfileUsed.name).toBe('Job Cart Bender');
    expect(result.benderProfileUsed.category).toBe('custom');
    expect(result.adjustmentPerConduit).toBeCloseTo(0.535898, 6);
  });

  test('warns when a saved bender profile is missing', () => {
    const result = calculateParallelOffset(baseInput({ benderProfileId: 'missing-profile' }));

    expect(result.isValid).toBe(true);
    expect(result.warnings.some((warning) => warning.includes('Saved bender was not found'))).toBe(
      true,
    );
  });

  test.each([10, 22.5, 30, 45, 60] as const)(
    'keeps the supported %s° formula finite',
    (bendAngle) => {
      const result = calculateParallelOffset(baseInput({ bendAngle }));
      expect(result.isValid).toBe(true);
      expect(Number.isFinite(result.adjustmentPerConduit)).toBe(true);
      expect(result.adjustmentPerConduit).toBeGreaterThan(0);
    },
  );

  test.each([1, 9, 2.5])('rejects unsupported conduit count %s', (conduitCount) => {
    const result = calculateParallelOffset(
      baseInput({
        mode: 'layout',
        offsetHeight: 6,
        conduitCount,
        shiftDirection: 'toward-free-end',
      }),
    );
    expect(result.isValid).toBe(false);
  });

  test('omits negative absolute marks and warns without corrupting relative layout', () => {
    const result = calculateParallelOffset(
      baseInput({
        mode: 'layout',
        centerSpacing: 6,
        offsetHeight: 4,
        conduitCount: 8,
        baseMark: 1,
        shiftDirection: 'toward-free-end',
      }),
    );

    expect(result.isValid).toBe(true);
    expect(result.warnings.some((warning) => warning.includes('negative absolute marks'))).toBe(true);
    expect(result.conduits[7].mark1).toBeUndefined();
    expect(result.conduits[7].cumulativeShift).toBeGreaterThan(0);
  });

  test('handles very large finite dimensions without NaN or Infinity', () => {
    const result = calculateParallelOffset(
      baseInput({
        mode: 'layout',
        centerSpacing: 100_000,
        offsetHeight: 100_000,
        conduitCount: 8,
        shiftDirection: 'away-from-free-end',
      }),
    );
    expect(result.isValid).toBe(true);
    expect(Number.isFinite(result.totalRackShift)).toBe(true);
    expect(Number.isFinite(result.distanceBetweenBends)).toBe(true);
  });

  test('rejects a finite input that overflows derived rack values', () => {
    const result = calculateParallelOffset(
      baseInput({ centerSpacing: Number.MAX_VALUE, bendAngle: 60 }),
    );

    expect(result.isValid).toBe(false);
    expect(result.diagramData).toBeUndefined();
    expect(Number.isFinite(result.adjustmentPerConduit)).toBe(true);
    expect(Number.isFinite(result.totalRackShift)).toBe(true);
    expect(result.warnings).toContain(
      'Calculated parallel layout is outside the supported numeric range.',
    );
  });

  test('rejects zero, negative, and non-finite required measurements', () => {
    expect(calculateParallelOffset(baseInput({ centerSpacing: 0 })).isValid).toBe(false);
    expect(calculateParallelOffset(baseInput({ centerSpacing: -2 })).isValid).toBe(false);
    expect(calculateParallelOffset(baseInput({ centerSpacing: Number.NaN })).isValid).toBe(false);
  });
});
