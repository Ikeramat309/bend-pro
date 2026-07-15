export const SADDLE4_DIAGRAM_LAYOUT = {
  startX: 18,
  endX: 342,
  centerX: 180,
  baseY: 220,
  peakMinY: 70,
  cornerRadius: 10,
  pipeHalf: 9.5,
  /** Space below the top tube for the obstruction. */
  clearance: 15,
  /** Keeps the outer mark collars visually distinct from the open end caps. */
  minEndRun: 26,
  minHalfTop: 32,
  defaultHalfTop: 40,
} as const;

const VISUAL_OBSTRUCTION_MAX_INCHES = 4;
const VISUAL_SADDLE_WIDTH_MAX_INCHES = 10;
const OBSTRUCTION_MIN_PX = 18;
const DIAGONAL_PX_PER_INCH = 12;
const DIAGONAL_MIN_PX = 44;
const DIAGONAL_MAX_PX = 132;

export type Saddle4DiagramGeometryInput = {
  obstructionHeightInches: number;
  betweenBendsInches: number;
  saddleWidthInches?: number;
  bendAngleDeg: number;
};

export type Saddle4DiagramGeometry = {
  topY: number;
  rise: number;
  dxDiag: number;
  diagonalPx: number;
  cosA: number;
  sinA: number;
  xOL: number;
  xIL: number;
  xIR: number;
  xOR: number;
  obsHeightPx: number;
  obsWidthPx: number;
  halfTopPx: number;
  hasSaddleWidth: boolean;
  pipePath: string;
  bendOuterL: string;
  bendInnerL: string;
  bendInnerR: string;
  bendOuterR: string;
};

function clamp(value: number, min: number, max: number): number {
  return Math.min(Math.max(value, min), max);
}

/** Pure presentation geometry. It never feeds calculator values back into the engine. */
export function buildSaddle4DiagramGeometry(
  input: Saddle4DiagramGeometryInput,
): Saddle4DiagramGeometry {
  const layout = SADDLE4_DIAGRAM_LAYOUT;
  const radians = (input.bendAngleDeg * Math.PI) / 180;
  const tanA = Math.tan(radians);
  const cosA = Math.cos(radians);
  const sinA = Math.sin(radians);
  const maxRise = layout.baseY - layout.peakMinY;
  const maxHalfSpan =
    (layout.endX - layout.startX) / 2 - layout.minEndRun;

  const visualObstructionInches = Math.min(
    input.obstructionHeightInches,
    VISUAL_OBSTRUCTION_MAX_INCHES,
  );
  const requestedObsHeightPx = clamp(
    14 + visualObstructionInches * 7,
    22,
    60,
  );
  const minimumReadableRise =
    OBSTRUCTION_MIN_PX + layout.pipeHalf + layout.clearance;
  const maxHalfTopForReadableRise =
    maxHalfSpan - minimumReadableRise / tanA;

  const requestedHalfTop =
    input.saddleWidthInches !== undefined
      ? (Math.min(input.saddleWidthInches, VISUAL_SADDLE_WIDTH_MAX_INCHES) *
          DIAGONAL_PX_PER_INCH) /
        2
      : layout.defaultHalfTop;
  const halfTopPx = clamp(
    requestedHalfTop,
    layout.minHalfTop,
    Math.max(layout.minHalfTop, maxHalfTopForReadableRise),
  );

  const availableDx = maxHalfSpan - halfTopPx;
  const requestedDiagonalPx = clamp(
    input.betweenBendsInches * DIAGONAL_PX_PER_INCH,
    DIAGONAL_MIN_PX,
    DIAGONAL_MAX_PX,
  );
  const requestedRise = Math.max(
    requestedDiagonalPx * sinA,
    requestedObsHeightPx + layout.pipeHalf + layout.clearance,
  );
  const rise = Math.min(requestedRise, availableDx * tanA, maxRise);
  const dxDiag = rise / tanA;
  const diagonalPx = Math.hypot(dxDiag, rise);
  const obsHeightPx = Math.min(
    requestedObsHeightPx,
    Math.max(OBSTRUCTION_MIN_PX, rise - layout.pipeHalf - layout.clearance),
  );
  const topY = layout.baseY - rise;

  const xIL = layout.centerX - halfTopPx;
  const xIR = layout.centerX + halfTopPx;
  const xOL = xIL - dxDiag;
  const xOR = xIR + dxDiag;
  const obsWidthPx = halfTopPx * 2;
  const cx = layout.cornerRadius * cosA;
  const cy = layout.cornerRadius * sinA;

  const pipePath =
    `M ${layout.startX} ${layout.baseY} H ${xOL - layout.cornerRadius} ` +
    `Q ${xOL} ${layout.baseY} ${xOL + cx} ${layout.baseY - cy} ` +
    `L ${xIL - cx} ${topY + cy} ` +
    `Q ${xIL} ${topY} ${xIL + layout.cornerRadius} ${topY} ` +
    `H ${xIR - layout.cornerRadius} ` +
    `Q ${xIR} ${topY} ${xIR + cx} ${topY + cy} ` +
    `L ${xOR - cx} ${layout.baseY - cy} ` +
    `Q ${xOR} ${layout.baseY} ${xOR + layout.cornerRadius} ${layout.baseY} ` +
    `H ${layout.endX}`;

  return {
    topY,
    rise,
    dxDiag,
    diagonalPx,
    cosA,
    sinA,
    xOL,
    xIL,
    xIR,
    xOR,
    obsHeightPx,
    obsWidthPx,
    halfTopPx,
    hasSaddleWidth: input.saddleWidthInches !== undefined,
    pipePath,
    bendOuterL: `M ${xOL - layout.cornerRadius} ${layout.baseY} Q ${xOL} ${layout.baseY} ${xOL + cx} ${layout.baseY - cy}`,
    bendInnerL: `M ${xIL - cx} ${topY + cy} Q ${xIL} ${topY} ${xIL + layout.cornerRadius} ${topY}`,
    bendInnerR: `M ${xIR - layout.cornerRadius} ${topY} Q ${xIR} ${topY} ${xIR + cx} ${topY + cy}`,
    bendOuterR: `M ${xOR - cx} ${layout.baseY - cy} Q ${xOR} ${layout.baseY} ${xOR + layout.cornerRadius} ${layout.baseY}`,
  };
}
