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

export type BenderVerificationStatus =
  | 'verified_default' // manufacturer-sourced take-up + radius
  | 'verified_with_source_note' // sourced, but carries a caution note
  | 'field_layout_only' // take-up sourced; radius missing (no precise geometry)
  | 'reference_only'; // identity/capacity only — must not drive marking math

export type BenderSizeSpec = {
  /** Manufacturer model numbers for this trade size, e.g. '841A; 841AH'. */
  models: string;
  /** Stub-90 take-up (deduct), inches — only when source-backed. */
  takeUpInches?: number;
  /** Centerline bend radius, inches — display/reference only today. */
  centerlineRadiusInches?: number;
  sourceIds: readonly string[];
  note?: string;
};

/** Built-in hand-bender chart ids (generic + manufacturer). */
export type BuiltInBenderProfileId =
  | 'generic-hand-bender'
  | 'hand-bender-alt-chart'
  | 'hand-bender-compact'
  | 'greenlee-site-rite-aluminum'
  | 'greenlee-site-rite-iron'
  | 'greenlee-site-rite-dual-shoe'
  | 'klein-angle-setter-iron'
  | 'klein-angle-setter-aluminum'
  | 'gardner-bigben-aluminum'
  | 'ideal-aluminum'
  | 'ideal-ductile-iron'
  | 'milwaukee-aluminum'
  | 'milwaukee-iron'
  | 'southwire-mcb';

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
  brand?: string;
  series?: string;
  material?: string;
  verificationStatus?: BenderVerificationStatus;
  sizeSpecs?: Partial<Record<TradeSize, BenderSizeSpec>>;
  /** EMT stub 90 take-up (deduct), inches per trade size. */
  emtStub90TakeUpInches: EmtStub90TakeUpByTradeSize;
};
