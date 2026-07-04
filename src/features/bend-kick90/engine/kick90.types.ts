/**
 * Kick 90 calculator input/result contracts.
 *
 * A kick is a small-angle bend added beside a 90° bend. Layout uses the
 * standard offset multiplier method: distance from the 90° bend mark to
 * the kick mark = kick rise × multiplier.
 */
import type { BenderCategory, CustomBenderProfileStored } from '@/data/benders';
import type { BendAngle, ConduitType, RoundingOption, TradeSize, UnitSystem } from '@/core/types';

export type Kick90EngineInput = {
  /** Sideways/up distance the leg must move after the 90° bend (inches internally). */
  kickRise: number;
  /** Optional reference mark from the free end (same as offset Mark 1). */
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

export type Kick90DiagramData = {
  calculatorType: 'kick90';
  kickRiseInches: number;
  distanceBetweenBendsInches: number;
  shrinkInches: number;
  mark1Inches?: number;
  mark2Inches?: number;
  bendAngle: BendAngle;
  display: {
    kickRise: string;
    distanceBetweenBends: string;
    shrink: string;
    mark1?: string;
    mark2?: string;
  };
};

export type Kick90BenderProfileUsed = {
  id: string;
  name: string;
  category: BenderCategory;
};

export type Kick90EngineResult = {
  kickRise: number;
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
  benderProfileUsed: Kick90BenderProfileUsed;
  diagramData?: Kick90DiagramData;

  kickRiseFormatted: string;
  distanceBetweenBendsFormatted: string;
  shrinkFormatted: string;
  mark1Formatted?: string;
  mark2Formatted?: string;
};
