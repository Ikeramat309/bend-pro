import { diagramMetrics } from '../diagramTheme';

import { labelPlacementsAvoidPipe, placeIsoLabels } from './isoLabels';
import { applyIsoTransform, fitIsoTransform, projectIso } from './isoProjection';
import { buildPipeCenterline } from './pipePath3d';

describe('placeIsoLabels', () => {
  test('placements avoid inflated pipe bounds for a sample isometric centerline', () => {
    const waypoints = [
      { x: 0, y: 0, z: 0 },
      { x: 14, y: 0, z: 0 },
      { x: 22, y: 6, z: 0 },
      { x: 22, y: 6, z: 20 },
    ];
    const centerline = buildPipeCenterline(waypoints, 2.2, 12).points;
    const rawProjected = centerline.map(projectIso);
    const frame = { x: 0, y: 0, width: 360, height: 300 };
    const transform = fitIsoTransform(rawProjected, frame, 28);
    const projected = rawProjected.map((p) => applyIsoTransform(p, transform));

    const bounds = {
      minX: Math.min(...projected.map((p) => p.x)),
      minY: Math.min(...projected.map((p) => p.y)),
      maxX: Math.max(...projected.map((p) => p.x)),
      maxY: Math.max(...projected.map((p) => p.y)),
    };

    const placements = placeIsoLabels(
      [
        { id: 'a', featurePoint: projected[8], width: 72, height: 28, preferredSlot: 'left' },
        { id: 'b', featurePoint: projected[20], width: 72, height: 28, preferredSlot: 'right' },
        { id: 'c', featurePoint: projected[14], width: 120, height: 32, preferredSlot: 'bottom' },
        { id: 'd', featurePoint: projected[10], width: 88, height: 32, preferredSlot: 'left' },
        { id: 'e', featurePoint: projected[6], width: 36, height: 18, preferredSlot: 'top' },
      ],
      bounds,
      frame,
      diagramMetrics.pipeStroke,
    );

    expect(placements).toHaveLength(5);
    expect(labelPlacementsAvoidPipe(placements, bounds, diagramMetrics.pipeStroke)).toBe(true);
  });
});
