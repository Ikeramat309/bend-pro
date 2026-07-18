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
const VECTOR_OFFSET = 31;
const VECTOR_TICK_HALF = 3.2;

type Point = { x: number; y: number };

function midpoint(a: Point, b: Point): Point {
  return { x: (a.x + b.x) / 2, y: (a.y + b.y) / 2 };
}

/** A field mark wraps the conduit and follows the local pipe direction. */
function SaddleMarkCollar({
  point,
  rotation = 0,
  ghost = false,
}: {
  point: Point;
  rotation?: number;
  ghost?: boolean;
}) {
  const theme = useDiagramTheme();
  const transform = rotation === 0 ? undefined : `rotate(${rotation} ${point.x} ${point.y})`;

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
        transform={transform}
      />
      <Ellipse
        cx={point.x}
        cy={point.y}
        rx={2.15}
        ry={9.2}
        fill="none"
        stroke={theme.mark}
        strokeWidth={1.4}
        transform={transform}
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

/**
 * A readable physical obstruction, not a detached technical callout. The
 * entered height lives inside the object so the value-to-object relationship
 * is immediate in both color schemes.
 */
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
  const labelY = top + Math.max(9, geo.obsHeightPx * 0.34);
  const valueY = top + Math.min(22, geo.obsHeightPx * 0.76);

  return (
    <G>
      <Ellipse
        cx={LAYOUT.centerX}
        cy={LAYOUT.baseY + 4}
        rx={geo.obsWidthPx * 0.46}
        ry={4.2}
        fill={theme.floor.shadow}
        opacity={ghost ? 0.05 : 0.13}
      />
      <Rect
        x={left}
        y={top}
        width={geo.obsWidthPx}
        height={geo.obsHeightPx}
        rx={4}
        fill={fill}
        stroke={stroke}
        strokeWidth={1.25}
      />
      <Rect
        x={left + 3}
        y={top + 3}
        width={Math.max(0, geo.obsWidthPx - 6)}
        height={Math.max(0, geo.obsHeightPx - 6)}
        rx={2.5}
        fill="none"
        stroke={stroke}
        strokeWidth={0.55}
        opacity={ghost ? 0.14 : 0.3}
      />
      <Line
        x1={left + 4}
        y1={top + 3.5}
        x2={left + geo.obsWidthPx - 4}
        y2={top + 3.5}
        stroke={stroke}
        strokeWidth={1}
        opacity={ghost ? 0.24 : 0.58}
      />
      {[0.28, 0.5, 0.72].map((ratio) => {
        const x = left + geo.obsWidthPx * ratio;

        return (
          <Line
            key={`obstruction-rib-${ratio}`}
            x1={x}
            y1={top + 6}
            x2={x}
            y2={LAYOUT.baseY - 5}
            stroke={stroke}
            strokeWidth={0.55}
            opacity={ghost ? 0.08 : 0.2}
          />
        );
      })}
      {!ghost && heightLabel ? (
        <G>
          <SvgText
            x={LAYOUT.centerX}
            y={labelY}
            fill={theme.mutedLabel}
            fontSize={6.6}
            fontWeight="700"
            textAnchor="middle">
            HEIGHT
          </SvgText>
          <SvgText
            x={LAYOUT.centerX}
            y={valueY}
            fill={theme.dimensionStrong}
            fontSize={heightLabel.length > 8 ? 8.4 : 10}
            fontWeight="700"
            textAnchor="middle">
            {heightLabel}
          </SvgText>
        </G>
      ) : null}
    </G>
  );
}

function BetweenBendsVector({ geo, value }: { geo: Saddle4DiagramGeometry; value: string }) {
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
  const titleY = 31;
  const valueY = 49;
  const labelTarget = { x: 111, y: valueY - 2 };

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
      <Ellipse cx={mid.x} cy={mid.y} rx={1.25} ry={1.25} fill={theme.dimensionStrong} />
      <SvgText
        x={28}
        y={titleY}
        fill={theme.mutedLabel}
        fontSize={8.3}
        fontWeight="700"
        textAnchor="start">
        {saddle4Copy.diagram.betweenBends.toUpperCase()}
      </SvgText>
      <SvgText
        x={28}
        y={valueY}
        fill={theme.dimensionStrong}
        fontSize={12.4}
        fontWeight="700"
        textAnchor="start">
        {value}
      </SvgText>
    </G>
  );
}

function SaddleWidthVector({ geo, value }: { geo: Saddle4DiagramGeometry; value: string }) {
  const theme = useDiagramTheme();
  const y = geo.topY - 17;
  const titleY = Math.max(22, y - 27);
  const valueY = titleY + 15;

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
            y1={geo.topY - 8}
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
        y={titleY}
        fill={theme.mutedLabel}
        fontSize={8}
        fontWeight="700"
        textAnchor="middle">
        {saddle4Copy.diagram.saddleWidth.toUpperCase()}
      </SvgText>
      <SvgText
        x={LAYOUT.centerX}
        y={valueY}
        fill={theme.dimensionStrong}
        fontSize={11.5}
        fontWeight="700"
        textAnchor="middle">
        {value}
      </SvgText>
    </G>
  );
}

