import { Fragment } from 'react';
import { Circle, Ellipse, G, Line, Path, Polygon, Rect, Text as SvgText } from 'react-native-svg';

import {
  DiagramCanvas,
  DiagramDefs,
  DiagramFrame,
  DiagramGhostMessage,
  DiagramSvg,
  useDiagramTheme,
} from '@/shared/diagrams';
import type { Point2 } from '@/shared/diagrams/iso';
import { IsoPipe } from '@/shared/diagrams/iso';

import {
  KICK90_GHOST_GEOMETRY,
  buildKick90DiagramGeometry,
  type Kick90DiagramGeometry,
} from '../diagram/kick90DiagramGeometry';
import type { Kick90DiagramData } from '../engine/kick90.types';
import { KICK90_CONFIG } from '../kick90.config';
import { kick90Copy } from '../kick90.copy';

export type Kick90DiagramProps = {
  data?: Kick90DiagramData;
  isEmpty?: boolean;
  isInvalid?: boolean;
};

type PositionedLabel = {
  x: number;
  y: number;
  anchor: 'start' | 'middle' | 'end';
};

type ProjectedLine = {
  start: Point2;
  end: Point2;
};

function pointsToPath(points: readonly Point2[], close = false): string {
  if (points.length === 0) {
    return '';
  }
  const [first, ...rest] = points;
  return `M ${first.x} ${first.y} ${rest.map((point) => `L ${point.x} ${point.y}`).join(' ')}${close ? ' Z' : ''}`;
}

