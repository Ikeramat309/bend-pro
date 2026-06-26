/**
 * Recent-layout storage service — AsyncStorage-backed, no UI dependencies.
 */
import { getCalculatorRoute, isCalculatorId } from '@/core/calculators';
import type { Href } from 'expo-router';

import {
  loadRecentLayoutsEnvelope,
  persistRecentLayoutsEnvelope,
  type RecentLayoutsStorage,
} from './sessionPersistence';
import {
  SESSION_SCHEMA_VERSION,
  type CalculatorSession,
  type CreateRecentLayoutParams,
  type RecentLayout,
  type UpdateRecentLayoutPatch,
} from './sessionTypes';

export const DEFAULT_MAX_RECENT_LAYOUTS = 20;

export type ContinueLayoutCandidate = {
  layout: RecentLayout;
  route: Href;
  label: string;
  description: string;
};

export function createLayoutId(now = Date.now()): string {
  return `layout-${now}-${Math.random().toString(36).slice(2, 10)}`;
}

export function createRecentLayout(
  params: CreateRecentLayoutParams,
  now = new Date().toISOString(),
): RecentLayout {
  const createdAt = params.createdAt ?? now;
  return {
    kind: 'recent',
    id: params.id ?? createLayoutId(Date.parse(createdAt)),
    schemaVersion: SESSION_SCHEMA_VERSION,
    calculatorId: params.calculatorId,
    calculatorTitle: params.calculatorTitle,
    inputSnapshot: params.inputSnapshot,
    setupSnapshot: params.setupSnapshot,
    resultSnapshot: params.resultSnapshot,
    warnings: params.warnings ?? [],
    createdAt,
    updatedAt: params.updatedAt ?? createdAt,
    label: params.label,
    projectId: params.projectId,
  };
}

export function recentLayoutToSession(layout: RecentLayout): CalculatorSession {
  return {
    id: layout.id,
    schemaVersion: layout.schemaVersion,
    calculatorId: layout.calculatorId,
    calculatorTitle: layout.calculatorTitle,
    inputSnapshot: layout.inputSnapshot,
    setupSnapshot: layout.setupSnapshot,
    resultSnapshot: layout.resultSnapshot,
    warnings: layout.warnings,
    createdAt: layout.createdAt,
    updatedAt: layout.updatedAt,
    label: layout.label,
    projectId: layout.projectId,
    isDirty: false,
  };
}

export function trimRecentLayouts(
  layouts: RecentLayout[],
  maxCount = DEFAULT_MAX_RECENT_LAYOUTS,
): RecentLayout[] {
  return [...layouts]
    .sort((a, b) => Date.parse(b.updatedAt) - Date.parse(a.updatedAt))
    .slice(0, maxCount);
}

export function isKnownCalculatorLayout(layout: RecentLayout): boolean {
  return isCalculatorId(layout.calculatorId);
}

export function getRecentLayoutRoute(layout: RecentLayout): Href | undefined {
  if (!isCalculatorId(layout.calculatorId)) {
    return undefined;
  }
  return getCalculatorRoute(layout.calculatorId);
}

/**
 * Resolves the best Continue Layout candidate from recents.
 * Falls back to undefined when no routable recent exists.
 *
 * TODO(HomeScreen): call from Home after `loadRecentLayouts` hydration — not wired yet.
 */
export function resolveContinueLayoutCandidate(
  layouts: RecentLayout[],
): ContinueLayoutCandidate | undefined {
  const sorted = trimRecentLayouts(layouts, layouts.length);
  for (const layout of sorted) {
    const route = getRecentLayoutRoute(layout);
    if (!route) {
      continue;
    }
    return {
      layout,
      route,
      label: layout.label ?? 'Continue Layout',
      description:
        layout.resultSnapshot?.summaryLine ??
        layout.calculatorTitle,
    };
  }
  return undefined;
}

export async function loadRecentLayouts(
  storage: RecentLayoutsStorage,
): Promise<RecentLayout[]> {
  const envelope = await loadRecentLayoutsEnvelope(storage);
  return envelope.layouts;
}

