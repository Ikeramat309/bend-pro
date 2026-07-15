import {
  SADDLE3_DIAGRAM_LAYOUT,
  buildSaddle3DiagramGeometry,
  capSaddle3DiagramInputs,
} from '../diagram/saddle3DiagramGeometry';

describe('capSaddle3DiagramInputs', () => {
  test('caps obstruction height for diagram scaling', () => {
    const capped = capSaddle3DiagramInputs(12, 24);
    expect(capped.visualObsIn).toBe(4);
    expect(capped.visualCenterToSide).toBeCloseTo(8);
  });

  test('preserves ratio below cap', () => {
    const result = capSaddle3DiagramInputs(2, 5.23);
    expect(result.visualObsIn).toBe(2);
    expect(result.visualCenterToSide).toBeCloseTo(5.23);
  });
});

describe('buildSaddle3DiagramGeometry', () => {
  test('builds pipe path and bend zones for typical inputs', () => {
    const geo = buildSaddle3DiagramGeometry(2, 5.23, 22.5);

    expect(geo.peakY).toBeLessThan(228);
    expect(geo.x1).toBeLessThan(180);
    expect(geo.x2).toBeGreaterThan(180);
    expect(geo.pipePath).toContain('M 24 228');
    expect(geo.bendLeft).toContain('Q');
    expect(geo.bendCenter).toContain('Q 180');
    expect(geo.bendRight).toContain('Q');
  });

  test('obstruction radius scales with visual height', () => {
    const small = buildSaddle3DiagramGeometry(1, 4, 22.5);
    const large = buildSaddle3DiagramGeometry(3, 6, 22.5);

    expect(large.obsRadius).toBeGreaterThan(small.obsRadius);
  });

  test.each([
    [0.25, 0.65, 22.5],
    [2, 4, 30],
    [4, 5.66, 45],
  ])(
    'keeps preset geometry inside the live diagram for %p in at %p in / %p degrees',
    (obstructionHeight, centerToSide, sideAngle) => {
      const geo = buildSaddle3DiagramGeometry(obstructionHeight, centerToSide, sideAngle);

      expect(geo.x1).toBeGreaterThanOrEqual(24);
      expect(geo.x2).toBeLessThanOrEqual(336);
      expect(geo.peakY).toBeGreaterThanOrEqual(72);
      expect(geo.peakY).toBeLessThan(228);
      expect(geo.x1 + geo.x2).toBeCloseTo(360);
    },
  );

  test('keeps capped extreme obstruction geometry readable', () => {
    const capped = capSaddle3DiagramInputs(24, 62.71);
    const geo = buildSaddle3DiagramGeometry(
      capped.visualObsIn,
      capped.visualCenterToSide,
      22.5,
    );

    expect(capped.visualObsIn).toBe(4);
    expect(geo.obsRadius).toBeLessThanOrEqual(32);
    expect(geo.peakY).toBeGreaterThanOrEqual(72);
    expect(geo.x1).toBeGreaterThanOrEqual(24);
    expect(geo.x2).toBeLessThanOrEqual(336);
  });

  test.each([22.5, 30, 45])(
    'preserves pipe clearance and finite geometry for extreme values at %s°',
    (sideAngle) => {
      const capped = capSaddle3DiagramInputs(100, 1_000);
      const geo = buildSaddle3DiagramGeometry(
        capped.visualObsIn,
        capped.visualCenterToSide,
        sideAngle,
      );
      const pipeBottomAtPeak = geo.peakY + SADDLE3_DIAGRAM_LAYOUT.pipeHalf;
      const obstructionTop = SADDLE3_DIAGRAM_LAYOUT.baseY - geo.obsRadius * 2;

      expect(geo.pipePath).not.toContain('NaN');
      expect(geo.pipePath).not.toContain('Infinity');
      expect(obstructionTop - pipeBottomAtPeak).toBeGreaterThanOrEqual(
        SADDLE3_DIAGRAM_LAYOUT.clearancePx - 0.001,
      );
      expect(geo.x1).toBeGreaterThanOrEqual(SADDLE3_DIAGRAM_LAYOUT.startX);
      expect(geo.x2).toBeLessThanOrEqual(SADDLE3_DIAGRAM_LAYOUT.endX);
    },
  );
});
