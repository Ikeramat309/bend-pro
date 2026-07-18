import type { ConduitType, RoundingOption, TradeSize, UnitSystem } from '@/core/types';
import type { BenderCategory, CustomBenderProfileStored } from '@/data/benders';
import type { Stub90DeductSource } from '@/data/benders/profileContext';

export type BackToBackDeductSource = Stub90DeductSource | 'not-needed';

export type BackToBackEngineInput = {
  /** Finished distance from the back of the first 90 to the back of the second. */
  backToBackDistance: number;
  /** Optional first-stub layout. Omitting it keeps the tool usable after the first 90 is already bent. */
  firstStubLength?: number;
  benderProfileId: string;
  conduitType: ConduitType;
  tradeSize: TradeSize;
  unitSystem: UnitSystem;
  roundingPrecision: RoundingOption;
  /** User-measured first-stub deduct in canonical inches. */
  deductOverrideInches?: number;
  customBenderProfiles?: readonly CustomBenderProfileStored[];
};

export type BackToBackDiagramData = {
  calculatorType: 'backToBack';
  backToBackDistanceInches: number;
  second90MarkInches: number;
  firstStubLengthInches?: number;
  firstDeductMarkInches?: number;
  deductInches?: number;
  bendAngle: 90;
  display: {
    backToBackDistance: string;
    second90Mark: string;
    firstStubLength?: string;
    firstDeductMark?: string;
    deduct?: string;
  };
};

export type BackToBackBenderProfileUsed = {
  id: string;
  name: string;
  category: BenderCategory;
};

export type BackToBackEngineResult = {
  backToBackDistance: number;
  /** Direct field transfer: measure this distance from the back of the first 90. */
  second90Mark?: number;
  firstStubLength?: number;
  deduct?: number;
  deductSource: BackToBackDeductSource;
  firstDeductMark?: number;
  bendAngle: 90;
  isValid: boolean;
  isFirstStubLayoutValid: boolean;
  isDeductOverridden: boolean;
  warnings: string[];
  benderProfileUsed: BackToBackBenderProfileUsed;
  diagramData?: BackToBackDiagramData;
  backToBackDistanceFormatted: string;
  second90MarkFormatted?: string;
  firstStubLengthFormatted?: string;
  deductFormatted?: string;
  firstDeductMarkFormatted?: string;
};
