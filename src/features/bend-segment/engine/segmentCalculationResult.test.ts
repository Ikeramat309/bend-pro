import { calculateSegment } from './segment.engine';
import type { SegmentEngineInput } from './segment.types';
import { toSegmentCalculationResult } from './segmentCalculationResult';

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

describe('toSegmentCalculationResult', () => {
  test('valid result includes calculator id and primary results', () => {
    const input = baseInput();
    const engine = calculateSegment(input);
    const result = toSegmentCalculationResult(input, engine);

    expect(result.calculatorId).toBe('segment');
    expect(result.status).toBe('valid');
    expect(result.primaryResults[0].key).toBe('spacing');
  });

  test('raw and display values are separated', () => {
    const input = baseInput({ roundingPrecision: '1/8' });
    const engine = calculateSegment(input);
    const result = toSegmentCalculationResult(input, engine);

    expect(result.rawValuesInches.spacing).toBeCloseTo(engine.spacing, 3);
    expect(result.displayValues.spacing).toBe(engine.spacingFormatted);
  });

  test('invalid result preserves warnings', () => {
    const input = baseInput({ radius: 0 });
    const engine = calculateSegment(input);
    const result = toSegmentCalculationResult(input, engine);

    expect(result.status).toBe('invalid');
    expect(result.warnings).toEqual(engine.warnings);
  });

  test('warning status when shot count is adjusted', () => {
    const input = baseInput({ degreesPerBend: 12 });
    const engine = calculateSegment(input);
    const result = toSegmentCalculationResult(input, engine);

    expect(result.status).toBe('warning');
    expect(result.warnings).toEqual(engine.warnings);
  });

  test('field steps ordered with marks when start offset provided', () => {
    const input = baseInput({ startOffset: 12, roundingPrecision: '1/16' });
    const engine = calculateSegment(input);
    const result = toSegmentCalculationResult(input, engine);

    expect(result.fieldSteps.map((step) => step.key)).toEqual([
      'numberOfBends',
      'degreesPerBend',
      'spacing',
      'developedLength',
      'firstMark',
      'lastMark',
    ]);
  });

  test('specific payload preserves marks array', () => {
    const input = baseInput({ startOffset: 12 });
    const engine = calculateSegment(input);
    const result = toSegmentCalculationResult(input, engine);

    expect(result.specific.marks).toEqual(engine.marks);
    expect(result.sourceNotes.some((note) => note.key === 'geometry')).toBe(true);
  });
});
