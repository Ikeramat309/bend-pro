import { Ellipse, G, Line, Rect, Text as SvgText } from 'react-native-svg';

import {
  BendRadiusZone,
  DiagramCanvas,
  DiagramDefs,
  DiagramFieldCue,
  DiagramFrame,
  DiagramGhostMessage,
  DiagramSvg,
  PipeSegment,
  diagramMetrics,
  useDiagramTheme,
} from '@/shared/diagrams';

import {
  OFFSET_DIAGRAM_LAYOUT,
  OFFSET_GHOST_PIPE,
  buildOffsetDiagramGeometry,
  type OffsetDiagramGeometry,
} from '../diagram/offsetDiagramGeometry';
import type { OffsetDiagramData } from '../engine/offset.types';
import { OFFSET_CONFIG } from '../offset.config';
import { offsetCopy } from '../offset.copy';

const MODEL = OFFSET_DIAGRAM_LAYOUT;
const DBB_VECTOR_OFFSET = 32;
const HEIGHT_VECTOR_X = 326;
const HEIGHT_LABEL_X = 312;
const VECTOR_TICK_HALF = 3.2;
const TAG_HEIGHT = 14;
const TAG_MIN_WIDTH = 22;
const TAG_VALUE_BASE_WIDTH = 31;
const TAG_VALUE_CHARACTER_WIDTH = 5.4;

type Point = { x: number; y: number };

function midpoint(a: Point, b: Point): Point {
  return { x: (a.x + b.x) / 2, y: (a.y + b.y) / 2 };
}

function OffsetMarkCollar({ point, ghost = false }: { point: Point; ghost?: boolean }) {
  const theme = useDiagramTheme();

  return (
    <G opacity={ghost ? 0.42 : 1}>
      <Ellipse
        cx={point.x}
        cy={point.y}
        rx={2.2}
        ry={9.3}
        fill="none"
        stroke={theme.markGlow}
        strokeWidth={2.8}
        opacity={0.38}
      />
      <Ellipse
        cx={point.x}
        cy={point.y}
        rx={2.2}
        ry={9.3}
        fill="none"
        stroke={theme.mark}
        strokeWidth={1.45}
      />
    </G>
  );
}

function OffsetEndCaps({ topY, ghost = false }: { topY: number; ghost?: boolean }) {
  const theme = useDiagramTheme();
  const opacity = ghost ? 0.5 : 1;

  return (
    <G opacity={opacity}>
      {[{ x: MODEL.startX, y: MODEL.bottomY }, { x: MODEL.endX, y: topY }].map(
        (point, index) => (
          <G key={`end-cap-${index}`}>
            <Ellipse
              cx={point.x}
              cy={point.y}
              rx={3.4}
              ry={9.1}
              fill={theme.pipe}
              stroke={theme.pipeSheen}
              strokeWidth={0.75}
            />
            <Ellipse
              cx={point.x}
              cy={point.y}
              rx={2.35}
              ry={6.55}
              fill={theme.endCap.fill}
              stroke={theme.endCap.stroke}
              strokeWidth={0.65}
            />
          </G>
        ),
      )}
    </G>
  );
}

function OffsetBendTag({
  point,
  tag,
  order,
  value,
}: {
  point: Point;
  tag: Point;
  order: 1 | 2;
  value?: string;
}) {
  const theme = useDiagramTheme();
  const label = value ? `B${order}  ·  ${value}` : `B${order}`;
  const width = value
    ? Math.min(104, TAG_VALUE_BASE_WIDTH + value.length * TAG_VALUE_CHARACTER_WIDTH)
    : TAG_MIN_WIDTH;
  const dx = tag.x - point.x;
  const dy = tag.y - point.y;
  const length = Math.hypot(dx, dy) || 1;
  const direction = { x: dx / length, y: dy / length };
  const pipeEdge = {
    x: point.x + direction.x * (diagramMetrics.pipeStroke / 2 + 2),
    y: point.y + direction.y * (diagramMetrics.pipeStroke / 2 + 2),
  };
  const tagEdge = {
    x: tag.x - direction.x * Math.min(width / 2, 10),
    y: tag.y - direction.y * (TAG_HEIGHT / 2),
  };

  return (
    <G>
      <Line
        x1={pipeEdge.x}
        y1={pipeEdge.y}
        x2={tagEdge.x}
        y2={tagEdge.y}
        stroke={theme.mark}
        strokeWidth={0.8}
        opacity={0.52}
      />
      <Rect
        x={tag.x - width / 2}
        y={tag.y - TAG_HEIGHT / 2}
        width={width}
        height={TAG_HEIGHT}
        rx={3}
        fill={theme.calloutFill}
        stroke={theme.mark}
        strokeWidth={0.9}
      />
      <SvgText
        x={tag.x}
        y={tag.y + 3}
        fill={theme.mark}
        fontSize={value ? 7.8 : 8.2}
        fontWeight="700"
        textAnchor="middle">
        {label}
      </SvgText>
    </G>
  );
}

