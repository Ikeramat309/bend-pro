/**
 * Maps a full calculation result to a persistence-friendly snapshot.
 */
import type { CalculationResult } from '@/core/calculations';

import type { CalculationResultSnapshot } from './sessionTypes';

export function toCalculationResultSnapshot(
  result: CalculationResult,
): CalculationResultSnapshot {
  return {
    status: result.status,
    primaryResults: result.primaryResults,
    secondaryResults: result.secondaryResults,
    warnings: [...result.warnings],
    displayValues: { ...result.displayValues },
    rawValuesInches: { ...result.rawValuesInches },
    summaryLine: result.primaryResults[0]?.display,
  };
}
