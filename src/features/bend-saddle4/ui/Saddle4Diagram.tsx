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
  SADDLE4_DIAGRAM_LAYOUT,
  buildSaddle4DiagramGeometry,
  type Saddle4DiagramGeometry,
} from '../diagram/saddle4DiagramGeometry';
import type { Saddle4DiagramData } from '../engine/saddle4.types';
import { SADDLE4_CONFIG } from '../saddle4.config';
import { saddle4Copy } from '../saddle4.copy';

const LAYOUT = SADDLE4_DIAGRAM_LAYOUT;
const VECTOR_OFFSET = 27;
const VECTOR_TICK_HALF = 3.2;
const TAG_WIDTH = 26;
const TAG_HEIGHT = 13;

type Point = { x: number; y: number };

function midpoint(a: Point, b: Point): Point {
  return { x: (a.x + b.x) / 2, y: (a.y + b.y) / 2 };
}

function SaddleMarkCollar({ point, ghost = false }: { point: Point; ghost?: boolean }) {
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

function SaddleEndCaps({ ghost = false }: { ghost?: boolean }) {
  const theme = useDiagramTheme();

  return (
    <G opacity={ghost ? 0.5 : 1}>
      {[
        { x: LAYOUT.startX, y: LAYOUT.baseY },
        { x: LAYOUT.endX, y: LAYOUT.baseY },
      ].map((point, index) => (
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
      ))}
    </G>
  );
}

function SaddleBendTag({ point, tag, label }: { point: Point; tag: Point; label: string }) {
  const theme = useDiagramTheme();
  const dx = tag.x - point.x;
  const dy = tag.y - point.y;
  const length = Math.hypot(dx, dy) || 1;
  const direction = { x: dx / length, y: dy / length };
  const pipeEdge = {
    x: point.x + direction.x * (diagramMetrics.pipeStroke / 2 + 1.5),
    y: point.y + direction.y * (diagramMetrics.pipeStroke / 2 + 1.5),
  };
  const tagEdge = {
    x: tag.x - direction.x * (TAG_WIDTH / 2),
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
        strokeWidth={0.75}
        opacity={0.5}
      />
      <Rect
        x={tag.x - TAG_WIDTH / 2}
        y={tag.y - TAG_HEIGHT / 2}
        width={TAG_WIDTH}
        height={TAG_HEIGHT}
        rx={3}
        fill={theme.calloutFill}
        stroke={theme.mark}
        strokeWidth={0.85}
      />
      <SvgText
        x={tag.x}
        y={tag.y + 2.8}
        fill={theme.mark}
        fontSize={7.8}
        fontWeight="700"
        textAnchor="middle">
        {label}
      </SvgText>
    </G>
  );
}

function SaddleObstruction({
  geo,
  heightLabel,
  ghost = false,
}: {
  geo: Saddle4DiagramGeometry;
  heightLabel?: string;
  ghost?: boolean;
}) {
  const theme = useDiagramTheme();
  const left = LAYOUT.centerX - geo.obsWidthPx / 2;
  const top = LAYOUT.baseY - geo.obsHeightPx;
  const fill = ghost ? theme.ghost.obstructionFill : theme.obstruction.fill;
  const stroke = ghost ? theme.ghost.obstructionStroke : theme.obstruction.stroke;
  const vectorX = left + 9;
  const vectorMidY = top + geo.obsHeightPx / 2;
  const compact = geo.obsHeightPx < 34;

  return (
    <G>
      <Rect
        x={left}
        y={top}
        width={geo.obsWidthPx}
        height={geo.obsHeightPx}
        rx={3}
        fill={fill}
        stroke={stroke}
        strokeWidth={1.1}
      />
      <Line
        x1={left}
        y1={top}
        x2={left + geo.obsWidthPx}
        y2={top}
        stroke={stroke}
        strokeWidth={1.35}
        opacity={0.8}
      />
      {!ghost && heightLabel ? (
        <G>
          <Line
            x1={vectorX}
            y1={top}
            x2={vectorX}
            y2={LAYOUT.baseY}
            stroke={theme.dimensionStrong}
            strokeWidth={0.9}
            opacity={0.65}
          />
          {[top, LAYOUT.baseY].map((y, index) => (
            <Line
              key={`height-tick-${index}`}
              x1={vectorX - VECTOR_TICK_HALF}
              y1={y}
              x2={vectorX + VECTOR_TICK_HALF}
              y2={y}
              stroke={theme.dimensionStrong}
              strokeWidth={0.85}
              opacity={0.72}
            />
          ))}
          <Line
            x1={vectorX + 3}
            y1={vectorMidY}
            x2={LAYOUT.centerX - 18}
            y2={vectorMidY}
            stroke={theme.dimensionStrong}
            strokeWidth={0.6}
            strokeDasharray="2 3"
            opacity={0.45}
          />
          {compact ? (
            <SvgText
              x={LAYOUT.centerX + 8}
              y={vectorMidY + 3}
              fill={theme.dimensionStrong}
              fontSize={9.4}
              fontWeight="700"
              textAnchor="middle">
              {`HEIGHT · ${heightLabel}`}
            </SvgText>
          ) : (
            <>
              <SvgText
                x={LAYOUT.centerX + 8}
                y={vectorMidY - 3}
                fill={theme.mutedLabel}
                fontSize={7.6}
                fontWeight="600"
                textAnchor="middle">
                HEIGHT
              </SvgText>
              <SvgText
                x={LAYOUT.centerX + 8}
                y={vectorMidY + 10}
                fill={theme.dimensionStrong}
                fontSize={10.8}
                fontWeight="700"
                textAnchor="middle">
                {heightLabel}
              </SvgText>
            </>
          )}
        </G>
      ) : null}
    </G>
  );
}

function BetweenBendsVector({
  geo,
  value,
}: {
  geo: Saddle4DiagramGeometry;
  value: string;
}) {
  const theme = useDiagramTheme();
  const normal = { x: -geo.sinA, y: -geo.cosA };
  const start = {
    x: geo.xOL + normal.x * VECTOR_OFFSET,
    y: LAYOUT.baseY + normal.y * VECTOR_OFFSET,
  };
  const end = {
    x: geo.xIL + normal.x * VECTOR_OFFSET,
    y: geo.topY + normal.y * VECTOR_OFFSET,
  };
  const mid = midpoint(start, end);
  const title = {
    x: mid.x + normal.x * 13,
    y: mid.y + normal.y * 13,
  };
  const result = {
    x: mid.x - normal.x * 2,
    y: mid.y - normal.y * 2,
  };
  const rotation = -Math.atan2(geo.rise, geo.dxDiag) * (180 / Math.PI);

  return (
    <G>
      {[
        { point: { x: geo.xOL, y: LAYOUT.baseY }, vector: start },
        { point: { x: geo.xIL, y: geo.topY }, vector: end },
      ].map((extension, index) => (
        <Line
          key={`between-extension-${index}`}
          x1={extension.point.x + normal.x * 10}
          y1={extension.point.y + normal.y * 10}
          x2={extension.vector.x - normal.x * 4}
          y2={extension.vector.y - normal.y * 4}
          stroke={theme.dimensionStrong}
          strokeWidth={0.65}
          opacity={0.34}
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
          opacity={0.8}
        />
      ))}
      <SvgText
        x={title.x}
        y={title.y}
        fill={theme.mutedLabel}
        fontSize={8.3}
        fontWeight="600"
        textAnchor="middle"
        transform={`rotate(${rotation} ${title.x} ${title.y})`}>
        {saddle4Copy.diagram.betweenBends.toUpperCase()}
      </SvgText>
      <SvgText
        x={result.x}
        y={result.y}
        fill={theme.dimensionStrong}
        fontSize={12.2}
        fontWeight="700"
        textAnchor="middle"
        transform={`rotate(${rotation} ${result.x} ${result.y})`}>
        {value}
      </SvgText>
    </G>
  );
}

function SaddleWidthVector({ geo, value }: { geo: Saddle4DiagramGeometry; value: string }) {
  const theme = useDiagramTheme();
  const y = geo.topY - 24;

  return (
    <G>
      <Line
        x1={geo.xIL}
        y1={y}
        x2={geo.xIR}
        y2={y}
        stroke={theme.dimensionStrong}
        strokeWidth={1.05}
        opacity={0.74}
      />
      {[geo.xIL, geo.xIR].map((x, index) => (
        <G key={`width-end-${index}`}>
          <Line
            x1={x}
            y1={geo.topY - 9}
            x2={x}
            y2={y + 4}
            stroke={theme.dimensionStrong}
            strokeWidth={0.65}
            opacity={0.34}
          />
          <Line
            x1={x}
            y1={y - VECTOR_TICK_HALF}
            x2={x}
            y2={y + VECTOR_TICK_HALF}
            stroke={theme.dimensionStrong}
            strokeWidth={0.9}
            opacity={0.8}
          />
        </G>
      ))}
      <SvgText
        x={LAYOUT.centerX}
        y={geo.topY - 47}
        fill={theme.mutedLabel}
        fontSize={8.3}
        fontWeight="600"
        textAnchor="middle">
        {saddle4Copy.diagram.saddleWidth.toUpperCase()}
      </SvgText>
      <SvgText
        x={LAYOUT.centerX}
        y={geo.topY - 33}
        fill={theme.dimensionStrong}
        fontSize={12.2}
        fontWeight="700"
        textAnchor="middle">
        {value}
      </SvgText>
    </G>
  );
}

function SaddleAngleCallout({ geo, angle }: { geo: Saddle4DiagramGeometry; angle: number }) {
  const theme = useDiagramTheme();
  const bendTarget = {
    x: geo.xOR - LAYOUT.cornerRadius * geo.cosA * 0.46,
    y: LAYOUT.baseY - LAYOUT.cornerRadius * geo.sinA * 0.2,
  };
  const label = {
    x: Math.min(328, geo.xOR + 29),
    y: LAYOUT.baseY - 31,
  };

  return (
    <G>
      <Line
        x1={bendTarget.x}
        y1={bendTarget.y}
        x2={label.x - 16}
        y2={label.y + 1}
        stroke={theme.bendZone.stroke}
        strokeWidth={0.7}
        strokeDasharray="2 3"
        opacity={0.54}
      />
      <Ellipse
        cx={bendTarget.x}
        cy={bendTarget.y}
        rx={1.25}
        ry={1.25}
        fill={theme.bendZone.stroke}
      />
      <SvgText
        x={label.x}
        y={label.y}
        fill={theme.bendZone.stroke}
        fontSize={11.5}
        fontWeight="700"
        textAnchor="middle">
        {`${angle}\u00b0 ×4`}
      </SvgText>
    </G>
  );
}

function SaddleMarkLegend({ data }: { data: Saddle4DiagramData }) {
  const theme = useDiagramTheme();
  const topText = `${saddle4Copy.diagram.top.toUpperCase()} MARKS  ·  ${data.display.innerMark1}  /  ${data.display.innerMark2}`;
  const outerText = `${saddle4Copy.diagram.outer.toUpperCase()} MARKS  ·  ${data.display.outerMark1}  /  ${data.display.outerMark2}`;

  return (
    <G>
      <SvgText
        x={LAYOUT.centerX}
        y={264}
        fill={theme.mark}
        fontSize={topText.length > 40 ? 8.2 : 8.8}
        fontWeight="600"
        textAnchor="middle">
        {topText}
      </SvgText>
      <SvgText
        x={LAYOUT.centerX}
        y={279}
        fill={theme.mark}
        fontSize={outerText.length > 40 ? 8.2 : 8.8}
        fontWeight="600"
        textAnchor="middle">
        {outerText}
      </SvgText>
    </G>
  );
}

export type Saddle4DiagramProps = {
  data?: Saddle4DiagramData;
  isEmpty?: boolean;
  isInvalid?: boolean;
};

export function Saddle4Diagram({ data, isEmpty = false, isInvalid = false }: Saddle4DiagramProps) {
  const message = isInvalid ? saddle4Copy.diagram.invalidMessage : saddle4Copy.diagram.emptyMessage;

  return (
    <DiagramFrame>
      {!data || isEmpty || isInvalid ? (
        <Saddle4GhostDiagram message={message} invalid={isInvalid} />
      ) : (
        <Saddle4LiveDiagram data={data} />
      )}
    </DiagramFrame>
  );
}

function Saddle4GhostDiagram({ message, invalid }: { message: string; invalid?: boolean }) {
  const theme = useDiagramTheme();
  const geo = buildSaddle4DiagramGeometry({
    obstructionHeightInches: 2,
    betweenBendsInches: 5.2,
    saddleWidthInches: 4,
    bendAngleDeg: 22.5,
  });

  return (
    <DiagramSvg viewBox={SADDLE4_CONFIG.diagramViewBox}>
      <DiagramDefs gradientId="saddle4GhostGradient" ghost />
      <DiagramCanvas />
      <SaddleObstruction geo={geo} ghost />
      <PipeSegment d={geo.pipePath} variant="shadow" opacity={theme.ghost.pipeShadowOpacity} />
      <PipeSegment d={geo.pipePath} variant="pipe" gradientId="saddle4GhostGradient" />
      <SaddleEndCaps ghost />
      <SaddleMarkCollar point={{ x: geo.xOL, y: LAYOUT.baseY }} ghost />
      <SaddleMarkCollar point={{ x: geo.xIL, y: geo.topY }} ghost />
      <SaddleMarkCollar point={{ x: geo.xIR, y: geo.topY }} ghost />
      <SaddleMarkCollar point={{ x: geo.xOR, y: LAYOUT.baseY }} ghost />
      <DiagramGhostMessage text={message} invalid={invalid} />
    </DiagramSvg>
  );
}

function Saddle4LiveDiagram({ data }: { data: Saddle4DiagramData }) {
  const geo = buildSaddle4DiagramGeometry({
    obstructionHeightInches: data.obstructionHeightInches,
    betweenBendsInches: data.betweenBendsInches,
    saddleWidthInches: data.saddleWidthInches,
    bendAngleDeg: data.bendAngle,
  });
  const marks = {
    outerLeft: { x: geo.xOL, y: LAYOUT.baseY },
    topLeft: { x: geo.xIL, y: geo.topY },
    topRight: { x: geo.xIR, y: geo.topY },
    outerRight: { x: geo.xOR, y: LAYOUT.baseY },
  };
  const hasMarkValues = Boolean(
    data.display.outerMark1 &&
      data.display.innerMark1 &&
      data.display.innerMark2 &&
      data.display.outerMark2,
  );

  return (
    <DiagramSvg viewBox={SADDLE4_CONFIG.diagramViewBox}>
      <DiagramDefs gradientId="saddle4PipeGradient" />
      <DiagramCanvas />

      <BetweenBendsVector geo={geo} value={data.display.betweenBends} />
      {geo.hasSaddleWidth && data.display.saddleWidth ? (
        <SaddleWidthVector geo={geo} value={data.display.saddleWidth} />
      ) : null}
      <SaddleObstruction geo={geo} heightLabel={data.display.obstructionHeight} />

      <PipeSegment d={geo.pipePath} variant="shadow" opacity={0.48} />
      <PipeSegment d={geo.pipePath} variant="pipe" gradientId="saddle4PipeGradient" />
      <BendRadiusZone d={geo.bendOuterL} glowWidth={14} />
      <BendRadiusZone d={geo.bendInnerL} glowWidth={14} />
      <BendRadiusZone d={geo.bendInnerR} glowWidth={14} />
      <BendRadiusZone d={geo.bendOuterR} glowWidth={14} />
      <SaddleEndCaps />

      <SaddleMarkCollar point={marks.outerLeft} />
      <SaddleMarkCollar point={marks.topLeft} />
      <SaddleMarkCollar point={marks.topRight} />
      <SaddleMarkCollar point={marks.outerRight} />

      <SaddleBendTag
        point={marks.topLeft}
        tag={{ x: geo.xIL + 17, y: geo.topY + 16 }}
        label="T1"
      />
      <SaddleBendTag
        point={marks.topRight}
        tag={{ x: geo.xIR - 17, y: geo.topY + 16 }}
        label="T2"
      />
      <SaddleBendTag
        point={marks.outerLeft}
        tag={{ x: geo.xOL + 20, y: LAYOUT.baseY + 27 }}
        label="O1"
      />
      <SaddleBendTag
        point={marks.outerRight}
        tag={{ x: geo.xOR - 20, y: LAYOUT.baseY + 27 }}
        label="O2"
      />

      <SaddleAngleCallout geo={geo} angle={data.bendAngle} />
      {hasMarkValues ? <SaddleMarkLegend data={data} /> : null}
      <DiagramFieldCue text={saddle4Copy.diagram.fieldCue} y={296} />
    </DiagramSvg>
  );
}