function OffsetDistanceVector({ geo, value }: { geo: OffsetDiagramGeometry; value: string }) {
  const theme = useDiagramTheme();
  const normal = { x: geo.sinA, y: geo.cosA };
  const start = {
    x: geo.x1 - normal.x * DBB_VECTOR_OFFSET,
    y: MODEL.bottomY - normal.y * DBB_VECTOR_OFFSET,
  };
  const end = {
    x: geo.x2 - normal.x * DBB_VECTOR_OFFSET,
    y: geo.topY - normal.y * DBB_VECTOR_OFFSET,
  };
  const mid = midpoint(start, end);
  const rotation = -Math.atan2(geo.rise, geo.dx) * (180 / Math.PI);
  const title = {
    x: mid.x - normal.x * 13,
    y: mid.y - normal.y * 13,
  };
  const result = {
    x: mid.x + normal.x * 2,
    y: mid.y + normal.y * 2,
  };
  const vectorDirection = { x: geo.cosA, y: -geo.sinA };

  return (
    <G>
      {[
        { from: { x: geo.x1, y: MODEL.bottomY }, to: start },
        { from: { x: geo.x2, y: geo.topY }, to: end },
      ].map((extension, index) => (
        <Line
          key={`dbb-extension-${index}`}
          x1={extension.from.x - normal.x * 10}
          y1={extension.from.y - normal.y * 10}
          x2={extension.to.x - normal.x * 5}
          y2={extension.to.y - normal.y * 5}
          stroke={theme.dimensionStrong}
          strokeWidth={0.7}
          opacity={0.34}
        />
      ))}
      <Line
        x1={start.x}
        y1={start.y}
        x2={end.x}
        y2={end.y}
        stroke={theme.dimensionStrong}
        strokeWidth={1.15}
        opacity={0.76}
      />
      {[start, end].map((point, index) => (
        <Line
          key={`dbb-tick-${index}`}
          x1={point.x - normal.x * VECTOR_TICK_HALF}
          y1={point.y - normal.y * VECTOR_TICK_HALF}
          x2={point.x + normal.x * VECTOR_TICK_HALF}
          y2={point.y + normal.y * VECTOR_TICK_HALF}
          stroke={theme.dimensionStrong}
          strokeWidth={0.95}
          opacity={0.8}
        />
      ))}
      <Line
        x1={mid.x - vectorDirection.x * 3}
        y1={mid.y - vectorDirection.y * 3}
        x2={title.x + normal.x * 5}
        y2={title.y + normal.y * 5}
        stroke={theme.dimensionStrong}
        strokeWidth={0.65}
        strokeDasharray="2 3"
        opacity={0.42}
      />
      <SvgText
        x={title.x}
        y={title.y}
        fill={theme.mutedLabel}
        fontSize={8.7}
        fontWeight="600"
        textAnchor="middle"
        transform={`rotate(${rotation} ${title.x} ${title.y})`}>
        {offsetCopy.diagram.distanceBetweenBends.toUpperCase()}
      </SvgText>
      <SvgText
        x={result.x}
        y={result.y}
        fill={theme.dimensionStrong}
        fontSize={13.2}
        fontWeight="700"
        textAnchor="middle"
        transform={`rotate(${rotation} ${result.x} ${result.y})`}>
        {value}
      </SvgText>
    </G>
  );
}

