import {
  KICK90_DIAGRAM_LAYOUT,
  buildKick90DiagramGeometry,
} from './kick90DiagramGeometry';

const VIEW = { x: 0, y: 0, width: 360, height: 300 };

function labelRect(label: { x: number; y: number; anchor: string }, width: number, height: number) {
  const x =
    label.anchor === 'start' ? label.x : label.anchor === 'end' ? label.x - width : label.x - width / 2;
  // DiagramLabel y is the text baseline — the glyph box sits above it.
  return { x, y: label.y - height, width, height };
}

function rectIntersectsBounds(
  rect: { x: number; y: number; width: number; height: number },
  bounds: { minX: number; minY: number; maxX: number; maxY: number },
  inflate: number,
): boolean {
  return (
    rect.x < bounds.maxX + inflate &&
    rect.x + rect.width > bounds.minX - inflate &&
    rect.y < bounds.maxY + inflate &&
    rect.y + rect.height > bounds.minY - inflate
  );
}

describe('buildKick90DiagramGeometry', () => {
  test('kick is lateral (−Y) and the stub is the only vertical travel', () => {
    const geo = buildKick90DiagramGeometry({
      bendAngleDeg: 30,
      kickRiseInches: 6,
      distanceBetweenBendsInches: 12,
    });

    const [start, kick, ninety, stubTop] = geo.waypoints;
    const elevation = KICK90_DIAGRAM_LAYOUT.pipeElevationWorld;

    // Run and kicked section ride one tube radius above the floor.
    expect(start.z).toBeCloseTo(elevation, 6);
    expect(kick.z).toBeCloseTo(elevation, 6);
    expect(ninety.z).toBeCloseTo(elevation, 6);
    // Kick pushes the run laterally away from the viewer (−Y) — a different
    // plane than the 90, which is the entire point of the isometric view.
    expect(ninety.y).toBeLessThan(0);
    // Stub rises straight up from the 90 with no lateral drift.
    expect(stubTop.x).toBe(ninety.x);
    expect(stubTop.y).toBe(ninety.y);
    expect(stubTop.z).toBeGreaterThan(elevation);

    const zDeltas = geo.waypoints.map((p, i, arr) => (i === 0 ? 0 : p.z - arr[i - 1].z));
    expect(zDeltas.filter((dz) => dz > 0)).toHaveLength(1);
  });

  test('drawn angle is clamped to the readable window but tracks the input', () => {
    const shallow = buildKick90DiagramGeometry({
      bendAngleDeg: 10,
      kickRiseInches: 6,
      distanceBetweenBendsInches: 36,
    });
    const mid = buildKick90DiagramGeometry({
      bendAngleDeg: 30,
      kickRiseInches: 6,
      distanceBetweenBendsInches: 12,
    });
    const steep = buildKick90DiagramGeometry({
      bendAngleDeg: 60,
      kickRiseInches: 6,
      distanceBetweenBendsInches: 7.2,
    });

    expect(shallow.drawnAngleDeg).toBe(KICK90_DIAGRAM_LAYOUT.drawnAngleMin);
    expect(mid.drawnAngleDeg).toBe(30);
    expect(steep.drawnAngleDeg).toBe(KICK90_DIAGRAM_LAYOUT.drawnAngleMax);
  });

  test('projected pipe fits inside the viewBox for every angle and extreme values', () => {
    for (const angle of [10, 22.5, 30, 45, 60]) {
      const geo = buildKick90DiagramGeometry({
        bendAngleDeg: angle,
        kickRiseInches: 40,
        distanceBetweenBendsInches: 240,
      });
      expect(geo.projectedBounds.minX).toBeGreaterThanOrEqual(VIEW.x);
      expect(geo.projectedBounds.minY).toBeGreaterThanOrEqual(VIEW.y);
      expect(geo.projectedBounds.maxX).toBeLessThanOrEqual(VIEW.x + VIEW.width);
      expect(geo.projectedBounds.maxY).toBeLessThanOrEqual(VIEW.y + VIEW.height);
    }
  });

  test('floor patch, grid, shadow, angle arc, and end caps are present', () => {
    const geo = buildKick90DiagramGeometry({
      bendAngleDeg: 30,
      kickRiseInches: 6,
      distanceBetweenBendsInches: 12,
    });

    expect(geo.floorPatch).toHaveLength(4);
    expect(geo.floorGrid.length).toBeGreaterThan(3);
    expect(geo.floorShadow.length).toBeGreaterThan(4);
    expect(geo.angleArc.length).toBeGreaterThan(8);
    expect(geo.endCaps).toHaveLength(2);
    for (const cap of geo.endCaps) {
      expect(cap.length).toBeGreaterThanOrEqual(12);
    }
  });

  test('marks land on the arc entry tangent points', () => {
    const geo = buildKick90DiagramGeometry({
      bendAngleDeg: 30,
      kickRiseInches: 6,
      distanceBetweenBendsInches: 12,
    });

    expect(geo.kickMarkIndex).toBe(geo.kickZone.startIndex);
    expect(geo.ninetyMarkIndex).toBe(geo.ninetyZone.startIndex);
    expect(geo.ninetyMarkIndex).toBeGreaterThan(geo.kickMarkIndex);
  });

  test('value labels stay clear of the kicked section for every angle', () => {
    for (const angle of [10, 22.5, 30, 45, 60]) {
      const geo = buildKick90DiagramGeometry({
        bendAngleDeg: angle,
        kickRiseInches: 6,
        distanceBetweenBendsInches: 12,
      });

      const kickMarkPoint = geo.projectedPoints[geo.kickMarkIndex];
      const ninetyMarkPoint = geo.projectedPoints[geo.ninetyMarkIndex];
      const dbbValueRect = labelRect(geo.labels.dbbValue, 60, 14);
      const kickedSectionBounds = {
        minX: Math.min(kickMarkPoint.x, ninetyMarkPoint.x),
        minY: Math.min(kickMarkPoint.y, ninetyMarkPoint.y),
        maxX: Math.max(kickMarkPoint.x, ninetyMarkPoint.x),
        maxY: Math.max(kickMarkPoint.y, ninetyMarkPoint.y),
      };
      // Inflate by the tube half-width (~10) plus mark tick reach.
      expect(rectIntersectsBounds(dbbValueRect, kickedSectionBounds, 12)).toBe(false);
    }
  });

  test('labels stay inside the frame for every angle', () => {
    for (const angle of [10, 22.5, 30, 45, 60]) {
      const geo = buildKick90DiagramGeometry({
        bendAngleDeg: angle,
        kickRiseInches: 6,
        distanceBetweenBendsInches: 12,
      });

      for (const label of Object.values(geo.labels)) {
        expect(label.x).toBeGreaterThanOrEqual(VIEW.x);
        expect(label.x).toBeLessThanOrEqual(VIEW.x + VIEW.width);
        expect(label.y).toBeGreaterThanOrEqual(VIEW.y);
        expect(label.y).toBeLessThanOrEqual(VIEW.y + VIEW.height);
      }
      // Start-anchored rise labels need room for the text run.
      expect(geo.labels.riseTitle.x).toBeLessThanOrEqual(VIEW.x + VIEW.width - 70);
    }
  });

  test('ghost axis and rise dimension describe the lateral offset on the floor', () => {
    const geo = buildKick90DiagramGeometry({
      bendAngleDeg: 30,
      kickRiseInches: 6,
      distanceBetweenBendsInches: 12,
    });

    // Rise dimension runs from the un-kicked floor axis end to the stub footprint.
    expect(geo.riseDim.start.x).toBeCloseTo(geo.ghostAxis.end.x, 6);
    expect(geo.riseDim.start.y).toBeCloseTo(geo.ghostAxis.end.y, 6);
    // −Y projects up-right in this iso handedness: the stub footprint sits
    // above and to the right of the ghost axis end on screen.
    expect(geo.riseDim.end.y).toBeLessThan(geo.riseDim.start.y);
    expect(geo.riseDim.end.x).toBeGreaterThan(geo.riseDim.start.x);
  });
});

describe('KICK90_DIAGRAM_LAYOUT', () => {
  test('exports stable layout constants', () => {
    expect(KICK90_DIAGRAM_LAYOUT.leadInWorld).toBeGreaterThan(0);
    expect(KICK90_DIAGRAM_LAYOUT.stubHeightWorld).toBeGreaterThan(0);
    expect(KICK90_DIAGRAM_LAYOUT.pipeElevationWorld).toBeGreaterThan(0);
    expect(KICK90_DIAGRAM_LAYOUT.drawnAngleMax).toBeGreaterThan(
      KICK90_DIAGRAM_LAYOUT.drawnAngleMin,
    );
  });
});
