import type { Bounds2, IsoTransform, Point2, Vec3 } from '@/shared/diagrams/iso';
import {
  applyIsoTransform,
  boundsFromPoints,
  buildAngleArcOnFloor,
  buildEndCapCircle,
  buildFloorGrid,
  buildFloorShadow,
  buildPipeCenterline,
  fitIsoTransform,
  floorPatchCorners,
  projectIso,
} from '@/shared/diagrams/iso';

/**
 * Layout constants for the Kick 90 isometric diagram.
 *
 * Fixed instructional schematic: the scene is semi-proportional inside tight
 * clamps so it always reads the same way — a run resting on the floor plane,
 * a shallow kick pushing the run laterally across the floor, and the 90° stub
 * rising vertically. Real values live in labels, not pixels.
 *
 * World axes: X = along the run, Y = lateral depth, Z = up. The floor is
 * z = 0; the pipe centerline sits one tube radius above it so the cast
 * shadow separates and the scene reads 3D.
 */
export const KICK90_DIAGRAM_LAYOUT = {
  /** Straight run before the kick mark, world units. */
  leadInWorld: 13,
  /** Vertical stub height, world units. */
  stubHeightWorld: 26,
  /** Fillet radius for both bends (display only). */
  bendRadiusWorld: 4.5,
  /** Kicked-section length between the two bends, world units. */
  dbbWorldMin: 16,
  dbbWorldMax: 22,
  /** Drawn kick angle clamp, degrees — keeps the jog readable in iso. */
  drawnAngleMin: 22,
  drawnAngleMax: 40,
  /** Pipe centerline elevation above the floor (≈ tube radius). */
  pipeElevationWorld: 2.4,
  /** Floor grid spacing, world units. */
  gridSpacingWorld: 8,
  /** Floor patch margin around the pipe footprint. */
  floorMarginWorld: 7,
  /** On-floor angle-arc radius at the kick vertex. */
  angleArcRadiusWorld: 7.5,
  viewPadding: 30,
  /** Screen-space offset of the distance dimension above the kicked section. */
  dbbDimOffset: 30,
} as const;

const VIEW = { x: 0, y: 0, width: 360, height: 300 } as const;

export type Kick90DiagramGeometryInput = {
  bendAngleDeg: number;
  kickRiseInches: number;
  distanceBetweenBendsInches: number;
  mark1Inches?: number;
};

export type DiagramTextAnchor = 'start' | 'middle' | 'end';

export type Kick90DiagramLabel = {
  x: number;
  y: number;
  anchor: DiagramTextAnchor;
};

export type ProjectedLine = { start: Point2; end: Point2 };

export type Kick90DiagramGeometry = {
  /** The four 3D corner waypoints — locked by tests as the model's truth. */
  waypoints: Vec3[];
  centerline: Vec3[];
  transform: IsoTransform;
  projectedPoints: Point2[];
  projectedBounds: Bounds2;
  kickMarkIndex: number;
  ninetyMarkIndex: number;
  kickZone: { startIndex: number; endIndex: number };
  ninetyZone: { startIndex: number; endIndex: number };
  /** Floor patch outline (projected, draw order) and grid lines. */
  floorPatch: Point2[];
  floorGrid: ProjectedLine[];
  /** Pipe footprint cast on the floor (projected). */
  floorShadow: Point2[];
  /** Dashed continuation of the run axis on the floor — the "no kick" path. */
  ghostAxis: ProjectedLine;
  /** On-floor arc between the run axis and the kicked axis at the kick vertex. */
  angleArc: Point2[];
  /** Open-tube cross sections (projected loops): run start + stub top. */
  endCaps: Point2[][];
  /** Distance-between-bends dimension, offset above the kicked section. */
  dbbDim: {
    start: Point2;
    end: Point2;
    mid: Point2;
    ext1: ProjectedLine;
    ext2: ProjectedLine;
  };
  /** Kick rise dimension on the floor: un-kicked axis → stub footprint. */
  riseDim: { start: Point2; end: Point2; mid: Point2 };
  labels: {
    dbbTitle: Kick90DiagramLabel;
    dbbValue: Kick90DiagramLabel;
    riseTitle: Kick90DiagramLabel;
    riseValue: Kick90DiagramLabel;
    angle: Kick90DiagramLabel;
    markLegend1: Kick90DiagramLabel;
    markLegend2: Kick90DiagramLabel;
  };
  drawnAngleDeg: number;
};

function clamp(value: number, min: number, max: number): number {
  return Math.min(Math.max(value, min), max);
}

function toScreen(p: Vec3, transform: IsoTransform): Point2 {
  return applyIsoTransform(projectIso(p), transform);
}

function projectLoop(loop: readonly Vec3[], transform: IsoTransform): Point2[] {
  return loop.map((p) => toScreen(p, transform));
}