function OffsetHeightVector({ geo, value }: { geo: OffsetDiagramGeometry; value: string }) {
  const theme = useDiagramTheme();
  const start = { x: HEIGHT_VECTOR_X, y: MODEL.bottomY };
  const end = { x: HEIGHT_VECTOR_X, y: geo.topY };
  const mid = midpoint(start, end);
  const compact = geo.rise < 42;
  const titleY = compact ? mid.y - 8 : mid.y - 6;
  const valueY = compact ? mid.y + 8 : mid.y + 11;
  const labelTarget = { x: HEIGHT_LABEL_X + 4, y: mid.y };

  return (
    <G>
      <Line
        x1={geo.x1 + 14}
        y1={MODEL.bottomY}
        x2={HEIGHT_VECTOR_X}
        y2={MODEL.bottomY}
        stroke={theme.dimension}
        strokeWidth={0.7}
        strokeDasharray="4 5"
        opacity={0.28}
      />
      <Line
        x1={start.x}
        y1={start.y}
        x2={end.x}
        y2={end.y}
        stroke={theme.dimensionStrong}
        strokeWidth={1.15}
        opacity={0.76}
      />
      {[start, end].map((point, index) => (
        <Line
          key={`height-tick-${index}`}
          x1={point.x - VECTOR_TICK_HALF}
          y1={point.y}
          x2={point.x + VECTOR_TICK_HALF}
          y2={point.y}
          stroke={theme.dimensionStrong}
          strokeWidth={0.95}
          opacity={0.8}
        />
      ))}
      <Line
        x1={mid.x - 3}
        y1={mid.y}
        x2={labelTarget.x}
        y2={labelTarget.y}
        stroke={theme.dimensionStrong}
        strokeWidth={0.65}
        strokeDasharray="2 3"
        opacity={0.48}
      />
      <SvgText
        x={HEIGHT_LABEL_X}
        y={titleY}
        fill={theme.mutedLabel}
        fontSize={8.5}
        fontWeight="600"
        textAnchor="end">
        {offsetCopy.diagram.offsetHeight.toUpperCase()}
      </SvgText>
      <SvgText
        x={HEIGHT_LABEL_X}
        y={valueY}
        fill={theme.dimensionStrong}
        fontSize={compact ? 12.2 : 13.5}
        fontWeight="700"
        textAnchor="end">
        {value}
      </SvgText>
    </G>
  );
}

function OffsetAngleCallout({ geo, value }: { geo: OffsetDiagramGeometry; value: string }) {
  const theme = useDiagramTheme();
  const bendTarget = {
    x: geo.x1 + MODEL.cornerR * geo.cosA * 0.48,
    y: MODEL.bottomY - MODEL.cornerR * geo.sinA * 0.22,
  };
  const label = {
    x: Math.min(geo.x1 + 58, 178),
    y: MODEL.bottomY + 31,
  };
  const labelTarget = { x: label.x - 12, y: label.y - 5 };

  return (
    <G>
      <Line
        x1={bendTarget.x}
        y1={bendTarget.y}
        x2={labelTarget.x}
        y2={labelTarget.y}
        stroke={theme.bendZone.stroke}
        strokeWidth={0.75}
        strokeDasharray="2 3"
        opacity={0.56}
      />
      <Ellipse
        cx={bendTarget.x}
        cy={bendTarget.y}
        rx={1.35}
        ry={1.35}
        fill={theme.bendZone.stroke}
      />
      <SvgText
        x={label.x}
        y={label.y}
        fill={theme.bendZone.stroke}
        fontSize={13}
        fontWeight="700"
        textAnchor="middle">
        {value}
      </SvgText>
    </G>
  );
}

export type OffsetDiagramProps = {
  data?: OffsetDiagramData;
  isEmpty?: boolean;
  isInvalid?: boolean;
};

