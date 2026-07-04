import {
  buildCustomBenderProfileFromDraft,
  createCustomBenderProfileId,
  getBenderProfileById,
  isBenderProfileNameTaken,
  isCustomBenderProfileId,
  mergeBenderProfiles,
  resolveBenderProfileById,
  sanitizeCustomBenderProfile,
  sanitizeCustomBenderProfiles,
  toBenderProfile,
  type CustomBenderProfileStored,
} from './customBenders';
import { BENDER_PROFILES, DEFAULT_BENDER_PROFILE_ID } from './index';

const sampleCustom: CustomBenderProfileStored = {
  id: 'custom-test-1',
  name: 'Shop bender',
  emtStub90TakeUpInches: { '1/2': 5.25, '3/4': 6.5 },
};

describe('custom bender profiles', () => {
  test('createCustomBenderProfileId uses custom prefix', () => {
    const id = createCustomBenderProfileId();
    expect(isCustomBenderProfileId(id)).toBe(true);
  });

  test('toBenderProfile maps stored profile to category custom', () => {
    const profile = toBenderProfile(sampleCustom);
    expect(profile.category).toBe('custom');
    expect(profile.name).toBe('Shop bender');
    expect(profile.emtStub90TakeUpInches['1/2']).toBe(5.25);
  });

  test('mergeBenderProfiles includes built-in and custom', () => {
    const merged = mergeBenderProfiles([sampleCustom]);
    expect(merged).toHaveLength(BENDER_PROFILES.length + 1);
    expect(merged.at(-1)?.id).toBe('custom-test-1');
  });

  test('getBenderProfileById resolves custom profile', () => {
    const profile = getBenderProfileById('custom-test-1', [sampleCustom]);
    expect(profile.name).toBe('Shop bender');
  });

  test('getBenderProfileById falls back when custom profile missing', () => {
    const profile = getBenderProfileById('custom-deleted', [sampleCustom]);
    expect(profile.id).toBe(DEFAULT_BENDER_PROFILE_ID);
  });

  test('resolveBenderProfileById reports no fallback for known ids', () => {
    const builtIn = resolveBenderProfileById(DEFAULT_BENDER_PROFILE_ID, [sampleCustom]);
    expect(builtIn.isFallback).toBe(false);
    expect(builtIn.profile.id).toBe(DEFAULT_BENDER_PROFILE_ID);

    const custom = resolveBenderProfileById('custom-test-1', [sampleCustom]);
    expect(custom.isFallback).toBe(false);
    expect(custom.profile.name).toBe('Shop bender');
  });

  test('resolveBenderProfileById flags fallback for unknown ids', () => {
    const resolved = resolveBenderProfileById('custom-deleted', [sampleCustom]);
    expect(resolved.isFallback).toBe(true);
    expect(resolved.profile.id).toBe(DEFAULT_BENDER_PROFILE_ID);
  });

  test('isBenderProfileNameTaken detects built-in and custom names', () => {
    expect(isBenderProfileNameTaken(BENDER_PROFILES[0].name, [sampleCustom])).toBe(true);
    expect(isBenderProfileNameTaken('Shop bender', [sampleCustom])).toBe(true);
    expect(isBenderProfileNameTaken('Shop bender', [sampleCustom], 'custom-test-1')).toBe(false);
    expect(isBenderProfileNameTaken('Unique name', [sampleCustom])).toBe(false);
  });

  test('buildCustomBenderProfileFromDraft validates name and deducts', () => {
    expect(buildCustomBenderProfileFromDraft({
      name: '',
      deductHalf: '5',
      deductThreeQuarter: '',
      deductOne: '',
    }).error).toBeDefined();

    expect(buildCustomBenderProfileFromDraft({
      name: 'Mine',
      deductHalf: '',
      deductThreeQuarter: '',
      deductOne: '',
    }).error).toBeDefined();

    const result = buildCustomBenderProfileFromDraft({
      name: 'Mine',
      deductHalf: '5',
      deductThreeQuarter: '6',
      deductOne: '',
    });
    expect(result.profile?.name).toBe('Mine');
    expect(result.profile?.emtStub90TakeUpInches).toEqual({ '1/2': 5, '3/4': 6 });
  });

  test('buildCustomBenderProfileFromDraft accepts fraction deduct input', () => {
    const result = buildCustomBenderProfileFromDraft({
      name: 'Shop',
      deductHalf: '5 1/4',
      deductThreeQuarter: '',
      deductOne: '',
    });

    expect(result.profile?.emtStub90TakeUpInches['1/2']).toBeCloseTo(5.25);
  });
});

describe('sanitizeCustomBenderProfiles', () => {
  test('keeps valid profiles and drops invalid entries', () => {
    const result = sanitizeCustomBenderProfiles([
      sampleCustom,
      { id: 'not-custom', name: 'Bad', emtStub90TakeUpInches: { '1/2': 5 } },
      { id: 'custom-2', name: '', emtStub90TakeUpInches: { '1/2': 5 } },
      { id: 'custom-3', name: 'Dup', emtStub90TakeUpInches: {} },
    ]);

    expect(result).toEqual([sampleCustom]);
  });

  test('sanitizeCustomBenderProfile rejects out-of-range deducts', () => {
    expect(
      sanitizeCustomBenderProfile({
        id: 'custom-x',
        name: 'Test',
        emtStub90TakeUpInches: { '1/2': 99 },
      }),
    ).toBeUndefined();
  });
});
