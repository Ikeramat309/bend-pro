/**
 * Shared domain types for Bend Pro.
 *
 * Import from here — not from feature folders — when a type is used across
 * calculators, data, utils, or shared UI.
 */
import type { EmtTradeSize } from '@/data/emt/emtSizes';

/** App unit mode. Imperial = inches; metric = millimetres. */
export type UnitSystem = 'imperial' | 'metric';

/** @deprecated Prefer UnitSystem. Kept for gradual migration. */
export type Unit = UnitSystem;

/** Bend Pro is EMT-only. Widen when additional conduit types ship. */
export type ConduitType = 'EMT';

/** EMT trade size (inches). Defined in @/data/emt/emtSizes. */
export type TradeSize = EmtTradeSize;

/** Standard offset bend angles. */
export type BendAngle = 10 | 22.5 | 30 | 45 | 60;

/**
 * Display rounding for imperial fractions or metric mm steps.
 */
export type RoundingOption = 'exact' | '1/16' | '1/8' | '1/4' | '1mm' | '5mm' | '10mm';

/** Alias for rounding precision — same values as RoundingOption. */
export type RoundingPrecision = RoundingOption;
