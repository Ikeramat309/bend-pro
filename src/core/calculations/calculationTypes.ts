/**
 * Shared calculation contract primitives — status, setup snapshot, field steps.
 * Used by feature adapters; engines keep their existing result types.
 */
import type { BenderCategory } from '@/data/benders';
import type { ConduitType, RoundingOption, TradeSize, UnitSystem } from '@/core/types';

/** Outcome of a calculation run for layouts, export, and future persistence. */
export type CalculationStatus = 'valid' | 'invalid' | 'warning';

export type CalculationResultTone = 'default' | 'primary';

/** Field setup captured at calculation time — for saved/recent layouts. */
export type CalculationSetupSnapshot = {
  unitSystem: UnitSystem;
  roundingPrecision: RoundingOption;
  conduitType: ConduitType;
  tradeSize: TradeSize;
  benderProfileId: string;
};

export type BenderProfileSnapshot = {
  id: string;
  name: string;
  category: BenderCategory;
};

export type SourceNoteKind = 'bender' | 'override' | 'table' | 'assumption' | 'info';

/** Transparency for bender charts, overrides, and table lookups. */
export type SourceNote = {
  key: string;
  kind: SourceNoteKind;
  message: string;
};

/** Ordered field-marking step — future share/export and marking workflows. */
export type FieldStep = {
  order: number;
  key: string;
  title: string;
  detail?: string;
  inches?: number;
  display?: string;
};

/** Optional formula/debug values — calculator-specific keys. */
export type FormulaValues = Readonly<Record<string, number | string | boolean>>;

export type SetupSnapshotInput = {
  unitSystem: UnitSystem;
  roundingPrecision: RoundingOption;
  conduitType: ConduitType;
  tradeSize: TradeSize;
  benderProfileId: string;
};

export function snapshotSetupFromInput(input: SetupSnapshotInput): CalculationSetupSnapshot {
  return {
    unitSystem: input.unitSystem,
    roundingPrecision: input.roundingPrecision,
    conduitType: input.conduitType,
    tradeSize: input.tradeSize,
    benderProfileId: input.benderProfileId,
  };
}

/**
 * Maps engine validity + warnings to a shared status.
 * Invalid when the result is not field-usable; warning when valid but flagged.
 */
export function deriveCalculationStatus(
  isValid: boolean,
  warnings: readonly string[],
): CalculationStatus {
  if (!isValid) {
    return 'invalid';
  }
  if (warnings.length > 0) {
    return 'warning';
  }
  return 'valid';
}
