/**
 * Safe parsing and normalization for stored session/layout JSON.
 */
import type { CalculationSetupSnapshot } from '@/core/calculations';
import { DEFAULT_BENDER_PROFILE_ID } from '@/data/benders';
import { DEFAULT_CONDUIT_TYPE } from '@/data/conduit';
import { DEFAULT_EMT_TRADE_SIZE } from '@/data/emt';
import type { ConduitType, RoundingOption, TradeSize, UnitSystem } from '@/core/types';

import {
  SESSION_SCHEMA_VERSION,
  type CalculationResultSnapshot,
  type CalculatorInputSnapshot,
  type LayoutRecordBase,
  type RecentLayout,
  type RecentLayoutsEnvelope,
  type SavedLayout,
} from './sessionTypes';

const IMPERIAL_ROUNDING: readonly RoundingOption[] = ['exact', '1/16', '1/8', '1/4'];
const METRIC_ROUNDING: readonly RoundingOption[] = ['1mm', '5mm', '10mm'];
const VALID_CONDUIT: readonly ConduitType[] = ['EMT'];

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === 'object' && value !== null && !Array.isArray(value);
}

function sanitizeString(value: unknown): string | undefined {
  return typeof value === 'string' && value.trim().length > 0 ? value : undefined;
}

function sanitizeIsoTimestamp(value: unknown, fallback: string): string {
  if (typeof value !== 'string') {
    return fallback;
  }
  const parsed = Date.parse(value);
  return Number.isFinite(parsed) ? new Date(parsed).toISOString() : fallback;
}

function isJsonLeaf(value: unknown): boolean {
  if (value === null) {
    return true;
  }
  const kind = typeof value;
  if (kind === 'string' || kind === 'boolean') {
    return true;
  }
  if (kind === 'number') {
    return Number.isFinite(value);
  }
  return false;
}

export function sanitizeInputSnapshot(raw: unknown): CalculatorInputSnapshot {
  if (!isRecord(raw)) {
    return {};
  }

  const snapshot: Record<string, unknown> = {};
  for (const [key, value] of Object.entries(raw)) {
    if (isJsonLeaf(value)) {
      snapshot[key] = value;
    }
  }
  return snapshot;
}

export function sanitizeSetupSnapshot(raw: unknown): CalculationSetupSnapshot {
  const fallback: CalculationSetupSnapshot = {
    unitSystem: 'imperial',
    roundingPrecision: '1/16',
    conduitType: DEFAULT_CONDUIT_TYPE,
    tradeSize: DEFAULT_EMT_TRADE_SIZE,
    benderProfileId: DEFAULT_BENDER_PROFILE_ID,
  };

  if (!isRecord(raw)) {
    return fallback;
  }

  const unitSystem: UnitSystem =
    raw.unitSystem === 'metric' ? 'metric' : raw.unitSystem === 'imperial' ? 'imperial' : fallback.unitSystem;

  const roundingPool = unitSystem === 'metric' ? METRIC_ROUNDING : IMPERIAL_ROUNDING;
  const roundingPrecision =
    typeof raw.roundingPrecision === 'string' &&
    roundingPool.includes(raw.roundingPrecision as RoundingOption)
      ? (raw.roundingPrecision as RoundingOption)
      : unitSystem === 'metric'
        ? '5mm'
        : '1/16';

  const conduitType: ConduitType =
    typeof raw.conduitType === 'string' && VALID_CONDUIT.includes(raw.conduitType as ConduitType)
      ? (raw.conduitType as ConduitType)
      : fallback.conduitType;

  const tradeSize =
    typeof raw.tradeSize === 'string' && raw.tradeSize.trim().length > 0
      ? (raw.tradeSize as TradeSize)
      : fallback.tradeSize;

  const benderProfileId = sanitizeString(raw.benderProfileId) ?? fallback.benderProfileId;

  return {
    unitSystem,
    roundingPrecision,
    conduitType,
    tradeSize,
    benderProfileId,
  };
}

function sanitizeResultItem(raw: unknown): CalculationResultSnapshot['primaryResults'][number] | null {
  if (!isRecord(raw)) {
    return null;
  }
  const key = sanitizeString(raw.key);
  const label = sanitizeString(raw.label);
  const display = sanitizeString(raw.display);
  if (!key || !label || !display) {
    return null;
  }
  const inches = typeof raw.inches === 'number' && Number.isFinite(raw.inches) ? raw.inches : undefined;
  const tone = raw.tone === 'primary' ? 'primary' : raw.tone === 'default' ? 'default' : undefined;
  return { key, label, display, inches, tone };
}

function sanitizeStringMap(raw: unknown): Record<string, string | undefined> {
  if (!isRecord(raw)) {
    return {};
  }
  const map: Record<string, string | undefined> = {};
  for (const [key, value] of Object.entries(raw)) {
    if (typeof value === 'string') {
      map[key] = value;
    }
  }
  return map;
}

