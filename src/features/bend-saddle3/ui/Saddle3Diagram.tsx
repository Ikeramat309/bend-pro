import { Circle, Ellipse } from 'react-native-svg';

import {
  BendRadiusZone,
  DiagramBendBadge,
  DiagramCanvas,
  DiagramDefs,
  DiagramFieldCue,
  DiagramFrame,
  DiagramGhostMessage,
  DiagramLabel,
  DiagramLeaderLine,
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

const { centerX: CENTER_X, baseY: BASE_Y } = SADDLE3_DIAGRAM_LAYOUT;

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

function ObstructionHeightPocket({
  centerX,
  radius,
  heightLabel,
}: {
  centerX: number;
  radius: number;
  heightLabel: string;
}) {
  const pocketX = 320;
  const vectorTop = 58;
  const vectorBottom = vectorTop + Math.min(Math.max(radius * 2, 30), 58);
  const obstructionTopY = BASE_Y - radius * 2;

  return (
    <>
      <DimensionLine
        x1={pocketX}
        y1={vectorTop}
        x2={pocketX}
        y2={vectorBottom}
        showArrows
      />
      <DiagramLeaderLine
        x1={pocketX - 2}
        y1={vectorBottom + 4}
        x2={centerX + 3}
        y2={obstructionTopY - 2}
        opacity={0.78}
      />
      <DiagramLabel
        x={pocketX - 9}
        y={31}
        text="HEIGHT"
        variant="muted"
        fontSize={8}
        fontWeight="700"
        textAnchor="end"
      />
      <DiagramLabel
        x={pocketX - 9}
        y={46}
        text={heightLabel}
        variant="default"
        fontSize={10.5}
        fontWeight="700"
        textAnchor="end"
      />
    </>
  );
}

function PipeEndCap({ x, y }: { x: number; y: number }) {
  const theme = useDiagramTheme();

  return (
    <Ellipse
      cx={x}
      cy={y}
      rx={3.2}
      ry={8.1}
      fill={theme.endCap.fill}
      stroke={theme.endCap.stroke}
      strokeWidth={1.25}
    />
  );
}

function Saddle3LiveDiagram({ data }: { data: Saddle3DiagramData }) {
  const { visualObsIn, visualCenterToSide } = capSaddle3DiagramInputs(
    data.obstructionHeightInches,
    data.centerToSideInches,
  );
  const geo = buildSaddle3DiagramGeometry(visualObsIn, visualCenterToSide, data.sideAngle);
  const { peakY, x1, x2, obsRadius, pipePath, bendLeft, bendCenter, bendRight } = geo;

  const hasMarks = data.centerMarkInches !== undefined;

  const segDx = CENTER_X - x1;
  const segRise = BASE_Y - peakY;
  const diagonalPx = Math.hypot(segDx, segRise);
  const ux = segDx / diagonalPx;
  const uy = -segRise / diagonalPx;
  const dimensionCenter = { x: 91, y: 92 };
  const dimensionHalf = 43;
  const dbb1 = {
    x: dimensionCenter.x - ux * dimensionHalf,
    y: dimensionCenter.y - uy * dimensionHalf,
  };
  const dbb2 = {
    x: dimensionCenter.x + ux * dimensionHalf,
    y: dimensionCenter.y + uy * dimensionHalf,
  };

  const sideBadgeY = BASE_Y + 17;
  const leftBadgeX = 45;
  const rightBadgeX = 315;
  const centerBadgeX = 164;
  const centerBadgeY = 62;

  return (
    <DiagramSvg viewBox={SADDLE3_CONFIG.diagramViewBox}>
      <DiagramDefs gradientId="saddle3PipeGradient" />
      <DiagramCanvas />

      <ObstructionCircle centerX={CENTER_X} baselineY={BASE_Y} radius={obsRadius} />

      <DimensionLine
        x1={dbb1.x}
        y1={dbb1.y}
        x2={dbb2.x}
        y2={dbb2.y}
        showArrows={diagonalPx >= 36}
      />
      <DiagramLeaderLine
        x1={dbb1.x}
        y1={dbb1.y + 5}
        x2={x1}
        y2={BASE_Y - 11}
        opacity={0.72}
      />
      <DiagramLeaderLine
        x1={dbb2.x}
        y1={dbb2.y + 5}
        x2={CENTER_X}
        y2={peakY - 11}
        opacity={0.72}
      />
      <ObstructionHeightPocket
        centerX={CENTER_X}
        radius={obsRadius}
        heightLabel={data.display.obstructionHeight}
      />
      <DiagramLeaderLine
        x1={CENTER_X}
        y1={centerBadgeY + 12}
        x2={CENTER_X}
        y2={peakY - 11}
        opacity={0.76}
      />
      <DiagramLeaderLine
        x1={leftBadgeX + 9}
        y1={sideBadgeY - 3}
        x2={x1 - 2}
        y2={BASE_Y + 9}
        opacity={0.76}
      />
      <DiagramLeaderLine
        x1={rightBadgeX - 9}
        y1={sideBadgeY - 3}
        x2={x2 + 2}
        y2={BASE_Y + 9}
        opacity={0.76}
      />

      <PipeSegment d={pipePath} variant="shadow" />
      <PipeSegment d={pipePath} variant="pipe" gradientId="saddle3PipeGradient" />
      <PipeEndCap x={SADDLE3_DIAGRAM_LAYOUT.startX - 8} y={BASE_Y} />
      <PipeEndCap x={SADDLE3_DIAGRAM_LAYOUT.endX + 8} y={BASE_Y} />

      <BendRadiusZone d={bendLeft} glowWidth={12} />
      <BendRadiusZone d={bendCenter} glowWidth={15} />
      <BendRadiusZone d={bendRight} glowWidth={12} />

      <DiagramLabel
        x={28}
        y={31}
        text={saddle3Copy.diagram.betweenBends}
        variant="muted"
        fontSize={8.5}
        fontWeight="700"
        textAnchor="start"
      />
      <DiagramLabel
        x={28}
        y={47}
        text={data.display.centerToSide}
        variant="default"
        fontSize={11}
        textAnchor="start"
      />

      <DiagramLabel
        x={180}
        y={31}
        text={saddle3Copy.results.centerMark}
        variant="muted"
        fontSize={8.5}
        fontWeight="700"
      />
      {hasMarks && data.display.centerMark ? (
        <DiagramLabel x={180} y={46} text={data.display.centerMark} variant="mark" fontSize={11} />
      ) : null}
      <DiagramBendBadge x={centerBadgeX} y={centerBadgeY} order={1} primary size={10} />
      <DiagramLabel
        x={190}
        y={centerBadgeY + 3}
        text={`${data.centerAngle}\u00B0`}
        variant="default"
        fontSize={10}
        fontWeight="700"
      />

      <DiagramBendBadge x={leftBadgeX} y={sideBadgeY} order={2} size={9} />
      <DiagramLabel
        x={70}
        y={sideBadgeY + 3}
        text={`${data.sideAngle}\u00B0`}
        variant="default"
        fontSize={9.5}
        fontWeight="700"
      />
      <DiagramBendBadge x={rightBadgeX} y={sideBadgeY} order={3} size={9} />
      <DiagramLabel
        x={290}
        y={sideBadgeY + 3}
        text={`${data.sideAngle}\u00B0`}
        variant="default"
        fontSize={9.5}
        fontWeight="700"
      />

      <MarkLine x1={x1} y1={BASE_Y - 10} x2={x1} y2={BASE_Y + 10} opacity={0.7} />
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

      <MarkLine x1={CENTER_X} y1={peakY - 10} x2={CENTER_X} y2={peakY + 10} />
      <MarkLine x1={x2} y1={BASE_Y - 10} x2={x2} y2={BASE_Y + 10} opacity={0.7} />
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

      <DiagramLeaderLine x1={CENTER_X} y1={BASE_Y + 2} x2={CENTER_X} y2={BASE_Y + 13} opacity={0.68} />
      <DiagramLabel
        x={CENTER_X}
        y={BASE_Y + 26}
        text="OBSTRUCTION"
        variant="muted"
        fontSize={8}
        fontWeight="700"
      />

      <DiagramFieldCue text={saddle3Copy.diagram.fieldCue} />
    </DiagramSvg>
  );
}
