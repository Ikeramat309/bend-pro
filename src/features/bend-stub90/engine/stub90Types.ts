/**
 * Stub 90 calculator input/result contracts.
 */
import type { BenderProfile } from '@/data/benderProfiles';
import type { ConduitType, RoundingOption, Unit } from '@/features/bend-offset/engine/offsetTypes';

export type Stub90EngineInput = {
  stubHeight: number;
  legLength?: number;
  benderProfileId: string;
  conduitType: ConduitType;
  tradeSize: string;
  unitSystem: Unit;
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

export type Stub90BenderProfileUsed = Pick<BenderProfile, 'id' | 'name' | 'category'>;

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

export type {
  ConduitType,
  RoundingOption,
  Unit,
};
