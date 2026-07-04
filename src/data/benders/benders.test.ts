import {
  BENDER_PROFILES,
  DEFAULT_BENDER_PROFILE_ID,
  filterBenderProfiles,
  formatProfileStub90Summary,
  getBenderProfile,
  getBenderProfileIdByName,
  HAND_BENDER_ALT_CHART,
  HAND_BENDER_COMPACT,
  MANUFACTURER_BENDER_PROFILES,
} from './index';

const GENERIC_PROFILE_COUNT = 3;
const MANUFACTURER_PROFILE_COUNT = 11;

describe('bender profiles', () => {
  test('generic and manufacturer hand profiles are registered', () => {
    expect(BENDER_PROFILES).toHaveLength(GENERIC_PROFILE_COUNT + MANUFACTURER_PROFILE_COUNT);
    expect(BENDER_PROFILES.slice(0, GENERIC_PROFILE_COUNT).map((profile) => profile.id)).toEqual([
      'generic-hand-bender',
      'hand-bender-alt-chart',
      'hand-bender-compact',
    ]);
    expect(BENDER_PROFILES.slice(GENERIC_PROFILE_COUNT)).toEqual([...MANUFACTURER_BENDER_PROFILES]);
  });

  test('generic profiles have description, chart kind, and stub-90 deducts for 1/2, 3/4, and 1', () => {
    for (const profile of BENDER_PROFILES.slice(0, GENERIC_PROFILE_COUNT)) {
      expect(profile.description.length).toBeGreaterThan(0);
      expect(profile.chartKind).toBe('generic-field-reference');
      expect(profile.emtStub90TakeUpInches['1/2']).toBeDefined();
      expect(profile.emtStub90TakeUpInches['3/4']).toBeDefined();
      expect(profile.emtStub90TakeUpInches['1']).toBeDefined();
    }
  });

  test('getBenderProfile resolves known ids and falls back for unknown', () => {
    expect(getBenderProfile('hand-bender-compact').id).toBe('hand-bender-compact');
    expect(getBenderProfile('klein-angle-setter-iron').id).toBe('klein-angle-setter-iron');
    expect(getBenderProfile('missing-profile').id).toBe(DEFAULT_BENDER_PROFILE_ID);
  });

  test('getBenderProfileIdByName resolves by display name', () => {
    expect(getBenderProfileIdByName(HAND_BENDER_ALT_CHART.name)).toBe('hand-bender-alt-chart');
    expect(getBenderProfileIdByName('Unknown')).toBe(DEFAULT_BENDER_PROFILE_ID);
  });
});

describe('filterBenderProfiles', () => {
  test('empty query returns all profiles', () => {
    expect(filterBenderProfiles('')).toHaveLength(BENDER_PROFILES.length);
    expect(filterBenderProfiles('   ')).toHaveLength(BENDER_PROFILES.length);
  });

  test('matches name, description, and category', () => {
    expect(filterBenderProfiles('compact')).toEqual([HAND_BENDER_COMPACT]);
    expect(filterBenderProfiles('alternate')).toEqual([HAND_BENDER_ALT_CHART]);
    expect(filterBenderProfiles('greenlee')).toHaveLength(3);
    expect(filterBenderProfiles('hand')).toHaveLength(BENDER_PROFILES.length);
  });

  test('returns empty when nothing matches', () => {
    expect(filterBenderProfiles('hydraulic')).toEqual([]);
  });
});

describe('formatProfileStub90Summary', () => {
  test('formats listed trade sizes with deduct values', () => {
    expect(formatProfileStub90Summary(HAND_BENDER_COMPACT)).toBe(
      '1/2" 4.5" · 3/4" 5.5" · 1" 7.5" · 1-1/4" 10.5"',
    );
  });
});
