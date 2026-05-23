/**
 * FILE: src/components/calculator-ui.ts
 *
 * PURPOSE: Single import path for all calculator UI building blocks.
 *
 * WHY: Screens write:
 *   import { InputCard, ResultCard } from '@/components/calculator-ui';
 * instead of many separate paths.
 */

// EXPORTS — re-export components and their TypeScript prop types
export { CalculatorLayout, type CalculatorLayoutProps } from './CalculatorLayout';
export { InputCard, type InputCardProps } from './InputCard';
export { ResultCard, type ResultCardProps } from './ResultCard';
export { UnitToggle, type UnitToggleProps } from './UnitToggle';
export {
  AngleSelector,
  ANGLE_OPTIONS,
  type AngleOption,
  type AngleSelectorProps,
} from './AngleSelector';
export {
  ConduitSelector,
  CONDUIT_TYPES,
  type ConduitType,
  type ConduitSizeOption,
  type ConduitSelectorProps,
} from './ConduitSelector';
export {
  RoundingSelector,
  IMPERIAL_ROUNDING_OPTIONS,
  METRIC_ROUNDING_OPTIONS,
  type RoundingId,
  type RoundingSelectorProps,
} from './RoundingSelector';
