import { Circle, Ellipse, G, Line, Path, Rect, Text as SvgText } from 'react-native-svg';

import {
  BendRadiusZone,
  DiagramCanvas,
  DiagramDefs,
  DiagramFieldCue,
  DiagramFrame,
  DiagramGhostMessage,
  DiagramLabel,
  DiagramSvg,
  PipeSegment,
  diagramMetrics,
  useDiagramTheme,
} from '@/shared/diagrams';
import {
  SADDLE3_DIAGRAM_LAYOUT,
  buildSaddle3DiagramGeometry,
  capSaddle3DiagramInputs,
  type Saddle3DiagramGeometry,
} from '../diagram/saddle3DiagramGeometry';
import type { Saddle3DiagramData } from '../engine/saddle3.types';
import { SADDLE3_CONFIG } from '../saddle3.config';
import { saddle3Copy } from '../saddle3.copy';

const LAYOUT = SADDLE3_DIAGRAM_LAYOUT;
const VECTOR_OFFSET = 30;
const VECTOR_TICK_HALF = 3.2;
const TAG_HEIGHT = 14;

type Point = { x: number; y: number };

function midpoint(a: Point, b: Point): Point {
  return { x: (a.x + b.x) / 2, y: (a.y + b.y) / 2 };
}

export type Saddle3DiagramProps = {
  data?: Saddle3DiagramData;
  isEmpty?: boolean;
  isInvalid?: boolean;
};

/** Feature diagram for 3-Point Saddle — built from shared SVG primitives. */
export function Saddle3Diagram({ data, isEmpty = false, isInvalid = false }: Saddle3DiagramProps) {
  const message = isInvalid
    ? saddle3Copy.diagram.invalidMessage
    : saddle3Copy.diagram.emptyMessage;

  return (
    <DiagramFrame>
      {!data || isEmpty || isInvalid ? (
        <Saddle3GhostDiagram message={message} invalid={isInvalid} />
      ) : (
        <Saddle3LiveDiagram data={data} />
      )}
    </DiagramFrame>
  );
}

function Saddle3GhostDiagram({ message, invalid }: { message: string; invalid?: boolean }) {
  const theme = useDiagramTheme();
  const geo = buildSaddle3DiagramGeometry(2, 5.23, 22.5);

  return (
    <DiagramSvg viewBox={SADDLE3_CONFIG.diagramViewBox}>
      <DiagramDefs gradientId="saddle3GhostGradient" ghost />
      <DiagramCanvas />
      <RoundObstruction geo={geo} ghost />
      <PipeSegment d={geo.pipePath} variant="shadow" opacity={theme.ghost.pipeShadowOpacity} />
      <PipeSegment d={geo.pipePath} variant="pipe" gradientId="saddle3GhostGradient" />
      <Saddle3EndCaps ghost />
      <Saddle3MarkCollar point={{ x: geo.x1, y: LAYOUT.baseY }} ghost />
      <Saddle3MarkCollar point={{ x: LAYOUT.centerX, y: geo.peakY }} ghost />
      <Saddle3MarkCollar point={{ x: geo.x2, y: LAYOUT.baseY }} ghost />
      <DiagramGhostMessage text={message} invalid={invalid} />
    </DiagramSvg>
  );
}

