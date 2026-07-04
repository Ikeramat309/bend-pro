/**
 * Bender profile context — where deduct/multiplier values come from.
 *
 * Pure helpers for calculator UI. Keeps profile-source messaging in one place.
 */
import type { BendAngle, RoundingOption, TradeSize, UnitSystem } from '@/core/types';
import { formatLength } from '@/utils/formatLength';

import type { BenderProfile } from './types';

export type Stub90DeductSource = 'override' | 'profile-chart' | 'missing-chart';

export type Stub90DeductContext = {
  source: Stub90DeductSource;
  profileName: string;
  tradeSize: TradeSize;
  chartDeductInches?: number;
  effectiveDeductInches?: number;
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
  return 'missing-chart';
}

export function resolveStub90DeductContext(
  profile: BenderProfile,
  tradeSize: TradeSize,
  effectiveDeductInches: number | undefined,
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
  const effective =
    context.effectiveDeductInches !== undefined
      ? formatLength(context.effectiveDeductInches, unitSystem, rounding)
      : undefined;

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
    case 'missing-chart':
      return `${context.profileName} has no stub 90 deduct chart for ${sizeLabel} EMT — set a custom deduct to calculate the mark.`;
  }
}

export function formatStub90DeductContextAction(context: Stub90DeductContext): string | undefined {
  if (context.source === 'missing-chart') {
    return 'Tap Deduct to set your bender value.';
  }
  if (context.source === 'override') {
    return 'Tap Deduct to edit or clear the override.';
  }
  return undefined;
}

/** Trust strip title — offset math uses standard angle tables, not the bender shoe. */
export function formatStandardOffsetTableTrustTitle(bendAngle: BendAngle): string {
  return `Standard ${bendAngle}° offset table`;
}

/** Trust strip title — saddle math uses standard preset tables. */
export function formatStandardSaddleTableTrustTitle(angleLabel: string): string {
  return `Standard ${angleLabel} table`;
}

/** Trust strip title — segment bend is geometric, not shoe-based. */
export function formatSegmentTrustTitle(): string {
  return 'Geometric model';
}

/** Selected bender shown in meta when it does not drive calculator math. */
export function formatSetupOnlyBenderMeta(profileName: string): string {
  return `${profileName} (setup only)`;
}

/** Warning when a saved bender profile id no longer resolves (e.g. deleted custom bender). */
export function formatMissingBenderProfileWarning(fallbackProfileName: string): string {
  return `Saved bender was not found — using ${fallbackProfileName} instead. Reselect your bender in Setup.`;
}
