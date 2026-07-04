import type { Vec3 } from './isoProjection';
import {
  buildAngleArcOnFloor,
  buildEndCapCircle,
  buildFloorGrid,
  buildFloorShadow,
  floorPatchCorners,
} from './isoScene';

describe('buildFloorGrid', () => {
  const bounds = { minX: 0, maxX: 20, minY: -10, maxY: 10 };

  test('creates lines along both floor axes at the given spacing', () => {
    const lines = buildFloorGrid(bounds, 10);

    const xLines = lines.filter((l) => l.start.x === l.end.x);
    const yLines = lines.filter((l) => l.start.y === l.end.y);
    expect(xLines.length).toBe(3); // x = 0, 10, 20
    expect(yLines.length).toBe(3); // y = -10, 0, 10
    for (const line of lines) {
      expect(line.start.z).toBe(0);
      expect(line.end.z).toBe(0);
    }
  });

  test('returns nothing for non-positive spacing', () => {
    expect(buildFloorGrid(bounds, 0)).toHaveLength(0);
  });
});

describe('floorPatchCorners', () => {
  test('returns four corners on the floor in draw order', () => {
    const corners = floorPatchCorners({ minX: -1, maxX: 2, minY: -3, maxY: 4 });
    expect(corners).toHaveLength(4);
    for (const corner of corners) {
      expect(corner.z).toBe(0);
    }
    expect(corners[0]).toEqual({ x: -1, y: -3, z: 0 });
    expect(corners[2]).toEqual({ x: 2, y: 4, z: 0 });
  });
});

describe('buildFloorShadow', () => {
  test('flattens the centerline and collapses vertical runs', () => {
    const centerline: Vec3[] = [
      { x: 0, y: 0, z: 2 },
      { x: 10, y: 0, z: 2 },
      { x: 10, y: -5, z: 2 },
      { x: 10, y: -5, z: 10 },
      { x: 10, y: -5, z: 20 },
    ];

    const shadow = buildFloorShadow(centerline);

    expect(shadow).toHaveLength(3); // vertical stub collapses to one point
    for (const point of shadow) {
      expect(point.z).toBe(0);
    }
    expect(shadow[2]).toEqual({ x: 10, y: -5, z: 0 });
  });
});

describe('buildEndCapCircle', () => {
  test('circle lies in the plane perpendicular to the tangent', () => {
    const center: Vec3 = { x: 5, y: -2, z: 8 };
    const tangent: Vec3 = { x: 0, y: 0, z: 1 };
    const loop = buildEndCapCircle(center, tangent, 2, 16);

    expect(loop).toHaveLength(16);
    for (const point of loop) {
      // Perpendicular to +Z tangent → all points share the center's z.
      expect(point.z).toBeCloseTo(center.z, 9);
      const radius = Math.hypot(point.x - center.x, point.y - center.y);
      expect(radius).toBeCloseTo(2, 9);
    }
  });

  test('degenerate tangent or radius yields no loop', () => {
    expect(buildEndCapCircle({ x: 0, y: 0, z: 0 }, { x: 0, y: 0, z: 0 }, 2)).toHaveLength(0);
    expect(buildEndCapCircle({ x: 0, y: 0, z: 0 }, { x: 1, y: 0, z: 0 }, 0)).toHaveLength(0);
  });
});

describe('buildAngleArcOnFloor', () => {
  test('arc spans the short way between the two directions at the radius', () => {
    const vertex: Vec3 = { x: 3, y: 0, z: 0 };
    const arc = buildAngleArcOnFloor(vertex, { x: 1, y: 0, z: 0 }, { x: 0, y: -1, z: 0 }, 4, 8);

    expect(arc).toHaveLength(9);
    for (const point of arc) {
      expect(point.z).toBe(0);
      expect(Math.hypot(point.x - vertex.x, point.y - vertex.y)).toBeCloseTo(4, 9);
    }
    // Starts along +X, ends along −Y.
    expect(arc[0].x).toBeCloseTo(vertex.x + 4, 9);
    expect(arc[0].y).toBeCloseTo(0, 9);
    expect(arc[arc.length - 1].x).toBeCloseTo(vertex.x, 9);
    expect(arc[arc.length - 1].y).toBeCloseTo(-4, 9);
  });
});
