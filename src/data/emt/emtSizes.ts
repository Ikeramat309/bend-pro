/**
 * EMT trade size data — single source of truth for Bend Pro.
 */

export const EMT_TRADE_SIZES = ['1/2', '3/4', '1', '1-1/4', '1-1/2', '2'] as const;

export type EmtTradeSize = (typeof EMT_TRADE_SIZES)[number];

/**
 * Sizes offered in the v1 setup picker — the honest hand-bender range.
 *
 * The full {@link EMT_TRADE_SIZES} list stays the type/capability source so
 * previously-persisted setups and future larger sizes remain valid, but the UI
 * only lets users pick sizes we support with honest generic charts. 1-1/2" and
 * 2" are out of hand-bender territory and have no honest data, so they are
 * hidden until sourced/calibrated.
 */
export const SUPPORTED_EMT_TRADE_SIZES = ['1/2', '3/4', '1', '1-1/4'] as const;

export const DEFAULT_EMT_TRADE_SIZE: EmtTradeSize = '1/2';

/**
 * Nominal EMT outside diameters in inches.
 * Source: Wheatland Tube, 20' EMT and Conduit product data sheet.
 */
export const EMT_OUTSIDE_DIAMETER_INCHES: Readonly<Record<EmtTradeSize, number>> = {
  '1/2': 0.706,
  '3/4': 0.922,
  '1': 1.163,
  '1-1/4': 1.51,
  '1-1/2': 1.74,
  '2': 2.197,
};

export function getEmtOutsideDiameterInches(size: string): number | undefined {
  return isEmtTradeSize(size) ? EMT_OUTSIDE_DIAMETER_INCHES[size] : undefined;
}

export function isEmtTradeSize(value: string): value is EmtTradeSize {
  return (EMT_TRADE_SIZES as readonly string[]).includes(value);
}

export function isSupportedEmtTradeSize(value: string): boolean {
  return (SUPPORTED_EMT_TRADE_SIZES as readonly string[]).includes(value);
}

export function formatEmtTradeSizeLabel(size: EmtTradeSize): string {
  return `${size}"`;
}
