import { Circle } from 'react-native-svg';

import {
  BendRadiusZone,
  DiagramBendBadge,
  DiagramCallout,
  DiagramCanvas,
  DiagramDefs,
  DiagramFieldCue,
  DiagramFlowArrow,
  DiagramFrame,
  DiagramGhostMessage,
  DiagramLabel,
  DiagramSvg,
  DimensionLine,
  MarkLine,
  PipeSegment,
  useDiagramTheme,
} from '@/shared/diagrams';
import type { Saddle3DiagramData } from '../engine/saddle3.types';
import { SADDLE3_CONFIG } from '../saddle3.config';
import { saddle3Copy } from '../saddle3.copy';
import {
  SADDLE3_DIAGRAM_LAYOUT,
  buildSaddle3DiagramGeometry,
  capSaddle3DiagramInputs,
} from '../diagram/saddle3DiagramGeometry';

const { centerX: CENTER_X, baseY: BASE_Y, startX: SADDLE3_START_X } = SADDLE3_DIAGRAM_LAYOUT;

function clamp(value: number, min: number, max: number): number {
  return Math.min(Math.max(value, min), max);
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
      <ObstructionCircle centerX={CENTER_X} baselineY={BASE_Y} radius={geo.obsRadius} ghost />
      <PipeSegment d={geo.pipePath} variant="shadow" opacity={theme.ghost.pipeShadowOpacity} />
      <PipeSegment d={geo.pipePath} variant="pipe" gradientId="saddle3GhostGradient" />
      <MarkLine x1={geo.x1} y1={BASE_Y - 11} x2={geo.x1} y2={BASE_Y + 11} opacity={theme.ghost.dimensionOpacity} />
      <MarkLine x1={CENTER_X} y1={geo.peakY - 12} x2={CENTER_X} y2={geo.peakY + 7} opacity={theme.ghost.markOpacity} />
      <MarkLine x1={geo.x2} y1={BASE_Y - 11} x2={geo.x2} y2={BASE_Y + 11} opacity={theme.ghost.dimensionOpacity} />
      <DiagramGhostMessage text={message} invalid={invalid} />
    </DiagramSvg>
  );
}

type ObstructionCircleProps = {
  centerX: number;
  baselineY: number;
  radius: number;
  ghost?: boolean;
};

function ObstructionCircle({
  centerX,
  baselineY,
  radius,
  ghost = false,
}: ObstructionCircleProps) {
  const theme = useDiagramTheme();
  const cy = baselineY - radius;
  const fill = ghost ? theme.ghost.obstructionFill : theme.obstruction.fill;
  const stroke = ghost ? theme.ghost.obstructionStroke : theme.obstruction.stroke;

  return (
    <Circle cx={centerX} cy={cy} r={radius} fill={fill} stroke={stroke} strokeWidth={1.5} />
  );
}

function ObstructionHeightLabel({
  centerX,
  baselineY,
  radius,
  heightLabel,
}: {
  centerX: number;
  baselineY: number;
  radius: number;
  heightLabel: string;
}) {
  const cy = baselineY - radius;
  const fontSize = clamp(radius * 0.42, 8.5, 11);

  return (
    <DiagramLabel
      x={centerX}
      y={cy + 4}
      text={heightLabel}
      variant="default"
      fontSize={fontSize}
      fontWeight="700"
    />
  );
}

