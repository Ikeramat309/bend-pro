export type { Vec3, Point2, Rect2, Bounds2, IsoTransform } from './isoProjection';
export {
  projectIso,
  applyIsoTransform,
  projectAndTransform,
  boundsFromPoints,
  inflateBounds,
  boundsToRect,
  fitIsoTransform,
} from './isoProjection';

export type { PipeArc, PipeCenterline } from './pipePath3d';
export {
  buildPipeCenterline,
  pathLengthAt,
  totalPathLength,
  locateAtArcLengthFraction,
  segmentLength,
} from './pipePath3d';

export type {
  LabelSlot,
  LabelRect,
  LabelPlacementRequest,
  LabelPlacement,
  LabelFrame,
} from './isoLabels';
export {
  placeIsoLabels,
  projectedBoundsFromPoints,
  labelPlacementsAvoidPipe,
} from './isoLabels';

export { IsoPipe, type IsoPipeProps, type IsoPipeZone, type IsoPipeMark } from './IsoPipe';

export type { FloorGridLine, FloorGridBounds } from './isoScene';
export {
  buildFloorGrid,
  floorPatchCorners,
  buildFloorShadow,
  buildEndCapCircle,
  buildAngleArcOnFloor,
} from './isoScene';
