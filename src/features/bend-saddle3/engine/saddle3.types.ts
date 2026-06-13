/**
 * 3-Point Saddle calculator input/result contracts.
 */
import type { BenderCategory, CustomBenderProfileStored } from '@/data/benders';
import type { ConduitType, RoundingOption, TradeSize, UnitSystem } from '@/core/types';

/** Side / center angle pairs supported by the saddle table. */
export type Saddle3AnglePreset = '22.5-45' | '30-60' | '45-90';

export type Saddle3EngineInput = {
  /** Vertical clearance needed over the obstruction (inches internally). */
  obstructionHeight: number;
  /** Optional distance from the pipe start to the obstruction center. */
  distanceToCenter?: number;
  anglePreset: Saddle3AnglePreset;
  benderProfileId: string;
  conduitType: ConduitType;
  tradeSize: TradeSize;
  unitSystem: UnitSystem;
  roundingPrecision: RoundingOption;
  customBenderProfiles?: readonly CustomBenderProfileStored[];
};

export type Saddle3DiagramData = {
  calculatorType: 'saddle3';
  obstructionHeightInches: number;
  centerToSideInches: number;
  shrinkInches: number;
  centerMarkInches?: number;
  sideMark1Inches?: number;
  sideMark2Inches?: number;
  sideAngle: number;
  centerAngle: number;
  display: {
    obstructionHeight: string;
    centerToSide: string;
    shrink: string;
    centerMark?: string;
    sideMark1?: string;
    sideMark2?: string;
  };
};

export type Saddle3BenderProfileUsed = {
  id: string;
  name: string;
  category: BenderCategory;
};

export type Saddle3EngineResult = {
  obstructionHeight: number;
  centerToSide: number;
  shrink: number;
  centerMark?: number;
  sideMark1?: number;
  sideMark2?: number;
  sideAngle: number;
  centerAngle: number;
  anglePreset: Saddle3AnglePreset;
  isValid: boolean;
  warnings: string[];
  benderProfileUsed: Saddle3BenderProfileUsed;
  diagramData?: Saddle3DiagramData;

  obstructionHeightFormatted: string;
  centerToSideFormatted: string;
  shrinkFormatted: string;
  centerMarkFormatted?: string;
  sideMark1Formatted?: string;
  sideMark2Formatted?: string;
};
