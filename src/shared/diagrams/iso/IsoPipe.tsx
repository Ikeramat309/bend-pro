import { Fragment } from 'react';
import { G, Line, Path } from 'react-native-svg';

import { diagramMetrics } from '../diagramTheme';
import { useDiagramTheme } from '../useDiagramTheme';

import type { IsoTransform, Point2, Vec3 } from './isoProjection';
import { applyIsoTransform, projectIso } from './isoProjection';

export type IsoPipeZone = {
  startIndex: number;
  endIndex: number;
};

export type IsoPipeMark = {
  index: number;
};

export type IsoPipeProps = {
  /** Sampled 3D centerline points (display geometry only). */
  centerline: readonly Vec3[];
  transform: IsoTransform;
  zones?: readonly IsoPipeZone[];
  marks?: readonly IsoPipeMark[];
  gradientId: string;
  /** Optional material tuning for diagrams that need a softer satin finish. */
  bodyWidthRatio?: number;
  sheenWidthRatio?: number;
  sheenOpacity?: number;
  shadowWidthRatio?: number;
  shadowOpacity?: number;
  zoneFillOpacity?: number;
  zoneStrokeOpacity?: number;
  lineCap?: 'butt' | 'round' | 'square';
  showFloorLine?: boolean;
  floorLineStart?: Vec3;
  floorLineEnd?: Vec3;
};

const PIPE_BODY_RATIO = 0.7;
const PIPE_SHEEN_RATIO = 0.28;
const PIPE_SHEEN_OPACITY = 0.5;
const PIPE_SHADOW_RATIO = 30 / diagramMetrics.pipeStroke;
const PIPE_SHADOW_OPACITY = 0.72;
const MARK_TICK_HALF = 14;

function projectPoints(centerline: readonly Vec3[], transform: IsoTransform): Point2[] {
  return centerline.map((p) => applyIsoTransform(projectIso(p), transform));
}

function pointsToPath(points: readonly Point2[]): string {
  if (points.length === 0) {
    return '';
  }
  const [first, ...rest] = points;
  return `M ${first.x} ${first.y} ${rest.map((p) => `L ${p.x} ${p.y}`).join(' ')}`;
}

function pathTangent(points: readonly Point2[], index: number): Point2 {
  const prev = points[Math.max(index - 1, 0)];
  const next = points[Math.min(index + 1, points.length - 1)];
  const dx = next.x - prev.x;
  const dy = next.y - prev.y;
  const len = Math.hypot(dx, dy) || 1;
  return { x: dx / len, y: dy / len };
}

function perpendicular(tangent: Point2): Point2 {
  return { x: -tangent.y, y: tangent.x };
}

/**
 * Renders a single-run 3D centerline as the brushed-steel tube treatment.
 * Self-crossing depth sorting is a known future need for multi-run layouts.
 */
export function IsoPipe({
  centerline,
  transform,
  zones = [],
  marks = [],
  gradientId,
  bodyWidthRatio = PIPE_BODY_RATIO,
  sheenWidthRatio = PIPE_SHEEN_RATIO,
  sheenOpacity = PIPE_SHEEN_OPACITY,
  shadowWidthRatio = PIPE_SHADOW_RATIO,
  shadowOpacity = PIPE_SHADOW_OPACITY,
  zoneFillOpacity = 1,
  zoneStrokeOpacity = 1,
  lineCap = 'round',
  showFloorLine = false,
  floorLineStart,
  floorLineEnd,
}: IsoPipeProps) {
  const theme = useDiagramTheme();
  const projected = projectPoints(centerline, transform);
  const pathD = pointsToPath(projected);
  const fullWidth = diagramMetrics.pipeStroke;
  const bodyStroke = `url(#${gradientId})`;

  return (
    <Fragment>
      {showFloorLine && floorLineStart && floorLineEnd ? (
        <Line
          x1={applyIsoTransform(projectIso(floorLineStart), transform).x}
          y1={applyIsoTransform(projectIso(floorLineStart), transform).y}
          x2={applyIsoTransform(projectIso(floorLineEnd), transform).x}
          y2={applyIsoTransform(projectIso(floorLineEnd), transform).y}
          stroke={theme.mutedLabel}
          strokeWidth={0.75}
          strokeDasharray="4 5"
          opacity={0.35}
        />
      ) : null}

      <Path
        d={pathD}
        fill="none"
        stroke={theme.pipeShadow}
        strokeWidth={fullWidth * shadowWidthRatio}
        strokeLinecap={lineCap}
        strokeLinejoin="round"
        opacity={shadowOpacity}
      />

      <Path
        d={pathD}
        fill="none"
        stroke={theme.pipeCore}
        strokeWidth={fullWidth}
        strokeLinecap={lineCap}
        strokeLinejoin="round"
      />
      <Path
        d={pathD}
        fill="none"
        stroke={bodyStroke}
        strokeWidth={fullWidth * bodyWidthRatio}
        strokeLinecap={lineCap}
        strokeLinejoin="round"
      />
      <Path
        d={pathD}
        fill="none"
        stroke={theme.pipeSheen}
        strokeWidth={fullWidth * sheenWidthRatio}
        strokeLinecap={lineCap}
        strokeLinejoin="round"
        opacity={sheenOpacity}
      />

      {zones.map((zone, index) => {
        const slice = projected.slice(zone.startIndex, zone.endIndex + 1);
        if (slice.length < 2) {
          return null;
        }
        const zonePath = pointsToPath(slice);
        return (
          <Fragment key={`zone-${index}`}>
            <Path
              d={zonePath}
              fill="none"
              stroke={theme.bendZone.fill}
              strokeWidth={18}
              strokeLinecap="round"
              strokeLinejoin="round"
              opacity={zoneFillOpacity}
            />
            <Path
              d={zonePath}
              fill="none"
              stroke={theme.bendZone.stroke}
              strokeWidth={1.25}
              strokeLinecap="round"
              strokeLinejoin="round"
              opacity={zoneStrokeOpacity}
            />
          </Fragment>
        );
      })}

      {marks.map((mark, index) => {
        const point = projected[mark.index];
        if (!point) {
          return null;
        }
        const tangent = pathTangent(projected, mark.index);
        const normal = perpendicular(tangent);
        const offset = fullWidth * 0.42 + 2;
        const x1 = point.x - normal.x * (MARK_TICK_HALF + offset);
        const y1 = point.y - normal.y * (MARK_TICK_HALF + offset);
        const x2 = point.x + normal.x * (MARK_TICK_HALF + offset);
        const y2 = point.y + normal.y * (MARK_TICK_HALF + offset);

        return (
          <G key={`mark-${index}`}>
            <Line
              x1={x1}
              y1={y1}
              x2={x2}
              y2={y2}
              stroke={theme.markGlow}
              strokeWidth={diagramMetrics.markStroke + 5}
              strokeLinecap="round"
            />
            <Line
              x1={x1}
              y1={y1}
              x2={x2}
              y2={y2}
              stroke={theme.mark}
              strokeWidth={diagramMetrics.markStroke}
              strokeLinecap="round"
            />
          </G>
        );
      })}
    </Fragment>
  );
}

export { projectPoints, pointsToPath, pathTangent, perpendicular };