function SaddleAngleCallout({ geo, angle }: { geo: Saddle4DiagramGeometry; angle: number }) {
  const theme = useDiagramTheme();
  const target = {
    x: geo.xIR + LAYOUT.cornerRadius * geo.cosA * 0.72,
    y: geo.topY + LAYOUT.cornerRadius * geo.sinA * 0.55,
  };
  const label = { x: 331, titleY: 31, valueY: 49 };

  return (
    <G>
      <Line
        x1={target.x}
        y1={target.y}
        x2={label.x - 23}
        y2={label.valueY - 2}
        stroke={theme.bendZone.stroke}
        strokeWidth={0.7}
        strokeDasharray="2 3"
        opacity={0.54}
      />
      <Ellipse cx={target.x} cy={target.y} rx={1.25} ry={1.25} fill={theme.bendZone.stroke} />
      <SvgText
        x={label.x}
        y={label.titleY}
        fill={theme.bendZone.stroke}
        fontSize={7.5}
        fontWeight="700"
        textAnchor="end">
        BENDS
      </SvgText>
      <SvgText
        x={label.x}
        y={label.valueY}
        fill={theme.bendZone.stroke}
        fontSize={11.8}
        fontWeight="700"
        textAnchor="end">
        {`${angle}\u00B0 \u00D7 4`}
      </SvgText>
    </G>
  );
}

function SaddleMarkLegend({ data }: { data: Saddle4DiagramData }) {
  const theme = useDiagramTheme();
  const topText = `TOP MARKS  \u00B7  ${data.display.innerMark1}  /  ${data.display.innerMark2}`;
  const outerText = `OUTER MARKS  \u00B7  ${data.display.outerMark1}  /  ${data.display.outerMark2}`;

  return (
    <G>
      <SvgText
        x={LAYOUT.centerX}
        y={264}
        fill={theme.mark}
        fontSize={topText.length > 40 ? 8 : 8.6}
        fontWeight="700"
        textAnchor="middle">
        {topText}
      </SvgText>
      <SvgText
        x={LAYOUT.centerX}
        y={279}
        fill={theme.mark}
        fontSize={outerText.length > 40 ? 8 : 8.6}
        fontWeight="700"
        textAnchor="middle">
        {outerText}
      </SvgText>
    </G>
  );
}

function getSaddleMarks(geo: Saddle4DiagramGeometry, angle: number) {
  const r = LAYOUT.cornerRadius;
  const cx = r * geo.cosA;
  const cy = r * geo.sinA;

  return [
    { point: { x: geo.xOL - r, y: LAYOUT.baseY }, rotation: 0 },
    { point: { x: geo.xIL - cx, y: geo.topY + cy }, rotation: -angle },
    { point: { x: geo.xIR - r, y: geo.topY }, rotation: 0 },
    { point: { x: geo.xOR - cx, y: LAYOUT.baseY - cy }, rotation: angle },
  ];
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
  const marks = getSaddleMarks(geo, 22.5);

  return (
    <DiagramSvg viewBox={SADDLE4_CONFIG.diagramViewBox}>
      <DiagramDefs gradientId="saddle4GhostGradient" ghost />
      <DiagramCanvas />
      <SaddleObstruction geo={geo} ghost />
      <PipeSegment d={geo.pipePath} variant="shadow" opacity={theme.ghost.pipeShadowOpacity} />
      <PipeSegment d={geo.pipePath} variant="pipe" gradientId="saddle4GhostGradient" material="satin" lineCap="butt" />
      <SaddleEndCaps ghost />
      {marks.map((mark, index) => (
        <SaddleMarkCollar key={index} {...mark} ghost />
      ))}
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
  const marks = getSaddleMarks(geo, data.bendAngle);
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
      <SaddleAngleCallout geo={geo} angle={data.bendAngle} />
      <SaddleObstruction geo={geo} heightLabel={data.display.obstructionHeight} />

      <PipeSegment d={geo.pipePath} variant="shadow" strokeWidth={23} opacity={0.22} />
      <PipeSegment
        d={geo.pipePath}
        variant="pipe"
        gradientId="saddle4PipeGradient"
        material="satin"
        lineCap="butt"
      />
      <BendRadiusZone d={geo.bendOuterL} glowWidth={15} />
      <BendRadiusZone d={geo.bendInnerL} glowWidth={15} />
      <BendRadiusZone d={geo.bendInnerR} glowWidth={15} />
      <BendRadiusZone d={geo.bendOuterR} glowWidth={15} />
      <SaddleEndCaps />

      {marks.map((mark, index) => (
        <SaddleMarkCollar key={index} {...mark} />
      ))}

      {hasMarkValues ? <SaddleMarkLegend data={data} /> : null}
      <DiagramFieldCue text={saddle4Copy.diagram.fieldCue} y={294} />
    </DiagramSvg>
  );
}
