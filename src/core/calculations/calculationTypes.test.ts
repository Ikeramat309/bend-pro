import {
  deriveCalculationStatus,
  snapshotSetupFromInput,
  type CalculationStatus,
} from './calculationTypes';

describe('deriveCalculationStatus', () => {
  test.each<[boolean, string[], CalculationStatus]>([
    [true, [], 'valid'],
    [true, ['Check field clearance.'], 'warning'],
    [false, [], 'invalid'],
    [false, ['Offset height must be greater than 0.'], 'invalid'],
  ])('isValid=%s warnings=%j → %s', (isValid, warnings, expected) => {
    expect(deriveCalculationStatus(isValid, warnings)).toBe(expected);
  });
});

describe('snapshotSetupFromInput', () => {
  test('captures field setup at calculation time', () => {
    expect(
      snapshotSetupFromInput({
        unitSystem: 'imperial',
        roundingPrecision: '1/16',
        conduitType: 'EMT',
        tradeSize: '3/4',
        benderProfileId: 'generic-hand-bender',
      }),
    ).toEqual({
      unitSystem: 'imperial',
      roundingPrecision: '1/16',
      conduitType: 'EMT',
      tradeSize: '3/4',
      benderProfileId: 'generic-hand-bender',
    });
  });
});
