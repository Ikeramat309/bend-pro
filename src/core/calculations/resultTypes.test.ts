import { isCalculationResultValid } from './resultTypes';

describe('isCalculationResultValid', () => {
  const base = {
    calculatorId: 'offset' as const,
    primaryResults: [],
    secondaryResults: [],
    warnings: [],
    assumptions: [],
    setupSnapshot: {
      unitSystem: 'imperial' as const,
      roundingPrecision: '1/16' as const,
      conduitType: 'EMT' as const,
      tradeSize: '1/2' as const,
      benderProfileId: 'generic-hand-bender',
    },
    benderProfile: { id: 'generic-hand-bender', name: 'Generic', category: 'hand' as const },
    rawValuesInches: {},
    displayValues: {},
    fieldSteps: [],
    sourceNotes: [],
    specific: {},
  };

  test('valid and warning statuses are usable', () => {
    expect(isCalculationResultValid({ ...base, status: 'valid' })).toBe(true);
    expect(isCalculationResultValid({ ...base, status: 'warning' })).toBe(true);
  });

  test('invalid status is not usable', () => {
    expect(isCalculationResultValid({ ...base, status: 'invalid' })).toBe(false);
  });
});
