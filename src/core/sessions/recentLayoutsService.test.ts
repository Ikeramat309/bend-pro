import { snapshotSetupFromInput } from '@/core/calculations';

import {
  clearRecentLayouts,
  createRecentLayout,
  DEFAULT_MAX_RECENT_LAYOUTS,
  isKnownCalculatorLayout,
  loadRecentLayouts,
  resolveContinueLayoutCandidate,
  saveRecentLayout,
  updateRecentLayout,
  upsertRecentLayout,
} from './recentLayoutsService';
import { parseStoredRecentLayoutsJson, RECENT_LAYOUTS_STORAGE_KEY, type RecentLayoutsStorage } from './sessionPersistence';
import { sanitizeRecentLayoutsEnvelope } from './sessionSanitize';
import { SESSION_SCHEMA_VERSION } from './sessionTypes';

function createMemoryStorage(initial: Record<string, string> = {}): RecentLayoutsStorage {
  const map = new Map(Object.entries(initial));
  return {
    getItem: async (key) => map.get(key) ?? null,
    setItem: async (key, value) => {
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

describe('recentLayoutsService', () => {
  test('saveRecentLayout persists and returns newest-first list', async () => {
    const storage = createMemoryStorage();
    const layouts = await saveRecentLayout(storage, {
      calculatorId: 'offset',
      calculatorTitle: 'Basic Offset',
      inputSnapshot: { offsetHeight: 6, bendAngle: 30 },
      setupSnapshot,
      warnings: [],
    });

    expect(layouts).toHaveLength(1);
    expect(layouts[0].calculatorId).toBe('offset');
    expect(layouts[0].schemaVersion).toBe(SESSION_SCHEMA_VERSION);
    expect(layouts[0].kind).toBe('recent');
    expect(layouts[0].createdAt).toBeTruthy();
    expect(layouts[0].updatedAt).toBeTruthy();

    const loaded = await loadRecentLayouts(storage);
    expect(loaded).toEqual(layouts);
  });

  test('updateRecentLayout updates existing entry by id', async () => {
    const storage = createMemoryStorage();
    const [created] = await saveRecentLayout(storage, {
      calculatorId: 'offset',
      calculatorTitle: 'Basic Offset',
      inputSnapshot: { offsetHeight: 6 },
      setupSnapshot,
    });

    const updated = await updateRecentLayout(
      storage,
      created.id,
      {
        inputSnapshot: { offsetHeight: 8 },
        resultSnapshot: {
          status: 'valid',
          primaryResults: [{ key: 'distanceBetweenBends', label: 'Distance Between Bends', display: '16"' }],
          secondaryResults: [],
          warnings: [],
          displayValues: { distanceBetweenBends: '16"' },
          rawValuesInches: { distanceBetweenBends: 16 },
          summaryLine: '16"',
        },
      },
      { now: '2026-06-13T12:00:00.000Z' },
    );

    expect(updated).toHaveLength(1);
    expect(updated[0].inputSnapshot.offsetHeight).toBe(8);
    expect(updated[0].updatedAt).toBe('2026-06-13T12:00:00.000Z');
    expect(updated[0].resultSnapshot?.summaryLine).toBe('16"');
  });

  test('upsertRecentLayout updates when id exists', async () => {
    const storage = createMemoryStorage();
    const layout = createRecentLayout({
      calculatorId: 'stub90',
      calculatorTitle: '90° Stub',
      inputSnapshot: { stubHeight: 36 },
      setupSnapshot,
      id: 'layout-test-1',
    });

    await saveRecentLayout(storage, layout);

    const next = await upsertRecentLayout(storage, {
      id: 'layout-test-1',
      calculatorId: 'stub90',
      calculatorTitle: '90° Stub',
      inputSnapshot: { stubHeight: 40 },
      setupSnapshot,
    });

    expect(next).toHaveLength(1);
    expect(next[0].inputSnapshot.stubHeight).toBe(40);
  });

  test('trimRecentLayouts enforces max recent count', async () => {
    const storage = createMemoryStorage();
    const max = 3;

    for (let index = 0; index < 5; index += 1) {
      await saveRecentLayout(
        storage,
        {
          calculatorId: 'offset',
          calculatorTitle: 'Basic Offset',
          inputSnapshot: { offsetHeight: index },
          setupSnapshot,
        },
        { now: `2026-06-13T10:0${index}:00.000Z`, maxCount: max },
      );
    }

    const loaded = await loadRecentLayouts(storage);
    expect(loaded).toHaveLength(max);
    expect(loaded[0].inputSnapshot.offsetHeight).toBe(4);
    expect(loaded[2].inputSnapshot.offsetHeight).toBe(2);
  });

  test('DEFAULT_MAX_RECENT_LAYOUTS is 20', () => {
    expect(DEFAULT_MAX_RECENT_LAYOUTS).toBe(20);
  });
});

describe('session persistence recovery', () => {
  test('parseStoredRecentLayoutsJson returns null for corrupt JSON', () => {
    expect(parseStoredRecentLayoutsJson(null)).toBeNull();
    expect(parseStoredRecentLayoutsJson('{bad json')).toBeNull();
  });

  test('sanitizeRecentLayoutsEnvelope drops corrupt entries', () => {
    const result = sanitizeRecentLayoutsEnvelope({
      schemaVersion: SESSION_SCHEMA_VERSION,
      layouts: [
        {
          id: 'good',
          schemaVersion: 1,
          calculatorId: 'offset',
          calculatorTitle: 'Basic Offset',
          inputSnapshot: {},
          setupSnapshot: {},
          warnings: [],
          createdAt: '2026-01-01T00:00:00.000Z',
          updatedAt: '2026-01-01T00:00:00.000Z',
          kind: 'recent',
        },
        { id: 'bad' },
      ],
    });

    expect(result.layouts).toHaveLength(1);
    expect(result.layouts[0].id).toBe('good');
  });

  test('loadRecentLayouts returns empty list for corrupt stored envelope', async () => {
    const storage = createMemoryStorage({
      [RECENT_LAYOUTS_STORAGE_KEY]: '{not-json',
    });

    await expect(loadRecentLayouts(storage)).resolves.toEqual([]);
  });

  test('loadRecentLayouts returns empty list for unsupported schema version', async () => {
    const storage = createMemoryStorage({
      [RECENT_LAYOUTS_STORAGE_KEY]: JSON.stringify({
        schemaVersion: 99,
        layouts: [
          createRecentLayout({
            calculatorId: 'offset',
            calculatorTitle: 'Basic Offset',
            inputSnapshot: {},
            setupSnapshot,
          }),
        ],
      }),
    });

    await expect(loadRecentLayouts(storage)).resolves.toEqual([]);
  });

  test('clearRecentLayouts removes all entries', async () => {
    const storage = createMemoryStorage();
    await saveRecentLayout(storage, {
      calculatorId: 'offset',
      calculatorTitle: 'Basic Offset',
      inputSnapshot: {},
      setupSnapshot,
    });

    await clearRecentLayouts(storage);
    await expect(loadRecentLayouts(storage)).resolves.toEqual([]);
  });
});

describe('unknown calculator id handling', () => {
  test('unknown ids are stored but not routable', async () => {
    const storage = createMemoryStorage();
    const [layout] = await saveRecentLayout(storage, {
      calculatorId: 'future-calculator',
      calculatorTitle: 'Future Tool',
      inputSnapshot: {},
      setupSnapshot,
    });

    expect(isKnownCalculatorLayout(layout)).toBe(false);
    expect(resolveContinueLayoutCandidate([layout])).toBeUndefined();
  });

  test('resolveContinueLayoutCandidate skips unknown ids and picks next routable', () => {
    const known = createRecentLayout({
      calculatorId: 'stub90',
      calculatorTitle: '90° Stub',
      inputSnapshot: {},
      setupSnapshot,
      updatedAt: '2026-06-13T11:00:00.000Z',
    });
    const unknown = createRecentLayout({
      calculatorId: 'retired-tool',
      calculatorTitle: 'Retired',
      inputSnapshot: {},
      setupSnapshot,
      updatedAt: '2026-06-13T12:00:00.000Z',
    });

    const candidate = resolveContinueLayoutCandidate([unknown, known]);
    expect(candidate?.layout.id).toBe(known.id);
    expect(candidate?.route).toBeDefined();
  });
});
