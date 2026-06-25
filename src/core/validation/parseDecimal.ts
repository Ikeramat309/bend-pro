/** Whole or fractional decimal text with no trailing junk — rejects "2abc". */
const STRICT_DECIMAL = /^(?:\d+\.?\d*|\.\d+)$/;

/** Parses strict decimal text. Empty string returns undefined. */
export function parseStrictDecimal(text: string): number | undefined {
  const cleaned = text.trim();
  if (cleaned === '') {
    return undefined;
  }
  if (!STRICT_DECIMAL.test(cleaned)) {
    return undefined;
  }
  const value = Number(cleaned);
  return Number.isFinite(value) ? value : undefined;
}

/** Strict decimal that must be greater than zero. */
export function parseStrictPositiveDecimal(text: string): number | undefined {
  const value = parseStrictDecimal(text);
  if (value === undefined || value <= 0) {
    return undefined;
  }
  return value;
}

/** Strict decimal that must be zero or greater. */
export function parseStrictNonNegativeDecimal(text: string): number | undefined {
  const value = parseStrictDecimal(text);
  if (value === undefined || value < 0) {
    return undefined;
  }
  return value;
}
