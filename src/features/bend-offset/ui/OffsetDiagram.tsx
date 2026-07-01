import {
  BendRadiusZone,
  DiagramBendBadge,
  DiagramCanvas,
  DiagramDefs,
  DiagramFrame,
  DiagramGhostMessage,
  DiagramLabel,
  DiagramSvg,
  DimensionLine,
  MarkLine,
  PipeSegment,
  diagramMetrics,
  useDiagramTheme,
} from '@/shared/diagrams';
import { G, Line } from 'react-native-svg';
import {
  OFFSET_DIAGRAM_LAYOUT,
  OFFSET_GHOST_PIPE,
  buildOffsetDiagramGeometry,
  type OffsetDiagramGeometry,
} from '../diagram/offsetDiagramGeometry';
import type { OffsetDiagramData } from '../engine/offset.types';
import { OFFSET_CONFIG } from '../offset.config';
import { offsetCopy } from '../offset.copy';

/** Model-space layout from geometry (pre-180° pipe path). */
const MODEL = OFFSET_DIAGRAM_LAYOUT;

const GHOST_PIPE = OFFSET_GHOST_PIPE;

const VIEW_W = 360;
const VIEW_H = 300;
const ROTATE_ORIGIN = `${VIEW_W / 2} ${VIEW_H / 2}`;
const PIPE_ROTATE = `rotate(180 ${ROTATE_ORIGIN})`;

/** Visual-only spacing for annotations in final screen space. */
const DBB_DIM_OFFSET = 40;
const OFFSET_VECTOR_INSET = 52;
const FLOOR_GAP_BELOW_PIPE = 10;
const OFFSET_LABEL_OUTSET = 38;
const OFFSET_HEIGHT_VALUE_SIZE = 15;
/** Orange mark ticks extend ±12px from mark center in model space → +12px screen Y at bottom edge. */
const MARK_LINE_HALF = 12;
const MARK_VALUE_GAP = 16;

/** Map model layout coords → final on-screen coords (180° about canvas center). */
function toScreen(x: number, y: number): { x: number; y: number } {
  return { x: VIEW_W - x, y: VIEW_H - y };
}

/** Keep dimension label rotation readable (never upside-down). */
function uprightTextRotation(angleDeg: number): number {
  let angle = angleDeg;
  if (angle > 90) angle -= 180;
  if (angle <= -90) angle += 180;
  return angle;
}

/**
 * Final screen-space anchors for annotations after the pipe 180° correction.
 *
 * On screen after 180° rotation:
 * - Model bottomY run (Mark 1) → upper-right horizontal pipe
 * - Model topY run (Mark 2) → lower-left horizontal pipe
 * - Floor reference sits below the lower-left visible run (model topY)
 * - Offset-height top aligns with underside of upper-right visible run (model bottomY)
 */
type OffsetScreenLayout = {
  mark1X: number;
  mark1Y: number;
  mark2X: number;
  mark2Y: number;
  floorLineStartX: number;
  lowerLeftPipeBottomY: number;
  upperRightPipeBottomY: number;
  floorReferenceY: number;
  offsetVectorX: number;
  offsetHeightMidY: number;
  offsetLabelCenterX: number;
  offsetLabelY: number;
  offsetValueY: number;
  mark1ValueY: number;
  mark2ValueY: number;
};

