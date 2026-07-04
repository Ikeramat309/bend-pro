/** World-space point for isometric pipe diagrams. */
export type Vec3 = { x: number; y: number; z: number };

export type Point2 = { x: number; y: number };

export type Rect2 = { x: number; y: number; width: number; height: number };

const COS_30 = Math.cos(Math.PI / 6);
const SIN_30 = Math.sin(Math.PI / 6);

/**
 * Classic isometric projection with SVG handedness locked by tests:
 * - +X → right and down on screen
 * - +Y → left and down on screen
 * - +Z → up on screen (smaller SVG y)
 *
 * screenX = (x − y) · cos(30°)
 * screenY = (x + y) · sin(30°) − z
 */
export function projectIso(p: Vec3): Point2 {
  return {
    x: (p.x - p.y) * COS_30,
    y: (p.x + p.y) * SIN_30 - p.z,
  };
}


export type IsoTransform = {
  scale: number;
  offsetX: number;
  offsetY: number;
};

export function applyIsoTransform(p: Point2, transform: IsoTransform): Point2 {
  return {
    x: p.x * transform.scale + transform.offsetX,
    y: p.y * transform.scale + transform.offsetY,
  };
}

export function projectAndTransform(p: Vec3, transform: IsoTransform): Point2 {
  return applyIsoTransform(projectIso(p), transform);
}

export type Bounds2 = {
  minX: number;
  minY: number;
  maxX: number;
  maxY: number;
};

export function boundsFromPoints(points: readonly Point2[]): Bounds2 {
  if (points.length === 0) {
    return { minX: 0, minY: 0, maxX: 0, maxY: 0 };
  }

  let minX = points[0].x;
  let minY = points[0].y;
  let maxX = points[0].x;
  let maxY = points[0].y;

  for (let i = 1; i < points.length; i += 1) {
    const p = points[i];
    minX = Math.min(minX, p.x);
    minY = Math.min(minY, p.y);
    maxX = Math.max(maxX, p.x);
    maxY = Math.max(maxY, p.y);
  }

  return { minX, minY, maxX, maxY };
}

export function inflateBounds(bounds: Bounds2, amount: number): Bounds2 {
  return {
    minX: bounds.minX - amount,
    minY: bounds.minY - amount,
    maxX: bounds.maxX + amount,
    maxY: bounds.maxY + amount,
  };
}

export function boundsToRect(bounds: Bounds2): Rect2 {
  return {
    x: bounds.minX,
    y: bounds.minY,
    width: bounds.maxX - bounds.minX,
    height: bounds.maxY - bounds.minY,
  };
}

/**
 * Fit projected centerline points into a target viewBox with uniform scale and
 * translation. Padding is applied on all sides in screen pixels.
 */
export function fitIsoTransform(
  projectedPoints: readonly Point2[],
  viewBox: Rect2,
  padding: number,
): IsoTransform {
  if (projectedPoints.length === 0) {
    return { scale: 1, offsetX: viewBox.x + viewBox.width / 2, offsetY: viewBox.y + viewBox.height / 2 };
  }

  const bounds = boundsFromPoints(projectedPoints);
  const contentWidth = Math.max(bounds.maxX - bounds.minX, 1e-6);
  const contentHeight = Math.max(bounds.maxY - bounds.minY, 1e-6);

  const availableWidth = Math.max(viewBox.width - padding * 2, 1);
  const availableHeight = Math.max(viewBox.height - padding * 2, 1);
  const scale = Math.min(availableWidth / contentWidth, availableHeight / contentHeight);

  const centerX = (bounds.minX + bounds.maxX) / 2;
  const centerY = (bounds.minY + bounds.maxY) / 2;
  const viewCenterX = viewBox.x + viewBox.width / 2;
  const viewCenterY = viewBox.y + viewBox.height / 2;

  return {
    scale,
    offsetX: viewCenterX - centerX * scale,
    offsetY: viewCenterY - centerY * scale,
  };
}
