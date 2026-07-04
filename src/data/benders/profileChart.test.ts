import {
  buildManufacturerDetailRows,
  buildProfileDeductRows,
  formatChartKindLabel,
  formatManufacturerBrandMaterial,
  formatVerificationStatusLabel,
  GENERIC_HAND_BENDER,
  MANUFACTURER_BENDER_PROFILES,
  profileHasRadiusData,
  splitProfilesByChartKind,
  splitProfilesByOrigin,
} from './index';

const GREENLEE_SITE_RITE_ALUMINUM = MANUFACTURER_BENDER_PROFILES[0]!;
const IDEAL_ALUMINUM = MANUFACTURER_BENDER_PROFILES.find((p) => p.id === 'ideal-aluminum')!;
const MILWAUKEE_ALUMINUM = MANUFACTURER_BENDER_PROFILES.find((p) => p.id === 'milwaukee-aluminum')!;

describe('profileChart helpers', () => {
  test('formatChartKindLabel covers built-in and custom kinds', () => {
    expect(formatChartKindLabel('generic-field-reference')).toBe('Generic field reference');
    expect(formatChartKindLabel('custom-measured')).toBe('Your measurements');
    expect(formatChartKindLabel('manufacturer')).toBe('Manufacturer chart');
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

  test('splitProfilesByChartKind groups manufacturer, generic, and custom', () => {
    const custom = {
      id: 'custom-test',
      name: 'Shop bender',
      category: 'custom' as const,
      chartKind: 'custom-measured' as const,
      description: 'test',
      emtStub90TakeUpInches: { '1/2': 5.125 },
    };

    const groups = splitProfilesByChartKind([
      GENERIC_HAND_BENDER,
      GREENLEE_SITE_RITE_ALUMINUM,
      custom,
    ]);

    expect(groups.generic).toHaveLength(1);
    expect(groups.generic[0]?.id).toBe('generic-hand-bender');
    expect(groups.manufacturer).toHaveLength(1);
    expect(groups.manufacturer[0]?.id).toBe('greenlee-site-rite-aluminum');
    expect(groups.custom).toHaveLength(1);
    expect(groups.custom[0]?.id).toBe('custom-test');
  });

  test('formatVerificationStatusLabel maps all manufacturer statuses', () => {
    expect(formatVerificationStatusLabel('verified_default')).toBe('Manufacturer chart');
    expect(formatVerificationStatusLabel('verified_with_source_note')).toBe(
      'Manufacturer chart · see note',
    );
    expect(formatVerificationStatusLabel('field_layout_only')).toBe(
      'Take-up only · no radius data',
    );
    expect(formatVerificationStatusLabel('reference_only')).toBe(
      'Unverified · needs custom deduct',
    );
  });

  test('formatManufacturerBrandMaterial joins brand and material', () => {
    expect(formatManufacturerBrandMaterial(GREENLEE_SITE_RITE_ALUMINUM)).toBe(
      'Greenlee · aluminum',
    );
    expect(formatManufacturerBrandMaterial(GENERIC_HAND_BENDER)).toBeUndefined();
  });

  test('buildManufacturerDetailRows includes radius and dashes for missing values', () => {
    const rows = buildManufacturerDetailRows(GREENLEE_SITE_RITE_ALUMINUM);
    const half = rows.find((row) => row.tradeSize === '1/2');
    const oneQuarter = rows.find((row) => row.tradeSize === '1-1/4');

    expect(half?.models).toContain('840A');
    expect(half?.takeUpInches).toBe(5);
    expect(half?.centerlineRadiusInches).toBe(4.1875);
    expect(oneQuarter?.takeUpInches).toBe(11);
    expect(profileHasRadiusData(GREENLEE_SITE_RITE_ALUMINUM)).toBe(true);
  });

  test('buildManufacturerDetailRows omits radius for field_layout_only profiles', () => {
    const rows = buildManufacturerDetailRows(IDEAL_ALUMINUM);
    const half = rows.find((row) => row.tradeSize === '1/2');

    expect(half?.takeUpInches).toBe(5);
    expect(half?.centerlineRadiusInches).toBeUndefined();
    expect(profileHasRadiusData(IDEAL_ALUMINUM)).toBe(false);
  });

  test('buildManufacturerDetailRows leaves take-up undefined for reference_only profiles', () => {
    const rows = buildManufacturerDetailRows(MILWAUKEE_ALUMINUM);
    const half = rows.find((row) => row.tradeSize === '1/2');

    expect(half?.models).toBe('48-22-4070');
    expect(half?.takeUpInches).toBeUndefined();
    expect(half?.centerlineRadiusInches).toBeUndefined();
    expect(profileHasRadiusData(MILWAUKEE_ALUMINUM)).toBe(false);
  });
});
