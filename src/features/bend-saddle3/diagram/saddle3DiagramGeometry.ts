export const SADDLE3_DIAGRAM_LAYOUT = {
  startX: 24,
  endX: 336,
  centerX: 180,
  baseY: 228,
  pxPerInch: 16,
  obsHeightMin: 22,
  diagramObsMaxIn: 4,
  peakMinY: 72,
  pipeHalf: 6,
  clearancePx: 14,
  maxHalfSpan: 128,
  minFlat: 36,
  cornerR: 10,
  diagMin: 40,
  diagMax: 128,
} as const;

export type Saddle3DiagramGeometry = {
  rise: number;
  dx: number;
  peakY: number;
  x1: number;
  x2: number;
  obsRadius: number;
  pipePath: string;
  bendLeft: string;
  bendCenter: string;
  bendRight: string;
};

function clamp(value: number, min: number, max: number): number {
  return Math.min(Math.max(value, min), max);
}

/** Cap diagram inputs so large field values do not break layout. */
export function capSaddle3DiagramInputs(
  obstructionHeightInches: number,
  centerToSideInches: number,
): { visualObsIn: number; visualCenterToSide: number } {
  const { diagramObsMaxIn } = SADDLE3_DIAGRAM_LAYOUT;
  const visualObsIn = Math.min(obstructionHeightInches, diagramObsMaxIn);
  const centerToSideRatio =
    obstructionHeightInches > 0 ? centerToSideInches / obstructionHeightInches : 0;
  return {
    visualObsIn,
    visualCenterToSide: visualObsIn * centerToSideRatio,
  };
}

/** Pure layout math for the 3-point saddle pipe diagram. */
export function buildSaddle3DiagramGeometry(
  visualObsIn: number,
  visualCenterToSide: number,
  sideAngleDeg: number,
): Saddle3DiagramGeometry {
  const {
    startX,
    endX,
    centerX,
    baseY,
    pxPerInch,
    obsHeightMin,
    peakMinY,
    pipeHalf,
    clearancePx,
    maxHalfSpan,
    minFlat,
    cornerR,
    diagMin,
    diagMax,
  } = SADDLE3_DIAGRAM_LAYOUT;

  const maxRise = baseY - peakMinY;
  const radians = (sideAngleDeg * Math.PI) / 180;
  const tan = Math.tan(radians);
  const cosA = Math.cos(radians);
  const sinA = Math.sin(radians);

  const maxObsHeightPx = maxRise - clearancePx - pipeHalf - 10;
  let obsHeightPx = clamp(visualObsIn * pxPerInch, obsHeightMin, maxObsHeightPx);
  let obsRadius = obsHeightPx / 2;
  let minRise = obsHeightPx + clearancePx + pipeHalf;

  if (minRise > maxRise) {
    obsHeightPx = maxRise - clearancePx - pipeHalf - 10;
    obsRadius = obsHeightPx / 2;
    minRise = obsHeightPx + clearancePx + pipeHalf;
  }

  let diagonalPx = clamp(visualCenterToSide * pxPerInch, diagMin, diagMax);
  let rise = diagonalPx * sinA;
  rise = clamp(Math.max(rise, minRise), minRise, maxRise);
  let dx = rise / tan;

  const maxDx = maxHalfSpan - minFlat;
  if (dx > maxDx) {
    dx = maxDx;
    rise = clamp(dx * tan, minRise, maxRise);
  }

  if (rise < minRise) {
    rise = Math.min(minRise, maxRise);
    dx = Math.min(rise / tan, maxDx);
  }

  const peakY = baseY - rise;
  const x1 = centerX - dx;
  const x2 = centerX + dx;

  const cx = cornerR * cosA;
  const cy = cornerR * sinA;
  const a1x = x1 - cornerR;
  const b1x = x1 + cx;
  const b1y = baseY - cy;
  const c1x = centerX - cx;
  const c1y = peakY + cy;
  const c2x = centerX + cx;
  const c2y = peakY + cy;
  const d1x = x2 - cx;
  const d1y = baseY - cy;
  const d2x = x2 + cornerR;

  const pipePath =
    `M ${startX} ${baseY} H ${a1x} ` +
    `Q ${x1} ${baseY} ${b1x} ${b1y} ` +
    `L ${c1x} ${c1y} ` +
    `Q ${centerX} ${peakY} ${c2x} ${c2y} ` +
    `L ${d1x} ${d1y} ` +
    `Q ${x2} ${baseY} ${d2x} ${baseY} ` +
    `H ${endX}`;

  return {
    rise,
    dx,
    peakY,
    x1,
    x2,
    obsRadius,
    pipePath,
    bendLeft: `M ${a1x} ${baseY} Q ${x1} ${baseY} ${b1x} ${b1y}`,
    bendCenter: `M ${c1x} ${c1y} Q ${centerX} ${peakY} ${c2x} ${c2y}`,
    bendRight: `M ${d1x} ${d1y} Q ${x2} ${baseY} ${d2x} ${baseY}`,
  };
}
