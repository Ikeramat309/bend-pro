import { calculateSaddle3 } from './saddle3.engine';
import { SADDLE3_ANGLE_DATA } from './saddle3AngleData';
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

/**
 * Trade-reference cross-check (non-circular).
 *
 * The 3-point saddle center-to-side distance is the conduit length needed to
 * gain the obstruction height across a side bend of angle θ, which is the
 * trigonometric cosecant: distance = height / sin(θ) = height × csc(θ).
 * Asserting the shipped multiplier against csc(θ) computed independently here
 * validates the constant against geometry itself — not against its own value.
 *
 * Reference: standard conduit-bending geometry (e.g. Benfield Conduit Bending
 * Manual; Ugly's Electrical References — 3-point saddle layout).
 */
describe('saddle3 multipliers match the cosecant of the side angle', () => {
  const cases: { preset: keyof typeof SADDLE3_ANGLE_DATA; sideAngle: number }[] = [
    { preset: '22.5-45', sideAngle: 22.5 },
    { preset: '30-60', sideAngle: 30 },
    { preset: '45-90', sideAngle: 45 },
  ];

  test.each(cases)('$preset center-to-side multiplier ≈ csc(side angle)', ({ preset, sideAngle }) => {
    const cosecant = 1 / Math.sin((sideAngle * Math.PI) / 180);
    expect(SADDLE3_ANGLE_DATA[preset].centerToSideMultiplier).toBeCloseTo(cosecant, 2);
  });

  test('center bend angle is always double the side bend angle', () => {
    for (const row of Object.values(SADDLE3_ANGLE_DATA)) {
      expect(row.centerAngle).toBe(row.sideAngle * 2);
    }
  });
});
