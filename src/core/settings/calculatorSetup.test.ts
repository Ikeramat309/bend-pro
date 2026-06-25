/**
 * sanitizeStoredSetup tests — persisted setup must never hydrate into an
 * invalid state, whatever is on disk.
 */
import {
  DEFAULT_CALCULATOR_SETUP,
  getSetupOverrideHint,
  patchCalculatorSetup,
  replaceCalculatorSetup,
  sanitizeStoredSetup,
} from './calculatorSetup';

describe('sanitizeStoredSetup', () => {
  test('valid stored setup passes through', () => {
    const stored = {
      unit: 'metric',
      rounding: '5mm',
      conduitType: 'EMT',
      conduitSize: '3/4',
      benderProfileId: 'generic-hand-bender',
    };

    expect(sanitizeStoredSetup(stored)).toEqual({
      unit: 'metric',
      rounding: '5mm',
      conduitType: 'EMT',
      conduitSize: '3/4',
      benderProfileId: 'generic-hand-bender',
      customBenderProfiles: [],
      stub90DeductOverridesInches: {},
      offsetMultiplierOverrides: {},
      offsetShrinkPerInchOverrides: {},
    });
  });

  test.each([null, undefined, 'garbage', 42, []])('non-object %j → defaults', (raw) => {
    expect(sanitizeStoredSetup(raw)).toEqual(DEFAULT_CALCULATOR_SETUP);
  });

  test('unknown field values fall back to defaults individually', () => {
    const result = sanitizeStoredSetup({
      unit: 'nautical',
      rounding: '1/32',
      conduitSize: '6',
      benderProfileId: 'discontinued-bender',
    });

    expect(result).toEqual(DEFAULT_CALCULATOR_SETUP);
  });

  test('partial stored setup keeps valid fields and defaults the rest', () => {
    const result = sanitizeStoredSetup({ conduitSize: '1' });

    expect(result.conduitSize).toBe('1');
    expect(result.unit).toBe(DEFAULT_CALCULATOR_SETUP.unit);
    expect(result.rounding).toBe(DEFAULT_CALCULATOR_SETUP.rounding);
  });

  test('rounding is forced to match the unit system', () => {
    // Metric unit with an imperial rounding step on disk.
    const metric = sanitizeStoredSetup({ unit: 'metric', rounding: '1/16' });
    expect(metric.rounding).toBe('1mm');

    // Imperial unit with a metric rounding step on disk.
    const imperial = sanitizeStoredSetup({ unit: 'imperial', rounding: '5mm' });
    expect(imperial.rounding).toBe('1/16');
  });

  test('conduit type is always EMT', () => {
    expect(sanitizeStoredSetup({ conduitType: 'RMC' }).conduitType).toBe('EMT');
  });

  describe('stub90 deduct overrides', () => {
    test('valid overrides pass through', () => {
      const result = sanitizeStoredSetup({
        stub90DeductOverridesInches: { '1/2': 5.25, '3/4': 6.5 },
      });

      expect(result.stub90DeductOverridesInches).toEqual({ '1/2': 5.25, '3/4': 6.5 });
    });

    test('invalid entries are dropped individually', () => {
      const result = sanitizeStoredSetup({
        stub90DeductOverridesInches: {
          '1/2': 5.25,
          '3/4': -1,
          '1': Number.NaN,
          '1-1/4': 999,
          '6': 4,
          '1-1/2': 'five',
        },
      });

      expect(result.stub90DeductOverridesInches).toEqual({ '1/2': 5.25 });
    });

    test('missing or malformed overrides default to empty', () => {
      expect(sanitizeStoredSetup({}).stub90DeductOverridesInches).toEqual({});
      expect(
        sanitizeStoredSetup({ stub90DeductOverridesInches: 'garbage' }).stub90DeductOverridesInches,
      ).toEqual({});
    });
  });

  describe('offset multiplier overrides', () => {
    test('valid overrides pass through', () => {
      const result = sanitizeStoredSetup({
        offsetMultiplierOverrides: { 30: 2.1, 45: 1.35 },
      });

      expect(result.offsetMultiplierOverrides).toEqual({ 30: 2.1, 45: 1.35 });
    });

    test('invalid entries are dropped individually', () => {
      const result = sanitizeStoredSetup({
        offsetMultiplierOverrides: {
          30: 2.1,
          15: 2,
          60: -1,
          45: Number.NaN,
          10: 999,
        },
      });

      expect(result.offsetMultiplierOverrides).toEqual({ 30: 2.1 });
    });

    test('missing or malformed overrides default to empty', () => {
      expect(sanitizeStoredSetup({}).offsetMultiplierOverrides).toEqual({});
      expect(
        sanitizeStoredSetup({ offsetMultiplierOverrides: null }).offsetMultiplierOverrides,
      ).toEqual({});
    });
  });

  describe('offset shrink per inch overrides', () => {
    test('valid overrides pass through', () => {
      const result = sanitizeStoredSetup({
        offsetShrinkPerInchOverrides: { 30: 0.3125, 45: 0.5 },
      });

      expect(result.offsetShrinkPerInchOverrides).toEqual({ 30: 0.3125, 45: 0.5 });
    });

    test('invalid entries are dropped individually', () => {
      const result = sanitizeStoredSetup({
        offsetShrinkPerInchOverrides: {
          30: 0.3125,
          15: 0.25,
          60: -0.1,
          45: Number.NaN,
          10: 99,
        },
      });

      expect(result.offsetShrinkPerInchOverrides).toEqual({ 30: 0.3125 });
    });

    test('missing or malformed overrides default to empty', () => {
      expect(sanitizeStoredSetup({}).offsetShrinkPerInchOverrides).toEqual({});
      expect(
        sanitizeStoredSetup({ offsetShrinkPerInchOverrides: 'garbage' }).offsetShrinkPerInchOverrides,
      ).toEqual({});
    });
  });

  describe('custom bender profiles', () => {
    test('valid custom profiles pass through', () => {
      const result = sanitizeStoredSetup({
        customBenderProfiles: [
          {
            id: 'custom-abc',
            name: 'Shop bender',
            emtStub90TakeUpInches: { '1/2': 5.25, '3/4': 6 },
          },
        ],
        benderProfileId: 'custom-abc',
      });

      expect(result.customBenderProfiles).toHaveLength(1);
      expect(result.benderProfileId).toBe('custom-abc');
    });

    test('unknown benderProfileId falls back when custom profile missing', () => {
      const result = sanitizeStoredSetup({
        benderProfileId: 'custom-deleted',
        customBenderProfiles: [],
      });

      expect(result.benderProfileId).toBe(DEFAULT_CALCULATOR_SETUP.benderProfileId);
    });
  });
});

