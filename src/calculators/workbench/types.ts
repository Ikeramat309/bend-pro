/**
 * FILE: src/calculators/workbench/types.ts
 *
 * PURPOSE: TypeScript contracts for the Calculator Workbench testing screen.
 *
 * ARCHITECTURE LAYER: calculators/workbench (between UI and engine).
 *   Screen state → runWorkbench() → uses types here for inputs/outputs
 *
 * FUTURE: Real calculators in src/calculators/offset/ will have similar types.
 */

// IMPORTS — types from UI components + engine (composition, not duplication)
import type { AngleOption } from '@/components/AngleSelector';
import type { ConduitType } from '@/components/ConduitSelector';
import type { RoundingId } from '@/components/RoundingSelector';
import type { UnitSystem } from '@/engine/types';

// TYPES

export type CalculatorType =
  | 'offset-bend'
  | 'stub-90'
  | '3-point-saddle'
  | '4-point-saddle'
  | 'rolling-offset';

export type WorkbenchUnit = UnitSystem;
export type WorkbenchRounding = RoundingId;

/** Everything the workbench reads from input fields (strings = TextInput values). */
export type WorkbenchInputs = {
  offsetHeight: string;
  firstMark: string;
  angle: AngleOption | null;
  conduitType: ConduitType;
  conduitSizeId: string;
  unit: WorkbenchUnit;
  rounding: WorkbenchRounding;
};

export type WorkbenchState = {
  calculatorType: CalculatorType;
  inputs: WorkbenchInputs;
};

/** Raw numbers for JSON debug panel — not formatted for humans yet. */
export type OffsetBendRawResult = {
  calculator: 'offset-bend';
  offsetHeightIn: number;
  firstMarkIn: number;
  angleDeg: number;
  multiplier: number;
  spacingIn: number;
  shrinkIn: number;
  firstMarkOutIn: number;
  secondMarkIn: number;
  conduitSizeId: string;
  conduitType: ConduitType;
  unit: WorkbenchUnit;
  rounding: WorkbenchRounding;
};

export type WorkbenchRawResult =
  | OffsetBendRawResult
  | { calculator: CalculatorType; status: 'coming-soon' };

/** Strings ready for ResultCard — produced by formattingEngine in runWorkbench. */
export type WorkbenchFormattedResult = {
  spacing: string;
  shrink: string;
  firstMark: string;
  secondMark: string;
  multiplier: string;
  conduitSize: string;
};

/** Complete package returned to CalculatorWorkbench screen. */
export type WorkbenchResult = {
  raw: WorkbenchRawResult;
  formatted: WorkbenchFormattedResult | null;
  warnings: string[];
  available: boolean;
};

export type WorkbenchPresetId =
  | 'small-offset'
  | 'standard-offset'
  | 'metric-offset'
  | 'bad-input';

// EXPORTS — inline above
