import {
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
  });

  test('obstruction radius scales with visual height', () => {
    const small = buildSaddle3DiagramGeometry(1, 4, 22.5);
    const large = buildSaddle3DiagramGeometry(3, 6, 22.5);

    expect(large.obsRadius).toBeGreaterThan(small.obsRadius);
  });
});
