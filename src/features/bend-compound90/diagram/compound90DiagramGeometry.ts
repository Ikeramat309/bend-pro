import type { Compound90Shape } from '../engine/compound90.types';

export const COMPOUND90_DIAGRAM_LAYOUT = {
  startX: 18,
  baseY: 226,
  firstCornerX: 100,
  secondCornerX: 265,
  secondCornerY: 61,
  endY: 18,
  cornerRadius: 15,
} as const;

export type Compound90DiagramGeometry = {
  pipePath: string;
  firstBendPath: string;
  secondBendPath: string;
  diagonalStart: { x: number; y: number };
  diagonalEnd: { x: number; y: number };
  firstMark: { x: number; y: number; rotation: number };
  secondMark: { x: number; y: number; rotation: number };
  obstruction: {
    kind: Compound90Shape;
    x: number;
    y: number;
    width: number;
    height: number;
    radius?: number;
    clearancePixels: number;
  };
};

function clamp(value: number, min: number, max: number): number {
  return Math.min(Math.max(value, min), max);
}

function quadraticMidpoint(start: { x: number; y: number }, control: { x: number; y: number }, end: { x: number; y: number }) {
  return {
    x: start.x * 0.25 + control.x * 0.5 + end.x * 0.25,
    y: start.y * 0.25 + control.y * 0.5 + end.y * 0.25,
  };
}

export function buildCompound90DiagramGeometry(input: {
  shape: Compound90Shape;
  primaryDimensionInches: number;
  secondaryDimensionInches?: number;
  clearanceInches?: number;
}): Compound90DiagramGeometry {
  const l = COMPOUND90_DIAGRAM_LAYOUT;
  const r = l.cornerRadius;
  const c = Math.SQRT1_2;
  const firstArcStart = { x: l.firstCornerX - r, y: l.baseY };
  const diagonalStart = {
    x: l.firstCornerX + r * c,
    y: l.baseY - r * c,
  };
  const diagonalEnd = {
    x: l.secondCornerX - r * c,
    y: l.secondCornerY + r * c,
  };
  const secondArcEnd = { x: l.secondCornerX, y: l.secondCornerY - r };
  const firstMark = quadraticMidpoint(
    firstArcStart,
    { x: l.firstCornerX, y: l.baseY },
    diagonalStart,
  );
  const secondMark = quadraticMidpoint(
    diagonalEnd,
    { x: l.secondCornerX, y: l.secondCornerY },
    secondArcEnd,
  );
  const pipePath =
    `M ${l.startX} ${l.baseY} H ${firstArcStart.x} ` +
    `Q ${l.firstCornerX} ${l.baseY} ${diagonalStart.x} ${diagonalStart.y} ` +
    `L ${diagonalEnd.x} ${diagonalEnd.y} ` +
    `Q ${l.secondCornerX} ${l.secondCornerY} ${secondArcEnd.x} ${secondArcEnd.y} ` +
    `V ${l.endY}`;

  const primary = clamp(input.primaryDimensionInches, 0.5, 24);
  const secondary = clamp(input.secondaryDimensionInches ?? primary, 0.5, 24);
  const scale = 3.1;
  const width = clamp(28 + secondary * scale, 36, 82);
  const height = clamp(28 + primary * scale, 36, 72);
  const centerX = 225;
  const bottom = l.baseY - 3;
  const radius = input.shape === 'circle' ? clamp(18 + primary * 2.1, 22, 38) : undefined;
  const diamondSide = input.shape === 'diamond' ? clamp(24 + primary * 3, 34, 58) : undefined;
  const objectWidth = diamondSide ?? (radius !== undefined ? radius * 2 : width);
  const objectHeight = diamondSide ?? (radius !== undefined ? radius * 2 : height);
  const centerY =
    input.shape === 'diamond' && diamondSide !== undefined
      ? bottom - diamondSide * Math.SQRT1_2
      : bottom - objectHeight / 2;
  const clearancePixels = clamp((input.clearanceInches ?? 0) * 2.4, 0, 13);

  return {
    pipePath,
    firstBendPath: `M ${firstArcStart.x} ${firstArcStart.y} Q ${l.firstCornerX} ${l.baseY} ${diagonalStart.x} ${diagonalStart.y}`,
    secondBendPath: `M ${diagonalEnd.x} ${diagonalEnd.y} Q ${l.secondCornerX} ${l.secondCornerY} ${secondArcEnd.x} ${secondArcEnd.y}`,
    diagonalStart,
    diagonalEnd,
    firstMark: { ...firstMark, rotation: -22.5 },
    secondMark: { ...secondMark, rotation: -67.5 },
    obstruction: {
      kind: input.shape,
      x: centerX - objectWidth / 2,
      y: centerY - objectHeight / 2,
      width: objectWidth,
      height: objectHeight,
      radius,
      clearancePixels,
    },
  };
}
