import type { AngleOption } from '@/components/AngleSelector';
import type { ConduitType } from '@/components/ConduitSelector';
import type { RoundingId } from '@/components/RoundingSelector';
import type { UnitSystem } from '@/engine/types';

export type CalculatorType =
  | 'offset-bend'
  | 'stub-90'
  | '3-point-saddle'
  | '4-point-saddle'
  | 'rolling-offset';

export type WorkbenchUnit = UnitSystem;

export type WorkbenchRounding = RoundingId;

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

/** Raw engine output — debugging shape. */
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

export type WorkbenchRawResult = OffsetBendRawResult | { calculator: CalculatorType; status: 'coming-soon' };

export type WorkbenchFormattedResult = {
  spacing: string;
  shrink: string;
  firstMark: string;
  secondMark: string;
  multiplier: string;
  conduitSize: string;
};

export type WorkbenchResult = {
  raw: WorkbenchRawResult;
  formatted: WorkbenchFormattedResult | null;
  warnings: string[];
  available: boolean;
};

export type WorkbenchPresetId = 'small-offset' | 'standard-offset' | 'metric-offset' | 'bad-input';