function buildOffsetScreenLayout(
  geo: Pick<OffsetDiagramGeometry, 'topY' | 'x1' | 'x2'>,
  pipeHalf: number,
): OffsetScreenLayout {
  const { topY, x1, x2 } = geo;
  const upperRightRunModelY = MODEL.bottomY;
  const lowerLeftRunModelY = topY;

  const mark1 = toScreen(x1, upperRightRunModelY);
  const mark2 = toScreen(x2, lowerLeftRunModelY);

  // Lower-left horizontal run on screen (model topY, mark 2 toward endX).
  const lowerLeftRunStart = toScreen(MODEL.endX, lowerLeftRunModelY);
  const lowerLeftRunEnd = toScreen(x2, lowerLeftRunModelY);
  const floorLineStartX = Math.min(lowerLeftRunStart.x, lowerLeftRunEnd.x);

  const lowerLeftPipeBottomY = Math.max(
    toScreen(x2, lowerLeftRunModelY - pipeHalf).y,
    toScreen(x2, lowerLeftRunModelY + pipeHalf).y,
  );

  // Underside of upper-right horizontal run on screen (model bottomY, Mark 1 run).
  const upperRightPipeBottomY = Math.max(
    toScreen(x1, upperRightRunModelY - pipeHalf).y,
    toScreen(x1, upperRightRunModelY + pipeHalf).y,
  );

  const floorReferenceY = lowerLeftPipeBottomY + FLOOR_GAP_BELOW_PIPE;
  const offsetVectorX = toScreen(OFFSET_VECTOR_INSET, 0).x;
  const offsetHeightMidY = (floorReferenceY + upperRightPipeBottomY) / 2;
  const offsetLabelCenterX = offsetVectorX - OFFSET_LABEL_OUTSET;
  const offsetLabelY = offsetHeightMidY - 10;
  const offsetValueY = offsetHeightMidY + 10;
  const mark1ValueY = mark1.y + MARK_LINE_HALF + MARK_VALUE_GAP;
  const mark2ValueY = mark2.y + MARK_LINE_HALF + MARK_VALUE_GAP;

  return {
    mark1X: mark1.x,
    mark1Y: mark1.y,
    mark2X: mark2.x,
    mark2Y: mark2.y,
    floorLineStartX,
    lowerLeftPipeBottomY,
    upperRightPipeBottomY,
    floorReferenceY,
    offsetVectorX,
    offsetHeightMidY,
    offsetLabelCenterX,
    offsetLabelY,
    offsetValueY,
    mark1ValueY,
    mark2ValueY,
  };
}

export type OffsetDiagramProps = {
  data?: OffsetDiagramData;
  isEmpty?: boolean;
  isInvalid?: boolean;
};

/** Feature diagram for Offset — built from shared SVG primitives. */
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
      <G transform={PIPE_ROTATE}>
        <PipeSegment d={GHOST_PIPE} variant="shadow" opacity={ghost.pipeShadowOpacity} />
        <PipeSegment d={GHOST_PIPE} variant="pipe" gradientId="offsetGhostGradient" />
        <MarkLine x1={88} y1={218} x2={88} y2={242} opacity={ghost.markOpacity} />
        <MarkLine x1={192} y1={114} x2={192} y2={138} opacity={ghost.markOpacity} />
        <DimensionLine x1={88} y1={268} x2={192} y2={268} showArrows={false} opacity={ghost.dimensionOpacity} />
      </G>
      <DiagramGhostMessage text={message} invalid={invalid} />
    </DiagramSvg>
  );
}

