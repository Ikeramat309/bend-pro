import {
  OFFSET_DIAGRAM_LAYOUT,
  buildOffsetDiagramGeometry,
} from '../diagram/offsetDiagramGeometry';

describe('buildOffsetDiagramGeometry (vertical)', () => {
  test('30° offset produces a readable jog with bend 2 above bend 1', () => {
    const geo = buildOffsetDiagramGeometry({
      bendAngleDeg: 30,
      distanceBetweenBendsInches: 12,
    });

    expect(geo.shift).toBeGreaterThan(OFFSET_DIAGRAM_LAYOUT.shiftMin);
    expect(geo.x2).toBeGreaterThan(geo.x1); // jog to the side
    expect(geo.y2).toBeLessThan(geo.y1); // bend 2 is higher up the screen
    expect(geo.pipePath).toContain(`M ${OFFSET_DIAGRAM_LAYOUT.leftX} ${OFFSET_DIAGRAM_LAYOUT.bottomY}`);
    expect(geo.bendZone1).toContain('Q');
    expect(geo.bendZone2).toContain('Q');
  });

  test('shallower angle produces longer vertical travel and a smaller jog', () => {
    const shallow = buildOffsetDiagramGeometry({
      bendAngleDeg: 10,
      distanceBetweenBendsInches: 12,
    });
    const steep = buildOffsetDiagramGeometry({
      bendAngleDeg: 60,
      distanceBetweenBendsInches: 12,
    });

    expect(shallow.dy).toBeGreaterThan(steep.dy);
    expect(shallow.shift).toBeLessThan(steep.shift);
  });

  test('mark 1 shifts the first bend along the run', () => {
    const withoutMark = buildOffsetDiagramGeometry({
      bendAngleDeg: 45,
      distanceBetweenBendsInches: 10,
    });
    const withMark = buildOffsetDiagramGeometry({
      bendAngleDeg: 45,
      distanceBetweenBendsInches: 10,
      mark1Inches: 20,
    });

    expect(withMark.y1).not.toBe(withoutMark.y1);
  });
});
