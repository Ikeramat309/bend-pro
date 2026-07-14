import type { Bounds2, IsoTransform, Point2, Vec3 } from '@/shared/diagrams/iso';
import {
  applyIsoTransform,
  boundsFromPoints,
  buildEndCapCircle,
  buildFloorGrid,
  buildFloorShadow,
  buildPipeCenterline,
  fitIsoTransform,
  floorPatchCorners,
  projectIso,
} from '@/shared/diagrams/iso';

/**
 * Fixed-view isometric layout for a rolling offset.
 *
 * The real calculator values determine labels and relative component ratios.
 * World-space lengths are clamped for readability and never feed calculator
 * results back into the engine.
 */
export const ROLLING_DIAGRAM_LAYOUT = {
  leadInWorld: 13,
  leadOutWorld: 16,
  bendRadiusWorld: 4,
  displacementWorldMin: 12,
  displacementWorldMax: 18,
  diagonalRunWorldMin: 19,
  diagonalRunWorldMax: 32,
  drawnAngleMin: 20,
  drawnAngleMax: 42,
  pipeElevationWorld: 2.4,
  gridSpacingWorld: 8,
  floorMarginWorld: 7,
  viewPadding: 25,
  dbbDimOffset: 34,
  heightDimOffset: 18,
} as const;

const VIEW = { x: 0, y: 0, width: 360, height: 300 } as const;

export type RollingDiagramGeometryInput = {
  offsetHeightInches: number;
  offsetRollInches: number;
  trueOffsetInches: number;
  distanceBetweenBendsInches: number;
  bendAngleDeg: number;
};

export type RollingProjectedLine = { start: Point2; end: Point2 };

export type RollingDiagramLabel = {
  x: number;
  y: number;
  anchor: 'start' | 'middle' | 'end';
};

export type RollingDiagramGeometry = {
  waypoints: Vec3[];
  centerline: Vec3[];
  transform: IsoTransform;
  projectedPoints: Point2[];
  projectedBounds: Bounds2;
  firstMarkIndex: number;
  secondMarkIndex: number;
  firstZone: { startIndex: number; endIndex: number };
  secondZone: { startIndex: number; endIndex: number };
  floorPatch: Point2[];
  floorGrid: RollingProjectedLine[];
  floorShadow: Point2[];
  endCaps: Point2[][];
  referenceAxis: RollingProjectedLine;
  dbbDim: {
    start: Point2;
    end: Point2;
    mid: Point2;
    ext1: RollingProjectedLine;
    ext2: RollingProjectedLine;
  };
  rollDim: { start: Point2; end: Point2; mid: Point2 };
  heightDim: {
    start: Point2;
    end: Point2;
    mid: Point2;
    ext1: RollingProjectedLine;
    ext2: RollingProjectedLine;
  };
  labels: {
    dbbTitle: RollingDiagramLabel;
    dbbValue: RollingDiagramLabel;
    rollTitle: RollingDiagramLabel;
    rollValue: RollingDiagramLabel;
    heightTitle: RollingDiagramLabel;
    heightValue: RollingDiagramLabel;
    angleTitle: RollingDiagramLabel;
    angleValue: RollingDiagramLabel;
    markLegend1: RollingDiagramLabel;
    markLegend2: RollingDiagramLabel;
  };
  drawnAngleDeg: number;
};

function clamp(value: number, min: number, max: number): number {
  return Math.min(Math.max(value, min), max);
}

function midpoint(a: Point2, b: Point2): Point2 {
  return { x: (a.x + b.x) / 2, y: (a.y + b.y) / 2 };
}

function toScreen(point: Vec3, transform: IsoTransform): Point2 {
  return applyIsoTransform(projectIso(point), transform);
}

function projectLoop(points: readonly Vec3[], transform: IsoTransform): Point2[] {
  return points.map((point) => toScreen(point, transform));
}

function offsetParallel(a: Point2, b: Point2, offset: number) {
  const dx = b.x - a.x;
  const dy = b.y - a.y;
  const length = Math.hypot(dx, dy) || 1;
  const normal = { x: -dy / length, y: dx / length };
  return {
    start: { x: a.x + normal.x * offset, y: a.y + normal.y * offset },
    end: { x: b.x + normal.x * offset, y: b.y + normal.y * offset },
  };
}

