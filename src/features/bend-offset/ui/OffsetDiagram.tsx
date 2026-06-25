import Svg from 'react-native-svg';

import {
  BendRadiusZone,
  DiagramCallout,
  DiagramCanvas,
  DiagramDefs,
  DiagramFrame,
  DiagramGhostMessage,
  DiagramLabel,
  DimensionLine,
  MarkLine,
  PipeSegment,
  diagramTheme,
} from '@/shared/diagrams';
import type { OffsetDiagramData } from '../engine/offset.types';
import { OFFSET_CONFIG } from '../offset.config';
import { offsetCopy } from '../offset.copy';

const GHOST_PIPE = 'M 24 230 H 88 L 192 126 H 336';
const { ghost } = diagramTheme;

/** Left end of the pipe. */
const START_X = 24;
/** Right end of the pipe. */
const END_X = 336;
/** Centerline of the low (entry) run. */
const BOTTOM_Y = 230;
/** Max horizontal travel of the diagonal between bends. */
const DX_MAX = 150;
/** Max vertical rise between the two runs. */
const RISE_MAX = 104;
const RISE_MIN = 20;
/** Corner radius of the bend zones, in px. Fixed shoe geometry. */
const CORNER_R = 18;
const LEFT_RUN_DEFAULT = 64;
const LEFT_RUN_MIN = 44;
const LEFT_RUN_MAX = 110;

function clamp(value: number, min: number, max: number): number {
  return Math.min(Math.max(value, min), max);
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
  return (
    <Svg
      viewBox={OFFSET_CONFIG.diagramViewBox}
      width="100%"
      height="100%"
      preserveAspectRatio="xMidYMid meet">
      <DiagramDefs gradientId="offsetGhostGradient" ghost />
      <DiagramCanvas />
      <PipeSegment d={GHOST_PIPE} variant="shadow" opacity={ghost.pipeShadowOpacity} />
      <PipeSegment d={GHOST_PIPE} variant="pipe" gradientId="offsetGhostGradient" />
      <MarkLine x1={88} y1={218} x2={88} y2={242} opacity={ghost.markOpacity} />
      <MarkLine x1={192} y1={114} x2={192} y2={138} opacity={ghost.markOpacity} />
      <DimensionLine x1={88} y1={268} x2={192} y2={268} showArrows={false} opacity={ghost.dimensionOpacity} />
      <DiagramGhostMessage text={message} invalid={invalid} />
    </Svg>
  );
}

