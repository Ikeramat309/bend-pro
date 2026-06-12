/**
 * Parses tape-measure style length input.
 *
 * Accepted forms (whitespace tolerant, optional trailing `"` or `in`):
 * - decimal:        "12", "12.5", ".5", "12."
 * - fraction:       "3/8"
 * - mixed number:   "12 3/8", "12-3/8"
 *
 * Returns undefined for empty or unparseable text. Lengths are unsigned —
 * negative input is rejected and surfaced as a field error by the screen.
 */

const TRAILING_UNIT = /\s*(?:"|″|in\.?)$/i;
const MIXED = /^(\d+)[\s-]+(\d+)\s*\/\s*(\d+)$/;
const FRACTION = /^(\d+)\s*\/\s*(\d+)$/;
const DECIMAL = /^(?:\d+\.?\d*|\.\d+)$/;

export function parseLengthInput(text: string): number | undefined {
  const cleaned = text.trim().replace(TRAILING_UNIT, '').trim();

  if (cleaned === '') return undefined;

  const mixed = cleaned.match(MIXED);
  if (mixed) {
    const denominator = Number(mixed[3]);
    if (denominator === 0) return undefined;
    return Number(mixed[1]) + Number(mixed[2]) / denominator;
  }

  const fraction = cleaned.match(FRACTION);
  if (fraction) {
    const denominator = Number(fraction[2]);
    if (denominator === 0) return undefined;
    return Number(fraction[1]) / denominator;
  }

  if (DECIMAL.test(cleaned)) {
    return Number(cleaned);
  }

  return undefined;
}

export function hasPositiveLengthInput(text: string): boolean {
  const parsed = parseLengthInput(text);
  return parsed !== undefined && parsed > 0;
}
