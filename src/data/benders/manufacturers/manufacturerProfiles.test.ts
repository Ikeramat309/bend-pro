import type { TradeSize } from '@/core/types';

import { resolveBenderProfileById } from '../customBenders';
import {
  GARDNER_BIGBEN_ALUMINUM,
  GREENLEE_SITE_RITE_ALUMINUM,
  GREENLEE_SITE_RITE_DUAL_SHOE,
  GREENLEE_SITE_RITE_IRON,
  IDEAL_ALUMINUM,
  IDEAL_DUCTILE_IRON,
  KLEIN_ANGLE_SETTER_ALUMINUM,
  KLEIN_ANGLE_SETTER_IRON,
  MANUFACTURER_BENDER_PROFILES,
  MILWAUKEE_ALUMINUM,
  MILWAUKEE_IRON,
  SOUTHWIRE_MCB,
} from './index';
import { BENDER_SOURCES, BENDER_WORKBOOK_VERSION } from './sources';

const REFERENCE_ONLY_PROFILES = [MILWAUKEE_ALUMINUM, MILWAUKEE_IRON, SOUTHWIRE_MCB];

const TAKE_UP_EXPECTATIONS: Record<string, Partial<Record<TradeSize, number>>> = {
  'greenlee-site-rite-aluminum': { '1/2': 5, '3/4': 6, '1': 8, '1-1/4': 11 },
  'greenlee-site-rite-iron': { '1/2': 5, '3/4': 6, '1': 8, '1-1/4': 11 },
  'greenlee-site-rite-dual-shoe': { '1/2': 5, '3/4': 6 },
  'klein-angle-setter-iron': { '1/2': 5, '3/4': 6, '1': 8 },
  'klein-angle-setter-aluminum': { '1/2': 5, '3/4': 6 },
  'gardner-bigben-aluminum': { '1/2': 5, '3/4': 6, '1': 8 },
  'ideal-aluminum': { '1/2': 5, '3/4': 6 },
  'ideal-ductile-iron': { '1/2': 5, '3/4': 6, '1': 8, '1-1/4': 11 },
};

const RADIUS_EXPECTATIONS: Record<string, Partial<Record<TradeSize, number>>> = {
  'greenlee-site-rite-aluminum': {
    '1/2': 4.1875,
    '3/4': 5.125,
    '1': 6.5,
    '1-1/4': 9.625,
  },
  'greenlee-site-rite-iron': {
    '1/2': 4.1875,
    '3/4': 5.125,
    '1': 6.5,
    '1-1/4': 9.625,
  },
  'greenlee-site-rite-dual-shoe': { '1/2': 4.1875, '3/4': 5.125 },
  'klein-angle-setter-iron': { '1/2': 4.625, '3/4': 5.5, '1': 7.375 },
  'klein-angle-setter-aluminum': { '1/2': 4.625, '3/4': 5.5 },
  'gardner-bigben-aluminum': { '1/2': 3.69, '3/4': 4.74, '1': 5.81 },
};

const NO_RADIUS_PROFILE_IDS = [
  'ideal-aluminum',
  'ideal-ductile-iron',
  'milwaukee-aluminum',
  'milwaukee-iron',
  'southwire-mcb',
];

describe('manufacturer bender workbook', () => {
  test('workbook version is v1.1', () => {
    expect(BENDER_WORKBOOK_VERSION).toBe('v1.1');
  });

  test('every source id in sizeSpecs resolves in BENDER_SOURCES', () => {
    for (const profile of MANUFACTURER_BENDER_PROFILES) {
      for (const spec of Object.values(profile.sizeSpecs ?? {})) {
        for (const sourceId of spec.sourceIds) {
          expect(BENDER_SOURCES[sourceId]).toBeDefined();
        }
      }
    }
  });
});

