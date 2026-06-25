/**
 * Standard calculation result envelope for all Bend Pro calculators.
 *
 * Feature engines keep their native result types. Adapters map engine output
 * into this shape for guide mode, persistence, export, and shared tooling.
 */
import type { CalculatorId } from '@/core/calculators/calculatorRegistry';

import type {
  BenderProfileSnapshot,
  CalculationSetupSnapshot,
  CalculationStatus,
  CalculationResultTone,
  FieldStep,
  FormulaValues,
  SourceNote,
} from './calculationTypes';

/** One labeled value for workspace chips, export rows, or saved layouts. */
export type CalculationResultItem = {
  key: string;
  label: string;
  /** Canonical inches when the value is a length. Omitted for unitless values (e.g. multiplier). */
  inches?: number;
  display: string;
  tone?: CalculationResultTone;
};

/**
 * Standard result envelope. `specific` holds calculator-native payload
 * (diagram data, angles, mark arrays) without forcing a one-size-fits-all shape.
 */
export type CalculationResult<
  TCalculatorId extends CalculatorId = CalculatorId,
  TSpecific extends Record<string, unknown> = Record<string, unknown>,
> = {
  calculatorId: TCalculatorId;
  status: CalculationStatus;
  primaryResults: CalculationResultItem[];
  secondaryResults: CalculationResultItem[];
  warnings: readonly string[];
  /** Documented defaults or table assumptions applied during the run. */
  assumptions: readonly string[];
  setupSnapshot: CalculationSetupSnapshot;
  benderProfile: BenderProfileSnapshot;
  /** All numeric outputs in canonical inches, keyed by measurement name. */
  rawValuesInches: Readonly<Record<string, number | undefined>>;
  /** User-facing formatted strings, keyed by measurement name. */
  displayValues: Readonly<Record<string, string | undefined>>;
  fieldSteps: readonly FieldStep[];
  sourceNotes: readonly SourceNote[];
  formulaValues?: FormulaValues;
  specific: TSpecific;
};

export function isCalculationResultValid<T extends CalculationResult>(
  result: T,
): result is T & { status: 'valid' | 'warning' } {
  return result.status !== 'invalid';
}
