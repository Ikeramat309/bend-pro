/**
 * Layout math for the VERTICAL offset pipe diagram.
 *
 * The conduit runs bottom-to-top (the long phone axis). The offset is a
 * sideways jog: a lower vertical run, a diagonal at the bend angle, then an
 * upper vertical run. "Distance between bends" is measured along the diagonal;
 * "offset height" is the horizontal shift between the two runs.
 *
 * SVG y grows downward, so "up" means decreasing y.
 */
export const OFFSET_DIAGRAM_LAYOUT = {
  /** x of the lower vertical run. */
  leftX: 104,
  /** Top end of the upper run (small y). */
  topY: 48,
  /** Bottom end of the lower run (large y). */
  bottomY: 392,
  /** Max vertical advance of the diagonal. */
  dyMax: 150,
  /** Horizontal jog clamps. */
  shiftMax: 112,
  shiftMin: 22,
  cornerR: 18,
  /** Lower-run length (bottom → first bend) clamps. */
  lowerRunDefault: 70,
  lowerRunMin: 46,
  lowerRunMax: 150,
  dimOffset: 26,
} as const;

export type OffsetDiagramGeometryInput = {
  bendAngleDeg: number;
  distanceBetweenBendsInches: number;
  mark1Inches?: number;
};

export type OffsetDiagramGeometry = {
  /** Horizontal jog between the two runs (offset height, px). */
  shift: number;
  /** Vertical advance of the diagonal (px). */
  dy: number;
  /** Lower bend point. */
  x1: number;
  y1: number;
  /** Upper bend point. */
  x2: number;
  y2: number;
  topY: number;
  bottomY: number;
  pipePath: string;
  bendZone1: string;
  bendZone2: string;
  /** Distance-between-bends dimension endpoints (offset to the right of the diagonal). */
  dbb1: { x: number; y: number };
  dbb2: { x: number; y: number };
  dbbLabelX: number;
  dbbLabelY: number;
  /** Offset-height (horizontal) dimension band, drawn below the runs. */
  offsetDimY: number;
  offsetLabelX: number;
  offsetLabelY: number;
  /** Unit components of the diagonal: along-run (cosA, vertical) and perpendicular (sinA, horizontal). */
  cosA: number;
  sinA: number;
};

function clamp(value: number, min: number, max: number): number {
  return Math.min(Math.max(value, min), max);
}

/** Pure layout math for the vertical offset pipe diagram — no React or SVG imports. */
export function buildOffsetDiagramGeometry(
  input: OffsetDiagramGeometryInput,
): OffsetDiagramGeometry {
  const {
    leftX,
    topY,
    bottomY,
    dyMax,
    shiftMax,
    shiftMin,
    cornerR,
    lowerRunDefault,
    lowerRunMin,
    lowerRunMax,
    dimOffset,
  } = OFFSET_DIAGRAM_LAYOUT;

  const radians = (input.bendAngleDeg * Math.PI) / 180;
  const tangent = Math.tan(radians);
  // shift (horizontal offset) is the perpendicular; dy is the along-run advance.
  const shift = clamp(tangent * dyMax, shiftMin, shiftMax);
  const dy = shift / tangent;

  const diagonalPx = Math.hypot(dy, shift);
  const cosA = dy / diagonalPx; // along the run (vertical)
  const sinA = shift / diagonalPx; // perpendicular (horizontal)

  const pxPerInch = diagonalPx / input.distanceBetweenBendsInches;
  const lowerRun =
    input.mark1Inches !== undefined
      ? clamp(input.mark1Inches * pxPerInch, lowerRunMin, lowerRunMax)
      : lowerRunDefault;

  const x1 = leftX;
  const y1 = bottomY - lowerRun;
  const x2 = x1 + shift;
  const y2 = y1 - dy;

  // Corner tangent points (diagonal direction is (sinA, -cosA)).
  const d1x = x1 + cornerR * sinA;
  const d1y = y1 - cornerR * cosA;
  const d2x = x2 - cornerR * sinA;
  const d2y = y2 + cornerR * cosA;

  const pipePath = `M ${x1} ${bottomY} V ${y1 + cornerR} Q ${x1} ${y1} ${d1x} ${d1y} L ${d2x} ${d2y} Q ${x2} ${y2} ${x2} ${y2 - cornerR} V ${topY}`;
  const bendZone1 = `M ${x1} ${y1 + cornerR} Q ${x1} ${y1} ${d1x} ${d1y}`;
  const bendZone2 = `M ${d2x} ${d2y} Q ${x2} ${y2} ${x2} ${y2 - cornerR}`;

  // Distance-between-bends dimension: parallel to the diagonal, offset to the right.
  // Perpendicular (pointing right/down) of the diagonal is (cosA, sinA).
  const px = cosA;
  const py = sinA;
  const dbb1 = { x: x1 + px * dimOffset, y: y1 + py * dimOffset };
  const dbb2 = { x: x2 + px * dimOffset, y: y2 + py * dimOffset };
  const dbbLabelX = (dbb1.x + dbb2.x) / 2 + 16;
  const dbbLabelY = (dbb1.y + dbb2.y) / 2;

  // Offset-height dimension: horizontal band below the lower run.
  const offsetDimY = bottomY + 22;
  const offsetLabelX = (x1 + x2) / 2;
  const offsetLabelY = offsetDimY + 16;

  return {
    shift,
    dy,
    x1,
    y1,
    x2,
    y2,
    topY,
    bottomY,
    pipePath,
    bendZone1,
    bendZone2,
    dbb1,
    dbb2,
    dbbLabelX,
    dbbLabelY,
    offsetDimY,
    offsetLabelX,
    offsetLabelY,
    cosA,
    sinA,
  };
}

/** Ghost (empty-state) vertical pipe with a soft jog. */
export const OFFSET_GHOST_PIPE = 'M 104 392 V 250 Q 104 232 120 222 L 200 170 Q 216 160 216 142 V 48';