function offsetParallel(a: Point2, b: Point2, offset: number): { start: Point2; end: Point2 } {
  const dx = b.x - a.x;
  const dy = b.y - a.y;
  const len = Math.hypot(dx, dy) || 1;
  const nx = -dy / len;
  const ny = dx / len;
  return {
    start: { x: a.x + nx * offset, y: a.y + ny * offset },
    end: { x: b.x + nx * offset, y: b.y + ny * offset },
  };
}

function midpoint(a: Point2, b: Point2): Point2 {
  return { x: (a.x + b.x) / 2, y: (a.y + b.y) / 2 };
}

/**
 * Pure layout math for the Kick 90 isometric diagram — no React or SVG.
 *
 * True 3D model: the run travels along +X one tube radius above the floor;
 * the kick bend rotates the run toward −Y (laterally across the floor); the
 * 90° bend turns the pipe straight up (+Z) into the stub. The kick and the
 * 90 live in different planes — that is the whole point of a kick, and the
 * reason this diagram is isometric instead of flat.
 */
export function buildKick90DiagramGeometry(
  input: Kick90DiagramGeometryInput,
): Kick90DiagramGeometry {
  const {
    leadInWorld,
    stubHeightWorld,
    bendRadiusWorld,
    dbbWorldMin,
    dbbWorldMax,
    drawnAngleMin,
    drawnAngleMax,
    pipeElevationWorld,
    gridSpacingWorld,
    floorMarginWorld,
    angleArcRadiusWorld,
    viewPadding,
    dbbDimOffset,
  } = KICK90_DIAGRAM_LAYOUT;

  // Drawn angle tracks the real angle inside a readable window; the kicked
  // section nudges with real spacing. Clamps keep every input variation
  // inside the label-safe envelope (locked by tests).
  const drawnAngleDeg = clamp(input.bendAngleDeg, drawnAngleMin, drawnAngleMax);
  const drawnAngle = (drawnAngleDeg * Math.PI) / 180;
  const dbbWorld = clamp(12 + input.distanceBetweenBendsInches * 0.3, dbbWorldMin, dbbWorldMax);

  const kickX = leadInWorld;
  const ninetyX = kickX + dbbWorld * Math.cos(drawnAngle);
  const ninetyY = -dbbWorld * Math.sin(drawnAngle);
  const z = pipeElevationWorld;

  const waypoints: Vec3[] = [
    { x: 0, y: 0, z },
    { x: kickX, y: 0, z },
    { x: ninetyX, y: ninetyY, z },
    { x: ninetyX, y: ninetyY, z: stubHeightWorld },
  ];

  const { points: centerline, arcs } = buildPipeCenterline(waypoints, bendRadiusWorld, 16);

  // Floor patch covers the pipe footprint plus margin.
  const floorBounds = {
    minX: -floorMarginWorld,
    maxX: ninetyX + floorMarginWorld,
    minY: ninetyY - floorMarginWorld,
    maxY: floorMarginWorld,
  };
  const patchWorld = floorPatchCorners(floorBounds);
  const gridWorld = buildFloorGrid(floorBounds, gridSpacingWorld);

  // Fit the whole scene (pipe + floor patch) into the view.
  const fitTargets = [...centerline, ...patchWorld].map(projectIso);
  const transform = fitIsoTransform(fitTargets, VIEW, viewPadding);

  const projectedPoints = centerline.map((p) => toScreen(p, transform));
  const projectedBounds = boundsFromPoints(projectedPoints);
  const floorPatch = projectLoop(patchWorld, transform);
  const floorGrid = gridWorld.map((line) => ({
    start: toScreen(line.start, transform),
    end: toScreen(line.end, transform),
  }));
  const floorShadow = projectLoop(buildFloorShadow(centerline), transform);

  const kickArc = arcs.find((arc) => arc.waypointIndex === 1);
  const ninetyArc = arcs.find((arc) => arc.waypointIndex === 2);

  // Marks sit at the arc entry tangent points — where the shoe lines up.
  const kickMarkIndex = kickArc?.startIndex ?? 1;
  const ninetyMarkIndex = ninetyArc?.startIndex ?? Math.max(centerline.length - 4, 0);
  const kickMarkPoint = projectedPoints[kickMarkIndex];
  const ninetyMarkPoint = projectedPoints[ninetyMarkIndex];

  // Floor furniture. The ghost axis continues the run direction past the kick
  // vertex; the rise dimension closes the triangle to the stub footprint.
  const kickVertexFloor: Vec3 = { x: kickX, y: 0, z: 0 };
  const ghostAxisEndFloor: Vec3 = { x: ninetyX, y: 0, z: 0 };
  const stubFootFloor: Vec3 = { x: ninetyX, y: ninetyY, z: 0 };

  const ghostAxis: ProjectedLine = {
    start: toScreen(kickVertexFloor, transform),
    end: toScreen(ghostAxisEndFloor, transform),
  };
  const riseStart = toScreen(ghostAxisEndFloor, transform);
  const riseEnd = toScreen(stubFootFloor, transform);
  const riseDim = { start: riseStart, end: riseEnd, mid: midpoint(riseStart, riseEnd) };

  const angleArc = projectLoop(
    buildAngleArcOnFloor(
      kickVertexFloor,
      { x: 1, y: 0, z: 0 },
      { x: Math.cos(drawnAngle), y: -Math.sin(drawnAngle), z: 0 },
      angleArcRadiusWorld,
    ),
    transform,
  );

  // Open-tube cross sections: run start (facing −X) and stub top (facing +Z).
  // Cap radius in world units is chosen so the projected mouth matches the
  // 19px tube stroke at the fitted scale.
  const capRadiusWorld = 9.5 / Math.max(transform.scale, 1e-6);
  const endCaps = [
    projectLoop(
      buildEndCapCircle(waypoints[0], { x: 1, y: 0, z: 0 }, capRadiusWorld),
      transform,
    ),
    projectLoop(
      buildEndCapCircle(waypoints[3], { x: 0, y: 0, z: 1 }, capRadiusWorld),
      transform,
    ),
  ];

  // Distance-between-bends dimension: parallel to the kicked section, offset
  // up-left on screen (toward the open pocket), extension ticks from marks.
  const dbbLine = offsetParallel(kickMarkPoint, ninetyMarkPoint, -dbbDimOffset);
  const dbbDim = {
    start: dbbLine.start,
    end: dbbLine.end,
    mid: midpoint(dbbLine.start, dbbLine.end),
    ext1: { start: kickMarkPoint, end: dbbLine.start },
    ext2: { start: ninetyMarkPoint, end: dbbLine.end },
  };

  // Label pockets (all screen-space, clamped to the frame):
  // - DBB text stacks above its dimension line, in the pocket over the kicked
  //   section between the run start (left) and the stub (right).
  // - Rise text hangs below-right of the rise dimension midpoint, on the open
  //   floor corner in front of the stub.
  // - Angle tag sits past the angle arc along its bisector.
  const dbbTitleY = Math.max(dbbDim.mid.y - 26, VIEW.y + 16);
  // Center the DBB text on its dimension but keep the text run clear of the
  // stub (right) and the run start (left). Title is the widest string (~110px).
  const stubScreenX = toScreen(waypoints[3], transform).x;
  const dbbLabelX = clamp(dbbDim.mid.x, VIEW.x + 70, stubScreenX - 68);
  // Start-anchored text needs room to run right — clamp with text width spare.
  const riseLabelX = Math.min(riseDim.mid.x + 18, VIEW.x + VIEW.width - 72);
  const riseTitleY = Math.min(riseDim.mid.y + 16, VIEW.y + VIEW.height - 26);

  const bisector = drawnAngle / 2;
  const angleLabelWorld: Vec3 = {
    x: kickX + (angleArcRadiusWorld + 5) * Math.cos(bisector),
    y: -(angleArcRadiusWorld + 5) * Math.sin(bisector),
    z: 0,
  };
  const angleLabelPoint = toScreen(angleLabelWorld, transform);

  const labels: Kick90DiagramGeometry['labels'] = {
    dbbTitle: { x: dbbLabelX, y: dbbTitleY, anchor: 'middle' },
    dbbValue: { x: dbbLabelX, y: dbbTitleY + 15, anchor: 'middle' },
    riseTitle: { x: riseLabelX, y: riseTitleY, anchor: 'start' },
    riseValue: { x: riseLabelX, y: riseTitleY + 15, anchor: 'start' },
    angle: {
      x: angleLabelPoint.x,
      y: Math.min(angleLabelPoint.y, VIEW.y + VIEW.height - 8),
      anchor: 'middle',
    },
    markLegend1: { x: VIEW.x + 14, y: VIEW.y + 24, anchor: 'start' },
    markLegend2: { x: VIEW.x + 14, y: VIEW.y + 40, anchor: 'start' },
  };

  return {
    waypoints,
    centerline,
    transform,
    projectedPoints,
    projectedBounds,
    kickMarkIndex,
    ninetyMarkIndex,
    kickZone: kickArc
      ? { startIndex: kickArc.startIndex, endIndex: kickArc.endIndex }
      : { startIndex: kickMarkIndex, endIndex: Math.min(kickMarkIndex + 4, centerline.length - 1) },
    ninetyZone: ninetyArc
      ? { startIndex: ninetyArc.startIndex, endIndex: ninetyArc.endIndex }
      : {
          startIndex: ninetyMarkIndex,
          endIndex: Math.min(ninetyMarkIndex + 4, centerline.length - 1),
        },
    floorPatch,
    floorGrid,
    floorShadow,
    ghostAxis,
    angleArc,
    endCaps,
    dbbDim,
    riseDim,
    labels,
    drawnAngleDeg,
  };
}

/** Ghost scene for the empty state — reference proportions, no values. */
const GHOST_GEOMETRY = buildKick90DiagramGeometry({
  bendAngleDeg: 30,
  kickRiseInches: 6,
  distanceBetweenBendsInches: 12,
});

export const KICK90_GHOST_GEOMETRY = GHOST_GEOMETRY;