export async function saveRecentLayout(
  storage: RecentLayoutsStorage,
  params: CreateRecentLayoutParams,
  options?: { maxCount?: number; now?: string },
): Promise<RecentLayout[]> {
  const now = options?.now ?? new Date().toISOString();
  const layout = createRecentLayout({ ...params, updatedAt: now }, now);
  const envelope = await loadRecentLayoutsEnvelope(storage);

  const withoutDuplicate = envelope.layouts.filter((entry) => entry.id !== layout.id);
  const next = trimRecentLayouts([layout, ...withoutDuplicate], options?.maxCount);

  await persistRecentLayoutsEnvelope(storage, { schemaVersion: SESSION_SCHEMA_VERSION, layouts: next });
  return next;
}

export async function updateRecentLayout(
  storage: RecentLayoutsStorage,
  id: string,
  patch: UpdateRecentLayoutPatch,
  options?: { maxCount?: number; now?: string },
): Promise<RecentLayout[]> {
  const now = options?.now ?? new Date().toISOString();
  const envelope = await loadRecentLayoutsEnvelope(storage);
  const index = envelope.layouts.findIndex((entry) => entry.id === id);

  if (index < 0) {
    return envelope.layouts;
  }

  const current = envelope.layouts[index];
  const updated: RecentLayout = {
    ...current,
    ...patch,
    updatedAt: now,
  };

  const nextLayouts = [...envelope.layouts];
  nextLayouts[index] = updated;
  const next = trimRecentLayouts(nextLayouts, options?.maxCount);

  await persistRecentLayoutsEnvelope(storage, { schemaVersion: SESSION_SCHEMA_VERSION, layouts: next });
  return next;
}

export async function upsertRecentLayout(
  storage: RecentLayoutsStorage,
  params: CreateRecentLayoutParams,
  options?: { maxCount?: number; now?: string },
): Promise<RecentLayout[]> {
  if (params.id) {
    const envelope = await loadRecentLayoutsEnvelope(storage);
    const exists = envelope.layouts.some((entry) => entry.id === params.id);
    if (exists) {
      return updateRecentLayout(
        storage,
        params.id,
        {
          calculatorTitle: params.calculatorTitle,
          inputSnapshot: params.inputSnapshot,
          setupSnapshot: params.setupSnapshot,
          resultSnapshot: params.resultSnapshot,
          warnings: params.warnings,
          label: params.label,
          projectId: params.projectId,
        },
        options,
      );
    }
  }

  return saveRecentLayout(storage, params, options);
}

/** Updates the most recent entry for a calculator id, or creates one. */
export async function upsertRecentLayoutForCalculator(
  storage: RecentLayoutsStorage,
  params: CreateRecentLayoutParams,
  options?: { maxCount?: number; now?: string },
): Promise<RecentLayout[]> {
  const envelope = await loadRecentLayoutsEnvelope(storage);
  const existing = envelope.layouts.find((entry) => entry.calculatorId === params.calculatorId);

  if (existing) {
    return updateRecentLayout(
      storage,
      existing.id,
      {
        calculatorTitle: params.calculatorTitle,
        inputSnapshot: params.inputSnapshot,
        setupSnapshot: params.setupSnapshot,
        resultSnapshot: params.resultSnapshot,
        warnings: params.warnings,
        label: params.label,
        projectId: params.projectId,
      },
      options,
    );
  }

  return saveRecentLayout(storage, params, options);
}

export async function removeRecentLayout(
  storage: RecentLayoutsStorage,
  id: string,
): Promise<RecentLayout[]> {
  const envelope = await loadRecentLayoutsEnvelope(storage);
  const next = envelope.layouts.filter((entry) => entry.id !== id);
  await persistRecentLayoutsEnvelope(storage, { schemaVersion: SESSION_SCHEMA_VERSION, layouts: next });
  return next;
}

export async function clearRecentLayouts(storage: RecentLayoutsStorage): Promise<void> {
  await persistRecentLayoutsEnvelope(storage, { schemaVersion: SESSION_SCHEMA_VERSION, layouts: [] });
}
