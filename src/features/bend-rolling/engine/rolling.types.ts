/**
 * Rolling Offset calculator input/result contracts.
 *
 * A rolling offset shifts the conduit in two perpendicular directions. The
 * bend is laid out using the true offset — the hypotenuse of the right
 * triangle formed by offset height and advance.
 */
import type { BenderCategory, CustomBenderProfileStored } from '@/data/benders';
import type { BendAngle, ConduitType, RoundingOption, TradeSize, UnitSystem } from '@/core/types';

export type RollingEngineInput = {
  /** Vertical component of the offset (inches internally). */
  offsetHeight: number;
  /** Horizontal roll / advance component (inches internally). */
  advance: number;
  /** Optional first layout mark. UI term is "Mark 1". */
  mark1?: number;
  bendAngle: BendAngle;
  benderProfileId: string;
  conduitType: ConduitType;
  tradeSize: TradeSize;
  unitSystem: UnitSystem;
  roundingPrecision: RoundingOption;
  multiplierOverride?: number;
  shrinkPerInchOverride?: number;
  customBenderProfiles?: readonly CustomBenderProfileStored[];
};

export type RollingDiagramData = {
  calculatorType: 'rolling';
  offsetHeightInches: number;
  advanceInches: number;
  trueOffsetInches: number;
  distanceBetweenBendsInches: number;
  shrinkInches: number;
  mark1Inches?: number;
  mark2Inches?: number;
  bendAngle: BendAngle;
  display: {
    offsetHeight: string;
    advance: string;
    trueOffset: string;
    distanceBetweenBends: string;
    shrink: string;
    mark1?: string;
    mark2?: string;
  };
};

export type RollingBenderProfileUsed = {
  id: string;
  name: string;
  category: BenderCategory;
};

export type RollingEngineResult = {
  offsetHeight: number;
  advance: number;
  trueOffset: number;
  distanceBetweenBends: number;
  shrink: number;
  mark1?: number;
  mark2?: number;
  bendAngle: BendAngle;
  multiplier: number;
  isMultiplierOverridden: boolean;
  shrinkPerInch: number;
  isShrinkOverridden: boolean;
  isValid: boolean;
  warnings: string[];
  benderProfileUsed: RollingBenderProfileUsed;
  diagramData?: RollingDiagramData;

  offsetHeightFormatted: string;
  advanceFormatted: string;
  trueOffsetFormatted: string;
  distanceBetweenBendsFormatted: string;
  shrinkFormatted: string;
  mark1Formatted?: string;
  mark2Formatted?: string;
};
