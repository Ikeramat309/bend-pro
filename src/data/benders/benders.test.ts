import {
  BENDER_PROFILES,
  DEFAULT_BENDER_PROFILE_ID,
  filterBenderProfiles,
  formatProfileStub90Summary,
  getBenderProfile,
  getBenderProfileIdByName,
  HAND_BENDER_ALT_CHART,
  HAND_BENDER_COMPACT,
} from './index';

describe('bender profiles', () => {
  test('three generic hand profiles are registered', () => {
    expect(BENDER_PROFILES).toHaveLength(3);
    expect(BENDER_PROFILES.map((profile) => profile.id)).toEqual([
      'generic-hand-bender',
      'hand-bender-alt-chart',
      'hand-bender-compact',
    ]);
  });

  test('every profile has a description and stub-90 deducts for 1/2, 3/4, and 1', () => {
    for (const profile of BENDER_PROFILES) {
      expect(profile.description.length).toBeGreaterThan(0);
      expect(profile.emtStub90TakeUpInches['1/2']).toBeDefined();
      expect(profile.emtStub90TakeUpInches['3/4']).toBeDefined();
      expect(profile.emtStub90TakeUpInches['1']).toBeDefined();
    }
  });

  test('getBenderProfile resolves known ids and falls back for unknown', () => {
    expect(getBenderProfile('hand-bender-compact').id).toBe('hand-bender-compact');
    expect(getBenderProfile('missing-profile').id).toBe(DEFAULT_BENDER_PROFILE_ID);
  });

  test('getBenderProfileIdByName resolves by display name', () => {
    expect(getBenderProfileIdByName(HAND_BENDER_ALT_CHART.name)).toBe('hand-bender-alt-chart');
    expect(getBenderProfileIdByName('Unknown')).toBe(DEFAULT_BENDER_PROFILE_ID);
  });
});

describe('filterBenderProfiles', () => {
  test('empty query returns all profiles', () => {
    expect(filterBenderProfiles('')).toHaveLength(3);
    expect(filterBenderProfiles('   ')).toHaveLength(3);
  });

  test('matches name, description, and category', () => {
    expect(filterBenderProfiles('compact')).toEqual([HAND_BENDER_COMPACT]);
    expect(filterBenderProfiles('alternate')).toEqual([HAND_BENDER_ALT_CHART]);
    expect(filterBenderProfiles('hand')).toHaveLength(3);
  });

  test('returns empty when nothing matches', () => {
    expect(filterBenderProfiles('hydraulic')).toEqual([]);
  });
});

describe('formatProfileStub90Summary', () => {
  test('formats listed trade sizes with deduct values', () => {
    expect(formatProfileStub90Summary(HAND_BENDER_COMPACT)).toBe('1/2" 4.5" · 3/4" 5.5" · 1" 7.5"');
  });
});
