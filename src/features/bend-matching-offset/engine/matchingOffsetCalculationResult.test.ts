import { calculateMatchingOffset } from './matchingOffset.engine';
import { toMatchingOffsetCalculationResult } from './matchingOffsetCalculationResult';
import type { MatchingOffsetEngineInput } from './matchingOffset.types';

const input: MatchingOffsetEngineInput = {
  mode: 'bends',
  offsetHeight: 6,
  referenceDistanceBetweenBends: 12,
  benderProfileId: 'generic-hand-bender',
  conduitType: 'EMT',
  tradeSize: '3/4',
  unitSystem: 'imperial',
  roundingPrecision: '1/16',
};

describe('toMatchingOffsetCalculationResult', () => {
  it('publishes an honest matching-bends result without inventing conduit marks', () => {
    const engineResult = calculateMatchingOffset(input);
    const result = toMatchingOffsetCalculationResult(input, engineResult);

    expect(result.calculatorId).toBe('matchingOffset');
    expect(result.status).toBe('valid');
    expect(result.primaryResults[0]).toMatchObject({
      key: 'bendAngle',
      display: '30°',
    });
    expect(result.secondaryResults.map((item) => item.key)).toEqual([
      'distanceBetweenBends',
      'angleMethod',
    ]);
    expect(result.fieldSteps.map((step) => step.key)).toEqual([
      'referenceDistanceBetweenBends',
      'distanceBetweenBends',
      'bendAngle',
    ]);
    expect(result.rawValuesInches).not.toHaveProperty('mark1');
    expect(result.fieldSteps[0].detail).toContain('along the existing conduit');
    expect(result.specific.angleExecution.requiresAngleTool).toBe(false);
  });

  it('publishes distance between bends as the solved centers-mode secondary result', () => {
    const centersInput: MatchingOffsetEngineInput = {
      ...input,
      mode: 'centers',
      offsetHeight: 3,
      adjacent: 12,
      referenceDistanceBetweenBends: undefined,
    };
    const engineResult = calculateMatchingOffset(centersInput);
    const result = toMatchingOffsetCalculationResult(centersInput, engineResult);

    expect(result.secondaryResults[0].key).toBe('distanceBetweenBends');
    expect(result.fieldSteps[0].key).toBe('adjacent');
    expect(result.fieldSteps[0].detail).toContain('straight-run projection');
    expect(result.specific.mode).toBe('centers');
    expect(result.specific.angleExecution.requiresAngleTool).toBe(true);
    expect(result.sourceNotes.find((note) => note.key === 'commonAngleComparison')?.message).toContain(
      '15° comparison',
    );
  });

  it('publishes no field-usable result for invalid geometry', () => {
    const invalidInput: MatchingOffsetEngineInput = {
      ...input,
      offsetHeight: 12,
      referenceDistanceBetweenBends: 12,
    };
    const result = toMatchingOffsetCalculationResult(
      invalidInput,
      calculateMatchingOffset(invalidInput),
    );

    expect(result.status).toBe('invalid');
    expect(result.primaryResults).toEqual([]);
    expect(result.secondaryResults).toEqual([]);
    expect(result.fieldSteps).toEqual([]);
    expect(result.sourceNotes.some((note) => note.key === 'angleExecution')).toBe(false);
  });
});
