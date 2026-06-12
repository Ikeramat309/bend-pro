/**
 * Offset calculator input/result contracts.
 */
import type { BenderCategory } from '@/data/benders';
import type { BendAngle, ConduitType, RoundingOption, TradeSize, UnitSystem } from '@/core/types';

export type OffsetEngineInput = {
  offsetHeight: number;
  /** Optional first layout mark. UI term is "Mark 1". */
  mark1?: number;
  bendAngle: BendAngle;
  benderProfileId: string;
  conduitType: ConduitType;
  tradeSize: TradeSize;
  unitSystem: UnitSystem;
  roundingPrecision: RoundingOption;
  /**
   * User-entered multiplier — replaces the standard angle-table value when
   * present. Ignored unless finite and > 0.
   */
  multiplierOverride?: number;
  /**
   * User-entered shrink per inch of offset height (inches). Replaces the
   * standard angle-table shrink rate when present.
   */
  shrinkPerInchOverride?: number;
};

/**
 * Single diagram contract. Numeric values (inches) drive future
 * semi-proportional layout; `display` strings are ready-to-render labels.
 * Present on the engine result only when the calculation is valid.
 */
export type OffsetDiagramData = {
  calculatorType: 'offset';
  offsetHeightInches: number;
  distanceBetweenBendsInches: number;
  shrinkInches: number;
  mark1Inches?: number;
  mark2Inches?: number;
  bendAngle: BendAngle;
  display: {
    offsetHeight: string;
    distanceBetweenBends: string;
    shrink: string;
    mark1?: string;
    mark2?: string;
  };
};

export type OffsetBenderProfileUsed = {
  id: string;
  name: string;
  category: BenderCategory;
};

export type OffsetEngineResult = {
  offsetHeight: number;
  distanceBetweenBends: number;
  shrink: number;
  mark1?: number;
  mark2?: number;
  bendAngle: BendAngle;
  multiplier: number;
  /** True when distance between bends used a manual multiplier override. */
  isMultiplierOverridden: boolean;
  /** Shrink rate used (inches lost per inch of offset height). */
  shrinkPerInch: number;
  /** True when shrink used a manual shrink-per-inch override. */
  isShrinkOverridden: boolean;
  isValid: boolean;
  warnings: string[];
  benderProfileUsed: OffsetBenderProfileUsed;
  diagramData?: OffsetDiagramData;

  offsetHeightFormatted: string;
  distanceBetweenBendsFormatted: string;
  shrinkFormatted: string;
  mark1Formatted?: string;
  mark2Formatted?: string;
};
