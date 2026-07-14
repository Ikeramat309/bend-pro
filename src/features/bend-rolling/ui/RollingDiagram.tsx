import { Fragment } from 'react';
import {
  Circle,
  Ellipse,
  G,
  Line,
  Path,
  Rect,
  Text as SvgText,
} from 'react-native-svg';

import {
  DiagramCanvas,
  DiagramDefs,
  DiagramFieldCue,
  DiagramFrame,
  DiagramGhostMessage,
  DiagramLabel,
  DiagramSvg,
  DimensionLine,
  useDiagramTheme,
} from '@/shared/diagrams';
import type { Point2 } from '@/shared/diagrams/iso';
import { IsoPipe } from '@/shared/diagrams/iso';

import {
  ROLLING_GHOST_GEOMETRY,
  buildRollingDiagramGeometry,
  type RollingDiagramGeometry,
} from '../diagram/rollingDiagramGeometry';
import type { RollingDiagramData } from '../engine/rolling.types';
import { ROLLING_CONFIG } from '../rolling.config';
import { rollingCopy } from '../rolling.copy';

export type RollingDiagramProps = {
  data?: RollingDiagramData;
  isEmpty?: boolean;
  isInvalid?: boolean;
};

function pointsToPath(points: readonly Point2[], close = false): string {
  if (points.length === 0) {
    return '';
  }
  const [first, ...rest] = points;
  return `M ${first.x} ${first.y} ${rest.map((point) => `L ${point.x} ${point.y}`).join(' ')}${close ? ' Z' : ''}`;
}

function midpoint(a: Point2, b: Point2): Point2 {
  return { x: (a.x + b.x) / 2, y: (a.y + b.y) / 2 };
}

function pathTangent(points: readonly Point2[], index: number): Point2 {
  const previous = points[Math.max(index - 1, 0)];
  const next = points[Math.min(index + 1, points.length - 1)];
  const dx = next.x - previous.x;
  const dy = next.y - previous.y;
  const length = Math.hypot(dx, dy) || 1;
  return { x: dx / length, y: dy / length };
}

function scaleLoop(points: readonly Point2[], scale: number): Point2[] {
  const center = points.reduce(
    (sum, point) => ({ x: sum.x + point.x / points.length, y: sum.y + point.y / points.length }),
    { x: 0, y: 0 },
  );
  return points.map((point) => ({
    x: center.x + (point.x - center.x) * scale,
    y: center.y + (point.y - center.y) * scale,
  }));
}

function RollingReferencePlane({
  geo,
  ghost = false,
}: {
  geo: RollingDiagramGeometry;
  ghost?: boolean;
}) {
  const theme = useDiagramTheme();
  const [corner1, corner2, corner3, corner4] = geo.floorPatch;

  if (!corner1 || !corner2 || !corner3 || !corner4) {
    return null;
  }

  const runGuide = {
    start: midpoint(corner1, corner4),
    end: midpoint(corner2, corner3),
  };
  const depthGuide = {
    start: midpoint(corner1, corner2),
    end: midpoint(corner4, corner3),
  };

  return (
    <G>
      <Path
        d={pointsToPath(geo.floorPatch, true)}
        fill={theme.floor.fill}
        stroke={theme.floor.edge}
        strokeWidth={0.75}
        opacity={ghost ? 0.42 : 0.72}
      />
      {[runGuide, depthGuide].map((guide, index) => (
        <Line
          key={`datum-${index}`}
          x1={guide.start.x}
          y1={guide.start.y}
          x2={guide.end.x}
          y2={guide.end.y}
          stroke={theme.floor.grid}
          strokeWidth={0.65}
          opacity={ghost ? 0.28 : 0.46}
        />
      ))}
      <Path
        d={pointsToPath(geo.floorShadow)}
        fill="none"
        stroke={theme.floor.shadow}
        strokeWidth={6}
        strokeLinecap="round"
        strokeLinejoin="round"
        opacity={ghost ? 0.07 : 0.13}
      />
    </G>
  );
}

