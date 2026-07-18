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

export const MATCHING_OFFSET_DIAGRAM_LAYOUT = {
  view: { x: 0, y: 0, width: 360, height: 300 },
  sceneView: { x: 72, y: 54, width: 216, height: 174 },
  leadInWorld: 10,
  tailWorld: 10,
  conduitSeparationWorld: 8,
  baseElevationWorld: 2.4,
  bendRadiusWorld: 3.2,
  minimumDrawnAngle: 8,
  maximumDrawnAngle: 45,
  minimumAdjacentWorld: 15,
  maximumAdjacentWorld: 21,
  minimumRiseWorld: 3.5,
  maximumRiseWorld: 17,
  floorMarginWorld: 5,
  floorGridWorld: 7,
  centerDistanceOffset: 25,
} as const;

export type MatchingOffsetDiagramGeometryInput = {
  offsetHeightInches: number;
  distanceBetweenBendsInches: number;
  adjacentInches: number;
  bendAngleDegrees: number;
};

export type MatchingOffsetDiagramLabel = {
  x: number;
  y: number;
  anchor: 'start' | 'middle' | 'end';
};

export type ProjectedLine = { start: Point2; end: Point2 };

export type MatchingOffsetDiagramGeometry = {
  transform: IsoTransform;
  referenceCenterline: Vec3[];
  matchingCenterline: Vec3[];
  referenceProjected: Point2[];
  matchingProjected: Point2[];
  projectedBounds: Bounds2;
  referenceZones: readonly { startIndex: number; endIndex: number }[];
  matchingZones: readonly { startIndex: number; endIndex: number }[];
  referenceCenterIndices: readonly [number, number];
  matchingCenterIndices: readonly [number, number];
  centerGuides: readonly [ProjectedLine, ProjectedLine];
  distanceBetweenBendsDimension: {
    start: Point2;
    end: Point2;
    extension1: ProjectedLine;
    extension2: ProjectedLine;
  };
  adjacentDimension: ProjectedLine;
  heightDimension: ProjectedLine;
  floorPatch: Point2[];
  floorGrid: ProjectedLine[];
  floorShadows: readonly [Point2[], Point2[]];
  referenceEndCaps: Point2[][];
  matchingEndCaps: Point2[][];
  labels: {
    distanceBetweenBends: MatchingOffsetDiagramLabel;
    bendAngle: MatchingOffsetDiagramLabel;
    offsetHeight: MatchingOffsetDiagramLabel;
    adjacent: MatchingOffsetDiagramLabel;
    reference: MatchingOffsetDiagramLabel;
    matching: MatchingOffsetDiagramLabel;
  };
  drawnAngleDegrees: number;
};

function clamp(value: number, min: number, max: number): number {
  return Math.min(Math.max(value, min), max);
}

function project(point: Vec3, transform: IsoTransform): Point2 {
  return applyIsoTransform(projectIso(point), transform);
}

function projectLoop(points: readonly Vec3[], transform: IsoTransform): Point2[] {
  return points.map((point) => project(point, transform));
}

function midpointIndex(startIndex: number, endIndex: number): number {
  return Math.round((startIndex + endIndex) / 2);
}

function offsetParallel(a: Point2, b: Point2, offset: number): ProjectedLine {
  const dx = b.x - a.x;
  const dy = b.y - a.y;
  const length = Math.hypot(dx, dy) || 1;
  const normal = { x: -dy / length, y: dx / length };
  return {
    start: { x: a.x + normal.x * offset, y: a.y + normal.y * offset },
    end: { x: b.x + normal.x * offset, y: b.y + normal.y * offset },
  };
}

/**
 * Pure presentation geometry for two matching conduit centerlines. The pipes
 * occupy separate Y planes, while corresponding bend centers remain aligned
 * along the run. Real measurements stay in labels; display spans are clamped.
 */