function sanitizeNumberMap(raw: unknown): Record<string, number | undefined> {
  if (!isRecord(raw)) {
    return {};
  }
  const map: Record<string, number | undefined> = {};
  for (const [key, value] of Object.entries(raw)) {
    if (typeof value === 'number' && Number.isFinite(value)) {
      map[key] = value;
    }
  }
  return map;
}

export function sanitizeResultSnapshot(raw: unknown): CalculationResultSnapshot | undefined {
  if (!isRecord(raw)) {
    return undefined;
  }

  const status =
    raw.status === 'valid' || raw.status === 'invalid' || raw.status === 'warning'
      ? raw.status
      : 'invalid';

  const primaryResults = Array.isArray(raw.primaryResults)
    ? raw.primaryResults.map(sanitizeResultItem).filter((item): item is NonNullable<typeof item> => item !== null)
    : [];

  const secondaryResults = Array.isArray(raw.secondaryResults)
    ? raw.secondaryResults.map(sanitizeResultItem).filter((item): item is NonNullable<typeof item> => item !== null)
    : [];

  const warnings = Array.isArray(raw.warnings)
    ? raw.warnings.filter((item): item is string => typeof item === 'string')
    : [];

  const summaryLine = sanitizeString(raw.summaryLine);

  return {
    status,
    primaryResults,
    secondaryResults,
    warnings,
    displayValues: sanitizeStringMap(raw.displayValues),
    rawValuesInches: sanitizeNumberMap(raw.rawValuesInches),
    summaryLine,
  };
}

function sanitizeWarnings(raw: unknown): string[] {
  if (!Array.isArray(raw)) {
    return [];
  }
  return raw.filter((item): item is string => typeof item === 'string');
}

function sanitizeLayoutBase(raw: unknown, fallbackNow: string): LayoutRecordBase | null {
  if (!isRecord(raw)) {
    return null;
  }

  const id = sanitizeString(raw.id);
  const calculatorId = sanitizeString(raw.calculatorId);
  const calculatorTitle = sanitizeString(raw.calculatorTitle);
  if (!id || !calculatorId || !calculatorTitle) {
    return null;
  }

  const createdAt = sanitizeIsoTimestamp(raw.createdAt, fallbackNow);
  const updatedAt = sanitizeIsoTimestamp(raw.updatedAt, createdAt);

  return {
    id,
    schemaVersion:
      typeof raw.schemaVersion === 'number' && Number.isFinite(raw.schemaVersion)
        ? raw.schemaVersion
        : SESSION_SCHEMA_VERSION,
    calculatorId,
    calculatorTitle,
    inputSnapshot: sanitizeInputSnapshot(raw.inputSnapshot),
    setupSnapshot: sanitizeSetupSnapshot(raw.setupSnapshot),
    resultSnapshot: sanitizeResultSnapshot(raw.resultSnapshot),
    warnings: sanitizeWarnings(raw.warnings),
    createdAt,
    updatedAt,
    label: sanitizeString(raw.label),
    projectId: sanitizeString(raw.projectId),
  };
}

export function sanitizeRecentLayout(raw: unknown, fallbackNow = new Date(0).toISOString()): RecentLayout | null {
  const base = sanitizeLayoutBase(raw, fallbackNow);
  if (!base) {
    return null;
  }
  return { ...base, kind: 'recent' };
}

export function sanitizeSavedLayout(raw: unknown, fallbackNow = new Date(0).toISOString()): SavedLayout | null {
  const base = sanitizeLayoutBase(raw, fallbackNow);
  if (!base) {
    return null;
  }
  const savedAt = sanitizeIsoTimestamp(isRecord(raw) ? raw.savedAt : undefined, base.updatedAt);
  return { ...base, kind: 'saved', savedAt };
}

/** Normalizes a stored envelope; drops corrupt entries instead of throwing. */
export function sanitizeRecentLayoutsEnvelope(raw: unknown): RecentLayoutsEnvelope {
  const empty: RecentLayoutsEnvelope = {
    schemaVersion: SESSION_SCHEMA_VERSION,
    layouts: [],
  };

  if (!isRecord(raw)) {
    return empty;
  }

  const schemaVersion =
    typeof raw.schemaVersion === 'number' && Number.isFinite(raw.schemaVersion)
      ? raw.schemaVersion
      : SESSION_SCHEMA_VERSION;

  if (schemaVersion !== SESSION_SCHEMA_VERSION) {
    return empty;
  }

  if (!Array.isArray(raw.layouts)) {
    return empty;
  }

  const layouts = raw.layouts
    .map((entry) => sanitizeRecentLayout(entry))
    .filter((entry): entry is RecentLayout => entry !== null);

  return {
    schemaVersion: SESSION_SCHEMA_VERSION,
    layouts,
  };
}