function RollingSatinPipe({ geo }: { geo: RollingDiagramGeometry }) {
  return (
    <IsoPipe
      centerline={geo.centerline}
      transform={geo.transform}
      zones={[geo.firstZone, geo.secondZone]}
      gradientId="rollingPipeGradient"
      bodyWidthRatio={0.86}
      sheenWidthRatio={0.12}
      sheenOpacity={0.24}
      shadowWidthRatio={1.25}
      shadowOpacity={0.3}
      zoneFillOpacity={0.58}
      zoneStrokeOpacity={0.72}
      lineCap="butt"
    />
  );
}

function RollingMarkCollar({ point, tangent }: { point: Point2; tangent: Point2 }) {
  const theme = useDiagramTheme();
  const rotation = (Math.atan2(tangent.y, tangent.x) * 180) / Math.PI;
  const transform = `rotate(${rotation} ${point.x} ${point.y})`;

  return (
    <G>
      <Ellipse
        cx={point.x}
        cy={point.y}
        rx={2.2}
        ry={9.3}
        fill="none"
        stroke={theme.markGlow}
        strokeWidth={2.8}
        opacity={0.35}
        transform={transform}
      />
      <Ellipse
        cx={point.x}
        cy={point.y}
        rx={2.2}
        ry={9.3}
        fill="none"
        stroke={theme.mark}
        strokeWidth={1.45}
        transform={transform}
      />
    </G>
  );
}

function RollingBendTag({
  point,
  tag,
  order,
}: {
  point: Point2;
  tag: Point2;
  order: 1 | 2;
}) {
  const theme = useDiagramTheme();
  const dx = tag.x - point.x;
  const dy = tag.y - point.y;
  const length = Math.hypot(dx, dy) || 1;
  const direction = { x: dx / length, y: dy / length };
  const pipeEdge = {
    x: point.x + direction.x * 11,
    y: point.y + direction.y * 11,
  };
  const tagEdge = {
    x: tag.x - direction.x * 9.5,
    y: tag.y - direction.y * 6,
  };

  return (
    <G>
      <Line
        x1={pipeEdge.x}
        y1={pipeEdge.y}
        x2={tagEdge.x}
        y2={tagEdge.y}
        stroke={theme.mark}
        strokeWidth={0.9}
        opacity={0.52}
      />
      <Rect
        x={tag.x - 10}
        y={tag.y - 6.5}
        width={20}
        height={13}
        rx={3}
        fill={theme.calloutFill}
        stroke={theme.mark}
        strokeWidth={0.9}
      />
      <SvgText
        x={tag.x}
        y={tag.y + 3}
        fill={theme.mark}
        fontSize={8}
        fontWeight="700"
        textAnchor="middle">
        {`B${order}`}
      </SvgText>
    </G>
  );
}

