/**
 * Offset engine adapter.
 *
 * The proven calculation still lives in offset.logic.ts. This adapter gives the
 * UI a cleaner, future-ready contract for benders, trade sizes, unit systems,
 * and rounding without changing the working math.
 */
import { calculateOffset } from './offset.logic';
import type { OffsetEngineInput, OffsetEngineResult } from './offsetTypes';

export function calculateOffsetEngine(input: OffsetEngineInput): OffsetEngineResult {
  const result = calculateOffset({
    offsetHeight: input.rise,
    firstMark: input.firstMark,
    bendAngle: input.bendAngle,
    unit: input.unitSystem,
    rounding: input.roundingPrecision,
    conduitSize: input.tradeSize,
    conduitType: input.conduitType,
  });

  return {
    markSpacing: result.spacingInches,
    shrink: result.shrinkInches,
    mark1: result.firstMarkInches,
    mark2: result.secondMarkInches,
    bendAngle: input.bendAngle,
    multiplier: result.multiplier,
    warnings: result.warnings.map((warning) => warning.message),
    benderProfileUsed: input.benderProfileId,

    markSpacingFormatted: result.spacingFormatted,
    shrinkFormatted: result.shrinkFormatted,
    mark1Formatted: result.firstMarkFormatted,
    mark2Formatted: result.secondMarkFormatted,
  };
}