function OffsetLiveDiagram({ data }: { data: OffsetDiagramData }) {
  const theme = useDiagramTheme();
  const mark1Display = data.mark1Inches !== undefined ? data.display.mark1 : undefined;
  const mark2Display = data.mark2Inches !== undefined ? data.display.mark2 : undefined;

  const geo = buildOffsetDiagramGeometry({
    bendAngleDeg: data.bendAngle,
    distanceBetweenBendsInches: data.distanceBetweenBendsInches,
    mark1Inches: data.mark1Inches,
  });

  const { topY, x1, x2, pipePath, bendZone1, bendZone2, rise, cosA, sinA } = geo;
  const pipeHalf = diagramMetrics.pipeStroke / 2;
  const screen = buildOffsetScreenLayout(geo, pipeHalf);

  const nx = sinA;
  const ny = cosA;
  const lowerRunModelY = MODEL.bottomY;

  // Distance-between-bends — screen-space, unchanged placement logic.
  const dbb1 = toScreen(x1 + nx * DBB_DIM_OFFSET, lowerRunModelY + ny * DBB_DIM_OFFSET);
  const dbb2 = toScreen(x2 + nx * DBB_DIM_OFFSET, topY + ny * DBB_DIM_OFFSET);
  const dbbDx = dbb2.x - dbb1.x;
  const dbbDy = dbb2.y - dbb1.y;
  const dbbLen = Math.hypot(dbbDx, dbbDy) || 1;
  const dbbLabelRotation = uprightTextRotation((Math.atan2(dbbDy, dbbDx) * 180) / Math.PI);
  const dbbMid = { x: (dbb1.x + dbb2.x) / 2, y: (dbb1.y + dbb2.y) / 2 };
  const pipeCenter = toScreen((MODEL.startX + MODEL.endX) / 2, (lowerRunModelY + topY) / 2);
  const awayX = dbbMid.x - pipeCenter.x;
  const awayY = dbbMid.y - pipeCenter.y;
  const awayLen = Math.hypot(awayX, awayY) || 1;
  const labelAnchor = {
    x: dbbMid.x + (awayX / awayLen) * 16,
    y: dbbMid.y + (awayY / awayLen) * 16,
  };
  const perpX = -dbbDy / dbbLen;
  const perpY = dbbDx / dbbLen;

  return (
    <DiagramSvg viewBox={OFFSET_CONFIG.diagramViewBox}>
      <DiagramDefs gradientId="offsetPipeGradient" />
      <DiagramCanvas />

      {/* Pipe geometry only — rotated; annotations live in screen space below. */}
      <G transform={PIPE_ROTATE}>
        <PipeSegment d={pipePath} variant="shadow" />
        <PipeSegment d={pipePath} variant="pipe" gradientId="offsetPipeGradient" />
        <BendRadiusZone d={bendZone1} glowWidth={18} />
        <BendRadiusZone d={bendZone2} glowWidth={18} />
        <MarkLine x1={x1} y1={lowerRunModelY - 12} x2={x1} y2={lowerRunModelY + 12} />
        <MarkLine x1={x2} y1={topY - 12} x2={x2} y2={topY + 12} />
      </G>

      {/* Floor reference — below lower-left horizontal run, toward offset-height vector. */}
      <Line
        x1={screen.floorLineStartX}
        y1={screen.floorReferenceY}
        x2={screen.offsetVectorX}
        y2={screen.floorReferenceY}
        stroke={theme.dimension}
        strokeWidth={0.75}
        strokeDasharray="5 4"
        opacity={0.42}
      />

      <DimensionLine
        x1={dbb2.x}
        y1={dbb2.y}
        x2={dbb1.x}
        y2={dbb1.y}
        extensionLines={[
          {
            x1: toScreen(x2 + nx * 8, topY + ny * 8).x,
            y1: toScreen(x2 + nx * 8, topY + ny * 8).y,
            x2: toScreen(x2 + nx * 46, topY + ny * 46).x,
            y2: toScreen(x2 + nx * 46, topY + ny * 46).y,
          },
          {
            x1: toScreen(x1 + nx * 8, lowerRunModelY + ny * 8).x,
            y1: toScreen(x1 + nx * 8, lowerRunModelY + ny * 8).y,
            x2: toScreen(x1 + nx * 46, lowerRunModelY + ny * 46).x,
            y2: toScreen(x1 + nx * 46, lowerRunModelY + ny * 46).y,
          },
        ]}
      />
      <DiagramLabel
        x={labelAnchor.x - perpX * 7}
        y={labelAnchor.y - perpY * 7}
        text={offsetCopy.diagram.distanceBetweenBends}
        variant="muted"
        fontSize={9.5}
        fontWeight="600"
        rotation={dbbLabelRotation}
      />
      <DiagramLabel
        x={labelAnchor.x + perpX * 7}
        y={labelAnchor.y + perpY * 7}
        text={data.display.distanceBetweenBends}
        variant="default"
        fontSize={13}
        fontWeight="700"
        rotation={dbbLabelRotation}
      />

      {/* Offset height — vertical on the right: floor (lower-left) → underside of upper-right run. */}
      <DimensionLine
        x1={screen.offsetVectorX}
        y1={screen.floorReferenceY}
        x2={screen.offsetVectorX}
        y2={screen.upperRightPipeBottomY}
        showArrows={rise >= 28}
      />
      <DiagramLabel
        x={screen.offsetLabelCenterX}
        y={screen.offsetLabelY}
        text={offsetCopy.diagram.offsetHeight}
        variant="muted"
        fontSize={10}
        fontWeight="600"
        textAnchor="middle"
      />
      <DiagramLabel
        x={screen.offsetLabelCenterX}
        y={screen.offsetValueY}
        text={data.display.offsetHeight}
        variant="default"
        fontSize={OFFSET_HEIGHT_VALUE_SIZE}
        fontWeight="700"
        textAnchor="middle"
      />

      <DiagramBendBadge x={screen.mark1X} y={screen.mark1Y - 22} order={1} />
      <DiagramBendBadge x={screen.mark2X} y={screen.mark2Y - 22} order={2} />

      {mark1Display ? (
        <DiagramLabel
          x={screen.mark1X}
          y={screen.mark1ValueY}
          text={mark1Display}
          variant="default"
          fontSize={11}
          textAnchor="middle"
        />
      ) : null}

      {mark2Display ? (
        <DiagramLabel
          x={screen.mark2X}
          y={screen.mark2ValueY}
          text={mark2Display}
          variant="default"
          fontSize={11}
          textAnchor="middle"
        />
      ) : null}
    </DiagramSvg>
  );
}
