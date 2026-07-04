import type { RoundingOption, TradeSize, UnitSystem } from '@/core/types';
import { SUPPORTED_EMT_TRADE_SIZES } from '@/data/emt/emtSizes';
import { formatLength } from '@/utils/formatLength';

import type { BenderChartKind, BenderProfile, BenderVerificationStatus } from './types';

const PROFILE_TABLE_SIZES: readonly TradeSize[] = ['1/2', '3/4', '1'];

export type ProfileDeductRow = {
  tradeSize: TradeSize;
  chartDeductInches?: number;
  overrideDeductInches?: number;
  effectiveDeductInches?: number;
};

const CHART_KIND_LABELS: Record<BenderChartKind, string> = {
  'generic-field-reference': 'Generic field reference',
  'custom-measured': 'Your measurements',
  manufacturer: 'Manufacturer chart',
};

/** User-facing label for where chart values come from. */
export function formatChartKindLabel(chartKind: BenderChartKind): string {
  return CHART_KIND_LABELS[chartKind];
}

/** What calculators use this profile for today. */
export function getProfileCapabilities(profile: BenderProfile): readonly string[] {
  const capabilities = [
    'Stub 90 — deduct mark uses this profile’s stub 90 deduct chart (or your per-size override).',
  ];

  if (profile.chartKind === 'generic-field-reference') {
    capabilities.push(
      'Offset & Rolling Offset — standard angle multiplier/shrink tables (not bender-specific). Profile name is shown for consistency.',
    );
  } else if (profile.chartKind === 'custom-measured') {
    capabilities.push(
      'Offset & Rolling Offset — standard angle tables. Your custom profile only stores stub 90 deducts.',
    );
  } else {
    capabilities.push(
      'Offset & Rolling Offset — standard angle tables unless manufacturer offset data is added later.',
    );
  }

  return capabilities;
}

/** Rows for the stub 90 deduct table in profile detail. */
export function buildProfileDeductRows(
  profile: BenderProfile,
  stub90DeductOverridesInches: Partial<Record<TradeSize, number>> = {},
): ProfileDeductRow[] {
  return PROFILE_TABLE_SIZES.map((tradeSize) => {
    const chartDeductInches = profile.emtStub90TakeUpInches[tradeSize];
    const overrideDeductInches = stub90DeductOverridesInches[tradeSize];
    const effectiveDeductInches = overrideDeductInches ?? chartDeductInches;

    return {
      tradeSize,
      chartDeductInches,
      overrideDeductInches,
      effectiveDeductInches,
    };
  });
}

export function formatProfileDeductCell(
  inches: number | undefined,
  unitSystem: UnitSystem,
  rounding: RoundingOption,
): string {
  if (inches === undefined) return '—';
  return formatLength(inches, unitSystem, rounding);
}

export function splitProfilesByOrigin(
  profiles: readonly BenderProfile[],
): { builtIn: BenderProfile[]; custom: BenderProfile[] } {
  const builtIn: BenderProfile[] = [];
  const custom: BenderProfile[] = [];

  for (const profile of profiles) {
    if (profile.category === 'custom') {
      custom.push(profile);
    } else {
      builtIn.push(profile);
    }
  }

  return { builtIn, custom };
}

export type ProfileChartKindGroups = {
  manufacturer: BenderProfile[];
  generic: BenderProfile[];
  custom: BenderProfile[];
};

/** Splits profiles into manufacturer, generic field-reference, and custom groups. */
export function splitProfilesByChartKind(
  profiles: readonly BenderProfile[],
): ProfileChartKindGroups {
  const manufacturer: BenderProfile[] = [];
  const generic: BenderProfile[] = [];
  const custom: BenderProfile[] = [];

  for (const profile of profiles) {
    if (profile.category === 'custom') {
      custom.push(profile);
    } else if (profile.chartKind === 'manufacturer') {
      manufacturer.push(profile);
    } else {
      generic.push(profile);
    }
  }

  return { manufacturer, generic, custom };
}

const VERIFICATION_STATUS_LABELS: Record<BenderVerificationStatus, string> = {
  verified_default: 'Manufacturer chart',
  verified_with_source_note: 'Manufacturer chart · see note',
  field_layout_only: 'Take-up only · no radius data',
  reference_only: 'Unverified · needs custom deduct',
};

/** User-facing verification status for manufacturer profile cards and detail. */
export function formatVerificationStatusLabel(status: BenderVerificationStatus): string {
  return VERIFICATION_STATUS_LABELS[status];
}

export function isVerificationStatusWarning(status: BenderVerificationStatus): boolean {
  return status === 'reference_only';
}

/** Brand and material subtitle for manufacturer cards, e.g. "Greenlee · aluminum". */
export function formatManufacturerBrandMaterial(profile: BenderProfile): string | undefined {
  if (profile.chartKind !== 'manufacturer') return undefined;

  const parts = [profile.brand, profile.material].filter(
    (part): part is string => part !== undefined && part.length > 0,
  );

  return parts.length > 0 ? parts.join(' · ') : undefined;
}

export type ProfileManufacturerDetailRow = {
  tradeSize: TradeSize;
  models: string;
  takeUpInches?: number;
  centerlineRadiusInches?: number;
  note?: string;
};

/** Per-size manufacturer chart rows for the profile detail sheet. */
export function buildManufacturerDetailRows(profile: BenderProfile): ProfileManufacturerDetailRow[] {
  if (profile.chartKind !== 'manufacturer' || profile.sizeSpecs === undefined) {
    return [];
  }

  return SUPPORTED_EMT_TRADE_SIZES.filter((tradeSize) => profile.sizeSpecs![tradeSize] !== undefined).map(
    (tradeSize) => {
      const spec = profile.sizeSpecs![tradeSize]!;

      return {
        tradeSize,
        models: spec.models,
        takeUpInches: spec.takeUpInches,
        centerlineRadiusInches: spec.centerlineRadiusInches,
        note: spec.note,
      };
    },
  );
}

export function profileHasRadiusData(profile: BenderProfile): boolean {
  if (profile.sizeSpecs === undefined) return false;

  return Object.values(profile.sizeSpecs).some(
    (spec) => spec !== undefined && spec.centerlineRadiusInches !== undefined,
  );
}