export function buildMatchingOffsetDiagramGeometry(
  input: MatchingOffsetDiagramGeometryInput,
): MatchingOffsetDiagramGeometry {
  const layout = MATCHING_OFFSET_DIAGRAM_LAYOUT;
  const safeAngle = Number.isFinite(input.bendAngleDegrees)
    ? input.bendAngleDegrees
    : 30;
  const safeDistance =
    Number.isFinite(input.distanceBetweenBendsInches) &&
    input.distanceBetweenBendsInches > 0
      ? input.distanceBetweenBendsInches
      : 12;
  const drawnAngleDegrees = clamp(
    safeAngle,
    layout.minimumDrawnAngle,
    layout.maximumDrawnAngle,
  );
  const drawnAngleRadians = (drawnAngleDegrees * Math.PI) / 180;
  const adjacentWorld = clamp(
    layout.minimumAdjacentWorld + Math.log10(safeDistance + 1) * 2.1,
    layout.minimumAdjacentWorld,
    layout.maximumAdjacentWorld,
  );
  const riseWorld = clamp(
    adjacentWorld * Math.tan(drawnAngleRadians),
    layout.minimumRiseWorld,
    layout.maximumRiseWorld,
  );
  const runEndX = layout.leadInWorld + adjacentWorld;
  const pipeEndX = runEndX + layout.tailWorld;
  const referenceY = layout.conduitSeparationWorld / 2;
  const matchingY = -layout.conduitSeparationWorld / 2;
  const baseZ = layout.baseElevationWorld;

  const waypointsFor = (y: number): Vec3[] => [
    { x: 0, y, z: baseZ },
    { x: layout.leadInWorld, y, z: baseZ },
    { x: runEndX, y, z: baseZ + riseWorld },
    { x: pipeEndX, y, z: baseZ + riseWorld },
  ];

  const referencePipe = buildPipeCenterline(
    waypointsFor(referenceY),
    layout.bendRadiusWorld,
    14,
  );
  const matchingPipe = buildPipeCenterline(
    waypointsFor(matchingY),
    layout.bendRadiusWorld,
    14,
  );

  const floorBounds = {
    minX: -layout.floorMarginWorld,
    maxX: pipeEndX + layout.floorMarginWorld,
    minY: matchingY - layout.floorMarginWorld,
    maxY: referenceY + layout.floorMarginWorld,
  };
  const floorWorld = floorPatchCorners(floorBounds);
  const fitPoints = [
    ...referencePipe.points,
    ...matchingPipe.points,
    ...floorWorld,
  ].map(projectIso);
  const transform = fitIsoTransform(fitPoints, layout.sceneView, 5);
  const referenceProjected = projectLoop(referencePipe.points, transform);
  const matchingProjected = projectLoop(matchingPipe.points, transform);
  const projectedBounds = boundsFromPoints([...referenceProjected, ...matchingProjected]);

  const referenceZones = referencePipe.arcs.map((arc) => ({
    startIndex: arc.startIndex,
    endIndex: arc.endIndex,
  }));
  const matchingZones = matchingPipe.arcs.map((arc) => ({
    startIndex: arc.startIndex,
    endIndex: arc.endIndex,
  }));
  const referenceCenterIndices = [
    midpointIndex(referencePipe.arcs[0].startIndex, referencePipe.arcs[0].endIndex),
    midpointIndex(referencePipe.arcs[1].startIndex, referencePipe.arcs[1].endIndex),
  ] as const;
  const matchingCenterIndices = [
    midpointIndex(matchingPipe.arcs[0].startIndex, matchingPipe.arcs[0].endIndex),
    midpointIndex(matchingPipe.arcs[1].startIndex, matchingPipe.arcs[1].endIndex),
  ] as const;
  const referenceCenters = referenceCenterIndices.map(
    (index) => referenceProjected[index],
  ) as [Point2, Point2];
  const matchingCenters = matchingCenterIndices.map(
    (index) => matchingProjected[index],
  ) as [Point2, Point2];
  const centerGuides = [
    { start: referenceCenters[0], end: matchingCenters[0] },
    { start: referenceCenters[1], end: matchingCenters[1] },
  ] as const;

  const centerDistanceLine = offsetParallel(
    matchingCenters[0],
    matchingCenters[1],
    -layout.centerDistanceOffset,
  );
  const adjacentDimension = {
    start: project({ x: layout.leadInWorld, y: matchingY, z: 0 }, transform),
    end: project({ x: runEndX, y: matchingY, z: 0 }, transform),
  };
  const heightDimension = {
    start: project({ x: runEndX + 2.5, y: matchingY, z: baseZ }, transform),
    end: project(
      { x: runEndX + 2.5, y: matchingY, z: baseZ + riseWorld },
      transform,
    ),
  };

  const capRadiusWorld = 9.5 / Math.max(transform.scale, 1e-6);
  const endCapsFor = (y: number): Point2[][] => [
    projectLoop(
      buildEndCapCircle({ x: 0, y, z: baseZ }, { x: 1, y: 0, z: 0 }, capRadiusWorld),
      transform,
    ),
    projectLoop(
      buildEndCapCircle(
        { x: pipeEndX, y, z: baseZ + riseWorld },
        { x: 1, y: 0, z: 0 },
        capRadiusWorld,
      ),
      transform,
    ),
  ];

  return {
    transform,
    referenceCenterline: referencePipe.points,
    matchingCenterline: matchingPipe.points,
    referenceProjected,
    matchingProjected,
    projectedBounds,
    referenceZones,
    matchingZones,
    referenceCenterIndices,
    matchingCenterIndices,
    centerGuides,
    distanceBetweenBendsDimension: {
      start: centerDistanceLine.start,
      end: centerDistanceLine.end,
      extension1: { start: matchingCenters[0], end: centerDistanceLine.start },
      extension2: { start: matchingCenters[1], end: centerDistanceLine.end },
    },
    adjacentDimension,
    heightDimension,
    floorPatch: projectLoop(floorWorld, transform),
    floorGrid: buildFloorGrid(floorBounds, layout.floorGridWorld).map((line) => ({
      start: project(line.start, transform),
      end: project(line.end, transform),
    })),
    floorShadows: [
      projectLoop(buildFloorShadow(referencePipe.points), transform),
      projectLoop(buildFloorShadow(matchingPipe.points), transform),
    ],
    referenceEndCaps: endCapsFor(referenceY),
    matchingEndCaps: endCapsFor(matchingY),
    labels: {
      distanceBetweenBends: { x: 188, y: 18, anchor: 'middle' },
      bendAngle: { x: 18, y: 40, anchor: 'start' },
      offsetHeight: { x: 348, y: 105, anchor: 'end' },
      adjacent: { x: 180, y: 251, anchor: 'middle' },
      reference: { x: 18, y: 188, anchor: 'start' },
      matching: { x: 18, y: 210, anchor: 'start' },
    },
    drawnAngleDegrees,
  };
}

export const MATCHING_OFFSET_GHOST_GEOMETRY = buildMatchingOffsetDiagramGeometry({
  offsetHeightInches: 6,
  distanceBetweenBendsInches: 12,
  adjacentInches: 6 * Math.sqrt(3),
  bendAngleDegrees: 30,
});
