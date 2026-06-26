import { useEffect, useRef } from 'react';

import type { CalculationResult, CalculationSetupSnapshot } from '@/core/calculations';

import {
  buildRecentLayoutPersistSignature,
  DEFAULT_PERSIST_DEBOUNCE_MS,
  persistRecentLayoutFromCalculation,
  shouldPersistRecentLayout,
  type PersistRecentLayoutInput,
} from './persistRecentLayout';
import type { RecentLayoutsStorage } from './sessionPersistence';
import type { CalculatorInputSnapshot } from './sessionTypes';

async function getDefaultStorage(): Promise<RecentLayoutsStorage> {
  const { default: AsyncStorage } = await import('@react-native-async-storage/async-storage');
  return AsyncStorage;
}

export type UsePersistRecentLayoutParams = {
  calculatorId: string;
  calculatorTitle: string;
  inputSnapshot: CalculatorInputSnapshot;
  setupSnapshot: CalculationSetupSnapshot;
  calculationResult: CalculationResult;
  /** When false, skips persistence entirely (e.g. before user enters inputs). */
  enabled?: boolean;
  debounceMs?: number;
};

/**
 * Debounced recent-layout persistence for calculator screens.
 * Writes only when the result is valid or warning — never for invalid runs.
 */
export function usePersistRecentLayout(params: UsePersistRecentLayoutParams): void {
  const debounceMs = params.debounceMs ?? DEFAULT_PERSIST_DEBOUNCE_MS;
  const lastSignatureRef = useRef<string>('');
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const signature = buildRecentLayoutPersistSignature({
    calculatorId: params.calculatorId,
    calculatorTitle: params.calculatorTitle,
    inputSnapshot: params.inputSnapshot,
    setupSnapshot: params.setupSnapshot,
    calculationResult: params.calculationResult,
  });

  useEffect(() => {
    if (params.enabled === false) {
      return undefined;
    }

    if (!shouldPersistRecentLayout(params.calculationResult)) {
      return undefined;
    }

    if (signature === lastSignatureRef.current) {
      return undefined;
    }

    if (timerRef.current) {
      clearTimeout(timerRef.current);
    }

    const payload: PersistRecentLayoutInput = {
      calculatorId: params.calculatorId,
      calculatorTitle: params.calculatorTitle,
      inputSnapshot: params.inputSnapshot,
      setupSnapshot: params.setupSnapshot,
      calculationResult: params.calculationResult,
    };

    timerRef.current = setTimeout(() => {
      void getDefaultStorage()
        .then((storage) => persistRecentLayoutFromCalculation(storage, payload))
        .then(() => {
          lastSignatureRef.current = signature;
        });
    }, debounceMs);

    return () => {
      if (timerRef.current) {
        clearTimeout(timerRef.current);
      }
    };
  }, [params.enabled, params.calculatorId, params.calculatorTitle, params.calculationResult, params.inputSnapshot, params.setupSnapshot, signature, debounceMs]);
}

export { shouldPersistRecentLayout, buildRecentLayoutPersistSignature };