describe('manufacturer bender profiles', () => {
  test('eleven manufacturer profiles are registered', () => {
    expect(MANUFACTURER_BENDER_PROFILES).toHaveLength(11);
  });

  test.each(MANUFACTURER_BENDER_PROFILES.map((profile) => [profile.id, profile]))(
    '%s has manufacturer chart kind, sourceNote, and sourced sizeSpecs',
    (_id, profile) => {
      expect(profile.chartKind).toBe('manufacturer');
      expect(profile.sourceNote?.trim().length).toBeGreaterThan(0);

      for (const spec of Object.values(profile.sizeSpecs ?? {})) {
        expect(spec.sourceIds.length).toBeGreaterThanOrEqual(1);
      }
    },
  );

  test.each(REFERENCE_ONLY_PROFILES.map((profile) => [profile.id, profile]))(
    '%s reference_only profile has empty emtStub90TakeUpInches',
    (_id, profile) => {
      expect(profile.verificationStatus).toBe('reference_only');
      expect(profile.emtStub90TakeUpInches).toEqual({});
      expect(Object.keys(profile.emtStub90TakeUpInches)).toHaveLength(0);
    },
  );

  test.each(
    Object.entries(TAKE_UP_EXPECTATIONS).flatMap(([profileId, sizes]) =>
      Object.entries(sizes).map(([tradeSize, takeUp]) => [profileId, tradeSize, takeUp]),
    ),
  )('%s %s" take-up is %s"', (profileId, tradeSize, takeUp) => {
    const profile = MANUFACTURER_BENDER_PROFILES.find((entry) => entry.id === profileId);
    expect(profile?.emtStub90TakeUpInches[tradeSize as TradeSize]).toBe(takeUp);
    expect(profile?.sizeSpecs?.[tradeSize as TradeSize]?.takeUpInches).toBe(takeUp);
  });

  test.each(
    Object.entries(RADIUS_EXPECTATIONS).flatMap(([profileId, sizes]) =>
      Object.entries(sizes).map(([tradeSize, radius]) => [profileId, tradeSize, radius]),
    ),
  )('%s %s" centerline radius is %s"', (profileId, tradeSize, radius) => {
    const profile = MANUFACTURER_BENDER_PROFILES.find((entry) => entry.id === profileId);
    expect(profile?.sizeSpecs?.[tradeSize as TradeSize]?.centerlineRadiusInches).toBe(radius);
  });

  test.each(NO_RADIUS_PROFILE_IDS)('%s sizeSpecs have no centerline radius', (profileId) => {
    const profile = MANUFACTURER_BENDER_PROFILES.find((entry) => entry.id === profileId);
    for (const spec of Object.values(profile?.sizeSpecs ?? {})) {
      expect(spec.centerlineRadiusInches).toBeUndefined();
    }
  });

  test.each(MANUFACTURER_BENDER_PROFILES.map((profile) => [profile.id, profile]))(
    'resolveBenderProfileById resolves %s without fallback',
    (id, profile) => {
      const resolved = resolveBenderProfileById(id);
      expect(resolved.isFallback).toBe(false);
      expect(resolved.profile.id).toBe(profile.id);
    },
  );
});

describe('manufacturer profile identity', () => {
  test('greenlee aluminum and iron share take-up and radius values', () => {
    expect(GREENLEE_SITE_RITE_ALUMINUM.emtStub90TakeUpInches).toEqual(
      GREENLEE_SITE_RITE_IRON.emtStub90TakeUpInches,
    );
    expect(GREENLEE_SITE_RITE_ALUMINUM.sizeSpecs?.['1/2']?.centerlineRadiusInches).toBe(4.1875);
  });

  test('greenlee dual-shoe carries per-size groove note', () => {
    expect(GREENLEE_SITE_RITE_DUAL_SHOE.sizeSpecs?.['1/2']?.note).toBe(
      'Dual-shoe model — values are for this groove/size.',
    );
  });

  test('gardner profile is verified_with_source_note', () => {
    expect(GARDNER_BIGBEN_ALUMINUM.verificationStatus).toBe('verified_with_source_note');
    expect(GARDNER_BIGBEN_ALUMINUM.sourceNote).toContain('B-0040');
  });

  test('ideal profiles are field_layout_only with take-up but no radius', () => {
    expect(IDEAL_ALUMINUM.verificationStatus).toBe('field_layout_only');
    expect(IDEAL_DUCTILE_IRON.emtStub90TakeUpInches['1-1/4']).toBe(11);
    expect(IDEAL_ALUMINUM.sizeSpecs?.['1/2']?.centerlineRadiusInches).toBeUndefined();
  });

  test('klein iron 3/4" chart deduct is 6', () => {
    expect(KLEIN_ANGLE_SETTER_IRON.emtStub90TakeUpInches['3/4']).toBe(6);
    expect(KLEIN_ANGLE_SETTER_ALUMINUM.emtStub90TakeUpInches['3/4']).toBe(6);
  });
});
