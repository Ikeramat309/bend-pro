/**
 * Segment Bend calculator input/result contracts.
 *
 * A segment bend (a.k.a. large-radius / circular bend) approximates a smooth
 * arc of a chosen radius and total angle with a series of small equal bends
 * ("shots") spaced evenly along the conduit.
 */
import type { BenderCategory, CustomBenderProfileStored } from '@/data/benders';
import type { ConduitType, RoundingOption, TradeSize, UnitSystem } from '@/core/types';

export type SegmentEngineInput = {
  /** Centerline radius of the desired arc (inches internally). */
  radius: number;
  /** Total angle the bend sweeps through, in degrees. */
  totalAngle: number;
  /** Requested angle per shot, in degrees. */
  degreesPerBend: number;
  /** Optional distance from the pipe end to where the bend group starts. */
  startOffset?: number;
  benderProfileId: string;
  conduitType: ConduitType;
  tradeSize: TradeSize;
  unitSystem: UnitSystem;
  roundingPrecision: RoundingOption;
  customBenderProfiles?: readonly CustomBenderProfileStored[];
};

export type SegmentDiagramData = {
  calculatorType: 'segment';
  radiusInches: number;
  totalAngle: number;
  numberOfBends: number;
  degreesPerBend: number;
  spacingInches: number;
  developedLengthInches: number;
  startOffsetInches?: number;
  /** Absolute bend-mark positions along the conduit (only when start is given). */
  marksInches?: number[];
  display: {
    radius: string;
    totalAngle: string;
    numberOfBends: string;
    degreesPerBend: string;
    spacing: string;
    developedLength: string;
    firstMark?: string;
    lastMark?: string;
  };
};

export type SegmentBenderProfileUsed = {
  id: string;
  name: string;
  category: BenderCategory;
};

export type SegmentEngineResult = {
  radius: number;
  totalAngle: number;
  /** Whole number of shots after fitting to the total angle. */
  numberOfBends: number;
  /** Effective angle per shot = totalAngle / numberOfBends. */
  degreesPerBend: number;
  /** What the user asked for, before fitting to a whole number of shots. */
  requestedDegreesPerBend: number;
  /** Distance between adjacent bend marks along the conduit. */
  spacing: number;
  /** Conduit length the bend group consumes (centerline arc length). */
  developedLength: number;
  startOffset?: number;
  firstMark?: number;
  lastMark?: number;
  marks?: number[];
  isValid: boolean;
  warnings: string[];
  benderProfileUsed: SegmentBenderProfileUsed;
  diagramData?: SegmentDiagramData;

  radiusFormatted: string;
  totalAngleFormatted: string;
  numberOfBendsFormatted: string;
  degreesPerBendFormatted: string;
  spacingFormatted: string;
  developedLengthFormatted: string;
  firstMarkFormatted?: string;
  lastMarkFormatted?: string;
};
