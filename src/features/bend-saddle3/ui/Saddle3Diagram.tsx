import { Circle, Ellipse, G, Line, Path, Text as SvgText } from 'react-native-svg';

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
  const radians = (22.5 * Math.PI) / 180;
  const cx = LAYOUT.cornerR * Math.cos(radians);
  const cy = LAYOUT.cornerR * Math.sin(radians);

  return (
    <DiagramSvg viewBox={SADDLE3_CONFIG.diagramViewBox}>
      <DiagramDefs gradientId="saddle3GhostGradient" ghost />
      <DiagramCanvas />
      <RoundObstruction geo={geo} ghost />
      <PipeSegment d={geo.pipePath} variant="shadow" opacity={theme.ghost.pipeShadowOpacity} />
      <PipeSegment
        d={geo.pipePath}
        variant="pipe"
        gradientId="saddle3GhostGradient"
        material="satin"
        lineCap="butt"
      />
      <Saddle3EndCaps ghost />
      <Saddle3MarkCollar point={{ x: geo.x1 - LAYOUT.cornerR, y: LAYOUT.baseY }} ghost />
      <Saddle3MarkCollar
        point={{ x: LAYOUT.centerX - cx, y: geo.peakY + cy }}
        rotation={-22.5}
        ghost
      />
      <Saddle3MarkCollar
        point={{ x: geo.x2 - cx, y: LAYOUT.baseY - cy }}
        rotation={22.5}
        ghost
      />
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

function Saddle3MarkCollar({
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

function Saddle3AngleCallouts({
  geo,
  sideAngle,
  centerAngle,
}: {
  geo: Saddle3DiagramGeometry;
  sideAngle: number;
  centerAngle: number;
}) {
  const theme = useDiagramTheme();
  const centerTitleY = Math.max(76, geo.peakY - 39);
  const centerValueY = centerTitleY + 15;
  const centerTarget = { x: LAYOUT.centerX, y: geo.peakY + 1 };
  const sideTarget = { x: geo.x2 + 4, y: LAYOUT.baseY - 5 };

  return (
    <G>
      <Line
        x1={centerTarget.x}
        y1={centerTarget.y}
        x2={214}
        y2={centerValueY - 4}
        stroke={theme.bendZone.stroke}
        strokeWidth={0.7}
        strokeDasharray="2 3"
        opacity={0.54}
      />
      <Ellipse
        cx={centerTarget.x}
        cy={centerTarget.y}
        rx={1.2}
        ry={1.2}
        fill={theme.bendZone.stroke}
      />
      <SvgText
        x={226}
        y={centerTitleY}
        fill={theme.bendZone.stroke}
        fontSize={7.4}
        fontWeight="700"
        textAnchor="middle">
        CENTER BEND
      </SvgText>
      <SvgText
        x={226}
        y={centerValueY}
        fill={theme.bendZone.stroke}
        fontSize={11.5}
        fontWeight="700"
        textAnchor="middle">
        {`${centerAngle}\u00B0`}
      </SvgText>

      <Line
        x1={sideTarget.x}
        y1={sideTarget.y}
        x2={308}
        y2={47}
        stroke={theme.bendZone.stroke}
        strokeWidth={0.7}
        strokeDasharray="2 3"
        opacity={0.5}
      />
      <Ellipse
        cx={sideTarget.x}
        cy={sideTarget.y}
        rx={1.2}
        ry={1.2}
        fill={theme.bendZone.stroke}
      />
      <SvgText
        x={332}
        y={31}
        fill={theme.bendZone.stroke}
        fontSize={7.4}
        fontWeight="700"
        textAnchor="end">
        SIDE BENDS
      </SvgText>
      <SvgText
        x={332}
        y={49}
        fill={theme.bendZone.stroke}
        fontSize={11.5}
        fontWeight="700"
        textAnchor="end">
        {`${sideAngle}\u00B0 \u00D7 2`}
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
  const sideRadians = (data.sideAngle * Math.PI) / 180;
  const cx = LAYOUT.cornerR * Math.cos(sideRadians);
  const cy = LAYOUT.cornerR * Math.sin(sideRadians);
  const marks = [
    { point: { x: geo.x1 - LAYOUT.cornerR, y: LAYOUT.baseY }, rotation: 0 },
    {
      point: { x: LAYOUT.centerX - cx, y: geo.peakY + cy },
      rotation: -data.sideAngle,
    },
    { point: { x: geo.x2 - cx, y: LAYOUT.baseY - cy }, rotation: data.sideAngle },
  ];

  return (
    <DiagramSvg viewBox={SADDLE3_CONFIG.diagramViewBox}>
      <DiagramDefs gradientId="saddle3PipeGradient" />
      <DiagramCanvas />

      <BetweenBendsVector geo={geo} value={data.display.centerToSide} />
      <Saddle3AngleCallouts
        geo={geo}
        sideAngle={data.sideAngle}
        centerAngle={data.centerAngle}
      />
      <RoundObstruction geo={geo} heightLabel={data.display.obstructionHeight} />

      <PipeSegment d={geo.pipePath} variant="shadow" strokeWidth={23} opacity={0.22} />
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

      {marks.map((mark, index) => (
        <Saddle3MarkCollar key={index} {...mark} />
      ))}

      {hasMarks && data.display.centerMark ? (
        <>
          <DiagramLabel
            x={180}
            y={31}
            text={saddle3Copy.results.centerMark.toUpperCase()}
            variant="muted"
            fontSize={8.3}
            fontWeight="700"
          />
          <DiagramLabel x={180} y={48} text={data.display.centerMark} variant="mark" fontSize={11} />
        </>
      ) : null}

      {hasMarks && data.display.sideMark1 && data.display.sideMark2 ? (
        <Saddle3MarkLegend data={data} />
      ) : null}
      <DiagramFieldCue text={saddle3Copy.diagram.fieldCue} y={294} />
    </DiagramSvg>
  );
}
