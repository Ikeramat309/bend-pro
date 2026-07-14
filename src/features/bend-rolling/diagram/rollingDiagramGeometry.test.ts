import {
  ROLLING_GHOST_GEOMETRY,
  buildRollingDiagramGeometry,
} from './rollingDiagramGeometry';

describe('buildRollingDiagramGeometry', () => {
  const geometry = buildRollingDiagramGeometry({
    offsetHeightInches: 6,
    offsetRollInches: 8,
    trueOffsetInches: 10,
    distanceBetweenBendsInches: 20,
    bendAngleDeg: 30,
  });

  it('draws two parallel runs separated in both height and roll', () => {
    const [start, firstBend, secondBend, end] = geometry.waypoints;

    expect(start.y).toBe(firstBend.y);
    expect(start.z).toBe(firstBend.z);
    expect(secondBend.y).toBe(end.y);
    expect(secondBend.z).toBe(end.z);
    expect(secondBend.y).toBeLessThan(firstBend.y);
    expect(secondBend.z).toBeGreaterThan(firstBend.z);
  });

  it('preserves the input component ratio in presentation geometry', () => {
    const [, firstBend, secondBend] = geometry.waypoints;
    const drawnHeight = secondBend.z - firstBend.z;
    const drawnRoll = Math.abs(secondBend.y - firstBend.y);

    expect(drawnHeight / drawnRoll).toBeCloseTo(6 / 8, 6);
  });

  it('keeps marks and bend zones on the sampled centerline', () => {
    const lastIndex = geometry.centerline.length - 1;

    expect(geometry.firstMarkIndex).toBeGreaterThanOrEqual(0);
    expect(geometry.secondMarkIndex).toBeGreaterThan(geometry.firstMarkIndex);
    expect(geometry.secondMarkIndex).toBeLessThanOrEqual(lastIndex);
    expect(geometry.firstZone.startIndex).toBeLessThan(geometry.firstZone.endIndex);
    expect(geometry.secondZone.startIndex).toBeLessThan(geometry.secondZone.endIndex);
    expect(geometry.secondZone.endIndex).toBeLessThanOrEqual(lastIndex);
  });

  it('fits the pipe inside the diagram viewBox', () => {
    expect(geometry.projectedBounds.minX).toBeGreaterThanOrEqual(0);
    expect(geometry.projectedBounds.maxX).toBeLessThanOrEqual(360);
    expect(geometry.projectedBounds.minY).toBeGreaterThanOrEqual(0);
    expect(geometry.projectedBounds.maxY).toBeLessThanOrEqual(300);
  });

  it('builds the floor, dimensions, and open tube ends', () => {
    expect(geometry.floorPatch).toHaveLength(4);
    expect(geometry.floorGrid.length).toBeGreaterThan(0);
    expect(geometry.floorShadow.length).toBe(geometry.centerline.length);
    expect(geometry.endCaps).toHaveLength(2);
    expect(geometry.rollDim.start).not.toEqual(geometry.rollDim.end);
    expect(geometry.heightDim.start).not.toEqual(geometry.heightDim.end);
    expect(geometry.dbbDim.start).not.toEqual(geometry.dbbDim.end);
  });

  it('ships a stable ghost scene for the empty state', () => {
    expect(ROLLING_GHOST_GEOMETRY.centerline.length).toBeGreaterThan(4);
    expect(ROLLING_GHOST_GEOMETRY.endCaps).toHaveLength(2);
  });
});
