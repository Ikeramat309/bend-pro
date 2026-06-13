/**
 * 4-Point Saddle calculator input/result contracts.
 *
 * A 4-point saddle is two offsets back-to-back: the conduit rises at the bend
 * angle, runs flat across the obstruction, then drops back to level — four
 * equal-angle bends total.
 */
import type { BenderCategory, CustomBenderProfileStored } from '@/data/benders';
import type { ConduitType, RoundingOption, TradeSize, UnitSystem } from '@/core/types';

/** Equal angle used on all four bends. */
export type Saddle4Angle = 22.5 | 30 | 45;

export type Saddle4EngineInput = {
  /** Vertical clearance needed over the obstruction (inches internally). */
  obstructionHeight: number;
  /** Flat-top length — distance between the two top (inner) bends. */
  saddleWidth: number;
  /** Equal bend angle for all four bends. */
  bendAngle: Saddle4Angle;
  /** Optional distance from the pipe start to the obstruction center. */
  distanceToCenter?: number;
  benderProfileId: string;
  conduitType: ConduitType;
  tradeSize: TradeSize;
  unitSystem: UnitSystem;
  roundingPrecision: RoundingOption;
  customBenderProfiles?: readonly CustomBenderProfileStored[];
};

export type Saddle4DiagramData = {
  calculatorType: 'saddle4';
  obstructionHeightInches: number;
  saddleWidthInches: number;
  /** Conduit distance between each outer and inner bend pair (height × multiplier). */
  betweenBendsInches: number;
  /** Total run shrink (both offsets). */
  shrinkInches: number;
  centerMarkInches?: number;
  outerMark1Inches?: number;
  innerMark1Inches?: number;
  innerMark2Inches?: number;
  outerMark2Inches?: number;
  bendAngle: number;
  display: {
    obstructionHeight: string;
    saddleWidth: string;
    betweenBends: string;
    shrink: string;
    centerMark?: string;
    outerMark1?: string;
    innerMark1?: string;
    innerMark2?: string;
    outerMark2?: string;
  };
};

export type Saddle4BenderProfileUsed = {
  id: string;
  name: string;
  category: BenderCategory;
};

export type Saddle4EngineResult = {
  obstructionHeight: number;
  saddleWidth: number;
  betweenBends: number;
  /** Total run shrink (both offsets). */
  shrink: number;
  /** Shrink ahead of center (one offset) — folded into the center mark. */
  shrinkToCenter: number;
  centerMark?: number;
  outerMark1?: number;
  innerMark1?: number;
  innerMark2?: number;
  outerMark2?: number;
  bendAngle: number;
  multiplier: number;
  shrinkPerInch: number;
  isValid: boolean;
  warnings: string[];
  benderProfileUsed: Saddle4BenderProfileUsed;
  diagramData?: Saddle4DiagramData;

  obstructionHeightFormatted: string;
  saddleWidthFormatted: string;
  betweenBendsFormatted: string;
  shrinkFormatted: string;
  centerMarkFormatted?: string;
  outerMark1Formatted?: string;
  innerMark1Formatted?: string;
  innerMark2Formatted?: string;
  outerMark2Formatted?: string;
};
