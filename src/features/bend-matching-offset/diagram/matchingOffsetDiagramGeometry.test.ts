import {
  buildMatchingOffsetDiagramGeometry,
  MATCHING_OFFSET_DIAGRAM_LAYOUT,
} from './matchingOffsetDiagramGeometry';

type Rect = { x: number; y: number; width: number; height: number };

function overlaps(a: Rect, b: Rect): boolean {
  return !(
    a.x + a.width <= b.x ||
    b.x + b.width <= a.x ||
    a.y + a.height <= b.y ||
    b.y + b.height <= a.y
  );
}

function measurementLabelRects(
  geo: ReturnType<typeof buildMatchingOffsetDiagramGeometry>,
): Rect[] {
  return [
    { x: geo.labels.distanceBetweenBends.x - 68, y: 6, width: 136, height: 36 },
    { x: geo.labels.bendAngle.x, y: 28, width: 68, height: 34 },
    { x: geo.labels.offsetHeight.x - 72, y: 93, width: 72, height: 34 },
    { x: geo.labels.adjacent.x - 62, y: 239, width: 124, height: 36 },
  ];
}

describe('buildMatchingOffsetDiagramGeometry', () => {
  it.each([
    { offsetHeightInches: 0.01, distanceBetweenBendsInches: 1_000_000, adjacentInches: 1_000_000, bendAngleDegrees: 0.001 },
    { offsetHeightInches: 3, distanceBetweenBendsInches: Math.sqrt(153), adjacentInches: 12, bendAngleDegrees: 14.036 },
    { offsetHeightInches: 6, distanceBetweenBendsInches: 12, adjacentInches: 6 * Math.sqrt(3), bendAngleDegrees: 30 },
    { offsetHeightInches: 10.392, distanceBetweenBendsInches: 12, adjacentInches: 6, bendAngleDegrees: 60 },
    { offsetHeightInches: 1e12, distanceBetweenBendsInches: Math.SQRT2 * 1e12, adjacentInches: 1e12, bendAngleDegrees: 45 },
  ])('keeps representative and extreme geometry finite and inside the scene', (input) => {
    const geo = buildMatchingOffsetDiagramGeometry(input);
    const scene = MATCHING_OFFSET_DIAGRAM_LAYOUT.sceneView;

    for (const point of [
      ...geo.referenceProjected,
      ...geo.matchingProjected,
      ...geo.floorPatch,
    ]) {
      expect(Number.isFinite(point.x)).toBe(true);
      expect(Number.isFinite(point.y)).toBe(true);
      expect(point.x).toBeGreaterThanOrEqual(scene.x - 0.001);
      expect(point.x).toBeLessThanOrEqual(scene.x + scene.width + 0.001);
      expect(point.y).toBeGreaterThanOrEqual(scene.y - 0.001);
      expect(point.y).toBeLessThanOrEqual(scene.y + scene.height + 0.001);
    }
  });

  it('builds two distinct matching pipes with aligned bend centers', () => {
    const geo = buildMatchingOffsetDiagramGeometry({
      offsetHeightInches: 6,
      distanceBetweenBendsInches: 12,
      adjacentInches: 6 * Math.sqrt(3),
      bendAngleDegrees: 30,
    });

    expect(geo.referenceCenterline).toHaveLength(geo.matchingCenterline.length);
    expect(geo.referenceCenterIndices).toHaveLength(2);
    expect(geo.matchingCenterIndices).toHaveLength(2);
    expect(geo.matchingZones).toHaveLength(2);
    for (const guide of geo.centerGuides) {
      expect(Math.hypot(guide.end.x - guide.start.x, guide.end.y - guide.start.y)).toBeGreaterThan(8);
    }
  });

  it('keeps all measurement labels in separate collision-free pockets', () => {
    const geo = buildMatchingOffsetDiagramGeometry({
      offsetHeightInches: 6,
      distanceBetweenBendsInches: 12,
      adjacentInches: 6 * Math.sqrt(3),
      bendAngleDegrees: 30,
    });
    const rects = measurementLabelRects(geo);

    for (const rect of rects) {
      expect(rect.x).toBeGreaterThanOrEqual(0);
      expect(rect.y).toBeGreaterThanOrEqual(0);
      expect(rect.x + rect.width).toBeLessThanOrEqual(360);
      expect(rect.y + rect.height).toBeLessThanOrEqual(300);
    }
    for (let i = 0; i < rects.length; i += 1) {
      for (let j = i + 1; j < rects.length; j += 1) {
        expect(overlaps(rects[i], rects[j])).toBe(false);
      }
    }
  });

  it('clamps only presentation angle while preserving the live input values outside geometry', () => {
    const shallow = buildMatchingOffsetDiagramGeometry({
      offsetHeightInches: 1,
      distanceBetweenBendsInches: 100,
      adjacentInches: 99.995,
      bendAngleDegrees: 0.57,
    });
    const steep = buildMatchingOffsetDiagramGeometry({
      offsetHeightInches: 10.392,
      distanceBetweenBendsInches: 12,
      adjacentInches: 6,
      bendAngleDegrees: 60,
    });

    expect(shallow.drawnAngleDegrees).toBe(MATCHING_OFFSET_DIAGRAM_LAYOUT.minimumDrawnAngle);
    expect(steep.drawnAngleDegrees).toBe(MATCHING_OFFSET_DIAGRAM_LAYOUT.maximumDrawnAngle);
  });
});
