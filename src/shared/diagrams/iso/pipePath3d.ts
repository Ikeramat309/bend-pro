import type { Vec3 } from './isoProjection';

export type PipeArc = {
  startIndex: number;
  endIndex: number;
  waypointIndex: number;
};

export type PipeCenterline = {
  points: Vec3[];
  arcs: PipeArc[];
};

const EPSILON = 1e-9;

function vecSub(a: Vec3, b: Vec3): Vec3 {
  return { x: a.x - b.x, y: a.y - b.y, z: a.z - b.z };
}

function vecAdd(a: Vec3, b: Vec3): Vec3 {
  return { x: a.x + b.x, y: a.y + b.y, z: a.z + b.z };
}

function vecScale(v: Vec3, s: number): Vec3 {
  return { x: v.x * s, y: v.y * s, z: v.z * s };
}

function vecLen(v: Vec3): number {
  return Math.sqrt(v.x * v.x + v.y * v.y + v.z * v.z);
}

function vecNormalize(v: Vec3): Vec3 | null {
  const len = vecLen(v);
  if (len < EPSILON) {
    return null;
  }
  return vecScale(v, 1 / len);
}

function vecDot(a: Vec3, b: Vec3): number {
  return a.x * b.x + a.y * b.y + a.z * b.z;
}

function vecCross(a: Vec3, b: Vec3): Vec3 {
  return {
    x: a.y * b.z - a.z * b.y,
    y: a.z * b.x - a.x * b.z,
    z: a.x * b.y - a.y * b.x,
  };
}

function clamp(value: number, min: number, max: number): number {
  return Math.min(Math.max(value, min), max);
}

function rotateAroundAxis(v: Vec3, axis: Vec3, angle: number): Vec3 {
  const cos = Math.cos(angle);
  const sin = Math.sin(angle);
  const dot = vecDot(axis, v);
  const cross = vecCross(axis, v);

  return {
    x: v.x * cos + cross.x * sin + axis.x * dot * (1 - cos),
    y: v.y * cos + cross.y * sin + axis.y * dot * (1 - cos),
    z: v.z * cos + cross.z * sin + axis.z * dot * (1 - cos),
  };
}

function sampleArc(
  center: Vec3,
  start: Vec3,
  axis: Vec3,
  sweep: number,
  samples: number,
): Vec3[] {
  const radiusVec = vecSub(start, center);
  const points: Vec3[] = [];

  for (let i = 1; i <= samples; i += 1) {
    const t = i / samples;
    const rotated = rotateAroundAxis(radiusVec, axis, sweep * t);
    points.push(vecAdd(center, rotated));
  }

  return points;
}

/**
 * Build a display-only 3D centerline with circular-arc fillets at interior
 * waypoints. Straight segments connect tangent points; arcs lie in the plane
 * spanned by the two segment directions.
 */