function Saddle3LiveDiagram({ data }: { data: Saddle3DiagramData }) {
  const { visualObsIn, visualCenterToSide } = capSaddle3DiagramInputs(
    data.obstructionHeightInches,
    data.centerToSideInches,
  );
  const geo = buildSaddle3DiagramGeometry(visualObsIn, visualCenterToSide, data.sideAngle);
  const { peakY, x1, x2, obsRadius, pipePath, bendLeft, bendRight } = geo;

  const hasMarks = data.centerMarkInches !== undefined;

  const segDx = CENTER_X - x1;
  const segRise = BASE_Y - peakY;
  const diagonalPx = Math.hypot(segDx, segRise);
  const nx = -segRise / diagonalPx;
  const ny = -segDx / diagonalPx;
  const dimOffset = 28;
  const dbb1 = { x: x1 + nx * dimOffset, y: BASE_Y + ny * dimOffset };
  const dbb2 = { x: CENTER_X + nx * dimOffset, y: peakY + ny * dimOffset };
  const bbLabelT = 0.34;
  const bbLabelX = dbb1.x + (dbb2.x - dbb1.x) * bbLabelT + nx * 24;
  const bbLabelY = dbb1.y + (dbb2.y - dbb1.y) * bbLabelT + ny * 24;

  return (
    <DiagramSvg viewBox={SADDLE3_CONFIG.diagramViewBox}>
      <DiagramDefs gradientId="saddle3PipeGradient" />
      <DiagramCanvas />

      <ObstructionCircle centerX={CENTER_X} baselineY={BASE_Y} radius={obsRadius} />

      <PipeSegment d={pipePath} variant="shadow" />
      <PipeSegment d={pipePath} variant="pipe" gradientId="saddle3PipeGradient" />

      <ObstructionHeightLabel
        centerX={CENTER_X}
        baselineY={BASE_Y}
        radius={obsRadius}
        heightLabel={data.display.obstructionHeight}
      />

      <BendRadiusZone d={bendLeft} glowWidth={13} />
      <BendRadiusZone d={bendRight} glowWidth={13} />

      <DiagramBendBadge x={x1} y={BASE_Y - 24} order={2} />
      <DiagramBendBadge x={CENTER_X} y={peakY - 26} order={1} primary />
      <DiagramBendBadge x={x2} y={BASE_Y - 24} order={3} />
      <DiagramFlowArrow x={SADDLE3_START_X - 4} y={BASE_Y} />

      <DimensionLine
        x1={dbb1.x}
        y1={dbb1.y}
        x2={dbb2.x}
        y2={dbb2.y}
        showArrows={diagonalPx >= 36}
        extensionLines={[
          { x1: x1 + nx * 8, y1: BASE_Y + ny * 8, x2: x1 + nx * 30, y2: BASE_Y + ny * 30 },
          { x1: CENTER_X + nx * 8, y1: peakY + ny * 8, x2: CENTER_X + nx * 30, y2: peakY + ny * 30 },
        ]}
      />
      <DiagramLabel
        x={bbLabelX}
        y={bbLabelY}
        text={saddle3Copy.diagram.betweenBends}
        variant="muted"
        fontSize={9.5}
        fontWeight="600"
      />
      <DiagramLabel
        x={bbLabelX}
        y={bbLabelY + 14}
        text={data.display.centerToSide}
        variant="default"
        fontSize={11}
      />

      <MarkLine x1={x1} y1={BASE_Y - 12} x2={x1} y2={BASE_Y + 12} opacity={0.62} />
      <DiagramLabel
        x={x1}
        y={BASE_Y + 34}
        text={saddle3Copy.diagram.sideMark1}
        variant="muted"
        fontSize={9.5}
        fontWeight="600"
      />
      {hasMarks && data.display.sideMark1 ? (
        <DiagramLabel x={x1} y={BASE_Y + 48} text={data.display.sideMark1} variant="default" fontSize={11} />
      ) : null}

      <MarkLine x1={CENTER_X} y1={peakY - 12} x2={CENTER_X} y2={peakY + 12} />
      <DiagramLabel
        x={CENTER_X}
        y={peakY - 32}
        text={saddle3Copy.diagram.centerMark}
        variant="muted"
        fontSize={9.5}
        fontWeight="600"
      />
      {hasMarks && data.display.centerMark ? (
        <DiagramLabel x={CENTER_X} y={peakY - 18} text={data.display.centerMark} variant="mark" fontSize={11} />
      ) : null}

      <MarkLine x1={x2} y1={BASE_Y - 12} x2={x2} y2={BASE_Y + 12} opacity={0.62} />
      <DiagramLabel
        x={x2}
        y={BASE_Y + 34}
        text={saddle3Copy.diagram.sideMark2}
        variant="muted"
        fontSize={9.5}
        fontWeight="600"
      />
      {hasMarks && data.display.sideMark2 ? (
        <DiagramLabel x={x2} y={BASE_Y + 48} text={data.display.sideMark2} variant="default" fontSize={11} />
      ) : null}

      <DiagramCallout x={16} y={14} width={132} height={26}>
        <DiagramLabel
          x={30}
          y={31}
          text={`${saddle3Copy.diagram.shrink}  ${data.display.shrink}`}
          variant="default"
          fontSize={10}
          textAnchor="start"
        />
      </DiagramCallout>
      <DiagramFieldCue text={saddle3Copy.diagram.fieldCue} />
    </DiagramSvg>
  );
}
