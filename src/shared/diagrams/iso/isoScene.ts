/**
 * Scene furniture for isometric pipe diagrams — pure display geometry.
 *
 * These helpers create the 3D-perception cues shared by every multi-plane
 * calculator diagram (Kick 90 today; rolling offset, parallel kicks,
 * matching bends, multi-bend later):
 *
 * - a floor grid patch on z = 0 that anchors the scene in space
 * - a cast shadow (the centerline flattened onto the floor)
 * - open end-cap cross sections so the pipe reads as a tube, not a stroke
 * - an on-floor angle arc between two directions
 *
 * Everything returns world-space Vec3 geometry; callers project with the
 * scene's IsoTransform. No React, no SVG, no calculator math.
 */
import type { Vec3 } from './isoProjection';

export type FloorGridLine = { start: Vec3; end: Vec3 };

export type FloorGridBounds = {
  minX: number;
  maxX: number;
  minY: number;
  maxY: number;
};

/**
 * Grid lines on the floor plane (z = 0) covering the given world bounds.
 * Lines run along both floor axes at the given spacing, plus the patch
 * border, so the plane reads as a surface instead of loose lines.
 */
export function buildFloorGrid(bounds: FloorGridBounds, spacing: number): FloorGridLine[] {
  const lines: FloorGridLine[] = [];
  if (spacing <= 0) {
    return lines;
  }

  const startX = Math.ceil(bounds.minX / spacing) * spacing;
  for (let x = startX; x <= bounds.maxX + 1e-9; x += spacing) {
    lines.push({
      start: { x, y: bounds.minY, z: 0 },
      end: { x, y: bounds.maxY, z: 0 },
    });
  }

  const startY = Math.ceil(bounds.minY / spacing) * spacing;
  for (let y = startY; y <= bounds.maxY + 1e-9; y += spacing) {
    lines.push({
      start: { x: bounds.minX, y, z: 0 },
      end: { x: bounds.maxX, y, z: 0 },
    });
  }

  return lines;
}

/** The four corners of the floor patch, in draw order. */
export function floorPatchCorners(bounds: FloorGridBounds): Vec3[] {
  return [
    { x: bounds.minX, y: bounds.minY, z: 0 },
    { x: bounds.maxX, y: bounds.minY, z: 0 },
    { x: bounds.maxX, y: bounds.maxY, z: 0 },
    { x: bounds.minX, y: bounds.maxY, z: 0 },
  ];
}

/**
 * Cast shadow of a centerline: every point flattened onto the floor.
 * Consecutive duplicate floor points (e.g. a vertical stub collapsing to its
 * base) are removed so the shadow path has no zero-length segments.
 */
export function buildFloorShadow(centerline: readonly Vec3[]): Vec3[] {
  const shadow: Vec3[] = [];

  for (const point of centerline) {
    const flat = { x: point.x, y: point.y, z: 0 };
    const previous = shadow[shadow.length - 1];
    if (previous && Math.hypot(flat.x - previous.x, flat.y - previous.y) < 1e-6) {
      continue;
    }
    shadow.push(flat);
  }

  return shadow;
}

function normalize(v: Vec3): Vec3 | null {
  const len = Math.hypot(v.x, v.y, v.z);
  if (len < 1e-9) {
    return null;
  }
  return { x: v.x / len, y: v.y / len, z: v.z / len };
}

function cross(a: Vec3, b: Vec3): Vec3 {
  return {
    x: a.y * b.z - a.z * b.y,
    y: a.z * b.x - a.x * b.z,
    z: a.x * b.y - a.y * b.x,
  };
}

/**
 * Sampled 3D circle of the tube cross-section at a pipe end. The circle lies
 * in the plane perpendicular to the tangent direction; project the returned
 * loop and render it as the open conduit mouth.
 */
export function buildEndCapCircle(
  center: Vec3,
  tangent: Vec3,
  radiusWorld: number,
  samples = 24,
): Vec3[] {
  const t = normalize(tangent);
  if (!t || radiusWorld <= 0) {
    return [];
  }

  // Pick a helper axis not parallel to the tangent to build the circle frame.
  const helper: Vec3 = Math.abs(t.z) < 0.9 ? { x: 0, y: 0, z: 1 } : { x: 1, y: 0, z: 0 };
  const u = normalize(cross(t, helper));
  if (!u) {
    return [];
  }
  const v = cross(t, u);

  const loop: Vec3[] = [];
  for (let i = 0; i < samples; i += 1) {
    const phi = (i / samples) * Math.PI * 2;
    const cos = Math.cos(phi);
    const sin = Math.sin(phi);
    loop.push({
      x: center.x + radiusWorld * (u.x * cos + v.x * sin),
      y: center.y + radiusWorld * (u.y * cos + v.y * sin),
      z: center.z + radiusWorld * (u.z * cos + v.z * sin),
    });
  }

  return loop;
}

/**
 * On-floor arc between two floor directions at a vertex — used to draw the
 * bend-angle indicator. Directions must lie in the floor plane (z ignored).
 */
export function buildAngleArcOnFloor(
  vertex: Vec3,
  fromDir: Vec3,
  toDir: Vec3,
  radiusWorld: number,
  samples = 16,
): Vec3[] {
  const from = normalize({ x: fromDir.x, y: fromDir.y, z: 0 });
  const to = normalize({ x: toDir.x, y: toDir.y, z: 0 });
  if (!from || !to || radiusWorld <= 0) {
    return [];
  }

  const fromAngle = Math.atan2(from.y, from.x);
  const toAngle = Math.atan2(to.y, to.x);
  let sweep = toAngle - fromAngle;
  // Take the short way around.
  if (sweep > Math.PI) sweep -= Math.PI * 2;
  if (sweep < -Math.PI) sweep += Math.PI * 2;

  const points: Vec3[] = [];
  for (let i = 0; i <= samples; i += 1) {
    const angle = fromAngle + (sweep * i) / samples;
    points.push({
      x: vertex.x + radiusWorld * Math.cos(angle),
      y: vertex.y + radiusWorld * Math.sin(angle),
      z: 0,
    });
  }

  return points;
}