function RoundObstruction({
  geo,
  heightLabel,
  ghost = false,
}: {
  geo: Saddle3DiagramGeometry;
  heightLabel?: string;
  ghost?: boolean;
}) {
  const theme = useDiagramTheme();
  const centerY = LAYOUT.baseY - geo.obsRadius;
  const fill = ghost ? theme.ghost.obstructionFill : theme.obstruction.fill;
  const stroke = ghost ? theme.ghost.obstructionStroke : theme.obstruction.stroke;
  const highlightY = centerY - geo.obsRadius * 0.34;

  return (
    <G>
      <Ellipse
        cx={LAYOUT.centerX}
        cy={LAYOUT.baseY + 2.5}
        rx={geo.obsRadius * 0.9}
        ry={3.6}
        fill={theme.floor.shadow}
        opacity={ghost ? 0.05 : 0.11}
      />
      <Circle
        cx={LAYOUT.centerX}
        cy={centerY}
        r={geo.obsRadius}
        fill={fill}
        stroke={stroke}
        strokeWidth={1.35}
      />
      <Path
        d={`M ${LAYOUT.centerX - geo.obsRadius * 0.62} ${highlightY} Q ${LAYOUT.centerX} ${centerY - geo.obsRadius * 0.72} ${LAYOUT.centerX + geo.obsRadius * 0.62} ${highlightY}`}
        fill="none"
        stroke={stroke}
        strokeWidth={0.8}
        opacity={ghost ? 0.18 : 0.38}
      />
      {!ghost && heightLabel ? (
        <G>
          <SvgText
            x={LAYOUT.centerX}
            y={centerY - 2.5}
            fill={theme.mutedLabel}
            fontSize={6.6}
            fontWeight="700"
            textAnchor="middle">
            HEIGHT
          </SvgText>
          <SvgText
            x={LAYOUT.centerX}
            y={centerY + 9.5}
            fill={theme.dimensionStrong}
            fontSize={heightLabel.length > 7 ? 8.2 : 9.5}
            fontWeight="700"
            textAnchor="middle">
            {heightLabel}
          </SvgText>
        </G>
      ) : null}
    </G>
  );
}

function Saddle3EndCaps({ ghost = false }: { ghost?: boolean }) {
  const theme = useDiagramTheme();

  return (
    <G opacity={ghost ? 0.5 : 1}>
      {[LAYOUT.startX, LAYOUT.endX].map((x) => (
        <G key={`end-cap-${x}`}>
          <Ellipse
            cx={x}
            cy={LAYOUT.baseY}
            rx={3.2}
            ry={9.5}
            fill={theme.pipe}
            stroke={theme.pipeSheen}
            strokeWidth={0.8}
          />
          <Ellipse
            cx={x}
            cy={LAYOUT.baseY}
            rx={1.9}
            ry={6.65}
            fill={theme.endCap.fill}
            stroke={theme.endCap.stroke}
            strokeWidth={0.65}
          />
        </G>
      ))}
    </G>
  );
}

function Saddle3MarkCollar({ point, ghost = false }: { point: Point; ghost?: boolean }) {
  const theme = useDiagramTheme();

  return (
    <G opacity={ghost ? 0.4 : 1}>
      <Ellipse
        cx={point.x}
        cy={point.y}
        rx={2.15}
        ry={9.2}
        fill="none"
        stroke={theme.markGlow}
        strokeWidth={2.7}
        opacity={0.34}
      />
      <Ellipse
        cx={point.x}
        cy={point.y}
        rx={2.15}
        ry={9.2}
        fill="none"
        stroke={theme.mark}
        strokeWidth={1.4}
      />
    </G>
  );
}

function Saddle3BendTag({
  point,
  tag,
  label,
  primary = false,
}: {
  point: Point;
  tag: Point;
  label: string;
  primary?: boolean;
}) {
  const theme = useDiagramTheme();
  const width = Math.min(82, Math.max(44, 20 + label.length * 5.2));
  const dx = tag.x - point.x;
  const dy = tag.y - point.y;
  const length = Math.hypot(dx, dy) || 1;
  const direction = { x: dx / length, y: dy / length };
  const pipeEdge = {
    x: point.x + direction.x * (diagramMetrics.pipeStroke / 2 + 2),
    y: point.y + direction.y * (diagramMetrics.pipeStroke / 2 + 2),
  };
  const tagEdge = {
    x: tag.x - direction.x * Math.min(width / 2, 13),
    y: tag.y - direction.y * (TAG_HEIGHT / 2),
  };
  const badge = primary
    ? {
        fill: theme.bendBadge.primaryFill,
        stroke: theme.bendBadge.primaryStroke,
        text: theme.bendBadge.primaryText,
      }
    : {
        fill: theme.calloutFill,
        stroke: theme.mark,
        text: theme.mark,
      };

  return (
    <G>
      <Line
        x1={pipeEdge.x}
        y1={pipeEdge.y}
        x2={tagEdge.x}
        y2={tagEdge.y}
        stroke={badge.stroke}
        strokeWidth={0.8}
        opacity={0.58}
      />
      <Rect
        x={tag.x - width / 2}
        y={tag.y - TAG_HEIGHT / 2}
        width={width}
        height={TAG_HEIGHT}
        rx={4}
        fill={badge.fill}
        stroke={badge.stroke}
        strokeWidth={0.9}
      />
      <SvgText
        x={tag.x}
        y={tag.y + 3}
        fill={badge.text}
        fontSize={8.1}
        fontWeight="700"
        textAnchor="middle">
        {label}
      </SvgText>
    </G>
  );
}

