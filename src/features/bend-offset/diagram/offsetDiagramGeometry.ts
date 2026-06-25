/** Layout constants for the offset diagram canvas. */
export const OFFSET_DIAGRAM_LAYOUT = {
  startX: 24,
  endX: 336,
  bottomY: 230,
  dxMax: 150,
  riseMax: 104,
  riseMin: 20,
  cornerR: 18,
  leftRunDefault: 64,
  leftRunMin: 44,
  leftRunMax: 110,
  dimOffset: 24,
} as const;

export type OffsetDiagramGeometryInput = {
  bendAngleDeg: number;
  distanceBetweenBendsInches: number;
  mark1Inches?: number;
};

export type OffsetDiagramGeometry = {
  rise: number;
  dx: number;
  topY: number;
  x1: number;
  x2: number;
  pipePath: string;
  bendZone1: string;
  bendZone2: string;
  dbb1: { x: number; y: number };
  dbb2: { x: number; y: number };
  dbbLabelX: number;
  dbbLabelY: number;
  offsetMidY: number;
  cosA: number;
  sinA: number;
};

function clamp(value: number, min: number, max: number): number {
  return Math.min(Math.max(value, min), max);
}

/** Pure layout math for the offset pipe diagram — no React or SVG imports. */
export function buildOffsetDiagramGeometry(
  input: OffsetDiagramGeometryInput,
): OffsetDiagramGeometry {
  const {
    startX,
    endX,
    bottomY,
    dxMax,
    riseMax,
    riseMin,
    cornerR,
    leftRunDefault,
    leftRunMin,
    leftRunMax,
    dimOffset,
  } = OFFSET_DIAGRAM_LAYOUT;

  const radians = (input.bendAngleDeg * Math.PI) / 180;
  const tangent = Math.tan(radians);
  const rise = clamp(tangent * dxMax, riseMin, riseMax);
  const dx = rise / tangent;
  const topY = bottomY - rise;

  const diagonalPx = Math.hypot(dx, rise);
  const cosA = dx / diagonalPx;
  const sinA = rise / diagonalPx;

  const pxPerInch = diagonalPx / input.distanceBetweenBendsInches;
  const leftRun =
    input.mark1Inches !== undefined
      ? clamp(input.mark1Inches * pxPerInch, leftRunMin, leftRunMax)
      : leftRunDefault;

  const x1 = startX + leftRun;
  const x2 = x1 + dx;
  const p1x = x1 + cornerR * cosA;
  const p1y = bottomY - cornerR * sinA;
  const p2x = x2 - cornerR * cosA;
  const p2y = topY + cornerR * sinA;

  const pipePath = `M ${startX} ${bottomY} H ${x1 - cornerR} Q ${x1} ${bottomY} ${p1x} ${p1y} L ${p2x} ${p2y} Q ${x2} ${topY} ${x2 + cornerR} ${topY} H ${endX}`;
  const bendZone1 = `M ${x1 - cornerR} ${bottomY} Q ${x1} ${bottomY} ${p1x} ${p1y}`;
  const bendZone2 = `M ${p2x} ${p2y} Q ${x2} ${topY} ${x2 + cornerR} ${topY}`;

  const nx = sinA;
  const ny = cosA;
  const dbb1 = { x: x1 + nx * dimOffset, y: bottomY + ny * dimOffset };
  const dbb2 = { x: x2 + nx * dimOffset, y: topY + ny * dimOffset };
  const dbbLabelX = (dbb1.x + dbb2.x) / 2 + 26;
  const dbbLabelY = (dbb1.y + dbb2.y) / 2 + 18;

  return {
    rise,
    dx,
    topY,
    x1,
    x2,
    pipePath,
    bendZone1,
    bendZone2,
    dbb1,
    dbb2,
    dbbLabelX,
    dbbLabelY,
    offsetMidY: (bottomY + topY) / 2,
    cosA,
    sinA,
  };
}

export const OFFSET_GHOST_PIPE = 'M 24 230 H 88 L 192 126 H 336';