/** Feature diagram for Offset — a single-plane, horizontal field layout. */
export function OffsetDiagram({ data, isEmpty = false, isInvalid = false }: OffsetDiagramProps) {
  const message = isInvalid
    ? offsetCopy.diagram.invalidMessage
    : offsetCopy.diagram.emptyMessage;
  const showLive = Boolean(data) && !isEmpty && !isInvalid;
  const fallbackMessage = !isEmpty && !isInvalid ? offsetCopy.diagram.unavailableMessage : message;

  return (
    <DiagramFrame>
      {showLive ? (
        <OffsetLiveDiagram data={data!} />
      ) : (
        <OffsetGhostDiagram message={fallbackMessage} invalid={isInvalid} />
      )}
    </DiagramFrame>
  );
}

function OffsetGhostDiagram({ message, invalid }: { message: string; invalid?: boolean }) {
  const { ghost } = useDiagramTheme();

  return (
    <DiagramSvg viewBox={OFFSET_CONFIG.diagramViewBox}>
      <DiagramDefs gradientId="offsetGhostGradient" ghost />
      <DiagramCanvas />
      <PipeSegment d={OFFSET_GHOST_PIPE} variant="shadow" opacity={ghost.pipeShadowOpacity} />
      <PipeSegment d={OFFSET_GHOST_PIPE} variant="pipe" gradientId="offsetGhostGradient" />
      <OffsetEndCaps topY={126} ghost />
      <OffsetMarkCollar point={{ x: 88, y: MODEL.bottomY }} ghost />
      <OffsetMarkCollar point={{ x: 192, y: 126 }} ghost />
      <DiagramGhostMessage text={message} invalid={invalid} />
    </DiagramSvg>
  );
}

function OffsetLiveDiagram({ data }: { data: OffsetDiagramData }) {
  const geo = buildOffsetDiagramGeometry({
    bendAngleDeg: data.bendAngle,
    distanceBetweenBendsInches: data.distanceBetweenBendsInches,
    mark1Inches: data.mark1Inches,
  });
  const mark1 = { x: geo.x1, y: MODEL.bottomY };
  const mark2 = { x: geo.x2, y: geo.topY };
  const mark1Width = data.display.mark1
    ? Math.min(104, TAG_VALUE_BASE_WIDTH + data.display.mark1.length * TAG_VALUE_CHARACTER_WIDTH)
    : TAG_MIN_WIDTH;
  const mark2Width = data.display.mark2
    ? Math.min(104, TAG_VALUE_BASE_WIDTH + data.display.mark2.length * TAG_VALUE_CHARACTER_WIDTH)
    : TAG_MIN_WIDTH;
  const tag1 = {
    x: Math.max(mark1Width / 2 + 4, mark1.x - 28),
    y: MODEL.bottomY + 31,
  };
  const tag2 = {
    x: Math.min(MODEL.endX - mark2Width / 2 - 5, mark2.x + 32),
    y: geo.topY - 26,
  };

  return (
    <DiagramSvg viewBox={OFFSET_CONFIG.diagramViewBox}>
      <DiagramDefs gradientId="offsetPipeGradient" />
      <DiagramCanvas />

      <OffsetDistanceVector geo={geo} value={data.display.distanceBetweenBends} />
      <OffsetHeightVector geo={geo} value={data.display.offsetHeight} />

      <PipeSegment d={geo.pipePath} variant="shadow" opacity={0.55} />
      <PipeSegment d={geo.pipePath} variant="pipe" gradientId="offsetPipeGradient" />
      <BendRadiusZone d={geo.bendZone1} glowWidth={17} />
      <BendRadiusZone d={geo.bendZone2} glowWidth={17} />
      <OffsetEndCaps topY={geo.topY} />

      <OffsetMarkCollar point={mark1} />
      <OffsetMarkCollar point={mark2} />
      <OffsetBendTag point={mark1} tag={tag1} order={1} value={data.display.mark1} />
      <OffsetBendTag point={mark2} tag={tag2} order={2} value={data.display.mark2} />
      <OffsetAngleCallout geo={geo} value={`${data.bendAngle}\u00b0`} />

      <DiagramFieldCue text={offsetCopy.diagram.fieldCue} />
    </DiagramSvg>
  );
}
