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
  /**
   * User-measured deduct in inches — replaces the bender profile's chart
   * value when present. Ignored unless finite and > 0.
   */
  deductOverrideInches?: number;
};

/**
 * Single diagram contract. Numeric values (inches) drive future
 * semi-proportional layout; `display` strings are ready-to-render labels.
 * Present on the engine result only when the calculation is valid.
 */
export type Stub90DiagramData = {
  calculatorType: 'stub90';
  stubHeightInches: number;
  deductInches: number;
  deductMarkInches: number;
  legLengthInches?: number;
  bendAngle: 90;
  display: {
    stubLength: string;
    deduct: string;
    deductMark: string;
    leg?: string;
  };
};

export type Stub90BenderProfileUsed = {
  id: string;
  name: string;
  category: BenderCategory;
};

export type Stub90EngineResult = {
  stubHeight: number;
  /** Bender take-up. UI term is always "Deduct" — see docs/GLOSSARY.md. */
  deduct: number;
  /** Stub length minus deduct. Never called "First Mark" — that is offset language. */
  deductMark?: number;
  legLength?: number;
  bendAngle: 90;
  isValidDeductMark: boolean;
  /** True when the deduct came from a manual override, not the profile chart. */
  isDeductOverridden: boolean;
  warnings: string[];
  benderProfileUsed: Stub90BenderProfileUsed;
  diagramData?: Stub90DiagramData;

  stubHeightFormatted: string;
  deductFormatted: string;
  deductMarkFormatted?: string;
  legLengthFormatted?: string;
};
