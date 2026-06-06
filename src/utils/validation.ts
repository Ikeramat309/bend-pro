/**
 * Shared lightweight validation helpers for UI input boundaries.
 */
export function parseOptionalNumber(value: string): number | undefined {
  return value.trim() === '' ? undefined : Number(value);
}

export function hasPositiveNumber(value: string): boolean {
  const parsed = Number(value);
  return value.trim() !== '' && Number.isFinite(parsed) && parsed > 0;
}
