import { toCalculationResultSnapshot } from './resultSnapshot';
import { sanitizeInputSnapshot, sanitizeSetupSnapshot } from './sessionSanitize';

describe('resultSnapshot', () => {
  test('toCalculationResultSnapshot separates display from raw values', () => {
    const snapshot = toCalculationResultSnapshot({
      calculatorId: 'offset',
      status: 'valid',
      primaryResults: [
        { key: 'distanceBetweenBends', label: 'Distance Between Bends', inches: 12, display: '12"' },
      ],
      secondaryResults: [],
      warnings: [],
      assumptions: [],
      setupSnapshot: sanitizeSetupSnapshot({}),
      benderProfile: { id: 'generic-hand-bender', name: 'Generic', category: 'hand' },
      rawValuesInches: { distanceBetweenBends: 12 },
      displayValues: { distanceBetweenBends: '12"' },
      fieldSteps: [],
      sourceNotes: [],
      specific: {},
    });

    expect(snapshot.rawValuesInches.distanceBetweenBends).toBe(12);
    expect(snapshot.displayValues.distanceBetweenBends).toBe('12"');
    expect(snapshot.summaryLine).toBe('12"');
  });
});

describe('sessionSanitize', () => {
  test('sanitizeInputSnapshot keeps JSON-safe leaf values only', () => {
    expect(
      sanitizeInputSnapshot({
        offsetHeight: 6,
        bendAngle: 30,
        nested: { bad: true },
        label: 'test',
      }),
    ).toEqual({
      offsetHeight: 6,
      bendAngle: 30,
      label: 'test',
    });
  });

  test('sanitizeSetupSnapshot applies defaults for invalid setup', () => {
    const setup = sanitizeSetupSnapshot({ unitSystem: 'nautical', roundingPrecision: 'bad' });
    expect(setup.unitSystem).toBe('imperial');
    expect(setup.conduitType).toBe('EMT');
    expect(setup.benderProfileId).toBeTruthy();
  });
});
