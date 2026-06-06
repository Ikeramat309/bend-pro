import type { TradeSize } from '@/core/types';

export type BenderCategory = 'hand' | 'mechanical' | 'hydraulic' | 'custom';

export type BenderProfileId = 'generic-hand-bender';

/**
 * EMT stub 90° take-up / deduct by trade size (inches).
 * Generic field values — not manufacturer shoe charts.
 */
export type EmtStub90TakeUpByTradeSize = Partial<Record<TradeSize, number>>;

export type BenderProfile = {
  id: BenderProfileId;
  name: string;
  category: BenderCategory;
  /** EMT stub 90 take-up (deduct), inches per trade size. */
  emtStub90TakeUpInches: EmtStub90TakeUpByTradeSize;
};
