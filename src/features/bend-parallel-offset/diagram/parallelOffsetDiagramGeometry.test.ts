import {
  PARALLEL_OFFSET_DIAGRAM_LAYOUT,
  buildParallelOffsetDiagramGeometry,
} from './parallelOffsetDiagramGeometry';

describe('buildParallelOffsetDiagramGeometry', () => {
  test.each([10, 22.5, 30, 45, 60])('keeps pipe diagonals faithful at %s°', (bendAngleDeg) => {
    const geometry = buildParallelOffsetDiagramGeometry({
      mode: 'layout',
      bendAngleDeg,
      conduitCount: 8,
      shiftDirection: 'toward-free-end',
    });

    expect(geometry.rise / geometry.run).toBeCloseTo(
      Math.tan((bendAngleDeg * Math.PI) / 180),
      8,
    );
    expect(geometry.pipes).toHaveLength(8);
    expect(geometry.pipes.every((pipe) => !pipe.pipePath.includes('NaN'))).toBe(true);
  });

  test.each(['toward-free-end', 'away-from-free-end'] as const)(
    'keeps an eight-conduit %s layout inside the canvas',
    (shiftDirection) => {
      const geometry = buildParallelOffsetDiagramGeometry({
        mode: 'layout',
        bendAngleDeg: 60,
        conduitCount: 8,
        shiftDirection,
      });
      for (const pipe of geometry.pipes) {
        expect(pipe.y + PARALLEL_OFFSET_DIAGRAM_LAYOUT.pipeHalf).toBeLessThanOrEqual(252);
        expect(pipe.topY - PARALLEL_OFFSET_DIAGRAM_LAYOUT.pipeHalf).toBeGreaterThanOrEqual(35);
        expect(pipe.x1).toBeGreaterThan(35);
        expect(pipe.x2).toBeLessThan(335);
      }
    },
  );

  test('uses exactly the half-angle tangent relationship for the visual stagger', () => {
    const geometry = buildParallelOffsetDiagramGeometry({
      mode: 'layout',
      bendAngleDeg: 30,
      conduitCount: 4,
      shiftDirection: 'away-from-free-end',
    });

    expect(geometry.visualShiftPerConduit / geometry.rackGap).toBeCloseTo(
      Math.tan(Math.PI / 12),
      10,
    );
    expect(geometry.pipes[1].x1 - geometry.pipes[0].x1).toBeCloseTo(
      geometry.visualShiftPerConduit,
      10,
    );
  });

  test('simple mode stays a legible three-pipe explanation', () => {
    const geometry = buildParallelOffsetDiagramGeometry({
      mode: 'simple',
      bendAngleDeg: 30,
      conduitCount: 8,
      shiftDirection: 'toward-free-end',
    });
    expect(geometry.pipes).toHaveLength(3);
  });
});