/** Pure presentation geometry. Calculator math remains in rolling.engine.ts. */
export function buildRollingDiagramGeometry(
  input: RollingDiagramGeometryInput,
): RollingDiagramGeometry {
  const layout = ROLLING_DIAGRAM_LAYOUT;
  const trueOffset = Math.max(input.trueOffsetInches, 0.001);
  const drawnAngleDeg = clamp(input.bendAngleDeg, layout.drawnAngleMin, layout.drawnAngleMax);
  const drawnAngle = (drawnAngleDeg * Math.PI) / 180;
  const displacementWorld = clamp(
    10 + trueOffset * 0.45,
    layout.displacementWorldMin,
    layout.displacementWorldMax,
  );
  const heightWorld = displacementWorld * (input.offsetHeightInches / trueOffset);
  const rollWorld = displacementWorld * (input.offsetRollInches / trueOffset);
  const diagonalRunWorld = clamp(
    displacementWorld / Math.tan(drawnAngle),
    layout.diagonalRunWorldMin,
    layout.diagonalRunWorldMax,
  );
  const z = layout.pipeElevationWorld;

  const firstBendX = layout.leadInWorld;
  const secondBendX = firstBendX + diagonalRunWorld;
  const finalY = -rollWorld;
  const finalZ = z + heightWorld;

  const waypoints: Vec3[] = [
    { x: 0, y: 0, z },
    { x: firstBendX, y: 0, z },
    { x: secondBendX, y: finalY, z: finalZ },
    { x: secondBendX + layout.leadOutWorld, y: finalY, z: finalZ },
  ];

  const { points: centerline, arcs } = buildPipeCenterline(
    waypoints,
    layout.bendRadiusWorld,
    16,
  );

  const floorBounds = {
    minX: -layout.floorMarginWorld,
    maxX: waypoints[3].x + layout.floorMarginWorld,
    minY: finalY - layout.floorMarginWorld,
    maxY: layout.floorMarginWorld,
  };
  const floorWorld = floorPatchCorners(floorBounds);
  const gridWorld = buildFloorGrid(floorBounds, layout.gridSpacingWorld);
  const fitTargets = [...centerline, ...floorWorld].map(projectIso);
  const transform = fitIsoTransform(fitTargets, VIEW, layout.viewPadding);

  const projectedPoints = centerline.map((point) => toScreen(point, transform));
  const projectedBounds = boundsFromPoints(projectedPoints);
  const floorPatch = projectLoop(floorWorld, transform);
  const floorGrid = gridWorld.map((line) => ({
    start: toScreen(line.start, transform),
    end: toScreen(line.end, transform),
  }));
  const floorShadow = projectLoop(buildFloorShadow(centerline), transform);

  const firstArc = arcs.find((arc) => arc.waypointIndex === 1);
  const secondArc = arcs.find((arc) => arc.waypointIndex === 2);
  const firstMarkIndex = firstArc?.startIndex ?? 1;
  const secondMarkIndex = secondArc?.startIndex ?? Math.max(centerline.length - 4, 0);
  const firstMark = projectedPoints[firstMarkIndex];
  const secondMark = projectedPoints[secondMarkIndex];

  const dbbLine = offsetParallel(firstMark, secondMark, -layout.dbbDimOffset);
  const dbbMid = midpoint(dbbLine.start, dbbLine.end);
  const dbbDim = {
    start: dbbLine.start,
    end: dbbLine.end,
    mid: dbbMid,
    ext1: { start: firstMark, end: dbbLine.start },
    ext2: { start: secondMark, end: dbbLine.end },
  };

  // Put the component dimensions at the free end of the pipe, away from both
  // bend marks. The dashed reference axis shows the path with no roll; roll
  // closes laterally first, then height closes vertically to the final run.
  const referenceStartWorld: Vec3 = { x: firstBendX, y: 0, z };
  const referenceEndWorld: Vec3 = { x: waypoints[3].x, y: 0, z };
  const rolledBaseWorld: Vec3 = { x: waypoints[3].x, y: finalY, z };
  const referenceAxis = {
    start: toScreen(referenceStartWorld, transform),
    end: toScreen(referenceEndWorld, transform),
  };
  const rollStart = toScreen(referenceEndWorld, transform);
  const rollEnd = toScreen(rolledBaseWorld, transform);
  const heightSourceStart = rollEnd;
  const heightSourceEnd = toScreen(waypoints[3], transform);
  const heightStart = {
    x: heightSourceStart.x + layout.heightDimOffset,
    y: heightSourceStart.y,
  };
  const heightEnd = {
    x: heightSourceEnd.x + layout.heightDimOffset,
    y: heightSourceEnd.y,
  };
  const rollDim = { start: rollStart, end: rollEnd, mid: midpoint(rollStart, rollEnd) };
  const heightDim = {
    start: heightStart,
    end: heightEnd,
    mid: midpoint(heightStart, heightEnd),
    ext1: { start: heightSourceStart, end: heightStart },
    ext2: { start: heightSourceEnd, end: heightEnd },
  };

  const capRadiusWorld = 9.5 / Math.max(transform.scale, 0.001);
  const endCaps = [
    projectLoop(buildEndCapCircle(waypoints[0], { x: 1, y: 0, z: 0 }, capRadiusWorld), transform),
    projectLoop(buildEndCapCircle(waypoints[3], { x: 1, y: 0, z: 0 }, capRadiusWorld), transform),
  ];

  const dbbLabelX = clamp(dbbMid.x, 78, 282);
  const dbbTitleY = clamp(dbbMid.y - 27, 16, 220);
  const rollLabelX = clamp(rollDim.mid.x, 54, 306);
  const rollTitleY = clamp(Math.max(rollDim.start.y, rollDim.end.y) + 18, 44, 252);
  const heightLabelX = clamp(heightDim.mid.x + 10, 82, 318);
  const heightTitleY = clamp(heightDim.mid.y - 7, 34, 236);
  const angleLabelX = clamp(firstMark.x - 18, 68, 318);
  const angleTitleY = clamp(firstMark.y + 35, 60, 236);

  return {
    waypoints,
    centerline,
    transform,
    projectedPoints,
    projectedBounds,
    firstMarkIndex,
    secondMarkIndex,
    firstZone: firstArc
      ? { startIndex: firstArc.startIndex, endIndex: firstArc.endIndex }
      : { startIndex: firstMarkIndex, endIndex: Math.min(firstMarkIndex + 4, centerline.length - 1) },
    secondZone: secondArc
      ? { startIndex: secondArc.startIndex, endIndex: secondArc.endIndex }
      : { startIndex: secondMarkIndex, endIndex: Math.min(secondMarkIndex + 4, centerline.length - 1) },
    floorPatch,
    floorGrid,
    floorShadow,
    endCaps,
    referenceAxis,
    dbbDim,
    rollDim,
    heightDim,
    labels: {
      dbbTitle: { x: dbbLabelX, y: dbbTitleY, anchor: 'middle' },
      dbbValue: { x: dbbLabelX, y: dbbTitleY + 15, anchor: 'middle' },
      rollTitle: { x: rollLabelX, y: rollTitleY, anchor: 'middle' },
      rollValue: { x: rollLabelX, y: rollTitleY + 15, anchor: 'middle' },
      heightTitle: { x: heightLabelX, y: heightTitleY, anchor: 'start' },
      heightValue: { x: heightLabelX, y: heightTitleY + 15, anchor: 'start' },
      angleTitle: { x: angleLabelX, y: angleTitleY, anchor: 'end' },
      angleValue: { x: angleLabelX, y: angleTitleY + 15, anchor: 'end' },
      markLegend1: { x: 14, y: 252, anchor: 'start' },
      markLegend2: { x: 14, y: 268, anchor: 'start' },
    },
    drawnAngleDeg,
  };
}

export const ROLLING_GHOST_GEOMETRY = buildRollingDiagramGeometry({
  offsetHeightInches: 6,
  offsetRollInches: 8,
  trueOffsetInches: 10,
  distanceBetweenBendsInches: 20,
  bendAngleDeg: 30,
});
