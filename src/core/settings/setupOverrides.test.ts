import { DEFAULT_CALCULATOR_SETUP } from './calculatorSetup';
import {
  listSetupOverrides,
  patchClearAllSetupOverrides,
  patchClearSetupOverride,
} from './setupOverrides';

describe('listSetupOverrides', () => {
  test('returns empty when no overrides are saved', () => {
    expect(listSetupOverrides(DEFAULT_CALCULATOR_SETUP)).toEqual([]);
  });

  test('lists stub90, multiplier, and shrink overrides', () => {
    const setup = {
      ...DEFAULT_CALCULATOR_SETUP,
      stub90DeductOverridesInches: { '1/2': 5.25 },
      offsetMultiplierOverrides: { 30: 2.1 },
      offsetShrinkPerInchOverrides: { 45: 0.2 },
    };

    const entries = listSetupOverrides(setup);
    expect(entries).toHaveLength(3);
    expect(entries.map((entry) => entry.kind)).toEqual([
      'stub90-deduct',
      'offset-multiplier',
      'offset-shrink',
    ]);
  });
});

describe('patchClearSetupOverride', () => {
  test('clears a single stub90 override', () => {
    const setup = {
      ...DEFAULT_CALCULATOR_SETUP,
      stub90DeductOverridesInches: { '1/2': 5.25, '3/4': 6.125 },
    };
    const entry = listSetupOverrides(setup)[0];

    expect(patchClearSetupOverride(setup, entry)).toEqual({
      stub90DeductOverridesInches: { '3/4': 6.125 },
    });
  });

  test('clears all overrides', () => {
    expect(patchClearAllSetupOverrides()).toEqual({
      stub90DeductOverridesInches: {},
      offsetMultiplierOverrides: {},
      offsetShrinkPerInchOverrides: {},
    });
  });
});