function BetweenBendsVector({ geo, value }: { geo: Saddle3DiagramGeometry; value: string }) {
  const theme = useDiagramTheme();
  const diagonal = Math.hypot(LAYOUT.centerX - geo.x1, LAYOUT.baseY - geo.peakY) || 1;
  const sinA = (LAYOUT.baseY - geo.peakY) / diagonal;
  const cosA = (LAYOUT.centerX - geo.x1) / diagonal;
  const normal = { x: -sinA, y: -cosA };
  const start = {
    x: geo.x1 + normal.x * VECTOR_OFFSET,
    y: LAYOUT.baseY + normal.y * VECTOR_OFFSET,
  };
  const end = {
    x: LAYOUT.centerX + normal.x * VECTOR_OFFSET,
    y: geo.peakY + normal.y * VECTOR_OFFSET,
  };
  const mid = midpoint(start, end);
  const compactTop = geo.peakY < 108;
  const titleY = compactTop ? 31 : 70;
  const valueY = titleY + 16;
  const labelTarget = { x: 108, y: valueY };

  return (
    <G>
      {[
        { point: { x: geo.x1, y: LAYOUT.baseY }, vector: start },
        { point: { x: LAYOUT.centerX, y: geo.peakY }, vector: end },
      ].map((extension, index) => (
        <Line
          key={`between-extension-${index}`}
          x1={extension.point.x + normal.x * 10}
          y1={extension.point.y + normal.y * 10}
          x2={extension.vector.x - normal.x * 4}
          y2={extension.vector.y - normal.y * 4}
          stroke={theme.dimensionStrong}
          strokeWidth={0.65}
          opacity={0.36}
        />
      ))}
      <Line
        x1={start.x}
        y1={start.y}
        x2={end.x}
        y2={end.y}
        stroke={theme.dimensionStrong}
        strokeWidth={1.1}
        opacity={0.76}
      />
      {[start, end].map((point, index) => (
        <Line
          key={`between-tick-${index}`}
          x1={point.x - normal.x * VECTOR_TICK_HALF}
          y1={point.y - normal.y * VECTOR_TICK_HALF}
          x2={point.x + normal.x * VECTOR_TICK_HALF}
          y2={point.y + normal.y * VECTOR_TICK_HALF}
          stroke={theme.dimensionStrong}
          strokeWidth={0.9}
          opacity={0.82}
        />
      ))}
      <Line
        x1={labelTarget.x}
        y1={labelTarget.y}
        x2={mid.x}
        y2={mid.y}
        stroke={theme.dimensionStrong}
        strokeWidth={0.65}
        strokeDasharray="2 3"
        opacity={0.46}
      />
      <Circle cx={mid.x} cy={mid.y} r={1.25} fill={theme.dimensionStrong} opacity={0.78} />
      <SvgText
        x={28}
        y={titleY}
        fill={theme.mutedLabel}
        fontSize={8.3}
        fontWeight="700"
        textAnchor="start">
        {saddle3Copy.diagram.betweenBends.toUpperCase()}
      </SvgText>
      <SvgText
        x={28}
        y={valueY}
        fill={theme.dimensionStrong}
        fontSize={11.5}
        fontWeight="700"
        textAnchor="start">
        {value}
      </SvgText>
    </G>
  );
}

