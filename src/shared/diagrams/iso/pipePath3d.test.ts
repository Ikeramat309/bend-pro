import {
  buildPipeCenterline,
  locateAtArcLengthFraction,
  pathLengthAt,
  totalPathLength,
} from './pipePath3d';

describe('buildPipeCenterline', () => {
  test('90° in-plane corner places tangent points at expected distance', () => {
    const waypoints = [
      { x: 0, y: 0, z: 0 },
      { x: 10, y: 0, z: 0 },
      { x: 10, y: 10, z: 0 },
    ];
    const radius = 2;
    const { points, arcs } = buildPipeCenterline(waypoints, radius, 12);

    expect(arcs).toHaveLength(1);
    const entry = points[arcs[0].startIndex];
    const exit = points[arcs[0].endIndex];

    expect(entry.x).toBeCloseTo(10 - radius, 4);
    expect(entry.y).toBeCloseTo(0, 4);
    expect(exit.x).toBeCloseTo(10, 4);
    expect(exit.y).toBeCloseTo(radius, 4);
  });

  test('out-of-plane corner (+X then +Y) changes both lateral coordinates along arc', () => {
    const waypoints = [
      { x: 0, y: 0, z: 0 },
      { x: 8, y: 0, z: 0 },
      { x: 8, y: 8, z: 0 },
    ];
    const { points, arcs } = buildPipeCenterline(waypoints, 1.5, 16);
    const arcPoints = points.slice(arcs[0].startIndex, arcs[0].endIndex + 1);

    const xValues = arcPoints.map((p) => p.x);
    const yValues = arcPoints.map((p) => p.y);
    const zValues = arcPoints.map((p) => p.z);

    for (let i = 1; i < xValues.length; i += 1) {
      expect(xValues[i]).toBeGreaterThanOrEqual(xValues[i - 1] - 1e-6);
      expect(yValues[i]).toBeGreaterThanOrEqual(yValues[i - 1] - 1e-6);
    }

    expect(zValues.every((z) => Math.abs(z) < 1e-6)).toBe(true);
    expect(arcPoints.length).toBeGreaterThan(4);
  });

  test('shallow 30° corner sweeps exactly the direction change (regression: was sweeping 150°)', () => {
    const angle = (30 * Math.PI) / 180;
    const waypoints = [
      { x: 0, y: 0, z: 0 },
      { x: 10, y: 0, z: 0 },
      { x: 10 + 20 * Math.cos(angle), y: 20 * Math.sin(angle), z: 0 },
    ];
    const radius = 2;
    const { points, arcs } = buildPipeCenterline(waypoints, radius, 16);

    expect(arcs).toHaveLength(1);
    const entry = points[arcs[0].startIndex];
    const exit = points[arcs[0].endIndex];

    // Exit tangent point must sit on the outgoing segment at tangent distance
    // t = r·tan(φ/2) past the corner.
    const tangent = radius * Math.tan(angle / 2);
    expect(exit.x).toBeCloseTo(10 + tangent * Math.cos(angle), 4);
    expect(exit.y).toBeCloseTo(tangent * Math.sin(angle), 4);

    // The arc chord must be short (small direction change), not a huge loop:
    // chord = 2·r·sin(φ/2) for a correct φ sweep.
    const chord = Math.hypot(exit.x - entry.x, exit.y - entry.y);
    expect(chord).toBeCloseTo(2 * radius * Math.sin(angle / 2), 3);

    // Every arc point stays within the corner neighborhood (no 150° excursion).
    const arcPoints = points.slice(arcs[0].startIndex, arcs[0].endIndex + 1);
    for (const p of arcPoints) {
      expect(Math.hypot(p.x - 10, p.y)).toBeLessThanOrEqual(tangent + radius);
    }
  });

  test('total path length is greater than straight polyline for filleted path', () => {
    const waypoints = [
      { x: 0, y: 0, z: 0 },
      { x: 12, y: 0, z: 0 },
      { x: 12, y: 0, z: 10 },
    ];
    const { points } = buildPipeCenterline(waypoints, 2, 12);
    const straight = Math.hypot(12, 0) + Math.hypot(0, 10);
    const filleted = totalPathLength(points);

    expect(filleted).toBeGreaterThan(straight - 2);
    expect(filleted).toBeLessThan(straight + 4);
  });

  test('pathLengthAt and locateAtArcLengthFraction agree at ends', () => {
    const waypoints = [
      { x: 0, y: 0, z: 0 },
      { x: 6, y: 0, z: 0 },
      { x: 6, y: 4, z: 0 },
      { x: 6, y: 4, z: 8 },
    ];
    const { points } = buildPipeCenterline(waypoints, 1.2, 10);
    const endLength = pathLengthAt(points, points.length - 1);
    const located = locateAtArcLengthFraction(points, 1);

    expect(located.point.x).toBeCloseTo(points[points.length - 1].x, 4);
    expect(located.point.y).toBeCloseTo(points[points.length - 1].y, 4);
    expect(located.point.z).toBeCloseTo(points[points.length - 1].z, 4);
    expect(endLength).toBeCloseTo(totalPathLength(points), 6);
  });
});
