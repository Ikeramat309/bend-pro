import { calculateSegment } from './segment.engine';
import type { SegmentEngineInput } from './segment.types';

function baseInput(overrides: Partial<SegmentEngineInput> = {}): SegmentEngineInput {
  return {
    radius: 30,
    totalAngle: 90,
    degreesPerBend: 10,
    benderProfileId: 'generic-hand-bender',
    conduitType: 'EMT',
    tradeSize: '1/2',
    unitSystem: 'imperial',
    roundingPrecision: '1/16',
    ...overrides,
  };
}

const DEG_TO_RAD = Math.PI / 180;

describe('calculateSegment', () => {
  test('reference case: 30" radius, 90°, 10° per bend', () => {
    const result = calculateSegment(baseInput({ roundingPrecision: '1/8' }));

    expect(result.isValid).toBe(true);
    expect(result.numberOfBends).toBe(9);
    expect(result.degreesPerBend).toBeCloseTo(10, 5);
    expect(result.spacing).toBeCloseTo(30 * 10 * DEG_TO_RAD, 4);
    expect(result.developedLength).toBeCloseTo(30 * 90 * DEG_TO_RAD, 4);
    expect(result.developedLength).toBeCloseTo(result.numberOfBends * result.spacing, 6);
    expect(result.spacingFormatted).toBe('5 1/4"');
    expect(result.developedLengthFormatted).toBe('47 1/8"');
  });

  test('fits to a whole number of shots and warns when the angle is adjusted', () => {
    const result = calculateSegment(baseInput({ totalAngle: 90, degreesPerBend: 12 }));

    expect(result.numberOfBends).toBe(8);
    expect(result.degreesPerBend).toBeCloseTo(11.25, 5);
    expect(result.warnings.some((w) => w.startsWith('Adjusted to 8 bends'))).toBe(true);
  });

  test('produces staggered absolute marks when a start of bend is given', () => {
    const result = calculateSegment(baseInput({ startOffset: 12, roundingPrecision: '1/16' }));

    expect(result.marks).toHaveLength(9);
    expect(result.firstMark).toBeCloseTo(12 + 0.5 * result.spacing, 5);
    expect(result.lastMark).toBeCloseTo(12 + 8.5 * result.spacing, 5);
  });

  test('invalid radius produces a warning and no diagram', () => {
    const result = calculateSegment(baseInput({ radius: 0 }));

    expect(result.isValid).toBe(false);
    expect(result.warnings).toContain('Radius must be greater than 0.');
    expect(result.diagramData).toBeUndefined();
  });

  test('invalid total angle produces a warning', () => {
    const result = calculateSegment(baseInput({ totalAngle: 0 }));

    expect(result.isValid).toBe(false);
    expect(result.warnings).toContain('Total angle must be greater than 0.');
  });

  test('invalid degrees per bend produces a warning', () => {
    const result = calculateSegment(baseInput({ degreesPerBend: 0 }));

    expect(result.isValid).toBe(false);
    expect(result.warnings).toContain('Degrees per bend must be greater than 0.');
  });

  test('warns when the shot count gets very large', () => {
    const result = calculateSegment(baseInput({ totalAngle: 90, degreesPerBend: 2 }));

    expect(result.numberOfBends).toBe(45);
    expect(result.warnings.some((w) => w.startsWith('That is a lot of shots'))).toBe(true);
  });

  test('warns on a large total angle', () => {
    const result = calculateSegment(baseInput({ totalAngle: 150 }));

    expect(result.warnings).toContain('Large total angle — verify this segment bend is practical for your run.');
  });

  test('negative start of bend is rejected', () => {
    const result = calculateSegment(baseInput({ startOffset: -1 }));

    expect(result.warnings).toContain('Start of bend cannot be negative.');
  });

  test('metric input converts radius to inches internally', () => {
    const result = calculateSegment(
      baseInput({ radius: 762, unitSystem: 'metric', roundingPrecision: '1mm' }),
    );

    expect(result.radius).toBeCloseTo(30, 2);
    expect(result.spacing).toBeCloseTo(30 * 10 * DEG_TO_RAD, 2);
  });
});
