import {
  buildRecentLayoutPersistSignature,
  persistRecentLayoutFromCalculation,
  shouldPersistRecentLayout,
} from './persistRecentLayout';
import { loadRecentLayouts, upsertRecentLayoutForCalculator } from './recentLayoutsService';
import { RECENT_LAYOUTS_STORAGE_KEY } from './sessionPersistence';
import type { CalculationResult } from '@/core/calculations';
import { snapshotSetupFromInput } from '@/core/calculations';

function createMemoryStorage(initial: Record<string, string> = {}) {
  const map = new Map(Object.entries(initial));
  return {
    getItem: async (key: string) => map.get(key) ?? null,
    setItem: async (key: string, value: string) => {
      map.set(key, value);
    },
  };
}

const setupSnapshot = snapshotSetupFromInput({
  unitSystem: 'imperial',
  roundingPrecision: '1/16',
  conduitType: 'EMT',
  tradeSize: '1/2',
  benderProfileId: 'generic-hand-bender',
});

function validResult(overrides: Partial<CalculationResult> = {}): CalculationResult {
  return {
    calculatorId: 'offset',
    status: 'valid',
    primaryResults: [{ key: 'distanceBetweenBends', label: 'Distance Between Bends', display: '12"' }],
    secondaryResults: [],
    warnings: [],
    assumptions: [],
    setupSnapshot,
    benderProfile: { id: 'generic-hand-bender', name: 'Generic', category: 'hand' },
    rawValuesInches: { distanceBetweenBends: 12 },
    displayValues: { distanceBetweenBends: '12"' },
    fieldSteps: [],
    sourceNotes: [],
    specific: {},
    ...overrides,
  };
}

describe('persistRecentLayout', () => {
  test('shouldPersistRecentLayout accepts valid and warning only', () => {
    expect(shouldPersistRecentLayout(validResult())).toBe(true);
    expect(shouldPersistRecentLayout(validResult({ status: 'warning', warnings: ['Check clearance.'] }))).toBe(true);
    expect(shouldPersistRecentLayout(validResult({ status: 'invalid' }))).toBe(false);
  });

  test('valid result saves to storage', async () => {
    const storage = createMemoryStorage();

    await persistRecentLayoutFromCalculation(storage, {
      calculatorId: 'offset',
      calculatorTitle: 'Basic Offset',
      inputSnapshot: { calculatorId: 'offset', offsetHeight: 6, bendAngle: 30 },
      setupSnapshot,
      calculationResult: validResult(),
    });

    const layouts = await loadRecentLayouts(storage);
    expect(layouts).toHaveLength(1);
    expect(layouts[0].calculatorId).toBe('offset');
    expect(layouts[0].resultSnapshot?.summaryLine).toBe('12"');
  });

  test('invalid result does not save', async () => {
    const storage = createMemoryStorage();

    await persistRecentLayoutFromCalculation(storage, {
      calculatorId: 'offset',
      calculatorTitle: 'Basic Offset',
      inputSnapshot: {},
      setupSnapshot,
      calculationResult: validResult({ status: 'invalid', primaryResults: [] }),
    });

    expect(await loadRecentLayouts(storage)).toEqual([]);
  });

  test('unknown calculator id does not crash or save', async () => {
    const storage = createMemoryStorage();

    await expect(
      persistRecentLayoutFromCalculation(storage, {
        calculatorId: 'future-calculator',
        calculatorTitle: 'Future',
        inputSnapshot: {},
        setupSnapshot,
        calculationResult: validResult({ calculatorId: 'offset' }),
      }),
    ).resolves.toBeUndefined();

    expect(await loadRecentLayouts(storage)).toEqual([]);
  });

  test('repeated upserts for same calculator do not duplicate', async () => {
    const storage = createMemoryStorage();

    await upsertRecentLayoutForCalculator(storage, {
      calculatorId: 'offset',
      calculatorTitle: 'Basic Offset',
      inputSnapshot: { offsetHeight: 6 },
      setupSnapshot,
      resultSnapshot: { status: 'valid', primaryResults: [], secondaryResults: [], warnings: [], displayValues: {}, rawValuesInches: {} },
    });

    await upsertRecentLayoutForCalculator(storage, {
      calculatorId: 'offset',
      calculatorTitle: 'Basic Offset',
      inputSnapshot: { offsetHeight: 8 },
      setupSnapshot,
      resultSnapshot: { status: 'valid', primaryResults: [], secondaryResults: [], warnings: [], displayValues: {}, rawValuesInches: {}, summaryLine: '16"' },
    });

    const layouts = await loadRecentLayouts(storage);
    expect(layouts).toHaveLength(1);
    expect(layouts[0].inputSnapshot.offsetHeight).toBe(8);
  });

  test('corrupt storage recovers on next save', async () => {
    const storage = createMemoryStorage({
      [RECENT_LAYOUTS_STORAGE_KEY]: '{bad json',
    });

    await persistRecentLayoutFromCalculation(storage, {
      calculatorId: 'stub90',
      calculatorTitle: '90° Stub',
      inputSnapshot: { stubHeight: 36 },
      setupSnapshot,
      calculationResult: validResult({ calculatorId: 'stub90', status: 'valid' }),
    });

    const layouts = await loadRecentLayouts(storage);
    expect(layouts).toHaveLength(1);
    expect(layouts[0].calculatorId).toBe('stub90');
  });

  test('persist signature changes when inputs change', () => {
    const base = {
      calculatorId: 'offset',
      calculatorTitle: 'Basic Offset',
      inputSnapshot: { offsetHeight: 6 },
      setupSnapshot,
      calculationResult: validResult(),
    };

    const first = buildRecentLayoutPersistSignature(base);
    const second = buildRecentLayoutPersistSignature({
      ...base,
      inputSnapshot: { offsetHeight: 8 },
    });

    expect(first).not.toBe(second);
  });
});
