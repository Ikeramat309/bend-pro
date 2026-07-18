import { Circle, Ellipse, G, Line, Rect, Text as SvgText } from 'react-native-svg';

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
  COMPOUND90_DIAGRAM_LAYOUT,
  buildCompound90DiagramGeometry,
  type Compound90DiagramGeometry,
} from '../diagram/compound90DiagramGeometry';
import type { Compound90DiagramData } from '../engine/compound90.types';
import { COMPOUND90_CONFIG } from '../compound90.config';
import { compound90Copy } from '../compound90.copy';

type Point = { x: number; y: number };

function WrapMark({ point, rotation }: { point: Point; rotation: number }) {
  const theme = useDiagramTheme();
  const transform = rotation ? `rotate(${rotation} ${point.x} ${point.y})` : undefined;

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
        opacity={0.34}
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

function EndCaps() {
  const theme = useDiagramTheme();
  const l = COMPOUND90_DIAGRAM_LAYOUT;

  return (
    <G>
      <G>
        <Ellipse cx={l.startX} cy={l.baseY} rx={3.3} ry={9.1} fill={theme.pipe} />
        <Ellipse
          cx={l.startX}
          cy={l.baseY}
          rx={2.2}
          ry={6.5}
          fill={theme.endCap.fill}
          stroke={theme.endCap.stroke}
          strokeWidth={0.65}
        />
      </G>
      <G transform={`rotate(90 ${l.secondCornerX} ${l.endY})`}>
        <Ellipse cx={l.secondCornerX} cy={l.endY} rx={3.3} ry={9.1} fill={theme.pipe} />
        <Ellipse
          cx={l.secondCornerX}
          cy={l.endY}
          rx={2.2}
          ry={6.5}
          fill={theme.endCap.fill}
          stroke={theme.endCap.stroke}
          strokeWidth={0.65}
        />
      </G>
    </G>
  );
}

function Obstruction({
  geometry,
  data,
  ghost = false,
}: {
  geometry: Compound90DiagramGeometry;
  data?: Compound90DiagramData;
  ghost?: boolean;
}) {
  const theme = useDiagramTheme();
  const object = geometry.obstruction;
  const fill = ghost ? theme.ghost.obstructionFill : theme.obstruction.fill;
  const stroke = ghost ? theme.ghost.obstructionStroke : theme.obstruction.stroke;
  const centerX = object.x + object.width / 2;
  const centerY = object.y + object.height / 2;
  const clearance = object.clearancePixels;
  const diamondTransform =
    object.kind === 'diamond' ? `rotate(45 ${centerX} ${centerY})` : undefined;
  const value = data
    ? data.shape === 'box' && data.display.secondaryDimension
      ? `${data.display.primaryDimension} × ${data.display.secondaryDimension}`
      : data.display.primaryDimension
    : undefined;

  return (
    <G opacity={ghost ? 0.58 : 1}>
      <Ellipse
        cx={centerX}
        cy={object.y + object.height + 4}
        rx={object.width * 0.46}
        ry={4}
        fill={theme.floor.shadow}
        opacity={ghost ? 0.05 : 0.12}
      />
      {clearance > 0 ? (
        object.kind === 'circle' && object.radius ? (
          <Circle
            cx={centerX}
            cy={centerY}
            r={object.radius + clearance}
            fill="none"
            stroke={theme.dimensionStrong}
            strokeWidth={0.75}
            strokeDasharray="3 3"
            opacity={0.48}
          />
        ) : (
          <Rect
            x={object.x - clearance}
            y={object.y - clearance}
            width={object.width + clearance * 2}
            height={object.height + clearance * 2}
            rx={4}
            fill="none"
            stroke={theme.dimensionStrong}
            strokeWidth={0.75}
            strokeDasharray="3 3"
            opacity={0.48}
            transform={diamondTransform}
          />
        )
      ) : null}
      {object.kind === 'circle' && object.radius ? (
        <Circle cx={centerX} cy={centerY} r={object.radius} fill={fill} stroke={stroke} strokeWidth={1.3} />
      ) : (
        <Rect
          x={object.x}
          y={object.y}
          width={object.width}
          height={object.height}
          rx={object.kind === 'diamond' ? 3 : 4}
          fill={fill}
          stroke={stroke}
          strokeWidth={1.3}
          transform={diamondTransform}
        />
      )}
      {!ghost && data ? (
        <G>
          <SvgText
            x={centerX}
            y={centerY - 3}
            fill={theme.mutedLabel}
            fontSize={6.7}
            fontWeight="700"
            textAnchor="middle">
            {data.display.shape.toUpperCase()}
          </SvgText>
          {data.clearanceInches > 0 ? (
            <SvgText
              x={centerX}
              y={centerY + 22}
              fill={theme.mutedLabel}
              fontSize={6.2}
              fontWeight="700"
              textAnchor="middle">
              {`+ ${data.display.clearance} CLEAR`}
            </SvgText>
          ) : null}
          <SvgText
            x={centerX}
            y={centerY + 10}
            fill={theme.dimensionStrong}
            fontSize={value && value.length > 13 ? 8 : 9.5}
            fontWeight="700"
            textAnchor="middle">
            {value}
          </SvgText>
        </G>
      ) : null}
    </G>
  );
}

function BetweenBends({ geometry, value }: { geometry: Compound90DiagramGeometry; value: string }) {
  const theme = useDiagramTheme();
  const offset = -24 * Math.SQRT1_2;
  const start = {
    x: geometry.firstMark.x + offset,
    y: geometry.firstMark.y + offset,
  };
  const end = {
    x: geometry.secondMark.x + offset,
    y: geometry.secondMark.y + offset,
  };
  const mid = { x: (start.x + end.x) / 2, y: (start.y + end.y) / 2 };

  return (
    <G>
      <Line
        x1={start.x}
        y1={start.y}
        x2={end.x}
        y2={end.y}
        stroke={theme.dimensionStrong}
        strokeWidth={1.05}
        opacity={0.76}
      />
      {[start, end].map((point, index) => (
        <Line
          key={`compound-vector-tick-${index}`}
          x1={point.x - 3}
          y1={point.y - 3}
          x2={point.x + 3}
          y2={point.y + 3}
          stroke={theme.dimensionStrong}
          strokeWidth={0.9}
        />
      ))}
      <Line
        x1={103}
        y1={47}
        x2={mid.x}
        y2={mid.y}
        stroke={theme.dimensionStrong}
        strokeWidth={0.65}
        strokeDasharray="2 3"
        opacity={0.46}
      />
      <Circle cx={mid.x} cy={mid.y} r={1.2} fill={theme.dimensionStrong} />
      <SvgText x={27} y={30} fill={theme.mutedLabel} fontSize={8} fontWeight="700">
        BETWEEN BENDS
      </SvgText>
      <SvgText x={27} y={48} fill={theme.dimensionStrong} fontSize={12} fontWeight="700">
        {value}
      </SvgText>
    </G>
  );
}

export type Compound90DiagramProps = {
  data?: Compound90DiagramData;
  isEmpty?: boolean;
  isInvalid?: boolean;
};

export function Compound90Diagram({
  data,
  isEmpty = false,
  isInvalid = false,
}: Compound90DiagramProps) {
  const message = isInvalid
    ? compound90Copy.diagram.invalidMessage
    : compound90Copy.diagram.emptyMessage;

  return (
    <DiagramFrame>
      {!data || isEmpty || isInvalid ? (
        <Compound90Ghost message={message} invalid={isInvalid} />
      ) : (
        <Compound90Live data={data} />
      )}
    </DiagramFrame>
  );
}

function Compound90Ghost({ message, invalid }: { message: string; invalid?: boolean }) {
  const theme = useDiagramTheme();
  const geometry = buildCompound90DiagramGeometry({
    shape: 'circle',
    primaryDimensionInches: 7,
  });

  return (
    <DiagramSvg viewBox={COMPOUND90_CONFIG.diagramViewBox}>
      <DiagramDefs gradientId="compound90GhostGradient" ghost />
      <DiagramCanvas />
      <Obstruction geometry={geometry} ghost />
      <PipeSegment d={geometry.pipePath} variant="shadow" opacity={theme.ghost.pipeShadowOpacity} />
      <PipeSegment
        d={geometry.pipePath}
        variant="pipe"
        gradientId="compound90GhostGradient"
        material="satin"
        lineCap="butt"
      />
      <EndCaps />
      <DiagramGhostMessage text={message} invalid={invalid} />
    </DiagramSvg>
  );
}

function Compound90Live({ data }: { data: Compound90DiagramData }) {
  const geometry = buildCompound90DiagramGeometry({
    shape: data.shape,
    primaryDimensionInches: data.primaryDimensionInches,
    secondaryDimensionInches: data.secondaryDimensionInches,
    clearanceInches: data.clearanceInches,
  });
  const theme = useDiagramTheme();

  return (
    <DiagramSvg viewBox={COMPOUND90_CONFIG.diagramViewBox}>
      <DiagramDefs gradientId="compound90PipeGradient" />
      <DiagramCanvas />
      <BetweenBends geometry={geometry} value={data.display.distanceBetweenBends} />
      <SvgText
        x={332}
        y={31}
        fill={theme.bendZone.stroke}
        fontSize={7.7}
        fontWeight="700"
        textAnchor="end">
        BENDS
      </SvgText>
      <SvgText
        x={332}
        y={49}
        fill={theme.bendZone.stroke}
        fontSize={11.7}
        fontWeight="700"
        textAnchor="end">
        45° × 2
      </SvgText>
      <Obstruction geometry={geometry} data={data} />
      <PipeSegment d={geometry.pipePath} variant="shadow" strokeWidth={23} opacity={0.22} />
      <PipeSegment
        d={geometry.pipePath}
        variant="pipe"
        gradientId="compound90PipeGradient"
        material="satin"
        lineCap="butt"
      />
      <BendRadiusZone d={geometry.firstBendPath} glowWidth={15} />
      <BendRadiusZone d={geometry.secondBendPath} glowWidth={15} />
      <EndCaps />
      <WrapMark point={geometry.firstMark} rotation={geometry.firstMark.rotation} />
      <WrapMark point={geometry.secondMark} rotation={geometry.secondMark.rotation} />
      {data.display.firstMark && data.display.secondMark ? (
        <SvgText
          x={180}
          y={274}
          fill={theme.mark}
          fontSize={8.5}
          fontWeight="700"
          textAnchor="middle">
          {`MARKS  ·  ${data.display.firstMark}  /  ${data.display.secondMark}`}
        </SvgText>
      ) : null}
      <DiagramFieldCue text={compound90Copy.diagram.fieldCue} y={294} />
    </DiagramSvg>
  );
}