function RollingMeasurementVector({
  start,
  end,
  label,
  title,
  value,
  color,
  extensionLines = [],
}: {
  start: Point2;
  end: Point2;
  label: { x: number; y: number; anchor: 'start' | 'middle' | 'end' };
  title: string;
  value: string;
  color: string;
  extensionLines?: readonly { start: Point2; end: Point2 }[];
}) {
  const dx = end.x - start.x;
  const dy = end.y - start.y;
  const length = Math.hypot(dx, dy) || 1;
  const normal = { x: -dy / length, y: dx / length };
  const mid = midpoint(start, end);
  const labelTarget =
    label.anchor === 'middle'
      ? { x: label.x, y: label.y - 7 }
      : label.anchor === 'end'
        ? { x: label.x + 6, y: label.y + 3 }
        : { x: label.x - 6, y: label.y + 3 };
  const tickHalf = 3.2;

  return (
    <G>
      {extensionLines.map((line, index) => (
        <Line
          key={`extension-${index}`}
          x1={line.start.x}
          y1={line.start.y}
          x2={line.end.x}
          y2={line.end.y}
          stroke={color}
          strokeWidth={0.75}
          opacity={0.38}
        />
      ))}
      <Line
        x1={start.x}
        y1={start.y}
        x2={end.x}
        y2={end.y}
        stroke={color}
        strokeWidth={1.25}
        opacity={0.84}
      />
      {[start, end].map((point, index) => (
        <Line
          key={`tick-${index}`}
          x1={point.x - normal.x * tickHalf}
          y1={point.y - normal.y * tickHalf}
          x2={point.x + normal.x * tickHalf}
          y2={point.y + normal.y * tickHalf}
          stroke={color}
          strokeWidth={1}
          opacity={0.84}
        />
      ))}
      <Line
        x1={mid.x}
        y1={mid.y}
        x2={labelTarget.x}
        y2={labelTarget.y}
        stroke={color}
        strokeWidth={0.75}
        strokeDasharray="2 3"
        opacity={0.56}
      />
      <Circle cx={labelTarget.x} cy={labelTarget.y} r={1.35} fill={color} opacity={0.8} />
      <SvgText
        x={label.x}
        y={label.y}
        fill={color}
        fontSize={8.5}
        fontWeight="700"
        textAnchor={label.anchor}>
        {title.toUpperCase()}
      </SvgText>
      <SvgText
        x={label.x}
        y={label.y + 15}
        fill={color}
        fontSize={13.5}
        fontWeight="700"
        textAnchor={label.anchor}>
        {value}
      </SvgText>
    </G>
  );
}

function RollingAngleCallout({
  geo,
  value,
  color,
}: {
  geo: RollingDiagramGeometry;
  value: string;
  color: string;
}) {
  const { labels } = geo;
  const bendArcPoints = geo.projectedPoints.slice(
    geo.firstZone.startIndex,
    geo.firstZone.endIndex + 1,
  );
  const bendArcPath = pointsToPath(bendArcPoints);
  const bendArcMid =
    geo.projectedPoints[Math.round((geo.firstZone.startIndex + geo.firstZone.endIndex) / 2)];
  const labelTarget = { x: labels.angleTitle.x + 7, y: labels.angleTitle.y - 5 };

  return (
    <G>
      <Path
        d={bendArcPath}
        fill="none"
        stroke={color}
        strokeWidth={1.2}
        strokeLinecap="round"
        strokeLinejoin="round"
        opacity={0.84}
      />
      <Circle cx={bendArcMid.x} cy={bendArcMid.y} r={1.2} fill={color} />
      <Line
        x1={bendArcMid.x}
        y1={bendArcMid.y}
        x2={labelTarget.x}
        y2={labelTarget.y}
        stroke={color}
        strokeWidth={0.75}
        strokeDasharray="2 3"
        opacity={0.55}
      />
      <Circle cx={labelTarget.x} cy={labelTarget.y} r={1.35} fill={color} />
      <SvgText
        x={labels.angleTitle.x}
        y={labels.angleTitle.y}
        fill={color}
        fontSize={8.5}
        fontWeight="700"
        textAnchor={labels.angleTitle.anchor}>
        {rollingCopy.fields.bendAngle.label.toUpperCase()}
      </SvgText>
      <SvgText
        x={labels.angleValue.x}
        y={labels.angleValue.y}
        fill={color}
        fontSize={13.5}
        fontWeight="700"
        textAnchor={labels.angleValue.anchor}>
        {value}
      </SvgText>
    </G>
  );
}

/**
 * True 3D rolling-offset diagram. The first run, diagonal travel, and final
 * parallel run occupy different Y/Z positions so the pipe itself explains
 * the roll instead of relying on a detached technical inset.
 */
