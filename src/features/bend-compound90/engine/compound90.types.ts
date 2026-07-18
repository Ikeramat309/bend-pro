import type { BenderCategory, CustomBenderProfileStored } from '@/data/benders';
import type { ConduitType, RoundingOption, TradeSize, UnitSystem } from '@/core/types';

/**
 * The obstruction's orientation matters to a compound 90. A wall-aligned box
 * and a square set on a corner use different field layouts even when their
 * nominal side dimensions are identical.
 */
export type Compound90Shape = 'circle' | 'box' | 'diamond';

export type Compound90EngineInput = {
  shape: Compound90Shape;
  /** Circle diameter, wall-aligned box height, or diamond side. */
  primaryDimension: number;
  /** Wall-aligned box width. Omitted for circle and diamond. */
  secondaryDimension?: number;
  /** Requested free space around the obstruction, measured per side. */
  clearance?: number;
  /** Optional absolute first bend mark from the conduit start. */
  firstMark?: number;
  benderProfileId: string;
  conduitType: ConduitType;
  tradeSize: TradeSize;
  unitSystem: UnitSystem;
  roundingPrecision: RoundingOption;
  customBenderProfiles?: readonly CustomBenderProfileStored[];
};

export type Compound90BenderProfileUsed = {
  id: string;
  name: string;
  category: BenderCategory;
};

export type Compound90DiagramData = {
  calculatorType: 'compound90';
  shape: Compound90Shape;
  primaryDimensionInches: number;
  secondaryDimensionInches?: number;
  clearanceInches: number;
  conduitOutsideDiameterInches: number;
  distanceBetweenBendsInches: number;
  firstMarkInches?: number;
  secondMarkInches?: number;
  bendAngle: 45;
  display: {
    shape: string;
    primaryDimension: string;
    secondaryDimension?: string;
    clearance: string;
    conduitOutsideDiameter: string;
    distanceBetweenBends: string;
    firstMark?: string;
    secondMark?: string;
  };
};

export type Compound90EngineResult = {
  shape: Compound90Shape;
  primaryDimension: number;
  secondaryDimension?: number;
  clearance: number;
  /** Field-layout distance to the back/outside of conduit, including clearance. */
  backOfConduitDistance: number;
  conduitOutsideDiameter: number;
  distanceBetweenBends: number;
  firstMark?: number;
  secondMark?: number;
  bendAngle: 45;
  distanceMultiplier: number;
  isValid: boolean;
  warnings: string[];
  benderProfileUsed: Compound90BenderProfileUsed;
  diagramData?: Compound90DiagramData;
  primaryDimensionFormatted: string;
  secondaryDimensionFormatted?: string;
  clearanceFormatted: string;
  backOfConduitDistanceFormatted: string;
  conduitOutsideDiameterFormatted: string;
  distanceBetweenBendsFormatted: string;
  firstMarkFormatted?: string;
  secondMarkFormatted?: string;
};
