import { Fragment } from 'react';
import { Line, Path, Polygon } from 'react-native-svg';

import {
  DiagramCanvas,
  DiagramDefs,
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

function pointsToPath(points: readonly Point2[], close = false): string {
  if (points.length === 0) {
    return '';
  }
  const [first, ...rest] = points;
  return `M ${first.x} ${first.y} ${rest.map((p) => `L ${p.x} ${p.y}`).join(' ')}${close ? ' Z' : ''}`;
}

function polygonPoints(points: readonly Point2[]): string {
  return points.map((p) => `${p.x},${p.y}`).join(' ');
}

/**
 * Kick 90 diagram — isometric 3D scene. The run travels across a floor plane,
 * the kick pushes it laterally (a different plane than the 90), and the stub
 * rises vertically. Floor grid, cast shadow, and open tube mouths carry the
 * depth perception; a dashed floor axis shows where the run would have gone
 * with no kick so the rise reads instantly.
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

/** Scene furniture shared by ghost and live renders. */
function Kick90Scene({ geo, ghost = false }: { geo: Kick90DiagramGeometry; ghost?: boolean }) {
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

/** Open conduit mouths — drawn after the pipe so the tube reads hollow. */
function Kick90EndCaps({ geo }: { geo: Kick90DiagramGeometry }) {
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

function Kick90GhostDiagram({ message, invalid }: { message: string; invalid?: boolean }) {
  const geo = KICK90_GHOST_GEOMETRY;

  return (
    <DiagramSvg viewBox={KICK90_CONFIG.diagramViewBox}>
      <DiagramDefs gradientId="kick90GhostGradient" ghost />
      <DiagramCanvas />
      <Kick90Scene geo={geo} ghost />
      <IsoPipe
        centerline={geo.centerline}
        transform={geo.transform}
        gradientId="kick90GhostGradient"
      />
      <Kick90EndCaps geo={geo} />
      <DiagramGhostMessage text={message} invalid={invalid} />
    </DiagramSvg>
  );
}

function Kick90LiveDiagram({ data }: { data: Kick90DiagramData }) {
  const theme = useDiagramTheme();

  const geo: Kick90DiagramGeometry = buildKick90DiagramGeometry({
    bendAngleDeg: data.bendAngle,
    kickRiseInches: data.kickRiseInches,
    distanceBetweenBendsInches: data.distanceBetweenBendsInches,
    mark1Inches: data.mark1Inches,
  });

  const mark1Display = data.mark1Inches !== undefined ? data.display.mark1 : undefined;
  const mark2Display = data.mark2Inches !== undefined ? data.display.mark2 : undefined;

  return (
    <DiagramSvg viewBox={KICK90_CONFIG.diagramViewBox}>
      <DiagramDefs gradientId="kick90PipeGradient" />
      <DiagramCanvas />

      <Kick90Scene geo={geo} />

      {/* Where the run would have continued without the kick. */}
      <Line
        x1={geo.ghostAxis.start.x}
        y1={geo.ghostAxis.start.y}
        x2={geo.ghostAxis.end.x}
        y2={geo.ghostAxis.end.y}
        stroke={theme.mutedLabel}
        strokeWidth={1}
        strokeDasharray="5 5"
        opacity={0.5}
      />

      {/* Kick angle arc on the floor between the two axes. */}
      <Path
        d={pointsToPath(geo.angleArc)}
        fill="none"
        stroke={theme.mutedLabel}
        strokeWidth={1}
        opacity={0.6}
      />

      <IsoPipe
        centerline={geo.centerline}
        transform={geo.transform}
        zones={[geo.kickZone, geo.ninetyZone]}
        marks={[{ index: geo.kickMarkIndex }, { index: geo.ninetyMarkIndex }]}
        gradientId="kick90PipeGradient"
      />
      <Kick90EndCaps geo={geo} />

      {/* Distance between bends — offset parallel above the kicked section. */}
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
      <DiagramLabel
        x={geo.labels.dbbTitle.x}
        y={geo.labels.dbbTitle.y}
        text={kick90Copy.diagram.distanceBetweenBends}
        variant="muted"
        fontSize={9.5}
        fontWeight="600"
        textAnchor={geo.labels.dbbTitle.anchor}
      />
      <DiagramLabel
        x={geo.labels.dbbValue.x}
        y={geo.labels.dbbValue.y}
        text={data.display.distanceBetweenBends}
        variant="strong"
        fontSize={13.5}
        fontWeight="700"
        textAnchor={geo.labels.dbbValue.anchor}
      />

      {/* Kick rise — on the floor from the un-kicked axis to the stub footprint. */}
      <DimensionLine
        x1={geo.riseDim.start.x}
        y1={geo.riseDim.start.y}
        x2={geo.riseDim.end.x}
        y2={geo.riseDim.end.y}
      />
      <DiagramLabel
        x={geo.labels.riseTitle.x}
        y={geo.labels.riseTitle.y}
        text={kick90Copy.diagram.kickRise}
        variant="muted"
        fontSize={9.5}
        fontWeight="600"
        textAnchor={geo.labels.riseTitle.anchor}
      />
      <DiagramLabel
        x={geo.labels.riseValue.x}
        y={geo.labels.riseValue.y}
        text={data.display.kickRise}
        variant="strong"
        fontSize={13.5}
        fontWeight="700"
        textAnchor={geo.labels.riseValue.anchor}
      />

      {/* Kick angle tag past the arc, on its bisector. */}
      <DiagramLabel
        x={geo.labels.angle.x}
        y={geo.labels.angle.y}
        text={`${data.bendAngle}°`}
        variant="muted"
        fontSize={10}
        fontWeight="600"
        textAnchor={geo.labels.angle.anchor}
      />

      {/* Optional mark legend — top-left pocket, clear of the scene. */}
      {mark1Display ? (
        <DiagramLabel
          x={geo.labels.markLegend1.x}
          y={geo.labels.markLegend1.y}
          text={`${kick90Copy.diagram.kickMark} · ${mark1Display}`}
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
          text={`${kick90Copy.diagram.ninetyMark} · ${mark2Display}`}
          variant="mark"
          fontSize={10}
          fontWeight="600"
          textAnchor={geo.labels.markLegend2.anchor}
        />
      ) : null}
    </DiagramSvg>
  );
}
