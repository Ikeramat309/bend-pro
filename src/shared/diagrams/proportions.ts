/**
 * Clamped proportional scaling for semi-proportional diagrams.
 *
 * Diagrams are NOT to-scale CAD drawings — see docs/DIAGRAM_SYSTEM.md.
 * The goal is that relative proportions respond to the user's numbers
 * (a 30" stub looks taller than a 6" stub) while every element stays
 * inside readable pixel bounds.
 */

export type ProportionalSpan = {
  /** Physical value (inches). Must be > 0 to drive proportion. */
  value: number;
  /** Smallest readable pixel size for this span. */
  minPx: number;
  /** Largest pixel size that fits the canvas for this span. */
  maxPx: number;
};

export type ResolvedSpans = {
  horizontalPx: number;
  verticalPx: number;
};

function clamp(value: number, min: number, max: number): number {
  return Math.min(Math.max(value, min), max);
}

/**
 * Resolve two physical spans into pixel sizes that preserve their
 * relative proportion when possible.
 *
 * One span always fills its max (the canvas-binding axis); the other
 * scales proportionally, clamped to its own min/max so extreme ratios
 * (e.g. a 1" mark on a 40" stub) never collapse below readability.
 *
 * Non-positive values cannot drive proportion; that span falls back to
 * its max (matching the legacy fixed-size drawing).
 */
export function resolveProportionalSpans(
  horizontal: ProportionalSpan,
  vertical: ProportionalSpan,
): ResolvedSpans {
  const hasHorizontal = horizontal.value > 0;
  const hasVertical = vertical.value > 0;

  if (!hasHorizontal || !hasVertical) {
    return { horizontalPx: horizontal.maxPx, verticalPx: vertical.maxPx };
  }

  const scale = Math.min(
    horizontal.maxPx / horizontal.value,
    vertical.maxPx / vertical.value,
  );

  return {
    horizontalPx: clamp(horizontal.value * scale, horizontal.minPx, horizontal.maxPx),
    verticalPx: clamp(vertical.value * scale, vertical.minPx, vertical.maxPx),
  };
}
