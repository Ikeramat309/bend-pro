/**
 * Pure helpers for persisting recent layouts from calculator results.
 */
import { isCalculatorId } from '@/core/calculators';
import type { CalculationResult, CalculationSetupSnapshot } from '@/core/calculations';
import { isCalculationResultValid } from '@/core/calculations';

import { toCalculationResultSnapshot } from './resultSnapshot';
import {
  DEFAULT_MAX_RECENT_LAYOUTS,
  upsertRecentLayoutForCalculator,
} from './recentLayoutsService';
import type { RecentLayoutsStorage } from './sessionPersistence';
import type { CalculatorInputSnapshot } from './sessionTypes';

export const DEFAULT_PERSIST_DEBOUNCE_MS = 600;

export type PersistRecentLayoutInput = {
  calculatorId: string;
  calculatorTitle: string;
  inputSnapshot: CalculatorInputSnapshot;
  setupSnapshot: CalculationSetupSnapshot;
  calculationResult: CalculationResult;
};

export function shouldPersistRecentLayout(result: CalculationResult): boolean {
  return isCalculationResultValid(result);
}

export function buildRecentLayoutPersistSignature(input: PersistRecentLayoutInput): string {
  return JSON.stringify({
    calculatorId: input.calculatorId,
    status: input.calculationResult.status,
    warnings: input.calculationResult.warnings,
    inputSnapshot: input.inputSnapshot,
    setupSnapshot: input.setupSnapshot,
    summaryLine: input.calculationResult.primaryResults[0]?.display,
  });
}

export async function persistRecentLayoutFromCalculation(
  storage: RecentLayoutsStorage,
  input: PersistRecentLayoutInput,
  options?: { maxCount?: number; now?: string },
): Promise<void> {
  if (!shouldPersistRecentLayout(input.calculationResult)) {
    return;
  }

  if (!isCalculatorId(input.calculatorId)) {
    return;
  }

  try {
    await upsertRecentLayoutForCalculator(
      storage,
      {
        calculatorId: input.calculatorId,
        calculatorTitle: input.calculatorTitle,
        inputSnapshot: input.inputSnapshot,
        setupSnapshot: input.setupSnapshot,
        resultSnapshot: toCalculationResultSnapshot(input.calculationResult),
        warnings: [...input.calculationResult.warnings],
      },
      { maxCount: options?.maxCount ?? DEFAULT_MAX_RECENT_LAYOUTS, now: options?.now },
    );
  } catch {
    // Non-fatal — calculator screen keeps working.
  }
}
