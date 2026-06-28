import { Circle, Line, Path } from 'react-native-svg';

import {
  BendRadiusZone,
  DiagramBendBadge,
  DiagramCallout,
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
import type { RollingDiagramData } from '../engine/rolling.types';
import { ROLLING_CONFIG } from '../rolling.config';
import { rollingCopy } from '../rolling.copy';

const GHOST_PIPE = 'M 24 230 H 88 L 192 126 H 336';

const START_X = 24;
const END_X = 336;
const BOTTOM_Y = 230;
const DX_MAX = 150;
const RISE_MIN = 20;
const RISE_MAX = 104;
const CORNER_R = 18;
const LEFT_RUN_DEFAULT = 64;
const LEFT_RUN_MIN = 44;
const LEFT_RUN_MAX = 110;

/** Compact roll inset — top-right, overlaid on empty canvas above the pipe. */
const INSET_CORNER_X = 272;
const INSET_CORNER_Y = 86;
const INSET_MAX_LEG = 48;
/** Roll leg tilts down-right to read as depth (perpendicular to height in 3D). */
const ROLL_TILT_DEG = 28;

function clamp(value: number, min: number, max: number): number {
  return Math.min(Math.max(value, min), max);
}

export type RollingDiagramProps = {
  data?: RollingDiagramData;
  isEmpty?: boolean;
  isInvalid?: boolean;
};

/** Feature diagram — pipe-first layout with a compact roll inset. */
export function RollingDiagram({ data, isEmpty = false, isInvalid = false }: RollingDiagramProps) {
  const message = isInvalid ? rollingCopy.diagram.invalidMessage : rollingCopy.diagram.emptyMessage;

  return (
    <DiagramFrame>
      {!data || isEmpty || isInvalid ? (
        <RollingGhostDiagram message={message} invalid={isInvalid} />
      ) : (
        <RollingLiveDiagram data={data} />
      )}
    </DiagramFrame>
  );
}

function RollingGhostDiagram({ message, invalid }: { message: string; invalid?: boolean }) {
  const { ghost } = useDiagramTheme();

  return (
    <DiagramSvg viewBox={ROLLING_CONFIG.diagramViewBox}>
      <DiagramDefs gradientId="rollingGhostGradient" ghost />
      <DiagramCanvas />
      <RollInsetGhost />
      <PipeSegment d={GHOST_PIPE} variant="shadow" opacity={ghost.pipeShadowOpacity} />
      <PipeSegment d={GHOST_PIPE} variant="pipe" gradientId="rollingGhostGradient" />
      <MarkLine x1={88} y1={218} x2={88} y2={242} opacity={ghost.markOpacity} />
      <MarkLine x1={192} y1={114} x2={192} y2={138} opacity={ghost.markOpacity} />
      <DiagramGhostMessage text={message} invalid={invalid} />
    </DiagramSvg>
  );
}

function RollInsetGhost() {
  const theme = useDiagramTheme();
  const triV = 34;
  const triH = 22;
  const top = { x: INSET_CORNER_X, y: INSET_CORNER_Y - triV };
  const rollEnd = rollLegEnd(INSET_CORNER_X, INSET_CORNER_Y, triH);
  return (
    <>
      <DiagramCallout x={214} y={14} width={134} height={92}>
        <DiagramLabel
          x={228}
          y={28}
          text={rollingCopy.diagram.rollInset}
          variant="muted"
          fontSize={9}
          fontWeight="700"
          textAnchor="start"
        />
      </DiagramCallout>
      <Path
        d={`M ${INSET_CORNER_X} ${INSET_CORNER_Y} L ${top.x} ${top.y} M ${INSET_CORNER_X} ${INSET_CORNER_Y} L ${rollEnd.x} ${rollEnd.y}`}
        fill="none"
        stroke={theme.dimension}
        strokeWidth={1.5}
        strokeLinecap="round"
        opacity={0.35}
      />
    </>
  );
}

function rollLegEnd(cx: number, cy: number, length: number) {
  const rad = (ROLL_TILT_DEG * Math.PI) / 180;
  return { x: cx + length * Math.cos(rad), y: cy + length * Math.sin(rad) };
}

type RollInsetProps = {
  offsetHeightInches: number;
  advanceInches: number;
  heightLabel: string;
  rollLabel: string;
};

/** Isometric L — height up, roll tilting into depth — tucked in the top-right. */
function RollInset({ offsetHeightInches, advanceInches, heightLabel, rollLabel }: RollInsetProps) {
  const theme = useDiagramTheme();
  const maxLeg = Math.max(offsetHeightInches, advanceInches);
  const triV = INSET_MAX_LEG * (offsetHeightInches / maxLeg);
  const triH = INSET_MAX_LEG * (advanceInches / maxLeg);

  const cx = INSET_CORNER_X;
  const cy = INSET_CORNER_Y;
  const top = { x: cx, y: cy - triV };
  const rollEnd = rollLegEnd(cx, cy, triH);
  const hMidY = (cy + top.y) / 2;
  const rollMid = { x: (cx + rollEnd.x) / 2, y: (cy + rollEnd.y) / 2 };

  const boxH = Math.max(78, triV + 36);
  const leaderTarget = { x: 210, y: 148 };

  return (
    <>
      <DiagramCallout x={214} y={14} width={134} height={boxH}>
        <DiagramLabel
          x={228}
          y={28}
          text={rollingCopy.diagram.rollInset}
          variant="muted"
          fontSize={9}
          fontWeight="700"
          textAnchor="start"
        />

        {/* Pipe end at the corner — roll happens around this axis. */}
        <Circle
          cx={cx}
          cy={cy}
          r={5}
          fill={theme.pipe}
          stroke={theme.pipeHighlight}
          strokeWidth={1}
          opacity={0.9}
        />

        {/* Height leg — vertical, reads as rise. */}
        <Line
          x1={cx}
          y1={cy}
          x2={top.x}
          y2={top.y}
          stroke={theme.pipe}
          strokeWidth={4}
          strokeLinecap="round"
          opacity={0.85}
        />
        <DimensionLine
          x1={cx - 18}
          y1={cy}
          x2={cx - 18}
          y2={top.y}
          showArrows={triV >= 14}
        />
        <DiagramLabel
          x={cx - 22}
          y={hMidY + 4}
          text={heightLabel}
          variant="default"
          fontSize={9.5}
          fontWeight="700"
        />
        <DiagramLabel
          x={cx - 22}
          y={hMidY - 10}
          text={rollingCopy.diagram.offsetHeight}
          variant="muted"
          fontSize={8}
          fontWeight="600"
        />

        {/* Roll leg — angled down-right for depth. */}
        <Line
          x1={cx}
          y1={cy}
          x2={rollEnd.x}
          y2={rollEnd.y}
          stroke={theme.pipe}
          strokeWidth={4}
          strokeLinecap="round"
          opacity={0.85}
        />
        <Path
          d={`M ${rollEnd.x - 6} ${rollEnd.y - 2} L ${rollEnd.x + 2} ${rollEnd.y + 4} L ${rollEnd.x - 2} ${rollEnd.y + 6} Z`}
          fill={theme.dimension}
          opacity={0.7}
        />
        <Path
          d={`M ${cx - 10} ${hMidY} A 14 14 0 0 1 ${rollMid.x - 6} ${rollMid.y - 4}`}
          fill="none"
          stroke={theme.dimension}
          strokeWidth={1}
          strokeDasharray="3 2"
          opacity={0.55}
        />
        <DimensionLine
          x1={rollMid.x - 8}
          y1={rollMid.y + 10}
          x2={rollMid.x + 8}
          y2={rollMid.y - 10}
          showArrows={triH >= 14}
        />
        <DiagramLabel
          x={rollMid.x + 14}
          y={rollMid.y + 6}
          text={rollLabel}
          variant="default"
          fontSize={9.5}
          fontWeight="700"
          textAnchor="start"
        />
        <DiagramLabel
          x={rollMid.x + 14}
          y={rollMid.y - 8}
          text={rollingCopy.diagram.offsetRoll}
          variant="muted"
          fontSize={8}
          fontWeight="600"
          textAnchor="start"
        />

        {/* Right-angle tick at the corner. */}
        <Path
          d={`M ${cx + 7} ${cy} L ${cx + 7} ${cy - 7} L ${cx} ${cy - 7}`}
          fill="none"
          stroke={theme.dimension}
          strokeWidth={0.75}
          opacity={0.75}
        />
      </DiagramCallout>

      {/* Subtle leader from inset toward the pipe bend — ties roll to the layout. */}
      <DiagramLeaderLine x1={cx - 8} y1={cy + 4} x2={leaderTarget.x} y2={leaderTarget.y} opacity={0.45} />
    </>
  );
}

function RollingLiveDiagram({ data }: { data: RollingDiagramData }) {
  const mark1Display = data.mark1Inches !== undefined ? data.display.mark1 : undefined;
  const mark2Display = data.mark2Inches !== undefined ? data.display.mark2 : undefined;

  const radians = (data.bendAngle * Math.PI) / 180;
  const tangent = Math.tan(radians);
  const rise = clamp(tangent * DX_MAX, RISE_MIN, RISE_MAX);
  const dx = rise / tangent;
  const topY = BOTTOM_Y - rise;

  const diagonalPx = Math.hypot(dx, rise);
  const cosA = dx / diagonalPx;
  const sinA = rise / diagonalPx;

  const pxPerInch = diagonalPx / data.distanceBetweenBendsInches;
  const leftRun =
    data.mark1Inches !== undefined
      ? clamp(data.mark1Inches * pxPerInch, LEFT_RUN_MIN, LEFT_RUN_MAX)
      : LEFT_RUN_DEFAULT;

  const x1 = START_X + leftRun;
  const x2 = x1 + dx;
  const p1x = x1 + CORNER_R * cosA;
  const p1y = BOTTOM_Y - CORNER_R * sinA;
  const p2x = x2 - CORNER_R * cosA;
  const p2y = topY + CORNER_R * sinA;

  const pipePath = `M ${START_X} ${BOTTOM_Y} H ${x1 - CORNER_R} Q ${x1} ${BOTTOM_Y} ${p1x} ${p1y} L ${p2x} ${p2y} Q ${x2} ${topY} ${x2 + CORNER_R} ${topY} H ${END_X}`;
  const bendZone1 = `M ${x1 - CORNER_R} ${BOTTOM_Y} Q ${x1} ${BOTTOM_Y} ${p1x} ${p1y}`;
  const bendZone2 = `M ${p2x} ${p2y} Q ${x2} ${topY} ${x2 + CORNER_R} ${topY}`;

  const nx = sinA;
  const ny = cosA;
  const dimOffset = 24;
  const dbb1 = { x: x1 + nx * dimOffset, y: BOTTOM_Y + ny * dimOffset };
  const dbb2 = { x: x2 + nx * dimOffset, y: topY + ny * dimOffset };
  const dbbLabelX = (dbb1.x + dbb2.x) / 2 + 26;
  const dbbLabelY = (dbb1.y + dbb2.y) / 2 + 18;

  return (
    <DiagramSvg viewBox={ROLLING_CONFIG.diagramViewBox}>
      <DiagramDefs gradientId="rollingPipeGradient" />
      <DiagramCanvas />

      {/* Hero pipe — same visual weight as the basic offset diagram. */}
      <PipeSegment d={pipePath} variant="shadow" />
      <PipeSegment d={pipePath} variant="pipe" gradientId="rollingPipeGradient" />

      <BendRadiusZone d={bendZone1} glowWidth={18} />
      <BendRadiusZone d={bendZone2} glowWidth={18} />

      <DiagramBendBadge x={x1} y={BOTTOM_Y - 22} order={1} />
      <DiagramBendBadge x={x2} y={topY - 22} order={2} />

      <MarkLine x1={x1} y1={BOTTOM_Y - 12} x2={x1} y2={BOTTOM_Y + 12} />
      <DiagramLabel
        x={x1}
        y={262}
        text={rollingCopy.diagram.mark1}
        variant="muted"
        fontSize={9.5}
        fontWeight="600"
      />
      {mark1Display ? (
        <DiagramLabel x={x1} y={276} text={mark1Display} variant="default" fontSize={11} />
      ) : null}

      <MarkLine x1={x2} y1={topY - 12} x2={x2} y2={topY + 12} />
      <DiagramLabel
        x={x2}
        y={topY - 30}
        text={rollingCopy.diagram.mark2}
        variant="muted"
        fontSize={9.5}
        fontWeight="600"
      />
      {mark2Display ? (
        <DiagramLabel x={x2} y={topY - 16} text={mark2Display} variant="default" fontSize={11} />
      ) : null}

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
        text={rollingCopy.diagram.distanceBetweenBends}
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

      <DiagramCallout x={16} y={16} width={132} height={28}>
        <DiagramLabel
          x={30}
          y={34}
          text={`${rollingCopy.diagram.shrink}  ${data.display.shrink}`}
          variant="default"
          fontSize={10}
          textAnchor="start"
        />
      </DiagramCallout>

      <DiagramFieldCue text={rollingCopy.diagram.fieldCue} />

      <RollInset
        offsetHeightInches={data.offsetHeightInches}
        advanceInches={data.advanceInches}
        heightLabel={data.display.offsetHeight}
        rollLabel={data.display.advance}
      />
    </DiagramSvg>
  );
}
