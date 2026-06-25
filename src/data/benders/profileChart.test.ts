import {
  buildProfileDeductRows,
  formatChartKindLabel,
  GENERIC_HAND_BENDER,
  splitProfilesByOrigin,
} from './index';

describe('profileChart helpers', () => {
  test('formatChartKindLabel covers built-in and custom kinds', () => {
    expect(formatChartKindLabel('generic-field-reference')).toBe('Generic field reference');
    expect(formatChartKindLabel('custom-measured')).toBe('Your measurements');
  });

  test('buildProfileDeductRows merges chart and override values', () => {
    const rows = buildProfileDeductRows(GENERIC_HAND_BENDER, { '1/2': 5.25 });
    const half = rows.find((row) => row.tradeSize === '1/2');

    expect(half?.chartDeductInches).toBe(5);
    expect(half?.overrideDeductInches).toBe(5.25);
    expect(half?.effectiveDeductInches).toBe(5.25);
  });

  test('splitProfilesByOrigin separates custom profiles', () => {
    const custom = {
      id: 'custom-test',
      name: 'Shop bender',
      emtStub90TakeUpInches: { '1/2': 5.125 },
    };
    const { builtIn, custom: customProfiles } = splitProfilesByOrigin([
      GENERIC_HAND_BENDER,
      {
        id: custom.id,
        name: custom.name,
        category: 'custom',
        chartKind: 'custom-measured',
        description: 'test',
        emtStub90TakeUpInches: custom.emtStub90TakeUpInches,
      },
    ]);

    expect(builtIn).toHaveLength(1);
    expect(customProfiles).toHaveLength(1);
  });
});
