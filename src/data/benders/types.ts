import type { TradeSize } from '@/core/types';

export type BenderCategory = 'hand' | 'mechanical' | 'hydraulic' | 'custom';

/**
 * Canonical source for bender chart values in the product model.
 *
 * - generic-field-reference — built-in field-reference charts (not manufacturer-specific)
 * - custom-measured — user-measured profiles stored on device
 * - manufacturer — verified manufacturer charts (requires sourceNote; do not ship invented values)
 */
export type BenderChartKind =
  | 'generic-field-reference'
  | 'custom-measured'
  | 'manufacturer';

/** @deprecated Use {@link BenderChartKind} — kept as alias during migration. */
export type BenderChartSource = BenderChartKind;

/** Built-in generic hand-bender chart ids. */
export type BuiltInBenderProfileId =
  | 'generic-hand-bender'
  | 'hand-bender-alt-chart'
  | 'hand-bender-compact';

/** Active profile id — built-in or user-created (`custom-…`). */
export type BenderProfileId = BuiltInBenderProfileId | `custom-${string}`;

/**
 * EMT stub 90° take-up / deduct by trade size (inches).
 * Only listed sizes may be used — never invent values for missing sizes.
 */
export type EmtStub90TakeUpByTradeSize = Partial<Record<TradeSize, number>>;

export type BenderProfile = {
  id: string;
  name: string;
  category: BenderCategory;
  chartKind: BenderChartKind;
  /** Short note shown in the bender database — clarify generic vs. manufacturer. */
  description: string;
  /** Required when chartKind is manufacturer — cite the real chart source. */
  sourceNote?: string;
  /** EMT stub 90 take-up (deduct), inches per trade size. */
  emtStub90TakeUpInches: EmtStub90TakeUpByTradeSize;
};