describe('replaceCalculatorSetup', () => {
  test('normalizes rounding and keeps provided fields', () => {
    const next = replaceCalculatorSetup({
      ...DEFAULT_CALCULATOR_SETUP,
      unit: 'metric',
      rounding: '1/16',
      conduitSize: '1',
    });

    expect(next.unit).toBe('metric');
    expect(next.conduitSize).toBe('1');
    expect(next.rounding).toBe('1mm');
    expect(next.conduitType).toBe('EMT');
  });
});

describe('patchCalculatorSetup', () => {
  test('applies a partial change and keeps other fields', () => {
    const next = patchCalculatorSetup(DEFAULT_CALCULATOR_SETUP, { conduitSize: '1' });

    expect(next.conduitSize).toBe('1');
    expect(next.unit).toBe(DEFAULT_CALCULATOR_SETUP.unit);
    expect(next.rounding).toBe(DEFAULT_CALCULATOR_SETUP.rounding);
  });

  test('switching to metric replaces an imperial rounding step', () => {
    const next = patchCalculatorSetup(DEFAULT_CALCULATOR_SETUP, { unit: 'metric' });

    expect(next.unit).toBe('metric');
    expect(next.rounding).toBe('1mm');
  });

  test('switching back to imperial replaces a metric rounding step', () => {
    const metric = patchCalculatorSetup(DEFAULT_CALCULATOR_SETUP, { unit: 'metric' });
    const next = patchCalculatorSetup(metric, { unit: 'imperial' });

    expect(next.rounding).toBe('1/16');
  });

  test('rounding kept when still valid for the unit', () => {
    const eighth = patchCalculatorSetup(DEFAULT_CALCULATOR_SETUP, { rounding: '1/8' });
    const next = patchCalculatorSetup(eighth, { conduitSize: '3/4' });

    expect(next.rounding).toBe('1/8');
  });

  test('conduit type cannot leave EMT', () => {
    const next = patchCalculatorSetup(DEFAULT_CALCULATOR_SETUP, {
      conduitType: 'RMC' as never,
    });

    expect(next.conduitType).toBe('EMT');
  });
});

describe('getSetupOverrideHint', () => {
  test('stub90 hint when deduct is overridden for the active size', () => {
    const setup = patchCalculatorSetup(DEFAULT_CALCULATOR_SETUP, {
      conduitSize: '3/4',
      stub90DeductOverridesInches: { '3/4': 6.25 },
    });

    expect(getSetupOverrideHint(setup, { calculator: 'stub90' })).toBe(
      'Custom deduct on 3/4" EMT',
    );
  });

  test('stub90 returns undefined when no deduct override', () => {
    expect(getSetupOverrideHint(DEFAULT_CALCULATOR_SETUP, { calculator: 'stub90' })).toBeUndefined();
  });

  test('offset hints for multiplier, shrink, or both', () => {
    const multiplierOnly = patchCalculatorSetup(DEFAULT_CALCULATOR_SETUP, {
      offsetMultiplierOverrides: { 30: 2.1 },
    });
    expect(getSetupOverrideHint(multiplierOnly, { calculator: 'offset', bendAngle: 30 })).toBe(
      'Custom multiplier at 30°',
    );

    const shrinkOnly = patchCalculatorSetup(DEFAULT_CALCULATOR_SETUP, {
      offsetShrinkPerInchOverrides: { 30: 0.3125 },
    });
    expect(getSetupOverrideHint(shrinkOnly, { calculator: 'offset', bendAngle: 30 })).toBe(
      'Custom shrink at 30°',
    );

    const both = patchCalculatorSetup(DEFAULT_CALCULATOR_SETUP, {
      offsetMultiplierOverrides: { 30: 2.1 },
      offsetShrinkPerInchOverrides: { 30: 0.3125 },
    });
    expect(getSetupOverrideHint(both, { calculator: 'offset', bendAngle: 30 })).toBe(
      'Custom multiplier & shrink at 30°',
    );
  });

  test('offset returns undefined when overrides are for a different angle', () => {
    const setup = patchCalculatorSetup(DEFAULT_CALCULATOR_SETUP, {
      offsetMultiplierOverrides: { 45: 1.35 },
    });

    expect(
      getSetupOverrideHint(setup, { calculator: 'offset', bendAngle: 30 }),
    ).toBeUndefined();
  });
});
