/**
 * EMT trade size data — single source of truth for Bend Pro.
 */

export const EMT_TRADE_SIZES = ['1/2', '3/4', '1', '1-1/4', '1-1/2', '2'] as const;

export type EmtTradeSize = (typeof EMT_TRADE_SIZES)[number];

export const DEFAULT_EMT_TRADE_SIZE: EmtTradeSize = '1/2';

export function isEmtTradeSize(value: string): value is EmtTradeSize {
  return (EMT_TRADE_SIZES as readonly string[]).includes(value);
}

export function formatEmtTradeSizeLabel(size: EmtTradeSize): string {
  return `${size}"`;
}
