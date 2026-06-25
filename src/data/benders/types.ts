import type { TradeSize } from '@/core/types';

export type BenderCategory = 'hand' | 'mechanical' | 'hydraulic' | 'custom';

/**
 * Where stub-90 chart values come from. Manufacturer profiles require a
 * `sourceNote` with real attribution — do not ship invented shoe charts.
 */
export type BenderChartKind = 'generic-field-reference' | 'custom-measured' | 'manufacturer';

/** Built-in generic hand-bender chart ids. */
export type BuiltInBenderProfileId =
  | 'generic-hand-bender'
  | 'hand-bender-alt-chart'
  | 'hand-bender-compact';

/** Active profile id — built-in or user-created (`custom-…`). */
export type BenderProfileId = BuiltInBenderProfileId | `custom-${string}`;

/**
 * EMT stub 90° take-up / deduct by trade size (inches).
 * Generic field values — not manufacturer shoe charts.
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
