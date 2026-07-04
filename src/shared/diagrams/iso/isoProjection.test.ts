import {
  applyIsoTransform,
  fitIsoTransform,
  projectIso,
  type Point2,
} from './isoProjection';

describe('projectIso', () => {
  const origin = projectIso({ x: 0, y: 0, z: 0 });

  test('+X moves right and down', () => {
    const p = projectIso({ x: 1, y: 0, z: 0 });
    expect(p.x).toBeGreaterThan(origin.x);
    expect(p.y).toBeGreaterThan(origin.y);
  });

  test('+Y moves left and down', () => {
    const p = projectIso({ x: 0, y: 1, z: 0 });
    expect(p.x).toBeLessThan(origin.x);
    expect(p.y).toBeGreaterThan(origin.y);
  });

  test('+Z moves up on screen (smaller SVG y)', () => {
    const p = projectIso({ x: 0, y: 0, z: 1 });
    expect(p.y).toBeLessThan(origin.y);
  });

  test('uses classic isometric formula', () => {
    const p = projectIso({ x: 4, y: 2, z: 3 });
    const cos30 = Math.cos(Math.PI / 6);
    const sin30 = Math.sin(Math.PI / 6);
    expect(p.x).toBeCloseTo((4 - 2) * cos30, 8);
    expect(p.y).toBeCloseTo((4 + 2) * sin30 - 3, 8);
  });
});

describe('fitIsoTransform', () => {
  test('fits projected points into viewBox with padding', () => {
    const projected: Point2[] = [
      { x: -10, y: -5 },
      { x: 20, y: 15 },
      { x: 5, y: 25 },
    ];
    const transform = fitIsoTransform(projected, { x: 0, y: 0, width: 360, height: 300 }, 24);

    const fitted = projected.map((p) => applyIsoTransform(p, transform));
    const xs = fitted.map((p) => p.x);
    const ys = fitted.map((p) => p.y);

    expect(Math.min(...xs)).toBeGreaterThanOrEqual(24 - 0.5);
    expect(Math.max(...xs)).toBeLessThanOrEqual(360 - 24 + 0.5);
    expect(Math.min(...ys)).toBeGreaterThanOrEqual(24 - 0.5);
    expect(Math.max(...ys)).toBeLessThanOrEqual(300 - 24 + 0.5);
  });
});