export function RollingDiagram({ data, isEmpty = false, isInvalid = false }: RollingDiagramProps) {
  const message = isInvalid ? rollingCopy.diagram.invalidMessage : rollingCopy.diagram.emptyMessage;
  const showLive = Boolean(data) && !isEmpty && !isInvalid;

  return (
    <DiagramFrame>
      {showLive ? (
        <RollingLiveDiagram data={data!} />
      ) : (
        <RollingGhostDiagram message={message} invalid={isInvalid} />
      )}
    </DiagramFrame>
  );
}

function RollingEndCaps({
  geo,
  detailed = false,
  ghost = false,
}: {
  geo: RollingDiagramGeometry;
  detailed?: boolean;
  ghost?: boolean;
}) {
  const theme = useDiagramTheme();

  return (
    <G opacity={ghost ? 0.72 : 1}>
      {geo.endCaps.map((loop, index) => {
        if (!detailed) {
          return (
            <Path
              key={`cap-${index}`}
              d={pointsToPath(loop, true)}
              fill={theme.endCap.fill}
              stroke={theme.endCap.stroke}
              strokeWidth={1.25}
            />
          );
        }

        const innerLoop = scaleLoop(loop, 0.76);
        return (
          <Fragment key={`satin-cap-${index}`}>
            <Path
              d={pointsToPath(loop, true)}
              fill={theme.pipe}
              stroke={theme.pipeSheen}
              strokeWidth={0.75}
            />
            <Path
              d={pointsToPath(innerLoop, true)}
              fill={theme.endCap.fill}
              stroke={theme.endCap.stroke}
              strokeWidth={0.6}
            />
          </Fragment>
        );
      })}
    </G>
  );
}

function RollingGhostDiagram({ message, invalid }: { message: string; invalid?: boolean }) {
  const geo = ROLLING_GHOST_GEOMETRY;

  return (
    <DiagramSvg viewBox={ROLLING_CONFIG.diagramViewBox}>
      <DiagramDefs gradientId="rollingGhostGradient" ghost />
      <DiagramCanvas />
      <RollingReferencePlane geo={geo} ghost />
      <IsoPipe
        centerline={geo.centerline}
        transform={geo.transform}
        gradientId="rollingGhostGradient"
        bodyWidthRatio={0.86}
        sheenWidthRatio={0.12}
        sheenOpacity={0.2}
        shadowWidthRatio={1.2}
        shadowOpacity={0.18}
        lineCap="butt"
      />
      <RollingEndCaps geo={geo} detailed ghost />
      <DiagramGhostMessage text={message} invalid={invalid} />
    </DiagramSvg>
  );
}

