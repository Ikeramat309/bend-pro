import type { RoundingOption, TradeSize, UnitSystem } from '@/core/types';
import { formatLength } from '@/utils/formatLength';

import type { BenderChartKind, BenderProfile } from './types';

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
