import {
  OFFSET_DIAGRAM_LAYOUT,
  buildOffsetDiagramGeometry,
} from '../diagram/offsetDiagramGeometry';

describe('buildOffsetDiagramGeometry', () => {
  test('30° offset produces readable rise and bend positions', () => {
    const geo = buildOffsetDiagramGeometry({
      bendAngleDeg: 30,
      distanceBetweenBendsInches: 12,
    });

    expect(geo.rise).toBeGreaterThan(OFFSET_DIAGRAM_LAYOUT.riseMin);
    expect(geo.x2).toBeGreaterThan(geo.x1);
    expect(geo.pipePath).toContain('M 24 230');
    expect(geo.bendZone1).toContain('Q');
  });

  test('shallower angle produces longer horizontal travel', () => {
    const shallow = buildOffsetDiagramGeometry({
      bendAngleDeg: 10,
      distanceBetweenBendsInches: 12,
    });
    const steep = buildOffsetDiagramGeometry({
      bendAngleDeg: 60,
      distanceBetweenBendsInches: 12,
    });

    expect(shallow.dx).toBeGreaterThan(steep.dx);
    expect(shallow.rise).toBeLessThan(steep.rise);
  });

  test('mark 1 shifts first bend when provided', () => {
    const withoutMark = buildOffsetDiagramGeometry({
      bendAngleDeg: 45,
      distanceBetweenBendsInches: 10,
    });
    const withMark = buildOffsetDiagramGeometry({
      bendAngleDeg: 45,
      distanceBetweenBendsInches: 10,
      mark1Inches: 20,
    });

    expect(withMark.x1).not.toBe(withoutMark.x1);
  });
});