function Saddle3MarkLegend({ data }: { data: Saddle3DiagramData }) {
  const theme = useDiagramTheme();
  const text = `SIDE MARKS  \u00B7  ${data.display.sideMark1}  /  ${data.display.sideMark2}`;

  return (
    <SvgText
      x={LAYOUT.centerX}
      y={278}
      fill={theme.mark}
      fontSize={text.length > 46 ? 8 : 8.8}
      fontWeight="600"
      textAnchor="middle">
      {text}
    </SvgText>
  );
}

function Saddle3LiveDiagram({ data }: { data: Saddle3DiagramData }) {
  const { visualObsIn, visualCenterToSide } = capSaddle3DiagramInputs(
    data.obstructionHeightInches,
    data.centerToSideInches,
  );
  const geo = buildSaddle3DiagramGeometry(visualObsIn, visualCenterToSide, data.sideAngle);
  const hasMarks = data.centerMarkInches !== undefined;
  const centerTag =
    geo.peakY < 108
      ? { x: 238, y: Math.max(62, geo.peakY - 1) }
      : { x: LAYOUT.centerX, y: Math.max(66, geo.peakY - 34) };
  const leftTag = { x: Math.max(45, geo.x1 - 42), y: LAYOUT.baseY + 25 };
  const rightTag = { x: Math.min(315, geo.x2 + 42), y: LAYOUT.baseY + 25 };

  return (
    <DiagramSvg viewBox={SADDLE3_CONFIG.diagramViewBox}>
      <DiagramDefs gradientId="saddle3PipeGradient" />
      <DiagramCanvas />

      <BetweenBendsVector geo={geo} value={data.display.centerToSide} />
      <RoundObstruction geo={geo} heightLabel={data.display.obstructionHeight} />

      <PipeSegment d={geo.pipePath} variant="shadow" strokeWidth={23} opacity={0.24} />
      <PipeSegment
        d={geo.pipePath}
        variant="pipe"
        gradientId="saddle3PipeGradient"
        material="satin"
        lineCap="butt"
      />
      <BendRadiusZone d={geo.bendLeft} glowWidth={12} />
      <BendRadiusZone d={geo.bendCenter} glowWidth={15} />
      <BendRadiusZone d={geo.bendRight} glowWidth={12} />
      <Saddle3EndCaps />

      <Saddle3MarkCollar point={{ x: geo.x1, y: LAYOUT.baseY }} />
      <Saddle3MarkCollar point={{ x: LAYOUT.centerX, y: geo.peakY }} />
      <Saddle3MarkCollar point={{ x: geo.x2, y: LAYOUT.baseY }} />

      <Saddle3BendTag
        point={{ x: LAYOUT.centerX, y: geo.peakY }}
        tag={centerTag}
        label={`B1  \u00B7  ${data.centerAngle}\u00B0`}
        primary
      />
      <Saddle3BendTag
        point={{ x: geo.x1, y: LAYOUT.baseY }}
        tag={leftTag}
        label={`B2  \u00B7  ${data.sideAngle}\u00B0`}
      />
      <Saddle3BendTag
        point={{ x: geo.x2, y: LAYOUT.baseY }}
        tag={rightTag}
        label={`B3  \u00B7  ${data.sideAngle}\u00B0`}
      />

      <DiagramLabel
        x={180}
        y={31}
        text={saddle3Copy.results.centerMark}
        variant="muted"
        fontSize={8.3}
        fontWeight="700"
      />
      {hasMarks && data.display.centerMark ? (
        <DiagramLabel x={180} y={47} text={data.display.centerMark} variant="mark" fontSize={11} />
      ) : (
        <DiagramLabel x={180} y={47} text="OPTIONAL" variant="muted" fontSize={8} />
      )}

      {hasMarks && data.display.sideMark1 && data.display.sideMark2 ? (
        <Saddle3MarkLegend data={data} />
      ) : null}
      <DiagramFieldCue text={saddle3Copy.diagram.fieldCue} y={294} />
    </DiagramSvg>
  );
}
