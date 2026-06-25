export {
  DEFAULT_CALCULATOR_SETUP,
  IMPERIAL_ROUNDING_OPTIONS,
  MAX_DEDUCT_OVERRIDE_INCHES,
  MAX_OFFSET_MULTIPLIER,
  MAX_OFFSET_SHRINK_PER_INCH,
  METRIC_ROUNDING_OPTIONS,
  patchCalculatorSetup,
  sanitizeStoredSetup,
  getSetupOverrideHint,
  type CalculatorSetup,
  type OffsetMultiplierOverrides,
  type OffsetShrinkPerInchOverrides,
  type SetupOverrideHintContext,
  type Stub90DeductOverrides,
} from './calculatorSetup';
export {
  listSetupOverrides,
  patchClearAllSetupOverrides,
  patchClearSetupOverride,
  type SetupOverrideEntry,
} from './setupOverrides';
export { SettingsProvider, useCalculatorSetup } from './SettingsContext';
