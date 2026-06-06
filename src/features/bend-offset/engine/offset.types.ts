/**
 * Offset calculator input/result contracts.
 */
import type { BenderCategory } from '@/data/benders';
import type { BendAngle, ConduitType, RoundingOption, TradeSize, UnitSystem } from '@/core/types';

export type OffsetEngineInput = {
  offsetHeight: number;
  firstMark?: number;
  bendAngle: BendAngle;
  benderProfileId: string;
  conduitType: ConduitType;
  tradeSize: TradeSize;
  unitSystem: UnitSystem;
  roundingPrecision: RoundingOption;
};

/** Formatted strings passed from engine result into the diagram component. */
export type OffsetDiagramViewData = {
  distanceBetweenBends: string;
  offsetHeight: string;
  shrink: string;
  mark1: string;
  mark2: string;
  showMarks: boolean;
  angleDeg: number;
};

export type OffsetBenderProfileUsed = {
  id: string;
  name: string;
  category: BenderCategory;
};

export type OffsetEngineResult = {
  offsetHeight: number;
  distanceBetweenBends: number;
  shrink: number;
  mark1?: number;
  mark2?: number;
  bendAngle: BendAngle;
  multiplier: number;
  isValid: boolean;
  warnings: string[];
  benderProfileUsed: OffsetBenderProfileUsed;

  offsetHeightFormatted: string;
  distanceBetweenBendsFormatted: string;
  shrinkFormatted: string;
  mark1Formatted?: string;
  mark2Formatted?: string;
};
