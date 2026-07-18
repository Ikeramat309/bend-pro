import type { MatchingOffsetEngineInput } from './matchingOffset.types';
import { calculateMatchingOffset, formatMatchingOffsetAngle } from './matchingOffset.engine';

const COMMON = {
  benderProfileId: 'generic-hand-bender',
  conduitType: 'EMT' as const,
  tradeSize: '1/2' as const,
  unitSystem: 'imperial' as const,
  roundingPrecision: '1/16' as const,
};

function centersInput(
  patch: Partial<Extract<MatchingOffsetEngineInput, { mode: 'centers' }>> = {},
): Extract<MatchingOffsetEngineInput, { mode: 'centers' }> {
  return { ...COMMON, mode: 'centers', offsetHeight: 3, adjacent: 12, ...patch };
}

function bendsInput(
  patch: Partial<Extract<MatchingOffsetEngineInput, { mode: 'bends' }>> = {},
): Extract<MatchingOffsetEngineInput, { mode: 'bends' }> {
  return {
    ...COMMON,
    mode: 'bends',
    offsetHeight: 6,
    referenceDistanceBetweenBends: 12,
    ...patch,
  };
}

describe('calculateMatchingOffset', () => {
  it('solves distance between bends and angle from rise plus adjacent centers', () => {
    const result = calculateMatchingOffset(centersInput());

    expect(result.isValid).toBe(true);
    expect(result.bendAngleDegrees).toBeCloseTo(14.036243, 6);
    expect(result.distanceBetweenBends).toBeCloseTo(Math.sqrt(153), 8);
    expect(result.shrink).toBeCloseTo(Math.sqrt(153) - 12, 8);
    expect(result.diagramData?.mode).toBe('centers');
    expect(result.angleExecution.requiresAngleTool).toBe(true);
    expect(result.angleExecution.nearestCommonAngleDegrees).toBe(15);
    expect(result.angleExecution.comparison?.adjacent).toBeCloseTo(
      3 / Math.tan(Math.PI / 12),
      8,
    );
    expect(result.warnings.some((warning) => warning.includes('Do not round to 15°'))).toBe(
      true,
    );
  });

  it('solves a measured 6 by 12 existing offset as 30 degrees', () => {
    const result = calculateMatchingOffset(bendsInput());

    expect(result.isValid).toBe(true);
    expect(result.bendAngleDegrees).toBeCloseTo(30, 8);
    expect(result.adjacent).toBeCloseTo(6 * Math.sqrt(3), 8);
    expect(result.shrink).toBeCloseTo(12 - 6 * Math.sqrt(3), 8);
    expect(result.multiplier).toBeCloseTo(2, 8);
    expect(result.shrinkPerInch).toBeCloseTo(Math.tan(Math.PI / 12), 8);
    expect(result.angleExecution).toMatchObject({
      isCommonAngle: true,
      requiresAngleTool: false,
      nearestCommonAngleDegrees: 30,
      comparison: undefined,
    });
  });

  it('keeps the two inverse modes consistent', () => {
    const centers = calculateMatchingOffset(centersInput({ offsetHeight: 4, adjacent: 9 }));
    const bends = calculateMatchingOffset(
      bendsInput({
        offsetHeight: 4,
        referenceDistanceBetweenBends: centers.distanceBetweenBends,
      }),
    );

    expect(bends.isValid).toBe(true);
    expect(bends.bendAngleDegrees).toBeCloseTo(centers.bendAngleDegrees, 10);
    expect(bends.adjacent).toBeCloseTo(9, 10);
    expect(bends.shrink).toBeCloseTo(centers.shrink, 10);
  });

  it('converts metric input to canonical inches', () => {
    const result = calculateMatchingOffset(
      centersInput({
        offsetHeight: 152.4,
        adjacent: 263.965,
        unitSystem: 'metric',
        roundingPrecision: '1mm',
      }),
    );

    expect(result.isValid).toBe(true);
    expect(result.offsetHeight).toBeCloseTo(6, 8);
    expect(result.bendAngleDegrees).toBeCloseTo(30, 3);
    expect(result.distanceBetweenBends).toBeCloseTo(12, 3);
    expect(result.distanceBetweenBendsFormatted).toBe('305 mm');
  });

  it('rejects an existing center distance that is not longer than the rise', () => {
    const result = calculateMatchingOffset(
      bendsInput({ offsetHeight: 12, referenceDistanceBetweenBends: 12 }),
    );

    expect(result.isValid).toBe(false);
    expect(result.diagramData).toBeUndefined();
    expect(result.warnings).toContain(
      'Offset height must be less than the reference distance between bends.',
    );
  });

  it('rejects a calculated offset angle above 60 degrees', () => {
    const result = calculateMatchingOffset(
      bendsInput({ offsetHeight: 11, referenceDistanceBetweenBends: 12 }),
    );

    expect(result.isValid).toBe(false);
    expect(result.warnings.some((warning) => warning.includes('greater than 60°'))).toBe(true);
  });

  it('accepts the 60-degree boundary and warns that it is steep', () => {
    const result = calculateMatchingOffset(
      bendsInput({
        offsetHeight: 12 * Math.sin(Math.PI / 3),
        referenceDistanceBetweenBends: 12,
      }),
    );

    expect(result.isValid).toBe(true);
    expect(result.bendAngleDegrees).toBeCloseTo(60, 8);
    expect(result.warnings.some((warning) => warning.includes('steep offset'))).toBe(true);
  });

  it('keeps a very shallow but solvable angle valid with an advisory warning', () => {
    const result = calculateMatchingOffset(
      centersInput({ offsetHeight: 1, adjacent: 100 }),
    );

    expect(result.isValid).toBe(true);
    expect(result.bendAngleDegrees).toBeLessThan(1);
    expect(result.warnings.some((warning) => warning.includes('very shallow'))).toBe(true);
  });

  it('never emits NaN for invalid or non-finite input', () => {
    const result = calculateMatchingOffset(
      centersInput({ offsetHeight: Number.POSITIVE_INFINITY, adjacent: Number.NaN }),
    );

    expect(result.isValid).toBe(false);
    for (const value of [
      result.offsetHeight,
      result.distanceBetweenBends,
      result.adjacent,
      result.shrink,
      result.bendAngleDegrees,
    ]) {
      expect(Number.isNaN(value)).toBe(false);
    }
  });

  it('remains finite for extreme but geometrically valid measurements', () => {
    const result = calculateMatchingOffset(
      centersInput({ offsetHeight: 1_000_000_000_000, adjacent: 1_000_000_000_000 }),
    );

    expect(result.isValid).toBe(true);
    expect(result.bendAngleDegrees).toBeCloseTo(45, 8);
    expect(Number.isFinite(result.distanceBetweenBends)).toBe(true);
    expect(Number.isFinite(result.shrink)).toBe(true);
  });

  it('formats arbitrary angles without rounding a shallow angle to zero', () => {
    expect(formatMatchingOffsetAngle(11.612)).toBe('11.6°');
    expect(formatMatchingOffsetAngle(0.049)).toBe('0.05°');
    expect(formatMatchingOffsetAngle(Number.NaN)).toBe('—');
  });

  it('does not classify a merely close angle as an exact common field angle', () => {
    const angle = 30.04;
    const result = calculateMatchingOffset(
      centersInput({
        offsetHeight: 6,
        adjacent: 6 / Math.tan((angle * Math.PI) / 180),
      }),
    );

    expect(result.bendAngleDegrees).toBeCloseTo(angle, 8);
    expect(result.angleExecution.isCommonAngle).toBe(false);
    expect(result.angleExecution.requiresAngleTool).toBe(true);
  });

  it('recognizes an exact 22.5-degree solution without floating-point drift', () => {
    const result = calculateMatchingOffset(
      centersInput({
        offsetHeight: 4,
        adjacent: 4 / Math.tan(Math.PI / 8),
      }),
    );

    expect(result.bendAngleDegrees).toBeCloseTo(22.5, 10);
    expect(result.angleExecution.isCommonAngle).toBe(true);
    expect(result.angleExecution.requiresAngleTool).toBe(false);
  });
});
