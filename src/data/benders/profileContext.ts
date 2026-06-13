/**
 * Bender profile context — where deduct/multiplier values come from.
 *
 * Pure helpers for calculator UI. Keeps profile-source messaging in one place.
 */
import type { BendAngle, RoundingOption, TradeSize, UnitSystem } from '@/core/types';
import { formatLength } from '@/utils/formatLength';

import type { BenderProfile } from './types';

export type Stub90DeductSource = 'override' | 'profile-chart' | 'default-fallback';

export type Stub90DeductContext = {
  source: Stub90DeductSource;
  profileName: string;
  tradeSize: TradeSize;
  chartDeductInches?: number;
  effectiveDeductInches: number;
};

export function resolveStub90DeductSource(
  profile: BenderProfile,
  tradeSize: TradeSize,
  deductOverrideInches?: number,
): Stub90DeductSource {
  if (
    deductOverrideInches !== undefined &&
    Number.isFinite(deductOverrideInches) &&
    deductOverrideInches > 0
  ) {
    return 'override';
  }
  if (profile.emtStub90TakeUpInches[tradeSize] !== undefined) {
    return 'profile-chart';
  }
  return 'default-fallback';
}

export function resolveStub90DeductContext(
  profile: BenderProfile,
  tradeSize: TradeSize,
  effectiveDeductInches: number,
  deductOverrideInches?: number,
): Stub90DeductContext {
  const source = resolveStub90DeductSource(profile, tradeSize, deductOverrideInches);
  const chartDeductInches = profile.emtStub90TakeUpInches[tradeSize];

  return {
    source,
    profileName: profile.name,
    tradeSize,
    chartDeductInches,
    effectiveDeductInches,
  };
}

/** One-line profile context for the calculator setup band. */
export function formatStub90DeductContextLine(
  context: Stub90DeductContext,
  unitSystem: UnitSystem,
  rounding: RoundingOption,
): string {
  const sizeLabel = `${context.tradeSize}"`;
  const effective = formatLength(context.effectiveDeductInches, unitSystem, rounding);

  switch (context.source) {
    case 'override': {
      const chartPart =
        context.chartDeductInches !== undefined
          ? ` — chart ${formatLength(context.chartDeductInches, unitSystem, rounding)}`
          : '';
      return `Custom deduct for ${sizeLabel} EMT: ${effective}${chartPart}`;
    }
    case 'profile-chart':
      return `${context.profileName}: ${effective} deduct for ${sizeLabel} EMT`;
    case 'default-fallback':
      return `${context.profileName} has no chart for ${sizeLabel} EMT — using default ${effective} deduct`;
  }
}

export function formatStub90DeductContextAction(context: Stub90DeductContext): string | undefined {
  if (context.source === 'default-fallback') {
    return 'Tap Deduct to set your bender value.';
  }
  if (context.source === 'override') {
    return 'Tap Deduct to edit or clear the override.';
  }
  return undefined;
}

/** Offset — bender selection is shown for consistency; math uses standard angle tables. */
export function formatOffsetProfileContextLine(profileName: string, bendAngle: BendAngle): string {
  return `${profileName} — offset uses standard ${bendAngle}° multiplier and shrink tables (not bender-specific charts).`;
}
