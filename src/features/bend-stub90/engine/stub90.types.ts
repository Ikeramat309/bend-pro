/**
 * Stub 90 calculator input/result contracts.
 */
import type { BenderCategory } from '@/data/benders';
import type { ConduitType, RoundingOption, TradeSize, UnitSystem } from '@/core/types';

export type Stub90EngineInput = {
  stubHeight: number;
  legLength?: number;
  benderProfileId: string;
  conduitType: ConduitType;
  tradeSize: TradeSize;
  unitSystem: UnitSystem;
  roundingPrecision: RoundingOption;
};

export type Stub90DiagramData = {
  calculatorType: 'stub90';
  stubHeightInches: number;
  deductInches: number;
  firstMarkInches: number;
  legLengthInches?: number;
  conduitLengthInches?: number;
  bendAngle: 90;
};

/** Formatted strings passed from engine result into the diagram component. */
export type Stub90DiagramViewData = {
  deductMark: string;
  stubLength: string;
  deduct: string;
  leg?: string;
  showLeg: boolean;
};

export type Stub90BenderProfileUsed = {
  id: string;
  name: string;
  category: BenderCategory;
};

export type Stub90EngineResult = {
  stubHeight: number;
  takeUp: number;
  deduct: number;
  firstMark?: number;
  legLength?: number;
  bendAngle: 90;
  isValidFirstMark: boolean;
  warnings: string[];
  benderProfileUsed: Stub90BenderProfileUsed;
  diagramData?: Stub90DiagramData;

  stubHeightFormatted: string;
  takeUpFormatted: string;
  deductFormatted: string;
  firstMarkFormatted?: string;
  legLengthFormatted?: string;
  conduitLengthFormatted?: string;
};