function RollingLiveDiagram({ data }: { data: RollingDiagramData }) {
  const theme = useDiagramTheme();
  const geo = buildRollingDiagramGeometry({
    offsetHeightInches: data.offsetHeightInches,
    offsetRollInches: data.advanceInches,
    trueOffsetInches: data.trueOffsetInches,
    distanceBetweenBendsInches: data.distanceBetweenBendsInches,
    bendAngleDeg: data.bendAngle,
  });
  const firstMarkPoint = geo.projectedPoints[geo.firstMarkIndex];
  const secondMarkPoint = geo.projectedPoints[geo.secondMarkIndex];
  const firstMarkTangent = pathTangent(geo.projectedPoints, geo.firstMarkIndex);
  const secondMarkTangent = pathTangent(geo.projectedPoints, geo.secondMarkIndex);
  const firstTagPoint = { x: firstMarkPoint.x - 26, y: firstMarkPoint.y - 38 };
  const secondTagPoint = { x: secondMarkPoint.x + 27, y: secondMarkPoint.y - 23 };
  const mark1Display = data.mark1Inches !== undefined ? data.display.mark1 : undefined;
  const mark2Display = data.mark2Inches !== undefined ? data.display.mark2 : undefined;

  return (
    <DiagramSvg viewBox={ROLLING_CONFIG.diagramViewBox}>
      <DiagramDefs gradientId="rollingPipeGradient" />
      <DiagramCanvas />
      <RollingReferencePlane geo={geo} />

      {/* Original straight-ahead axis: the roll and height dimensions close from here. */}
      <Line
        x1={geo.referenceAxis.start.x}
        y1={geo.referenceAxis.start.y}
        x2={geo.referenceAxis.end.x}
        y2={geo.referenceAxis.end.y}
        stroke={theme.mutedLabel}
        strokeWidth={0.75}
        strokeDasharray="4 5"
        opacity={0.28}
      />

      <DimensionLine
        x1={geo.dbbDim.start.x}
        y1={geo.dbbDim.start.y}
        x2={geo.dbbDim.end.x}
        y2={geo.dbbDim.end.y}
        extensionLines={[
          {
            x1: geo.dbbDim.ext1.start.x,
            y1: geo.dbbDim.ext1.start.y,
            x2: geo.dbbDim.ext1.end.x,
            y2: geo.dbbDim.ext1.end.y,
          },
          {
            x1: geo.dbbDim.ext2.start.x,
            y1: geo.dbbDim.ext2.start.y,
            x2: geo.dbbDim.ext2.end.x,
            y2: geo.dbbDim.ext2.end.y,
          },
        ]}
        opacity={0.72}
      />

      <RollingMeasurementVector
        start={geo.rollDim.start}
        end={geo.rollDim.end}
        label={geo.labels.rollTitle}
        title={rollingCopy.diagram.offsetRoll}
        value={data.display.advance}
        color={theme.dimensionStrong}
      />
      <RollingMeasurementVector
        start={geo.heightDim.start}
        end={geo.heightDim.end}
        label={geo.labels.heightTitle}
        title={rollingCopy.diagram.offsetHeight}
        value={data.display.offsetHeight}
        color={theme.dimensionStrong}
        extensionLines={[geo.heightDim.ext1, geo.heightDim.ext2]}
      />

      <RollingSatinPipe geo={geo} />
      <RollingEndCaps geo={geo} detailed />

      <RollingMarkCollar point={firstMarkPoint} tangent={firstMarkTangent} />
      <RollingMarkCollar point={secondMarkPoint} tangent={secondMarkTangent} />
      <RollingBendTag point={firstMarkPoint} tag={firstTagPoint} order={1} />
      <RollingBendTag point={secondMarkPoint} tag={secondTagPoint} order={2} />

      <DiagramLabel
        x={geo.labels.dbbTitle.x}
        y={geo.labels.dbbTitle.y}
        text={rollingCopy.diagram.distanceBetweenBends}
        variant="muted"
        fontSize={10}
        fontWeight="600"
        textAnchor={geo.labels.dbbTitle.anchor}
      />
      <DiagramLabel
        x={geo.labels.dbbValue.x}
        y={geo.labels.dbbValue.y}
        text={data.display.distanceBetweenBends}
        variant="strong"
        fontSize={14.5}
        fontWeight="700"
        textAnchor={geo.labels.dbbValue.anchor}
      />

      <RollingAngleCallout
        geo={geo}
        value={`${data.bendAngle}°`}
        color={theme.bendZone.stroke}
      />

      {mark1Display ? (
        <SvgText
          x={geo.labels.markLegend1.x}
          y={geo.labels.markLegend1.y}
          fill={theme.mark}
          fontSize={10}
          fontWeight="600"
          textAnchor={geo.labels.markLegend1.anchor}>
          {`${rollingCopy.diagram.mark1} · ${mark1Display}`}
        </SvgText>
      ) : null}
      {mark2Display ? (
        <SvgText
          x={geo.labels.markLegend2.x}
          y={geo.labels.markLegend2.y}
          fill={theme.mark}
          fontSize={10}
          fontWeight="600"
          textAnchor={geo.labels.markLegend2.anchor}>
          {`${rollingCopy.diagram.mark2} · ${mark2Display}`}
        </SvgText>
      ) : null}

      <DiagramFieldCue text={rollingCopy.diagram.fieldCue} />
    </DiagramSvg>
  );
}
