import type { TradeSize } from '@/core/types';

export type BenderCategory = 'hand' | 'mechanical' | 'hydraulic' | 'custom';

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
  /** Short note shown in the bender database — clarify generic vs. manufacturer. */
  description: string;
  /** EMT stub 90 take-up (deduct), inches per trade size. */
  emtStub90TakeUpInches: EmtStub90TakeUpByTradeSize;
};