function OffsetLiveDiagram({ data }: { data: OffsetDiagramData }) {
  const mark1Display = data.mark1Inches !== undefined ? data.display.mark1 : undefined;
  const mark2Display = data.mark2Inches !== undefined ? data.display.mark2 : undefined;

  // Semi-proportional layout: the diagonal slope IS the real bend angle —
  // a 10° offset draws shallow and long, a 60° offset short and steep.
  // The rise is sized so the diagonal always fits, clamped for readability.
  const radians = (data.bendAngle * Math.PI) / 180;
  const tangent = Math.tan(radians);
  const rise = clamp(tangent * DX_MAX, RISE_MIN, RISE_MAX);
  const dx = rise / tangent;
  const topY = BOTTOM_Y - rise;

  const diagonalPx = Math.hypot(dx, rise);
  const cosA = dx / diagonalPx;
  const sinA = rise / diagonalPx;

  // With Mark 1 given, the entry run length is proportional to the
  // diagonal (same px-per-inch); otherwise a neutral default.
  const pxPerInch = diagonalPx / data.distanceBetweenBendsInches;
  const leftRun =
    data.mark1Inches !== undefined
      ? clamp(data.mark1Inches * pxPerInch, LEFT_RUN_MIN, LEFT_RUN_MAX)
      : LEFT_RUN_DEFAULT;

  // Bend vertices: bend 1 leaves the low run, bend 2 lands on the high run.
  const x1 = START_X + leftRun;
  const x2 = x1 + dx;
  const p1x = x1 + CORNER_R * cosA;
  const p1y = BOTTOM_Y - CORNER_R * sinA;
  const p2x = x2 - CORNER_R * cosA;
  const p2y = topY + CORNER_R * sinA;

  const pipePath = `M ${START_X} ${BOTTOM_Y} H ${x1 - CORNER_R} Q ${x1} ${BOTTOM_Y} ${p1x} ${p1y} L ${p2x} ${p2y} Q ${x2} ${topY} ${x2 + CORNER_R} ${topY} H ${END_X}`;
  const bendZone1 = `M ${x1 - CORNER_R} ${BOTTOM_Y} Q ${x1} ${BOTTOM_Y} ${p1x} ${p1y}`;
  const bendZone2 = `M ${p2x} ${p2y} Q ${x2} ${topY} ${x2 + CORNER_R} ${topY}`;

  // Distance Between Bends runs ALONG the pipe diagonal (that is what the
  // number means), offset perpendicular to the run. Labels stay horizontal.
  const nx = sinA;
  const ny = cosA;
  const dimOffset = 24;
  const dbb1 = { x: x1 + nx * dimOffset, y: BOTTOM_Y + ny * dimOffset };
  const dbb2 = { x: x2 + nx * dimOffset, y: topY + ny * dimOffset };
  const dbbLabelX = (dbb1.x + dbb2.x) / 2 + 26;
  const dbbLabelY = (dbb1.y + dbb2.y) / 2 + 18;

  const offsetMidY = (BOTTOM_Y + topY) / 2;

  return (
    <Svg
      viewBox={OFFSET_CONFIG.diagramViewBox}
      width="100%"
      height="100%"
      preserveAspectRatio="xMidYMid meet">
      <DiagramDefs gradientId="offsetPipeGradient" />
      <DiagramCanvas />

      <PipeSegment d={pipePath} variant="shadow" />
      <PipeSegment d={pipePath} variant="pipe" gradientId="offsetPipeGradient" />

      <BendRadiusZone d={bendZone1} glowWidth={18} />
      <BendRadiusZone d={bendZone2} glowWidth={18} />

      {/* Mark 1 — on the low run at bend 1, measured from the left end. */}
      <MarkLine x1={x1} y1={BOTTOM_Y - 12} x2={x1} y2={BOTTOM_Y + 12} />
      <DiagramLabel
        x={x1}
        y={262}
        text={offsetCopy.diagram.mark1}
        variant="muted"
        fontSize={9.5}
        fontWeight="600"
      />
      {mark1Display ? (
        <DiagramLabel x={x1} y={276} text={mark1Display} variant="default" fontSize={11} />
      ) : null}

      {/* Mark 2 — on the high run at bend 2. */}
      <MarkLine x1={x2} y1={topY - 12} x2={x2} y2={topY + 12} />
      <DiagramLabel
        x={x2}
        y={topY - 30}
        text={offsetCopy.diagram.mark2}
        variant="muted"
        fontSize={9.5}
        fontWeight="600"
      />
      {mark2Display ? (
        <DiagramLabel x={x2} y={topY - 16} text={mark2Display} variant="default" fontSize={11} />
      ) : null}

      {/* Distance Between Bends — along the diagonal. */}
      <DimensionLine
        x1={dbb1.x}
        y1={dbb1.y}
        x2={dbb2.x}
        y2={dbb2.y}
        extensionLines={[
          { x1: x1 + nx * 8, y1: BOTTOM_Y + ny * 8, x2: x1 + nx * 30, y2: BOTTOM_Y + ny * 30 },
          { x1: x2 + nx * 8, y1: topY + ny * 8, x2: x2 + nx * 30, y2: topY + ny * 30 },
        ]}
      />
      <DiagramLabel
        x={dbbLabelX}
        y={dbbLabelY}
        text={offsetCopy.diagram.distanceBetweenBends}
        variant="muted"
        fontSize={9.5}
        fontWeight="600"
      />
      <DiagramLabel
        x={dbbLabelX}
        y={dbbLabelY + 14}
        text={data.display.distanceBetweenBends}
        variant="default"
        fontSize={11}
      />

      {/* Offset Height — the rise between the two runs. */}
      <DimensionLine
        x1={52}
        y1={BOTTOM_Y}
        x2={52}
        y2={topY}
        showArrows={rise >= 28}
        extensionLines={[
          { x1: START_X, y1: BOTTOM_Y, x2: 80, y2: BOTTOM_Y },
          { x1: START_X, y1: topY, x2: 80, y2: topY },
        ]}
      />
      {/* Rotated label and value share one column; separated along the
          rotated axis so the texts cannot overlap. */}
      <DiagramLabel
        x={12}
        y={offsetMidY - 28}
        text={offsetCopy.diagram.offsetHeight}
        variant="muted"
        fontSize={9.5}
        fontWeight="600"
        rotation={-90}
      />
      <DiagramLabel
        x={12}
        y={offsetMidY + 28}
        text={data.display.offsetHeight}
        variant="default"
        fontSize={10.5}
        rotation={-90}
      />

      {/* Shrink — always visible; mark values live at the marks. */}
      <DiagramCallout x={214} y={16} width={132} height={28}>
        <DiagramLabel
          x={228}
          y={34}
          text={`${offsetCopy.diagram.shrink}  ${data.display.shrink}`}
          variant="default"
          fontSize={10}
          textAnchor="start"
        />
      </DiagramCallout>

      <DiagramLabel
        x={346}
        y={292}
        text={`${offsetCopy.diagram.title} • ${data.bendAngle}°`}
        variant="muted"
        fontSize={10}
        fontWeight="600"
        textAnchor="end"
      />
    </Svg>
  );
}