export function buildPipeCenterline(
  waypoints: readonly Vec3[],
  bendRadiusWorld: number,
  samplesPerArc = 12,
): PipeCenterline {
  if (waypoints.length < 2) {
    return { points: [...waypoints], arcs: [] };
  }

  const points: Vec3[] = [waypoints[0]];
  const arcs: PipeArc[] = [];

  for (let i = 1; i < waypoints.length - 1; i += 1) {
    const prev = waypoints[i - 1];
    const corner = waypoints[i];
    const next = waypoints[i + 1];

    const inVec = vecSub(corner, prev);
    const outVec = vecSub(next, corner);
    const inDir = vecNormalize(inVec);
    const outDir = vecNormalize(outVec);

    if (!inDir || !outDir) {
      points.push(corner);
      continue;
    }

    const cosPhi = clamp(vecDot(inDir, outDir), -1, 1);
    const phi = Math.acos(cosPhi);

    if (phi < EPSILON || Math.abs(Math.PI - phi) < EPSILON) {
      points.push(corner);
      continue;
    }

    const inLen = vecLen(inVec);
    const outLen = vecLen(outVec);
    const maxTangent = Math.min(inLen, outLen) * 0.49;
    const idealTangent = bendRadiusWorld * Math.tan(phi / 2);
    const tangent = Math.min(idealTangent, maxTangent);
    const effectiveRadius = tangent / Math.max(Math.tan(phi / 2), EPSILON);

    const entry = vecSub(corner, vecScale(inDir, tangent));
    const exit = vecAdd(corner, vecScale(outDir, tangent));

    const sinPhi = Math.sin(phi);
    const axis = vecNormalize(vecCross(inDir, outDir));
    if (!axis || sinPhi < EPSILON) {
      points.push(corner);
      continue;
    }

    // Arc center: perpendicular to the incoming direction at the entry tangent
    // point, on the inside of the turn. The arc sweeps exactly the direction
    // change φ (rotating inDir about the axis by φ yields outDir).
    const inwardNormal = vecScale(
      vecSub(outDir, vecScale(inDir, cosPhi)),
      1 / sinPhi,
    );
    const center = vecAdd(entry, vecScale(inwardNormal, effectiveRadius));
    const sweep = phi;

    points.push(entry);
    const arcStartIndex = points.length - 1;
    const arcPoints = sampleArc(center, entry, axis, sweep, samplesPerArc);
    points.push(...arcPoints);
    const arcEndIndex = points.length - 1;
    arcs.push({ startIndex: arcStartIndex, endIndex: arcEndIndex, waypointIndex: i });

    // The final arc sample lands on the exit tangent point — only push exit
    // separately if sampling drifted (guards duplicate zero-length segments).
    const lastPoint = points[points.length - 1];
    if (segmentLength(lastPoint, exit) > 1e-6) {
      points.push(exit);
    }
  }

  points.push(waypoints[waypoints.length - 1]);
  return { points, arcs };
}

export function segmentLength(a: Vec3, b: Vec3): number {
  return vecLen(vecSub(b, a));
}

/** Cumulative arc length at `points[index]` along the sampled centerline. */
export function pathLengthAt(points: readonly Vec3[], index: number): number {
  const clampedIndex = clamp(index, 0, Math.max(points.length - 1, 0));
  let total = 0;

  for (let i = 1; i <= clampedIndex; i += 1) {
    total += segmentLength(points[i - 1], points[i]);
  }

  return total;
}

export function totalPathLength(points: readonly Vec3[]): number {
  if (points.length < 2) {
    return 0;
  }
  return pathLengthAt(points, points.length - 1);
}

/**
 * Locate the point at a given arc-length fraction (0 = start, 1 = end) and
 * return its index plus interpolation factor within that segment.
 */
export function locateAtArcLengthFraction(
  points: readonly Vec3[],
  fraction: number,
): { index: number; t: number; point: Vec3 } {
  if (points.length === 0) {
    return { index: 0, t: 0, point: { x: 0, y: 0, z: 0 } };
  }
  if (points.length === 1) {
    return { index: 0, t: 0, point: points[0] };
  }

  const total = totalPathLength(points);
  if (total < EPSILON) {
    return { index: 0, t: 0, point: points[0] };
  }

  const target = clamp(fraction, 0, 1) * total;
  let walked = 0;

  for (let i = 1; i < points.length; i += 1) {
    const segLen = segmentLength(points[i - 1], points[i]);
    if (walked + segLen >= target || i === points.length - 1) {
      const t = segLen < EPSILON ? 0 : (target - walked) / segLen;
      const clampedT = clamp(t, 0, 1);
      const point = {
        x: points[i - 1].x + (points[i].x - points[i - 1].x) * clampedT,
        y: points[i - 1].y + (points[i].y - points[i - 1].y) * clampedT,
        z: points[i - 1].z + (points[i].z - points[i - 1].z) * clampedT,
      };
      return { index: i - 1, t: clampedT, point };
    }
    walked += segLen;
  }

  const last = points[points.length - 1];
  return { index: points.length - 2, t: 1, point: last };
}
