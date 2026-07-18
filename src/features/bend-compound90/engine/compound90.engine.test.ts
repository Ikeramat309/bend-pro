import { DEFAULT_BENDER_PROFILE_ID } from '@/data/benders';

import { calculateCompound90 } from './compound90.engine';
import type { Compound90EngineInput } from './compound90.types';

function input(overrides: Partial<Compound90EngineInput> = {}): Compound90EngineInput {
  return {
    shape: 'circle',
    primaryDimension: 7,
    benderProfileId: DEFAULT_BENDER_PROFILE_ID,
    conduitType: 'EMT',
    tradeSize: '1/2',
    unitSystem: 'imperial',
    roundingPrecision: '1/16',
    ...overrides,
  };
}

describe('calculateCompound90', () => {
  test('uses the round-obstruction field multiplier and half-OD center correction', () => {
    const result = calculateCompound90(input());
    expect(result.isValid).toBe(true);
    expect(result.backOfConduitDistance).toBeCloseTo(16.8, 8);
    expect(result.conduitOutsideDiameter).toBeCloseTo(0.706, 8);
    expect(result.distanceBetweenBends).toBeCloseTo(16.447, 8);
    expect(result.bendAngle).toBe(45);
  });

  test('uses the square-on-point multiplier and half-OD center correction', () => {
    const result = calculateCompound90(input({ shape: 'diamond', primaryDimension: 4 }));
    expect(result.distanceBetweenBends).toBeCloseTo(11.647, 8);
  });

  test('uses both wall-aligned box dimensions', () => {
    const result = calculateCompound90(
      input({ shape: 'box', primaryDimension: 2, secondaryDimension: 4 }),
    );
    expect(result.isValid).toBe(true);
    expect(result.backOfConduitDistance).toBeCloseTo(8.484, 8);
    expect(result.distanceBetweenBends).toBeCloseTo(8.131, 8);
  });

  test('adds requested clearance on both sides before center correction', () => {
    const result = calculateCompound90(input({ clearance: 1 }));
    expect(result.backOfConduitDistance).toBeCloseTo(18.8, 8);
    expect(result.distanceBetweenBends).toBeCloseTo(18.447, 8);
  });

  test('creates an absolute second mark when first mark is entered', () => {
    const result = calculateCompound90(input({ firstMark: 20 }));
    expect(result.firstMark).toBe(20);
    expect(result.secondMark).toBeCloseTo(36.447, 8);
  });

  test('converts metric dimensions to canonical inches', () => {
    const result = calculateCompound90(
      input({
        primaryDimension: 177.8,
        clearance: 25.4,
        unitSystem: 'metric',
        roundingPrecision: '1mm',
      }),
    );
    expect(result.primaryDimension).toBeCloseTo(7, 8);
    expect(result.clearance).toBeCloseTo(1, 8);
    expect(result.distanceBetweenBends).toBeCloseTo(18.447, 8);
  });

  test('requires both box dimensions', () => {
    const result = calculateCompound90(
      input({ shape: 'box', primaryDimension: 2, secondaryDimension: undefined }),
    );
    expect(result.isValid).toBe(false);
    expect(result.diagramData).toBeUndefined();
    expect(result.warnings).toContain('Box width must be greater than 0.');
  });

  test('rejects negative clearance', () => {
    const result = calculateCompound90(input({ clearance: -0.5 }));
    expect(result.isValid).toBe(false);
    expect(result.warnings).toContain('Clearance cannot be negative.');
  });

  test('keeps extreme finite input finite for presentation and warnings', () => {
    const result = calculateCompound90(input({ primaryDimension: 100_000 }));
    expect(Number.isFinite(result.distanceBetweenBends)).toBe(true);
    expect(result.warnings.some((warning) => warning.startsWith('Large obstruction'))).toBe(true);
  });

  test('changes center spacing with the selected EMT outside diameter', () => {
    const halfInch = calculateCompound90(input({ tradeSize: '1/2' }));
    const oneInch = calculateCompound90(input({ tradeSize: '1' }));

    expect(halfInch.distanceBetweenBends).toBeCloseTo(16.447, 8);
    expect(oneInch.distanceBetweenBends).toBeCloseTo(16.2185, 8);
  });

  test('rejects a finite input that overflows the calculated spacing', () => {
    const result = calculateCompound90(input({ primaryDimension: Number.MAX_VALUE }));

    expect(result.isValid).toBe(false);
    expect(result.diagramData).toBeUndefined();
    expect(Number.isFinite(result.distanceBetweenBends)).toBe(true);
    expect(result.warnings).toContain(
      'Calculated bend spacing is outside the supported numeric range.',
    );
  });
});
