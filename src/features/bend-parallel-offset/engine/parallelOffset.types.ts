import type { BenderCategory, CustomBenderProfileStored } from '@/data/benders';
import type { BendAngle, ConduitType, RoundingOption, TradeSize, UnitSystem } from '@/core/types';

export type ParallelOffsetMode = 'simple' | 'layout';
export type ParallelOffsetShiftDirection = 'toward-free-end' | 'away-from-free-end';

export type ParallelOffsetEngineInput = {
  mode: ParallelOffsetMode;
  centerSpacing: number;
  bendAngle: BendAngle;
  /** Required only in full-layout mode. */
  offsetHeight?: number;
  /** Required only in full-layout mode. */
  conduitCount?: number;
  /** Optional actual Mark 1 on the first conduit. */
  baseMark?: number;
  shiftDirection?: ParallelOffsetShiftDirection;
  benderProfileId: string;
  conduitType: ConduitType;
  tradeSize: TradeSize;
  unitSystem: UnitSystem;
  roundingPrecision: RoundingOption;
  /** Setup/trust context only; no bender chart value affects parallel-offset math. */
  customBenderProfiles?: readonly CustomBenderProfileStored[];
};

export type ParallelOffsetConduitLayout = {
  conduitNumber: number;
  cumulativeShift: number;
  signedShift: number;
  mark1?: number;
  mark2?: number;
  display: {
    cumulativeShift: string;
    mark1?: string;
    mark2?: string;
  };
};

export type ParallelOffsetDiagramData = {
  calculatorType: 'parallel-offset';
  mode: ParallelOffsetMode;
  bendAngle: BendAngle;
  centerSpacingInches: number;
  adjustmentPerConduitInches: number;
  totalRackShiftInches: number;
  offsetHeightInches?: number;
  distanceBetweenBendsInches?: number;
  conduitCount: number;
  shiftDirection: ParallelOffsetShiftDirection;
  conduits: readonly ParallelOffsetConduitLayout[];
  display: {
    centerSpacing: string;
    adjustmentPerConduit: string;
    totalRackShift: string;
    offsetHeight?: string;
    distanceBetweenBends?: string;
  };
};

export type ParallelOffsetBenderProfileUsed = {
  id: string;
  name: string;
  category: BenderCategory;
};

export type ParallelOffsetEngineResult = {
  mode: ParallelOffsetMode;
  bendAngle: BendAngle;
  centerSpacing: number;
  adjustmentFactor: number;
  adjustmentPerConduit: number;
  totalRackShift: number;
  offsetHeight?: number;
  distanceBetweenBends?: number;
  conduitCount: number;
  shiftDirection: ParallelOffsetShiftDirection;
  conduits: readonly ParallelOffsetConduitLayout[];
  isValid: boolean;
  warnings: string[];
  benderProfileUsed: ParallelOffsetBenderProfileUsed;
  diagramData?: ParallelOffsetDiagramData;
  centerSpacingFormatted: string;
  adjustmentPerConduitFormatted: string;
  totalRackShiftFormatted: string;
  offsetHeightFormatted?: string;
  distanceBetweenBendsFormatted?: string;
};
