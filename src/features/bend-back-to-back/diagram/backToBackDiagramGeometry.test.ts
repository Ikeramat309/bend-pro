import {
  BACK_TO_BACK_DIAGRAM_LAYOUT,
  buildBackToBackDiagramGeometry,
} from './backToBackDiagramGeometry';

describe('buildBackToBackDiagramGeometry', () => {
  test('reference geometry is centered and remains inside the viewBox', () => {
    const geo = buildBackToBackDiagramGeometry({
      backToBackDistanceInches: 36,
      firstStubLengthInches: 12,
    });

    expect((geo.leftX + geo.rightX) / 2).toBe(BACK_TO_BACK_DIAGRAM_LAYOUT.centerX);
    expect(geo.leftX).toBeGreaterThanOrEqual(50);
    expect(geo.rightX).toBeLessThanOrEqual(310);
    expect(geo.topY).toBeGreaterThan(50);
    expect(geo.bottomY).toBeLessThan(250);
    expect(geo.pipePath).not.toContain('NaN');
  });

  test('back span responds to physical distance until readable clamps apply', () => {
    const short = buildBackToBackDiagramGeometry({
      backToBackDistanceInches: 12,
      firstStubLengthInches: 36,
    });
    const long = buildBackToBackDiagramGeometry({
      backToBackDistanceInches: 72,
      firstStubLengthInches: 12,
    });

    expect(long.backSpanPx).toBeGreaterThan(short.backSpanPx);
    expect(short.backSpanPx).toBeGreaterThanOrEqual(
      BACK_TO_BACK_DIAGRAM_LAYOUT.minBackSpanPx,
    );
    expect(long.backSpanPx).toBeLessThanOrEqual(
      BACK_TO_BACK_DIAGRAM_LAYOUT.maxBackSpanPx,
    );
  });

  test('first-stub length changes the leg presentation without moving field marks off pipe', () => {
    const short = buildBackToBackDiagramGeometry({
      backToBackDistanceInches: 36,
      firstStubLengthInches: 8,
    });
    const tall = buildBackToBackDiagramGeometry({
      backToBackDistanceInches: 36,
      firstStubLengthInches: 40,
    });

    expect(tall.legPx).toBeGreaterThan(short.legPx);
    expect(short.arrowMark.x).toBe(short.leftX);
    expect(short.arrowMark.y).toBeGreaterThan(short.topY + short.radius);
    expect(short.starMark.y).toBe(short.topY);
    expect(short.starMark.x).toBeLessThan(short.rightX - short.radius);
  });

  test.each([
    { backToBackDistanceInches: 0, firstStubLengthInches: 0 },
    { backToBackDistanceInches: Number.NaN, firstStubLengthInches: Number.POSITIVE_INFINITY },
    { backToBackDistanceInches: 1_000_000, firstStubLengthInches: 1 },
    { backToBackDistanceInches: 1, firstStubLengthInches: 1_000_000 },
  ])('extreme input %# stays finite and clamped', (input) => {
    const geo = buildBackToBackDiagramGeometry(input);

    for (const value of [
      geo.leftX,
      geo.rightX,
      geo.topY,
      geo.bottomY,
      geo.radius,
      geo.backSpanPx,
      geo.legPx,
      geo.arrowMark.x,
      geo.arrowMark.y,
      geo.starMark.x,
      geo.starMark.y,
    ]) {
      expect(Number.isFinite(value)).toBe(true);
    }
    expect(geo.leftX).toBeGreaterThanOrEqual(50);
    expect(geo.rightX).toBeLessThanOrEqual(310);
    expect(geo.bottomY).toBeLessThanOrEqual(228);
  });
});
