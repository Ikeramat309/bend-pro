/**
 * Future-ready Offset calculator input/result contracts.
 *
 * These names match field language and setup concepts without tying the engine
 * to any specific screen copy.
 */
import type { BendAngle, ConduitType, RoundingOption, Unit } from './offset.types';

export type OffsetEngineInput = {
  rise: number;
  bendAngle: BendAngle;
  firstMark?: number;
  benderProfileId: string;
  conduitType: ConduitType;
  tradeSize: string;
  unitSystem: Unit;
  roundingPrecision: RoundingOption;
};

export type OffsetEngineResult = {
  markSpacing: number;
  shrink: number;
  mark1?: number;
  mark2?: number;
  bendAngle: BendAngle;
  multiplier: number;
  warnings: string[];
  benderProfileUsed: string;

  markSpacingFormatted: string;
  shrinkFormatted: string;
  mark1Formatted?: string;
  mark2Formatted?: string;
};

export type {
  BendAngle,
  ConduitType,
  RoundingOption,
  Unit,
};
