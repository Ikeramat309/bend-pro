/** Shared helpers for JSON-safe calculator input snapshots. */

export function isJsonLeaf(value: unknown): boolean {
  if (value === null) {
    return false;
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

export function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === 'object' && value !== null && !Array.isArray(value);
}

export function pickJsonLeaves(
  raw: unknown,
  allowedKeys: readonly string[],
): Record<string, unknown> {
  if (!isRecord(raw)) {
    return {};
  }

  const picked: Record<string, unknown> = {};
  for (const key of allowedKeys) {
    const value = raw[key];
    if (isJsonLeaf(value)) {
      picked[key] = value;
    }
  }
  return picked;
}

export function optionalFiniteNumber(value: unknown): number | undefined {
  return typeof value === 'number' && Number.isFinite(value) ? value : undefined;
}

export function requiredFiniteNumber(value: unknown): number | undefined {
  const parsed = optionalFiniteNumber(value);
  return parsed !== undefined && parsed > 0 ? parsed : undefined;
}

export function optionalNonNegativeNumber(value: unknown): number | undefined {
  const parsed = optionalFiniteNumber(value);
  return parsed !== undefined && parsed >= 0 ? parsed : undefined;
}
