import { sanitizeRecentLayoutsEnvelope } from './sessionSanitize';
import { SESSION_SCHEMA_VERSION, type RecentLayoutsEnvelope } from './sessionTypes';

export const RECENT_LAYOUTS_STORAGE_KEY = 'bend-pro/recent-layouts/v1';

export type RecentLayoutsStorage = {
  getItem(key: string): Promise<string | null>;
  setItem(key: string, value: string): Promise<void>;
};

export function parseStoredRecentLayoutsJson(raw: string | null): unknown {
  if (raw === null) {
    return null;
  }
  try {
    return JSON.parse(raw) as unknown;
  } catch {
    return null;
  }
}

export async function loadRecentLayoutsEnvelope(
  storage: RecentLayoutsStorage,
  key = RECENT_LAYOUTS_STORAGE_KEY,
): Promise<RecentLayoutsEnvelope> {
  const raw = await storage.getItem(key);
  const parsed = parseStoredRecentLayoutsJson(raw);
  if (parsed === null) {
    return { schemaVersion: SESSION_SCHEMA_VERSION, layouts: [] };
  }
  return sanitizeRecentLayoutsEnvelope(parsed);
}

export async function persistRecentLayoutsEnvelope(
  storage: RecentLayoutsStorage,
  envelope: RecentLayoutsEnvelope,
  key = RECENT_LAYOUTS_STORAGE_KEY,
): Promise<void> {
  try {
    await storage.setItem(
      key,
      JSON.stringify({
        schemaVersion: SESSION_SCHEMA_VERSION,
        layouts: envelope.layouts,
      }),
    );
  } catch {
    // Storage unavailable — caller keeps in-memory state.
  }
}
