/** Matching Offset calculator input/result contracts. */
import type { BenderCategory, CustomBenderProfileStored } from '@/data/benders';
import type { ConduitType, RoundingOption, TradeSize, UnitSystem } from '@/core/types';

export type MatchingOffsetMode = 'centers' | 'bends';

export type MatchingOffsetCommonAngleComparison = {
  angleDegrees: number;
  distanceBetweenBends: number;
  adjacent: number;
  distanceBetweenBendsDelta: number;
  adjacentDelta: number;
  angleFormatted: string;
  distanceBetweenBendsFormatted: string;
  adjacentFormatted: string;
  distanceBetweenBendsDeltaFormatted: string;
  adjacentDeltaFormatted: string;
};

export type MatchingOffsetAngleExecution = {
  /** True only when the exact solved angle is itself a common field angle. */
  isCommonAngle: boolean;
  requiresAngleTool: boolean;
  nearestCommonAngleDegrees: number;
  nearestCommonAngleFormatted: string;
  comparison?: MatchingOffsetCommonAngleComparison;
};

type MatchingOffsetCommonInput = {
  offsetHeight: number;
  benderProfileId: string;
  conduitType: ConduitType;
  tradeSize: TradeSize;
  unitSystem: UnitSystem;
  roundingPrecision: RoundingOption;
  customBenderProfiles?: readonly CustomBenderProfileStored[];
};

/**
 * Match Centers uses the adjacent (straight-run) projection between the two
 * bend-center stations. Match Bends uses the measured center distance along
 * an existing offset. The fields are exclusive so their meanings cannot be
 * silently interchanged.
 */
export type MatchingOffsetEngineInput =
  | (MatchingOffsetCommonInput & {
      mode: 'centers';
      adjacent: number;
      referenceDistanceBetweenBends?: never;
    })
  | (MatchingOffsetCommonInput & {
      mode: 'bends';
      referenceDistanceBetweenBends: number;
      adjacent?: never;
    });

export type MatchingOffsetDiagramData = {
  calculatorType: 'matchingOffset';
  mode: MatchingOffsetMode;
  offsetHeightInches: number;
  distanceBetweenBendsInches: number;
  adjacentInches: number;
  shrinkInches: number;
  bendAngleDegrees: number;
  angleExecution: MatchingOffsetAngleExecution;
  display: {
    offsetHeight: string;
    distanceBetweenBends: string;
    adjacent: string;
    shrink: string;
    bendAngle: string;
    angleMethod: string;
  };
};

export type MatchingOffsetBenderProfileUsed = {
  id: string;
  name: string;
  category: BenderCategory;
};

export type MatchingOffsetEngineResult = {
  mode: MatchingOffsetMode;
  offsetHeight: number;
  distanceBetweenBends: number;
  adjacent: number;
  shrink: number;
  bendAngleDegrees: number;
  angleExecution: MatchingOffsetAngleExecution;
  multiplier: number;
  shrinkPerInch: number;
  isValid: boolean;
  warnings: string[];
  benderProfileUsed: MatchingOffsetBenderProfileUsed;
  diagramData?: MatchingOffsetDiagramData;
  offsetHeightFormatted: string;
  distanceBetweenBendsFormatted: string;
  adjacentFormatted: string;
  shrinkFormatted: string;
  bendAngleFormatted: string;
};
