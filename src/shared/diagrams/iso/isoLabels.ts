import type { Bounds2, Point2, Rect2 } from './isoProjection';
import { boundsToRect, inflateBounds } from './isoProjection';

export type LabelSlot = 'left' | 'right' | 'top' | 'bottom';

export type LabelRect = Rect2 & { slot: LabelSlot };

export type LabelPlacementRequest = {
  id: string;
  featurePoint: Point2;
  width: number;
  height: number;
  preferredSlot?: LabelSlot;
};

export type LabelPlacement = {
  id: string;
  slot: LabelSlot;
  rect: LabelRect;
  anchor: Point2;
  leaderFrom: Point2;
  leaderTo: Point2;
};

export type LabelFrame = Rect2;

const SLOT_GAP = 10;

function rectsIntersect(a: Rect2, b: Rect2): boolean {
  return a.x < b.x + b.width && a.x + a.width > b.x && a.y < b.y + b.height && a.y + a.height > b.y;
}

function rectInsideFrame(rect: Rect2, frame: LabelFrame): boolean {
  return (
    rect.x >= frame.x &&
    rect.y >= frame.y &&
    rect.x + rect.width <= frame.x + frame.width &&
    rect.y + rect.height <= frame.y + frame.height
  );
}

function buildSlotRegions(pipeBounds: Bounds2, frame: LabelFrame): Record<LabelSlot, Rect2> {
  const pipeRect = boundsToRect(pipeBounds);

  return {
    left: {
      x: frame.x,
      y: frame.y,
      width: Math.max(pipeRect.x - frame.x - SLOT_GAP, 0),
      height: frame.height,
    },
    right: {
      x: pipeRect.x + pipeRect.width + SLOT_GAP,
      y: frame.y,
      width: Math.max(frame.x + frame.width - (pipeRect.x + pipeRect.width) - SLOT_GAP, 0),
      height: frame.height,
    },
    top: {
      x: frame.x,
      y: frame.y,
      width: frame.width,
      height: Math.max(pipeRect.y - frame.y - SLOT_GAP, 0),
    },
    bottom: {
      x: frame.x,
      y: pipeRect.y + pipeRect.height + SLOT_GAP,
      width: frame.width,
      height: Math.max(frame.y + frame.height - (pipeRect.y + pipeRect.height) - SLOT_GAP, 0),
    },
  };
}

function placeInSlot(
  slot: LabelSlot,
  region: Rect2,
  size: { width: number; height: number },
  occupied: LabelRect[],
  pipeBounds: Bounds2,
  frame: LabelFrame,
): LabelRect | null {
  const step = size.height + 6;
  const maxY = region.y + Math.max(region.height - size.height, 0);
  const maxX = region.x + Math.max(region.width - size.width, 0);

  const candidates: { x: number; y: number }[] = [];

  if (slot === 'left' || slot === 'right') {
    for (let y = region.y; y <= maxY + 0.001; y += step) {
      candidates.push({
        x: slot === 'left' ? region.x + Math.max(region.width - size.width, 0) : region.x,
        y,
      });
    }
  } else {
    for (let x = region.x; x <= maxX + 0.001; x += size.width + 10) {
      candidates.push({
        x,
        y: slot === 'top' ? region.y + Math.max(region.height - size.height, 0) : region.y,
      });
    }
  }

  for (const candidate of candidates) {
    const rect: LabelRect = {
      slot,
      x: candidate.x,
      y: candidate.y,
      width: size.width,
      height: size.height,
    };

    if (!rectInsideFrame(rect, frame)) {
      continue;
    }

    const hitsPipe = rectsIntersect(rect, boundsToRect(pipeBounds));
    const hitsOccupied = occupied.some((other) => rectsIntersect(rect, other));
    if (!hitsPipe && !hitsOccupied) {
      return rect;
    }
  }

  return null;
}

