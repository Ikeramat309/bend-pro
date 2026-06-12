/**
 * Shared calculator setup — the field configuration (conduit, bender, units,
 * rounding) that should follow the user across calculators and app restarts.
 *
 * Pure module: types, defaults, and stored-value sanitizing live here so they
 * can be unit-tested without touching AsyncStorage or React.
 */
import type { ConduitType, RoundingOption, TradeSize, UnitSystem } from '@/core/types';
import { BENDER_PROFILES, DEFAULT_BENDER_PROFILE_ID, type BenderProfileId } from '@/data/benders';
import { DEFAULT_CONDUIT_TYPE } from '@/data/conduit';
import { DEFAULT_EMT_TRADE_SIZE, isEmtTradeSize } from '@/data/emt';

/** Manual stub-90 deduct (take-up) overrides in inches, keyed by EMT size. */
export type Stub90DeductOverrides = Partial<Record<TradeSize, number>>;

export type CalculatorSetup = {
  unit: UnitSystem;
  rounding: RoundingOption;
  conduitType: ConduitType;
  conduitSize: TradeSize;
  benderProfileId: BenderProfileId;
  /**
   * User-measured deduct values that replace the bender profile's chart.
   * Always stored in inches, regardless of the display unit system.
   */
  stub90DeductOverridesInches: Stub90DeductOverrides;
};

export const DEFAULT_CALCULATOR_SETUP: CalculatorSetup = {
  unit: 'imperial',
  rounding: '1/16',
  conduitType: DEFAULT_CONDUIT_TYPE,
  conduitSize: DEFAULT_EMT_TRADE_SIZE,
  benderProfileId: DEFAULT_BENDER_PROFILE_ID,
  stub90DeductOverridesInches: {},
};

/** Sanity ceiling for a manual deduct — nothing on a hand bender exceeds this. */
export const MAX_DEDUCT_OVERRIDE_INCHES = 24;

export const IMPERIAL_ROUNDING_OPTIONS: readonly RoundingOption[] = ['exact', '1/16', '1/8', '1/4'];
export const METRIC_ROUNDING_OPTIONS: readonly RoundingOption[] = ['1mm', '5mm', '10mm'];

function isKnownBenderProfileId(value: string): value is BenderProfileId {
  return BENDER_PROFILES.some((profile) => profile.id === value);
}

/**
 * Turns an unknown stored value (old schema, corrupt JSON, removed bender,
 * etc.) into a safe CalculatorSetup. Unknown fields fall back to defaults,
 * and rounding is forced to match the unit system.
 */
export function sanitizeStoredSetup(raw: unknown): CalculatorSetup {
  // Fresh overrides object so the shared default is never mutated.
  const setup = { ...DEFAULT_CALCULATOR_SETUP, stub90DeductOverridesInches: {} };

  if (typeof raw !== 'object' || raw === null) return setup;
  const record = raw as Record<string, unknown>;

  if (record.unit === 'imperial' || record.unit === 'metric') {
    setup.unit = record.unit;
  }

  if (typeof record.conduitSize === 'string' && isEmtTradeSize(record.conduitSize)) {
    setup.conduitSize = record.conduitSize;
  }

  if (typeof record.benderProfileId === 'string' && isKnownBenderProfileId(record.benderProfileId)) {
    setup.benderProfileId = record.benderProfileId;
  }

  if (
    typeof record.stub90DeductOverridesInches === 'object' &&
    record.stub90DeductOverridesInches !== null
  ) {
    const overrides: Stub90DeductOverrides = {};
    for (const [size, value] of Object.entries(record.stub90DeductOverridesInches)) {
      if (
        isEmtTradeSize(size) &&
        typeof value === 'number' &&
        Number.isFinite(value) &&
        value > 0 &&
        value <= MAX_DEDUCT_OVERRIDE_INCHES
      ) {
        overrides[size] = value;
      }
    }
    setup.stub90DeductOverridesInches = overrides;
  }

  const validRounding =
    setup.unit === 'imperial' ? IMPERIAL_ROUNDING_OPTIONS : METRIC_ROUNDING_OPTIONS;
  if (
    typeof record.rounding === 'string' &&
    validRounding.includes(record.rounding as RoundingOption)
  ) {
    setup.rounding = record.rounding as RoundingOption;
  } else if (setup.unit === 'metric') {
    setup.rounding = '1mm';
  }

  return setup;
}

/**
 * Applies a partial change to the setup while keeping it consistent:
 * conduit type stays EMT, and rounding always matches the unit system.
 */
export function patchCalculatorSetup(
  current: CalculatorSetup,
  patch: Partial<CalculatorSetup>,
): CalculatorSetup {
  const next: CalculatorSetup = { ...current, ...patch, conduitType: DEFAULT_CONDUIT_TYPE };
  const validRounding =
    next.unit === 'imperial' ? IMPERIAL_ROUNDING_OPTIONS : METRIC_ROUNDING_OPTIONS;

  if (!validRounding.includes(next.rounding)) {
    next.rounding = next.unit === 'imperial' ? '1/16' : '1mm';
  }

  return next;
}
