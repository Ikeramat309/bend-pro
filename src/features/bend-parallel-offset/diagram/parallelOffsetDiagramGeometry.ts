import type { ParallelOffsetMode, ParallelOffsetShiftDirection } from '../engine/parallelOffset.types';

export const PARALLEL_OFFSET_DIAGRAM_LAYOUT = {
  startX: 8,
  endX: 352,
  topLimit: 46,
  bottomLimit: 244,
  bendRadius: 9,
  diagonalLength: 82,
  pipeHalf: 7.5,
} as const;

export type ParallelOffsetDiagramGeometryInput = {
  mode: ParallelOffsetMode;
  bendAngleDeg: number;
  conduitCount: number;
  shiftDirection: ParallelOffsetShiftDirection;
};

export type ParallelOffsetPipeGeometry = {
  conduitNumber: number;
  y: number;
  topY: number;
  x1: number;
  x2: number;
  mark1: { x: number; y: number };
  mark2: { x: number; y: number };
  pipePath: string;
  bendZone1: string;
  bendZone2: string;
};

export type ParallelOffsetDiagramGeometry = {
  rackGap: number;
  visualShiftPerConduit: number;
  directionSign: -1 | 1;
  rise: number;
  run: number;
  pipes: readonly ParallelOffsetPipeGeometry[];
};

function clamp(value: number, min: number, max: number): number {
  return Math.min(Math.max(value, min), max);
}

/** Pure presentation geometry; engine values never depend on this layout. */
export function buildParallelOffsetDiagramGeometry(
  input: ParallelOffsetDiagramGeometryInput,
): ParallelOffsetDiagramGeometry {
  const layout = PARALLEL_OFFSET_DIAGRAM_LAYOUT;
  const count = input.mode === 'simple' ? 3 : clamp(Math.trunc(input.conduitCount), 2, 8);
  const radians = (input.bendAngleDeg * Math.PI) / 180;
  const sinA = Math.sin(radians);
  const cosA = Math.cos(radians);
  const rackGap = clamp(112 / Math.max(count - 1, 1), 16, 29);
  const visualShiftPerConduit = rackGap * Math.tan(radians / 2);
  const directionSign: -1 | 1 = input.shiftDirection === 'toward-free-end' ? -1 : 1;
  const rise = layout.diagonalLength * sinA;
  const run = layout.diagonalLength * cosA;
  const baseY = directionSign === -1 ? layout.bottomLimit : layout.topLimit + rise;
  const baseX1 = directionSign === -1 ? 112 : 54;
  const radiusX = layout.bendRadius * cosA;
  const radiusY = layout.bendRadius * sinA;

  const pipes = Array.from({ length: count }, (_, index): ParallelOffsetPipeGeometry => {
    const rowShift = directionSign * index;
    const y = baseY + rowShift * rackGap;
    const topY = y - rise;
    const x1 = baseX1 + rowShift * visualShiftPerConduit;
    const x2 = x1 + run;
    const pipePath =
      `M ${layout.startX} ${y} H ${x1 - layout.bendRadius} ` +
      `Q ${x1} ${y} ${x1 + radiusX} ${y - radiusY} ` +
      `L ${x2 - radiusX} ${topY + radiusY} ` +
      `Q ${x2} ${topY} ${x2 + layout.bendRadius} ${topY} ` +
      `H ${layout.endX}`;

    return {
      conduitNumber: index + 1,
      y,
      topY,
      x1,
      x2,
      mark1: { x: x1, y },
      mark2: { x: x2, y: topY },
      pipePath,
      bendZone1: `M ${x1 - layout.bendRadius} ${y} Q ${x1} ${y} ${x1 + radiusX} ${y - radiusY}`,
      bendZone2: `M ${x2 - radiusX} ${topY + radiusY} Q ${x2} ${topY} ${x2 + layout.bendRadius} ${topY}`,
    };
  });

  return { rackGap, visualShiftPerConduit, directionSign, rise, run, pipes };
}