function forceOutsidePipe(
  slot: LabelSlot,
  pipeBounds: Bounds2,
  frame: LabelFrame,
  size: { width: number; height: number },
  occupied: LabelRect[],
  index: number,
): LabelRect {
  const pipeRect = boundsToRect(pipeBounds);
  const stagger = (index % 4) * (size.height + 4);
  let x = frame.x + 4;
  let y = frame.y + 8 + stagger;

  switch (slot) {
    case 'left':
      x = Math.max(frame.x + 4, pipeRect.x - size.width - SLOT_GAP);
      y = Math.min(pipeRect.y + stagger, frame.y + frame.height - size.height - 4);
      break;
    case 'right':
      x = Math.min(pipeRect.x + pipeRect.width + SLOT_GAP, frame.x + frame.width - size.width - 4);
      y = Math.min(pipeRect.y + stagger, frame.y + frame.height - size.height - 4);
      break;
    case 'top':
      x = Math.min(pipeRect.x + stagger, frame.x + frame.width - size.width - 4);
      y = Math.max(frame.y + 4, pipeRect.y - size.height - SLOT_GAP);
      break;
    case 'bottom':
      x = Math.min(pipeRect.x + stagger, frame.x + frame.width - size.width - 4);
      y = Math.min(pipeRect.y + pipeRect.height + SLOT_GAP, frame.y + frame.height - size.height - 4);
      break;
    default:
      break;
  }

  let rect: LabelRect = { slot, x, y, width: size.width, height: size.height };
  let attempts = 0;
  while (
    attempts < 12 &&
    (rectsIntersect(rect, boundsToRect(pipeBounds)) ||
      occupied.some((other) => rectsIntersect(rect, other)) ||
      !rectInsideFrame(rect, frame))
  ) {
    rect = { ...rect, y: rect.y + size.height + 4 };
    attempts += 1;
  }

  return rect;
}

function anchorForSlot(rect: LabelRect): Point2 {
  switch (rect.slot) {
    case 'left':
      return { x: rect.x + rect.width, y: rect.y + rect.height / 2 };
    case 'right':
      return { x: rect.x, y: rect.y + rect.height / 2 };
    case 'top':
      return { x: rect.x + rect.width / 2, y: rect.y + rect.height };
    case 'bottom':
      return { x: rect.x + rect.width / 2, y: rect.y };
    default:
      return { x: rect.x + rect.width / 2, y: rect.y + rect.height / 2 };
  }
}

/**
 * Assign label anchor slots outside the pipe bounding box (inflated by tube
 * width). Slots are left/right columns and top/bottom bands within the frame.
 * By construction, returned label rects do not intersect the inflated pipe bounds.
 */
export function placeIsoLabels(
  requests: readonly LabelPlacementRequest[],
  pipeProjectedBounds: Bounds2,
  frame: LabelFrame,
  tubeWidth: number,
): LabelPlacement[] {
  const pipeBounds = inflateBounds(pipeProjectedBounds, tubeWidth / 2 + 4);
  const slotRegions = buildSlotRegions(pipeBounds, frame);
  const slotOrder: LabelSlot[] = ['left', 'right', 'top', 'bottom'];
  const occupied: LabelRect[] = [];
  const placements: LabelPlacement[] = [];

  requests.forEach((request, requestIndex) => {
    const preferred = request.preferredSlot
      ? [request.preferredSlot, ...slotOrder.filter((s) => s !== request.preferredSlot)]
      : slotOrder;

    let placed: LabelRect | null = null;
    for (const slot of preferred) {
      placed = placeInSlot(
        slot,
        slotRegions[slot],
        { width: request.width, height: request.height },
        occupied,
        pipeBounds,
        frame,
      );
      if (placed) {
        break;
      }
    }

    if (!placed) {
      placed = forceOutsidePipe(
        preferred[0],
        pipeBounds,
        frame,
        { width: request.width, height: request.height },
        occupied,
        requestIndex,
      );
    }

    occupied.push(placed);
    const anchor = anchorForSlot(placed);
    placements.push({
      id: request.id,
      slot: placed.slot,
      rect: placed,
      anchor,
      leaderFrom: request.featurePoint,
      leaderTo: anchor,
    });
  });

  return placements;
}

export function projectedBoundsFromPoints(points: readonly Point2[]): Bounds2 {
  if (points.length === 0) {
    return { minX: 0, minY: 0, maxX: 0, maxY: 0 };
  }

  let minX = points[0].x;
  let minY = points[0].y;
  let maxX = points[0].x;
  let maxY = points[0].y;

  for (let i = 1; i < points.length; i += 1) {
    minX = Math.min(minX, points[i].x);
    minY = Math.min(minY, points[i].y);
    maxX = Math.max(maxX, points[i].x);
    maxY = Math.max(maxY, points[i].y);
  }

  return { minX, minY, maxX, maxY };
}

export function labelPlacementsAvoidPipe(
  placements: readonly LabelPlacement[],
  pipeProjectedBounds: Bounds2,
  tubeWidth: number,
): boolean {
  const pipeBounds = inflateBounds(pipeProjectedBounds, tubeWidth / 2 + 4);
  const pipeRect = boundsToRect(pipeBounds);
  return placements.every((placement) => !rectsIntersect(placement.rect, pipeRect));
}