function polygonPoints(points: readonly Point2[]): string {
  return points.map((point) => `${point.x},${point.y}`).join(' ');
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

function clamp(value: number, min: number, max: number): number {
  return Math.min(Math.max(value, min), max);
}

/**
 * Kick 90 diagram - true isometric geometry. The kick changes the lateral
 * plane of the run; the final 90 turns the pipe vertically into the stub.
 */
export function Kick90Diagram({ data, isEmpty = false, isInvalid = false }: Kick90DiagramProps) {
  const message = isInvalid
    ? kick90Copy.diagram.invalidMessage
    : kick90Copy.diagram.emptyMessage;
  const showLive = Boolean(data) && !isEmpty && !isInvalid;

  return (
    <DiagramFrame>
      {showLive ? (
        <Kick90LiveDiagram data={data!} />
      ) : (
        <Kick90GhostDiagram message={message} invalid={isInvalid} />
      )}
    </DiagramFrame>
  );
}

/** Quiet datum plane: enough depth context without turning the diagram into a grid. */
function Kick90Scene({ geo, ghost = false }: { geo: Kick90DiagramGeometry; ghost?: boolean }) {
  const theme = useDiagramTheme();
  const [corner1, corner2, corner3, corner4] = geo.floorPatch;

  if (!corner1 || !corner2 || !corner3 || !corner4) {
    return null;
  }

  const datumGuides = [
    { start: midpoint(corner1, corner4), end: midpoint(corner2, corner3) },
    { start: midpoint(corner1, corner2), end: midpoint(corner4, corner3) },
  ];

  return (
    <G>
      <Polygon
        points={polygonPoints(geo.floorPatch)}
        fill={theme.floor.fill}
        stroke={theme.floor.edge}
        strokeWidth={0.75}
        opacity={ghost ? 0.42 : 0.72}
      />
      {datumGuides.map((guide, index) => (
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

function Kick90SatinPipe({ geo, ghost = false }: { geo: Kick90DiagramGeometry; ghost?: boolean }) {
  return (
    <IsoPipe
      centerline={geo.centerline}
      transform={geo.transform}
      zones={ghost ? undefined : [geo.kickZone, geo.ninetyZone]}
      gradientId={ghost ? 'kick90GhostGradient' : 'kick90PipeGradient'}
      bodyWidthRatio={0.86}
      sheenWidthRatio={0.12}
      sheenOpacity={ghost ? 0.18 : 0.24}
      shadowWidthRatio={1.25}
      shadowOpacity={ghost ? 0.16 : 0.3}
      zoneFillOpacity={0.58}
      zoneStrokeOpacity={0.72}
      lineCap="butt"
    />
  );
}

/** Detailed open conduit mouths with a visible steel wall and dark hollow core. */
function Kick90EndCaps({ geo, ghost = false }: { geo: Kick90DiagramGeometry; ghost?: boolean }) {
  const theme = useDiagramTheme();

  return (
    <G opacity={ghost ? 0.7 : 1}>
      {geo.endCaps.map((loop, index) => {
        const innerLoop = scaleLoop(loop, 0.76);
        return (
          <Fragment key={`cap-${index}`}>
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

function Kick90MarkCollar({ point, tangent }: { point: Point2; tangent: Point2 }) {
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

function Kick90MarkTag({
  point,
  offset,
  title,
  value,
}: {
  point: Point2;
  offset: Point2;
  title: string;
  value?: string;
}) {
  const theme = useDiagramTheme();
  const width = value
    ? clamp(Math.max(value.length * 5.8 + 16, title.length * 4.8 + 12), 42, 82)
    : clamp(title.length * 5 + 12, 34, 62);
  const height = value ? 26 : 15;
  const tag = {
    x: clamp(point.x + offset.x, width / 2 + 8, 352 - width / 2),
    y: clamp(point.y + offset.y, height / 2 + 8, 292 - height / 2),
  };
  const dx = tag.x - point.x;
  const dy = tag.y - point.y;
  const length = Math.hypot(dx, dy) || 1;
  const direction = { x: dx / length, y: dy / length };
  const pipeEdge = { x: point.x + direction.x * 11, y: point.y + direction.y * 11 };
  const toPoint = { x: -direction.x, y: -direction.y };
  const edgeDistance = Math.min(
    Math.abs(toPoint.x) > 0.001 ? width / 2 / Math.abs(toPoint.x) : Number.POSITIVE_INFINITY,
    Math.abs(toPoint.y) > 0.001 ? height / 2 / Math.abs(toPoint.y) : Number.POSITIVE_INFINITY,
  );
  const tagEdge = { x: tag.x + toPoint.x * edgeDistance, y: tag.y + toPoint.y * edgeDistance };

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
        x={tag.x - width / 2}
        y={tag.y - height / 2}
        width={width}
        height={height}
        rx={3}
        fill={theme.calloutFill}
        stroke={theme.mark}
        strokeWidth={0.9}
      />
      <SvgText
        x={tag.x}
        y={tag.y + (value ? -3 : 3)}
        fill={theme.mark}
        fontSize={7.6}
        fontWeight="700"
        textAnchor="middle">
        {title}
      </SvgText>
      {value ? (
        <SvgText
          x={tag.x}
          y={tag.y + 9}
          fill={theme.label}
          fontSize={9.2}
          fontWeight="700"
          textAnchor="middle">
          {value}
        </SvgText>
      ) : null}
    </G>
  );
}

/** Measurement line with an explicit dotted leader tying its label to the vector. */
function Kick90MeasurementVector({
  start,
  end,
  label,
  title,
  value,
  color,
  titleFontSize = 8.5,
  extensionLines = [],
}: {
  start: Point2;
  end: Point2;
  label: PositionedLabel;
  title: string;
  value: string;
  color: string;
  titleFontSize?: number;
  extensionLines?: readonly ProjectedLine[];
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
        fontSize={titleFontSize}
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

function Kick90AngleCallout({
  geo,
  label,
  value,
}: {
  geo: Kick90DiagramGeometry;
  label: PositionedLabel;
  value: string;
}) {
  const theme = useDiagramTheme();
  const arcMid = geo.angleArc[Math.floor(geo.angleArc.length / 2)];
  const labelTarget = { x: label.x, y: label.y - 21 };

  return (
    <G>
      <Path
        d={pointsToPath(geo.angleArc)}
        fill="none"
        stroke={theme.bendZone.stroke}
        strokeWidth={1.2}
        strokeLinecap="round"
        strokeLinejoin="round"
        opacity={0.84}
      />
      <Circle cx={arcMid.x} cy={arcMid.y} r={1.2} fill={theme.bendZone.stroke} />
      <Line
        x1={arcMid.x}
        y1={arcMid.y}
        x2={labelTarget.x}
        y2={labelTarget.y}
        stroke={theme.bendZone.stroke}
        strokeWidth={0.75}
        strokeDasharray="2 3"
        opacity={0.55}
      />
      <Circle cx={labelTarget.x} cy={labelTarget.y} r={1.35} fill={theme.bendZone.stroke} />
      <SvgText
        x={label.x}
        y={label.y - 15}
        fill={theme.bendZone.stroke}
        fontSize={8.5}
        fontWeight="700"
        textAnchor={label.anchor}>
        {kick90Copy.fields.bendAngle.label.toUpperCase()}
      </SvgText>
      <SvgText
        x={label.x}
        y={label.y}
        fill={theme.bendZone.stroke}
        fontSize={13.5}
        fontWeight="700"
        textAnchor={label.anchor}>
        {value}
      </SvgText>
    </G>
  );
}

function Kick90GhostDiagram({ message, invalid }: { message: string; invalid?: boolean }) {
  const geo = KICK90_GHOST_GEOMETRY;

  return (
    <DiagramSvg viewBox={KICK90_CONFIG.diagramViewBox}>
      <DiagramDefs gradientId="kick90GhostGradient" ghost />
      <DiagramCanvas />
      <Kick90Scene geo={geo} ghost />
      <Kick90SatinPipe geo={geo} ghost />
      <Kick90EndCaps geo={geo} ghost />
      <DiagramGhostMessage text={message} invalid={invalid} />
    </DiagramSvg>
  );
}

function Kick90LiveDiagram({ data }: { data: Kick90DiagramData }) {
  const theme = useDiagramTheme();
  const geo = buildKick90DiagramGeometry({
    bendAngleDeg: data.bendAngle,
    kickRiseInches: data.kickRiseInches,
    distanceBetweenBendsInches: data.distanceBetweenBendsInches,
    mark1Inches: data.mark1Inches,
  });
  const kickMarkPoint = geo.projectedPoints[geo.kickMarkIndex];
  const ninetyMarkPoint = geo.projectedPoints[geo.ninetyMarkIndex];
  const kickMarkTangent = pathTangent(geo.projectedPoints, geo.kickMarkIndex);
  const ninetyMarkTangent = pathTangent(geo.projectedPoints, geo.ninetyMarkIndex);
  const mark1Display = data.mark1Inches !== undefined ? data.display.mark1 : undefined;
  const mark2Display = data.mark2Inches !== undefined ? data.display.mark2 : undefined;
  const dbbLabel: PositionedLabel = {
    x: Math.min(154, geo.dbbDim.mid.x - 30),
    y: Math.max(78, geo.dbbDim.mid.y - 30),
    anchor: 'middle',
  };
  const angleLabel: PositionedLabel = {
    x: 170,
    y: 230,
    anchor: 'middle',
  };

  return (
    <DiagramSvg viewBox={KICK90_CONFIG.diagramViewBox}>
      <DiagramDefs gradientId="kick90PipeGradient" />
      <DiagramCanvas />
      <Kick90Scene geo={geo} />

      {/* Straight-ahead datum: where the run would continue with no kick. */}
      <Line
        x1={geo.ghostAxis.start.x}
        y1={geo.ghostAxis.start.y}
        x2={geo.ghostAxis.end.x}
        y2={geo.ghostAxis.end.y}
        stroke={theme.mutedLabel}
        strokeWidth={0.75}
        strokeDasharray="4 5"
        opacity={0.28}
      />

      <Kick90MeasurementVector
        start={geo.dbbDim.start}
        end={geo.dbbDim.end}
        label={dbbLabel}
        title={kick90Copy.diagram.distanceBetweenBends}
        value={data.display.distanceBetweenBends}
        color={theme.dimensionStrong}
        titleFontSize={7.5}
        extensionLines={[geo.dbbDim.ext1, geo.dbbDim.ext2]}
      />
      <Kick90MeasurementVector
        start={geo.riseDim.start}
        end={geo.riseDim.end}
        label={geo.labels.riseTitle}
        title={kick90Copy.diagram.kickRise}
        value={data.display.kickRise}
        color={theme.dimensionStrong}
      />

      <Kick90SatinPipe geo={geo} />
      <Kick90EndCaps geo={geo} />
      <Kick90MarkCollar point={kickMarkPoint} tangent={kickMarkTangent} />
      <Kick90MarkCollar point={ninetyMarkPoint} tangent={ninetyMarkTangent} />
      <Kick90MarkTag
        point={kickMarkPoint}
        offset={{ x: -32, y: 24 }}
        title={kick90Copy.diagram.kickMark.toUpperCase()}
        value={mark1Display}
      />
      <Kick90MarkTag
        point={ninetyMarkPoint}
        offset={{ x: 55, y: -25 }}
        title={kick90Copy.diagram.ninetyMark.toUpperCase()}
        value={mark2Display}
      />

      <Kick90AngleCallout
        geo={geo}
        label={angleLabel}
        value={`${data.bendAngle}\u00B0`}
      />
    </DiagramSvg>
  );
}
