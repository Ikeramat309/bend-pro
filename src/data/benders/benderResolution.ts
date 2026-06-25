import type { TradeSize } from '@/core/types';

import { DEFAULT_EMT_STUB90_TAKE_UP_INCHES } from './benderDefaults';
import type { BenderProfile, BenderSourceType } from './types';
import { resolveStub90DeductSource, type Stub90DeductSource } from './profileContext';

/** Maps profile metadata to the product source model. */
export function getBenderSourceType(profile: BenderProfile): BenderSourceType {
  if (profile.chartKind === 'custom-measured') {
    return 'custom';
  }
  if (profile.chartKind === 'manufacturer') {
    return 'verified';
  }
  return 'generic';
}

export type EffectiveStub90Deduct = {
  deductInches: number;
  chartDeductInches?: number;
  source: Stub90DeductSource;
  sourceType: BenderSourceType;
};

/**
 * Resolves stub-90 deduct with explicit precedence:
 * manual override → profile chart → generic default fallback.
 */
export function resolveEffectiveStub90DeductInches(
  profile: BenderProfile,
  tradeSize: TradeSize,
  deductOverrideInches?: number,
  defaultFallbackInches: number = DEFAULT_EMT_STUB90_TAKE_UP_INCHES,
): EffectiveStub90Deduct {
  const override =
    deductOverrideInches !== undefined &&
    Number.isFinite(deductOverrideInches) &&
    deductOverrideInches > 0
      ? deductOverrideInches
      : undefined;
  const chartDeductInches = profile.emtStub90TakeUpInches[tradeSize];
  const deductInches = override ?? chartDeductInches ?? defaultFallbackInches;
  const source = resolveStub90DeductSource(profile, tradeSize, override);

  return {
    deductInches,
    chartDeductInches,
    source,
    sourceType: getBenderSourceType(profile),
  };
}
