import { Fragment } from 'react';
import { Circle, Ellipse, G, Line, Path, Text as SvgText } from 'react-native-svg';

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
  MATCHING_OFFSET_GHOST_GEOMETRY,
  buildMatchingOffsetDiagramGeometry,
  type MatchingOffsetDiagramGeometry,
} from '../diagram/matchingOffsetDiagramGeometry';
import type { MatchingOffsetDiagramData } from '../engine/matchingOffset.types';
import { MATCHING_OFFSET_CONFIG } from '../matchingOffset.config';
import { matchingOffsetCopy } from '../matchingOffset.copy';

export type MatchingOffsetDiagramProps = {
  data?: MatchingOffsetDiagramData;
  mode: MatchingOffsetDiagramData['mode'];
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

function scaleLoop(points: readonly Point2[], scale: number): Point2[] {
  const center = points.reduce(
    (sum, point) => ({
      x: sum.x + point.x / points.length,
      y: sum.y + point.y / points.length,
    }),
    { x: 0, y: 0 },
  );
  return points.map((point) => ({
    x: center.x + (point.x - center.x) * scale,
    y: center.y + (point.y - center.y) * scale,
  }));
}

function pathTangent(points: readonly Point2[], index: number): Point2 {
  const previous = points[Math.max(index - 1, 0)];
  const next = points[Math.min(index + 1, points.length - 1)];
  const dx = next.x - previous.x;
  const dy = next.y - previous.y;
  const length = Math.hypot(dx, dy) || 1;
  return { x: dx / length, y: dy / length };
}

function MatchingReferencePlane({
  geo,
  ghost = false,
}: {
  geo: MatchingOffsetDiagramGeometry;
  ghost?: boolean;
}) {
  const theme = useDiagramTheme();

  return (
    <G>
      <Path
        d={pointsToPath(geo.floorPatch, true)}
        fill={theme.floor.fill}
        stroke={theme.floor.edge}
        strokeWidth={0.7}
        opacity={ghost ? 0.28 : 0.5}
      />
      {geo.floorGrid.map((line, index) => (
        <Line
          key={`floor-grid-${index}`}
          x1={line.start.x}
          y1={line.start.y}
          x2={line.end.x}
          y2={line.end.y}
          stroke={theme.floor.grid}
          strokeWidth={0.55}
          opacity={ghost ? 0.16 : 0.28}
        />
      ))}
      {geo.floorShadows.map((shadow, index) => (
        <Path
          key={`floor-shadow-${index}`}
          d={pointsToPath(shadow)}
          fill="none"
          stroke={theme.floor.shadow}
          strokeWidth={5}
          strokeLinecap="round"
          opacity={ghost ? 0.05 : index === 0 ? 0.08 : 0.14}
        />
      ))}
    </G>
  );
}

function MatchingEndCaps({
  loops,
  opacity = 1,
}: {
  loops: readonly Point2[][];
  opacity?: number;
}) {
  const theme = useDiagramTheme();

  return (
    <G opacity={opacity}>
      {loops.map((loop, index) => (
        <Fragment key={`end-cap-${index}`}>
          <Path
            d={pointsToPath(loop, true)}
            fill={theme.pipe}
            stroke={theme.pipeSheen}
            strokeWidth={0.7}
          />
          <Path
            d={pointsToPath(scaleLoop(loop, 0.74), true)}
            fill={theme.endCap.fill}
            stroke={theme.endCap.stroke}
            strokeWidth={0.6}
          />
        </Fragment>
      ))}
    </G>
  );
}

function MatchingMarkCollar({ point, tangent }: { point: Point2; tangent: Point2 }) {
  const theme = useDiagramTheme();
  const rotation = (Math.atan2(tangent.y, tangent.x) * 180) / Math.PI;
  const transform = `rotate(${rotation} ${point.x} ${point.y})`;

  return (
    <G>
      <Ellipse
        cx={point.x}
        cy={point.y}
        rx={2.2}
        ry={9.4}
        fill="none"
        stroke={theme.markGlow}
        strokeWidth={2.8}
        opacity={0.34}
        transform={transform}
      />
      <Ellipse
        cx={point.x}
        cy={point.y}
        rx={2.2}
        ry={9.4}
        fill="none"
        stroke={theme.mark}
        strokeWidth={1.45}
        transform={transform}
      />
    </G>
  );
}

function MeasurementLabel({
  point,
  title,
  value,
  caption,
}: {
  point: { x: number; y: number; anchor: 'start' | 'middle' | 'end' };
  title: string;
  value: string;
  caption?: string;
}) {
  return (
    <G>
      <DiagramLabel
        x={point.x}
        y={point.y}
        text={title.toUpperCase()}
        variant="muted"
        fontSize={8.4}
        fontWeight="700"
        textAnchor={point.anchor}
      />
      {caption ? (
        <DiagramLabel
          x={point.x}
          y={point.y + 27}
          text={caption}
          variant="mark"
          fontSize={7.2}
          fontWeight="700"
          textAnchor={point.anchor}
        />
      ) : null}
      <DiagramLabel
        x={point.x}
        y={point.y + 15}
        text={value}
        variant="strong"
        fontSize={13.2}
        fontWeight="700"
        textAnchor={point.anchor}
      />
    </G>
  );
}

/** Reference and target conduit occupy separate depth planes in one fixed iso view. */
export function MatchingOffsetDiagram({
  data,
  mode,
  isEmpty = false,
  isInvalid = false,
}: MatchingOffsetDiagramProps) {
  const showLive = Boolean(data) && !isEmpty && !isInvalid;
  const message = isInvalid
    ? matchingOffsetCopy.diagram.invalid
    : mode === 'centers'
      ? matchingOffsetCopy.diagram.emptyCenters
      : matchingOffsetCopy.diagram.emptyBends;

  return (
    <DiagramFrame>
      {showLive ? (
        <MatchingOffsetLiveDiagram data={data!} />
      ) : (
        <MatchingOffsetGhostDiagram message={message} invalid={isInvalid} />
      )}
    </DiagramFrame>
  );
}

function MatchingOffsetGhostDiagram({ message, invalid }: { message: string; invalid?: boolean }) {
  const geo = MATCHING_OFFSET_GHOST_GEOMETRY;

  return (
    <DiagramSvg viewBox={MATCHING_OFFSET_CONFIG.diagramViewBox}>
      <DiagramDefs gradientId="matchingOffsetGhostGradient" ghost />
      <DiagramCanvas />
      <MatchingReferencePlane geo={geo} ghost />
      <G opacity={0.28}>
        <IsoPipe
          centerline={geo.referenceCenterline}
          transform={geo.transform}
          gradientId="matchingOffsetGhostGradient"
          bodyWidthRatio={0.84}
          sheenWidthRatio={0.12}
          sheenOpacity={0.18}
          shadowWidthRatio={1.1}
          shadowOpacity={0.1}
          lineCap="butt"
        />
        <MatchingEndCaps loops={geo.referenceEndCaps} />
      </G>
      <G opacity={0.58}>
        <IsoPipe
          centerline={geo.matchingCenterline}
          transform={geo.transform}
          gradientId="matchingOffsetGhostGradient"
          bodyWidthRatio={0.84}
          sheenWidthRatio={0.12}
          sheenOpacity={0.18}
          shadowWidthRatio={1.15}
          shadowOpacity={0.14}
          lineCap="butt"
        />
        <MatchingEndCaps loops={geo.matchingEndCaps} />
      </G>
      <DiagramGhostMessage text={message} invalid={invalid} />
    </DiagramSvg>
  );
}

function MatchingOffsetLiveDiagram({ data }: { data: MatchingOffsetDiagramData }) {
  const theme = useDiagramTheme();
  const geo = buildMatchingOffsetDiagramGeometry(data);
  const markPoints = geo.matchingCenterIndices.map((index) => geo.matchingProjected[index]);
  const markTangents = geo.matchingCenterIndices.map((index) =>
    pathTangent(geo.matchingProjected, index),
  );
  const activeCenters = data.mode === 'centers';

  return (
    <DiagramSvg viewBox={MATCHING_OFFSET_CONFIG.diagramViewBox}>
      <DiagramDefs gradientId="matchingOffsetPipeGradient" />
      <DiagramCanvas />
      <MatchingReferencePlane geo={geo} />

      {geo.centerGuides.map((guide, index) => (
        <Line
          key={`center-guide-${index}`}
          x1={guide.start.x}
          y1={guide.start.y}
          x2={guide.end.x}
          y2={guide.end.y}
          stroke={theme.dimensionStrong}
          strokeWidth={0.75}
          strokeDasharray="3 4"
          opacity={0.38}
        />
      ))}

      <DimensionLine
        x1={geo.distanceBetweenBendsDimension.start.x}
        y1={geo.distanceBetweenBendsDimension.start.y}
        x2={geo.distanceBetweenBendsDimension.end.x}
        y2={geo.distanceBetweenBendsDimension.end.y}
        extensionLines={[
          {
            x1: geo.distanceBetweenBendsDimension.extension1.start.x,
            y1: geo.distanceBetweenBendsDimension.extension1.start.y,
            x2: geo.distanceBetweenBendsDimension.extension1.end.x,
            y2: geo.distanceBetweenBendsDimension.extension1.end.y,
          },
          {
            x1: geo.distanceBetweenBendsDimension.extension2.start.x,
            y1: geo.distanceBetweenBendsDimension.extension2.start.y,
            x2: geo.distanceBetweenBendsDimension.extension2.end.x,
            y2: geo.distanceBetweenBendsDimension.extension2.end.y,
          },
        ]}
        opacity={activeCenters ? 0.58 : 0.86}
      />
      <DimensionLine
        x1={geo.adjacentDimension.start.x}
        y1={geo.adjacentDimension.start.y}
        x2={geo.adjacentDimension.end.x}
        y2={geo.adjacentDimension.end.y}
        opacity={activeCenters ? 0.86 : 0.48}
      />
      <DimensionLine
        x1={geo.heightDimension.start.x}
        y1={geo.heightDimension.start.y}
        x2={geo.heightDimension.end.x}
        y2={geo.heightDimension.end.y}
        opacity={0.74}
      />

      <G opacity={0.38}>
        <IsoPipe
          centerline={geo.referenceCenterline}
          transform={geo.transform}
          gradientId="matchingOffsetPipeGradient"
          bodyWidthRatio={0.84}
          sheenWidthRatio={0.12}
          sheenOpacity={0.2}
          shadowWidthRatio={1.1}
          shadowOpacity={0.12}
          lineCap="butt"
        />
        <MatchingEndCaps loops={geo.referenceEndCaps} />
      </G>
      <IsoPipe
        centerline={geo.matchingCenterline}
        transform={geo.transform}
        zones={geo.matchingZones}
        gradientId="matchingOffsetPipeGradient"
        bodyWidthRatio={0.86}
        sheenWidthRatio={0.12}
        sheenOpacity={0.24}
        shadowWidthRatio={1.24}
        shadowOpacity={0.28}
        zoneFillOpacity={0.56}
        zoneStrokeOpacity={0.72}
        lineCap="butt"
      />
      <MatchingEndCaps loops={geo.matchingEndCaps} />

      {markPoints.map((point, index) => (
        <MatchingMarkCollar key={`matching-mark-${index}`} point={point} tangent={markTangents[index]} />
      ))}
      {markPoints.map((point, index) => (
        <SvgText
          key={`matching-order-${index}`}
          x={point.x + (index === 0 ? -13 : 13)}
          y={point.y - 13}
          fill={theme.mark}
          fontSize={9}
          fontWeight="700"
          textAnchor="middle">
          {index + 1}
        </SvgText>
      ))}

      <MeasurementLabel
        point={geo.labels.distanceBetweenBends}
        title={matchingOffsetCopy.results.distanceBetweenBends}
        value={data.display.distanceBetweenBends}
      />
      <MeasurementLabel
        point={geo.labels.bendAngle}
        title={matchingOffsetCopy.results.bendAngle}
        value={data.display.bendAngle}
        caption={data.display.angleMethod}
      />
      <MeasurementLabel
        point={geo.labels.offsetHeight}
        title={matchingOffsetCopy.fields.offsetHeight.label}
        value={data.display.offsetHeight}
      />
      <MeasurementLabel
        point={geo.labels.adjacent}
        title={matchingOffsetCopy.results.adjacent}
        value={data.display.adjacent}
      />

      <Line
        x1={geo.labels.bendAngle.x + 42}
        y1={geo.labels.bendAngle.y + 8}
        x2={markPoints[0].x}
        y2={markPoints[0].y}
        stroke={theme.bendZone.stroke}
        strokeWidth={0.7}
        strokeDasharray="2 3"
        opacity={0.52}
      />
      <Circle cx={markPoints[0].x} cy={markPoints[0].y} r={1.25} fill={theme.bendZone.stroke} />

      <G opacity={0.76}>
        <DiagramLabel
          x={geo.labels.reference.x}
          y={geo.labels.reference.y}
          text={matchingOffsetCopy.diagram.reference.toUpperCase()}
          variant="muted"
          fontSize={8.2}
          textAnchor={geo.labels.reference.anchor}
        />
        <DiagramLabel
          x={geo.labels.matching.x}
          y={geo.labels.matching.y}
          text={matchingOffsetCopy.diagram.matching.toUpperCase()}
          variant="mark"
          fontSize={8.2}
          textAnchor={geo.labels.matching.anchor}
        />
      </G>

      <DiagramFieldCue text={matchingOffsetCopy.diagram.fieldCue} />
    </DiagramSvg>
  );
}
