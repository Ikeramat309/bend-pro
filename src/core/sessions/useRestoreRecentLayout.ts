import { useLocalSearchParams } from 'expo-router';
import { useEffect, useRef } from 'react';

import type { CalculatorSetup } from '@/core/settings';
import { useCalculatorSetup } from '@/core/settings';

import { loadRecentLayouts } from './recentLayoutsService';
import type { RecentLayoutsStorage } from './sessionPersistence';
import type { RecentLayout } from './sessionTypes';

async function getDefaultStorage(): Promise<RecentLayoutsStorage> {
  const { default: AsyncStorage } = await import('@react-native-async-storage/async-storage');
  return AsyncStorage;
}

function normalizeLayoutIdParam(value: string | string[] | undefined): string | undefined {
  const raw = Array.isArray(value) ? value[0] : value;
  return typeof raw === 'string' && raw.trim().length > 0 ? raw : undefined;
}

export type LayoutRestoreResult<TFields> = {
  setupPatch: Partial<CalculatorSetup>;
  fields: TFields;
};

/**
 * Restores a recent layout when the screen opens with `?layoutId=` from Home Continue.
 */
export function useRestoreRecentLayout<TFields>(
  calculatorId: string,
  restore: (layout: RecentLayout, setup: CalculatorSetup) => LayoutRestoreResult<TFields> | null,
  applyFields: (fields: TFields) => void,
): void {
  const { layoutId } = useLocalSearchParams<{ layoutId?: string | string[] }>();
  const { setup, isHydrated, patchSetup } = useCalculatorSetup();
  const appliedRef = useRef(false);

  useEffect(() => {
    if (!isHydrated || appliedRef.current) {
      return;
    }

    const id = normalizeLayoutIdParam(layoutId);
    if (!id) {
      return;
    }

    void getDefaultStorage()
      .then((storage) => loadRecentLayouts(storage))
      .then((layouts) => layouts.find((entry) => entry.id === id && entry.calculatorId === calculatorId))
      .then((layout) => {
        if (!layout || appliedRef.current) {
          return;
        }

        const restored = restore(layout, setup);
        if (!restored) {
          return;
        }

        appliedRef.current = true;
        patchSetup(restored.setupPatch);
        applyFields(restored.fields);
      });
  }, [applyFields, calculatorId, isHydrated, layoutId, patchSetup, restore, setup]);
}
