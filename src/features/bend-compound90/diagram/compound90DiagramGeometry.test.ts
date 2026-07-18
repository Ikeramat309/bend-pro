import {
  COMPOUND90_DIAGRAM_LAYOUT,
  buildCompound90DiagramGeometry,
} from './compound90DiagramGeometry';

describe('buildCompound90DiagramGeometry', () => {
  test.each(['circle', 'box', 'diamond'] as const)(
    'keeps %s geometry finite and inside the canvas',
    (shape) => {
      const geometry = buildCompound90DiagramGeometry({
        shape,
        primaryDimensionInches: 100_000,
        secondaryDimensionInches: 100_000,
        clearanceInches: 100_000,
      });
      expect(geometry.pipePath).not.toMatch(/NaN|Infinity/);
      expect(geometry.obstruction.x).toBeGreaterThan(0);
      expect(geometry.obstruction.y).toBeGreaterThan(0);
      expect(geometry.obstruction.x + geometry.obstruction.width).toBeLessThan(360);
      expect(geometry.obstruction.y + geometry.obstruction.height).toBeLessThanOrEqual(
        COMPOUND90_DIAGRAM_LAYOUT.baseY,
      );
    },
  );

  test('keeps both wrap marks on the displayed bend centers', () => {
    const geometry = buildCompound90DiagramGeometry({
      shape: 'circle',
      primaryDimensionInches: 7,
    });
    expect(geometry.firstMark.rotation).toBe(-22.5);
    expect(geometry.firstMark.x).toBeCloseTo(98.902, 3);
    expect(geometry.firstMark.y).toBeCloseTo(223.348, 3);
    expect(geometry.secondMark.rotation).toBe(-67.5);
    expect(geometry.secondMark.x).toBeCloseTo(262.348, 3);
    expect(geometry.secondMark.y).toBeCloseTo(59.902, 3);
  });

  test('draws a bounded clearance envelope without changing the conduit path', () => {
    const noClearance = buildCompound90DiagramGeometry({
      shape: 'box',
      primaryDimensionInches: 4,
      secondaryDimensionInches: 6,
    });
    const withClearance = buildCompound90DiagramGeometry({
      shape: 'box',
      primaryDimensionInches: 4,
      secondaryDimensionInches: 6,
      clearanceInches: 2,
    });
    expect(withClearance.pipePath).toBe(noClearance.pipePath);
    expect(withClearance.obstruction.clearancePixels).toBeCloseTo(4.8, 8);
  });
});
