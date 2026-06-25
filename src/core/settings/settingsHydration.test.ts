import {
  DEFAULT_CALCULATOR_SETUP,
  sanitizeStoredSetup,
} from './calculatorSetup';
import { resolveHydratedSetup } from './settingsHydration';
import { parseStoredSetupJson, persistCalculatorSetup, type SetupStorage } from './settingsPersistence';

describe('settingsHydration', () => {
  test('pre-hydration setup matches defaults', () => {
    expect(DEFAULT_CALCULATOR_SETUP.unit).toBe('imperial');
    expect(DEFAULT_CALCULATOR_SETUP.conduitType).toBe('EMT');
  });

  test('stored setup loads when user has not edited yet', () => {
    const stored = { unit: 'metric', rounding: '5mm', conduitSize: '1' };
    const result = resolveHydratedSetup(stored, DEFAULT_CALCULATOR_SETUP, false);

    expect(result.unit).toBe('metric');
    expect(result.conduitSize).toBe('1');
    expect(result.rounding).toBe('5mm');
  });

  test('invalid stored setup is sanitized', () => {
    const result = resolveHydratedSetup(
      { unit: 'nautical', benderProfileId: 'missing-profile' },
      DEFAULT_CALCULATOR_SETUP,
      false,
    );

    expect(result).toEqual(DEFAULT_CALCULATOR_SETUP);
  });

  test('late storage load does not overwrite in-memory user edits', () => {
    const userEdited = sanitizeStoredSetup({ unit: 'metric', rounding: '5mm', conduitSize: '3/4' });
    const stored = { unit: 'imperial', rounding: '1/8', conduitSize: '1' };

    const result = resolveHydratedSetup(stored, userEdited, true);

    expect(result).toEqual(userEdited);
    expect(result.unit).toBe('metric');
  });

  test('null storage keeps current setup', () => {
    const current = sanitizeStoredSetup({ conduitSize: '1' });
    expect(resolveHydratedSetup(null, current, false)).toEqual(current);
  });
});

describe('settingsPersistence', () => {
  test('parseStoredSetupJson returns null for missing or corrupt data', () => {
    expect(parseStoredSetupJson(null)).toBeNull();
    expect(parseStoredSetupJson('{not json')).toBeNull();
  });

  test('parseStoredSetupJson parses valid JSON', () => {
    expect(parseStoredSetupJson('{"unit":"metric"}')).toEqual({ unit: 'metric' });
  });

  test('persistCalculatorSetup swallows storage errors', async () => {
    const storage: SetupStorage = {
      getItem: jest.fn(),
      setItem: jest.fn().mockRejectedValue(new Error('disk full')),
    };

    await expect(
      persistCalculatorSetup(storage, DEFAULT_CALCULATOR_SETUP),
    ).resolves.toBeUndefined();
  });

  test('persistCalculatorSetup writes JSON payload', async () => {
    const storage: SetupStorage = {
      getItem: jest.fn(),
      setItem: jest.fn().mockResolvedValue(undefined),
    };

    await persistCalculatorSetup(storage, DEFAULT_CALCULATOR_SETUP, 'test-key');

    expect(storage.setItem).toHaveBeenCalledWith(
      'test-key',
      JSON.stringify(DEFAULT_CALCULATOR_SETUP),
    );
  });
});
