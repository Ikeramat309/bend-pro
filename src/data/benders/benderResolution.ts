import type { TradeSize } from '@/core/types';

import type { BenderProfile } from './types';
import { resolveStub90DeductSource, type Stub90DeductSource } from './profileContext';

export type EffectiveStub90Deduct = {
  /** Undefined when the profile has no chart value and no override was supplied. */
  deductInches?: number;
  chartDeductInches?: number;
  source: Stub90DeductSource;
};

/**
 * Resolves stub-90 deduct with explicit precedence:
 * manual override → profile chart. No invented fallback values.
 */
export function resolveEffectiveStub90DeductInches(
  profile: BenderProfile,
  tradeSize: TradeSize,
  deductOverrideInches?: number,
): EffectiveStub90Deduct {
  const override =
    deductOverrideInches !== undefined &&
    Number.isFinite(deductOverrideInches) &&
    deductOverrideInches > 0
      ? deductOverrideInches
      : undefined;
  const chartDeductInches = profile.emtStub90TakeUpInches[tradeSize];
  const source = resolveStub90DeductSource(profile, tradeSize, override);

  if (override !== undefined) {
    return {
      deductInches: override,
      chartDeductInches,
      source,
    };
  }

  if (chartDeductInches !== undefined) {
    return {
      deductInches: chartDeductInches,
      chartDeductInches,
      source,
    };
  }

  return {
    source,
    chartDeductInches: undefined,
  };
}
