import {
  SADDLE4_DIAGRAM_LAYOUT,
  buildSaddle4DiagramGeometry,
} from './saddle4DiagramGeometry';

describe('buildSaddle4DiagramGeometry', () => {
  test.each([22.5, 30, 45])('keeps the visible slopes faithful at %s°', (bendAngleDeg) => {
    const geo = buildSaddle4DiagramGeometry({
      obstructionHeightInches: 2,
      betweenBendsInches: 5.2,
      saddleWidthInches: 4,
      bendAngleDeg,
    });

    expect(geo.rise / geo.dxDiag).toBeCloseTo(
      Math.tan((bendAngleDeg * Math.PI) / 180),
      6,
    );
    expect(geo.xOL).toBeGreaterThanOrEqual(SADDLE4_DIAGRAM_LAYOUT.startX);
    expect(geo.xOR).toBeLessThanOrEqual(SADDLE4_DIAGRAM_LAYOUT.endX);
  });

  test('keeps the tube clear of the obstruction at compact inputs', () => {
    const geo = buildSaddle4DiagramGeometry({
      obstructionHeightInches: 0.5,
      betweenBendsInches: 1.3,
      bendAngleDeg: 22.5,
    });
    const pipeBottom = geo.topY + SADDLE4_DIAGRAM_LAYOUT.pipeHalf;
    const obstructionTop = SADDLE4_DIAGRAM_LAYOUT.baseY - geo.obsHeightPx;

    expect(obstructionTop - pipeBottom).toBeGreaterThanOrEqual(
      SADDLE4_DIAGRAM_LAYOUT.clearance - 0.001,
    );
    expect(obstructionTop - geo.topY).toBeGreaterThan(22.5);
  });

  test('clamps large dimensions without pushing marks outside the canvas', () => {
    const geo = buildSaddle4DiagramGeometry({
      obstructionHeightInches: 48,
      betweenBendsInches: 120,
      saddleWidthInches: 96,
      bendAngleDeg: 22.5,
    });

    expect(geo.xOL).toBeGreaterThanOrEqual(SADDLE4_DIAGRAM_LAYOUT.startX);
    expect(geo.xOR).toBeLessThanOrEqual(SADDLE4_DIAGRAM_LAYOUT.endX);
    expect(geo.topY).toBeGreaterThanOrEqual(SADDLE4_DIAGRAM_LAYOUT.peakMinY);
    expect(geo.pipePath).not.toContain('NaN');
  });

  test('an entered saddle width widens the flat top when room allows', () => {
    const withoutWidth = buildSaddle4DiagramGeometry({
      obstructionHeightInches: 2,
      betweenBendsInches: 2.83,
      bendAngleDeg: 45,
    });
    const withWidth = buildSaddle4DiagramGeometry({
      obstructionHeightInches: 2,
      betweenBendsInches: 2.83,
      saddleWidthInches: 10,
      bendAngleDeg: 45,
    });

    expect(withWidth.halfTopPx).toBeGreaterThan(withoutWidth.halfTopPx);
  });

  test.each([22.5, 30, 45])(
    'keeps extreme width and height layouts separated at %s°',
    (bendAngleDeg) => {
      const geo = buildSaddle4DiagramGeometry({
        obstructionHeightInches: 100_000,
        betweenBendsInches: 100_000,
        saddleWidthInches: 100_000,
        bendAngleDeg,
      });
      const pipeBottom = geo.topY + SADDLE4_DIAGRAM_LAYOUT.pipeHalf;
      const obstructionTop = SADDLE4_DIAGRAM_LAYOUT.baseY - geo.obsHeightPx;

      expect(geo.pipePath).not.toContain('NaN');
      expect(geo.pipePath).not.toContain('Infinity');
      expect(geo.xOL - SADDLE4_DIAGRAM_LAYOUT.startX).toBeGreaterThanOrEqual(
        SADDLE4_DIAGRAM_LAYOUT.minEndRun - 0.001,
      );
      expect(SADDLE4_DIAGRAM_LAYOUT.endX - geo.xOR).toBeGreaterThanOrEqual(
        SADDLE4_DIAGRAM_LAYOUT.minEndRun - 0.001,
      );
      expect(obstructionTop - pipeBottom).toBeGreaterThanOrEqual(
        SADDLE4_DIAGRAM_LAYOUT.clearance - 0.001,
      );
      expect(geo.topY - 47).toBeGreaterThanOrEqual(20);
    },
  );
});
