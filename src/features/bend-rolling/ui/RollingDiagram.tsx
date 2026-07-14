import { Fragment } from 'react';
import { Line, Path, Polygon } from 'react-native-svg';

import {
  DiagramBendBadge,
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

function polygonPoints(points: readonly Point2[]): string {
  return points.map((point) => `${point.x},${point.y}`).join(' ');
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

function RollingScene({ geo, ghost = false }: { geo: RollingDiagramGeometry; ghost?: boolean }) {
  const theme = useDiagramTheme();
  const furnitureOpacity = ghost ? 0.55 : 1;

  return (
    <Fragment>
      <Polygon
        points={polygonPoints(geo.floorPatch)}
        fill={theme.floor.fill}
        stroke={theme.floor.edge}
        strokeWidth={1}
        opacity={furnitureOpacity}
      />
      {geo.floorGrid.map((line, index) => (
        <Line
          key={`grid-${index}`}
          x1={line.start.x}
          y1={line.start.y}
          x2={line.end.x}
          y2={line.end.y}
          stroke={theme.floor.grid}
          strokeWidth={0.75}
          opacity={furnitureOpacity}
        />
      ))}
      <Path
        d={pointsToPath(geo.floorShadow)}
        fill="none"
        stroke={theme.floor.shadow}
        strokeWidth={10}
        strokeLinecap="round"
        strokeLinejoin="round"
        opacity={ghost ? 0.18 : 0.32}
      />
    </Fragment>
  );
}

function RollingEndCaps({ geo }: { geo: RollingDiagramGeometry }) {
  const theme = useDiagramTheme();

  return (
    <Fragment>
      {geo.endCaps.map((loop, index) => (
        <Path
          key={`cap-${index}`}
          d={pointsToPath(loop, true)}
          fill={theme.endCap.fill}
          stroke={theme.endCap.stroke}
          strokeWidth={1.25}
        />
      ))}
    </Fragment>
  );
}

function RollingGhostDiagram({ message, invalid }: { message: string; invalid?: boolean }) {
  const geo = ROLLING_GHOST_GEOMETRY;

  return (
    <DiagramSvg viewBox={ROLLING_CONFIG.diagramViewBox}>
      <DiagramDefs gradientId="rollingGhostGradient" ghost />
      <DiagramCanvas />
      <RollingScene geo={geo} ghost />
      <IsoPipe
        centerline={geo.centerline}
        transform={geo.transform}
        gradientId="rollingGhostGradient"
      />
      <RollingEndCaps geo={geo} />
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
  const mark1Display = data.mark1Inches !== undefined ? data.display.mark1 : undefined;
  const mark2Display = data.mark2Inches !== undefined ? data.display.mark2 : undefined;

  return (
    <DiagramSvg viewBox={ROLLING_CONFIG.diagramViewBox}>
      <DiagramDefs gradientId="rollingPipeGradient" />
      <DiagramCanvas />
      <RollingScene geo={geo} />

      {/* Original straight-ahead axis: the roll and height dimensions close from here. */}
      <Line
        x1={geo.referenceAxis.start.x}
        y1={geo.referenceAxis.start.y}
        x2={geo.referenceAxis.end.x}
        y2={geo.referenceAxis.end.y}
        stroke={theme.mutedLabel}
        strokeWidth={1}
        strokeDasharray="5 5"
        opacity={0.32}
      />

      <DimensionLine
        x1={geo.rollDim.start.x}
        y1={geo.rollDim.start.y}
        x2={geo.rollDim.end.x}
        y2={geo.rollDim.end.y}
        opacity={0.86}
      />
      <DimensionLine
        x1={geo.heightDim.start.x}
        y1={geo.heightDim.start.y}
        x2={geo.heightDim.end.x}
        y2={geo.heightDim.end.y}
        opacity={0.86}
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
      />

      <IsoPipe
        centerline={geo.centerline}
        transform={geo.transform}
        zones={[geo.firstZone, geo.secondZone]}
        marks={[{ index: geo.firstMarkIndex }, { index: geo.secondMarkIndex }]}
        gradientId="rollingPipeGradient"
      />
      <RollingEndCaps geo={geo} />

      <DiagramBendBadge
        x={firstMarkPoint.x - 15}
        y={firstMarkPoint.y - 26}
        order={1}
        primary
        size={10}
      />
      <DiagramBendBadge
        x={secondMarkPoint.x + 15}
        y={secondMarkPoint.y - 26}
        order={2}
        size={10}
      />

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

      <DiagramLabel
        x={geo.labels.rollTitle.x}
        y={geo.labels.rollTitle.y}
        text={rollingCopy.diagram.offsetRoll}
        variant="muted"
        fontSize={10}
        fontWeight="600"
        textAnchor={geo.labels.rollTitle.anchor}
      />
      <DiagramLabel
        x={geo.labels.rollValue.x}
        y={geo.labels.rollValue.y}
        text={data.display.advance}
        variant="strong"
        fontSize={14.5}
        fontWeight="700"
        textAnchor={geo.labels.rollValue.anchor}
      />

      <DiagramLabel
        x={geo.labels.heightTitle.x}
        y={geo.labels.heightTitle.y}
        text={rollingCopy.diagram.offsetHeight}
        variant="muted"
        fontSize={9.5}
        fontWeight="600"
        textAnchor={geo.labels.heightTitle.anchor}
      />
      <DiagramLabel
        x={geo.labels.heightValue.x}
        y={geo.labels.heightValue.y}
        text={data.display.offsetHeight}
        variant="strong"
        fontSize={13.5}
        fontWeight="700"
        textAnchor={geo.labels.heightValue.anchor}
      />

      <DiagramLabel
        x={geo.labels.angleTitle.x}
        y={geo.labels.angleTitle.y}
        text={rollingCopy.fields.bendAngle.label}
        variant="muted"
        fontSize={8.5}
        fontWeight="600"
        textAnchor={geo.labels.angleTitle.anchor}
      />
      <DiagramLabel
        x={geo.labels.angleValue.x}
        y={geo.labels.angleValue.y}
        text={`${data.bendAngle}°`}
        variant="strong"
        fontSize={13.5}
        fontWeight="700"
        textAnchor={geo.labels.angleValue.anchor}
      />

      {mark1Display ? (
        <DiagramLabel
          x={geo.labels.markLegend1.x}
          y={geo.labels.markLegend1.y}
          text={`${rollingCopy.diagram.mark1} · ${mark1Display}`}
          variant="mark"
          fontSize={10}
          fontWeight="600"
          textAnchor={geo.labels.markLegend1.anchor}
        />
      ) : null}
      {mark2Display ? (
        <DiagramLabel
          x={geo.labels.markLegend2.x}
          y={geo.labels.markLegend2.y}
          text={`${rollingCopy.diagram.mark2} · ${mark2Display}`}
          variant="mark"
          fontSize={10}
          fontWeight="600"
          textAnchor={geo.labels.markLegend2.anchor}
        />
      ) : null}

      <DiagramFieldCue text={rollingCopy.diagram.fieldCue} />
    </DiagramSvg>
  );
}
