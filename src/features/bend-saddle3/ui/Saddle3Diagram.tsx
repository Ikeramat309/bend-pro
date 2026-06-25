import { StyleSheet, View } from 'react-native';
import Svg, { Circle } from 'react-native-svg';

import {
  BendRadiusZone,
  DiagramCallout,
  DiagramCanvas,
  DiagramDefs,
  DiagramLabel,
  DimensionLine,
  MarkLine,
  PipeSegment,
  diagramTheme,
} from '@/shared/diagrams';
import type { Saddle3DiagramData } from '../engine/saddle3.types';
import { SADDLE3_CONFIG } from '../saddle3.config';
import { saddle3Copy } from '../saddle3.copy';

/** Left/right ends of the conduit run. */
const START_X = 24;
const END_X = 336;
const CENTER_X = 180;
/** Baseline (centerline of the flat runs). */
const BASE_Y = 228;

/** Shared px-per-inch scale — obstruction, rise, and between-bends track inputs. */
const PX_PER_INCH = 16;
const OBS_HEIGHT_MIN = 22;
/** Diagram geometry stops scaling above this obstruction height (inches). */
const DIAGRAM_OBS_MAX_IN = 4;
const PEAK_MIN_Y = 72;
const PIPE_HALF = 6;
const CLEARANCE_PX = 14;
const MAX_HALF_SPAN = 128;
const MIN_FLAT = 36;
const CORNER_R = 10;
const DIAG_MIN = 40;
const DIAG_MAX = 128;

const MAX_RISE = BASE_Y - PEAK_MIN_Y;

function clamp(value: number, min: number, max: number): number {
  return Math.min(Math.max(value, min), max);
}

/** Cap diagram inputs so large field values do not break layout or cross the pipe. */
function visualDiagramInputs(
  obstructionHeightInches: number,
  centerToSideInches: number,
): { visualObsIn: number; visualCenterToSide: number } {
  const visualObsIn = Math.min(obstructionHeightInches, DIAGRAM_OBS_MAX_IN);
  const centerToSideRatio =
    obstructionHeightInches > 0 ? centerToSideInches / obstructionHeightInches : 0;
  return {
    visualObsIn,
    visualCenterToSide: visualObsIn * centerToSideRatio,
  };
}

type SaddleGeometry = {
  rise: number;
  dx: number;
  peakY: number;
  x1: number;
  x2: number;
  obsRadius: number;
  pipePath: string;
  bendLeft: string;
  bendRight: string;
};

function buildSaddleGeometry(
  visualObsIn: number,
  visualCenterToSide: number,
  sideAngleDeg: number,
): SaddleGeometry {
  const radians = (sideAngleDeg * Math.PI) / 180;
  const tan = Math.tan(radians);
  const cosA = Math.cos(radians);
  const sinA = Math.sin(radians);

  const maxObsHeightPx = MAX_RISE - CLEARANCE_PX - PIPE_HALF - 10;
  let obsHeightPx = clamp(visualObsIn * PX_PER_INCH, OBS_HEIGHT_MIN, maxObsHeightPx);
  let obsRadius = obsHeightPx / 2;
  let minRise = obsHeightPx + CLEARANCE_PX + PIPE_HALF;

  // If clearance needs exceed the frame, shrink the drawn obstruction — geometry
  // has already been capped by DIAGRAM_OBS_MAX_IN so this is a safety net only.
  if (minRise > MAX_RISE) {
    obsHeightPx = MAX_RISE - CLEARANCE_PX - PIPE_HALF - 10;
    obsRadius = obsHeightPx / 2;
    minRise = obsHeightPx + CLEARANCE_PX + PIPE_HALF;
  }

  let diagonalPx = clamp(visualCenterToSide * PX_PER_INCH, DIAG_MIN, DIAG_MAX);
  let rise = diagonalPx * sinA;
  rise = clamp(Math.max(rise, minRise), minRise, MAX_RISE);
  let dx = rise / tan;

  const maxDx = MAX_HALF_SPAN - MIN_FLAT;
  if (dx > maxDx) {
    dx = maxDx;
    rise = clamp(dx * tan, minRise, MAX_RISE);
  }

  if (rise < minRise) {
    rise = Math.min(minRise, MAX_RISE);
    dx = Math.min(rise / tan, maxDx);
  }

  const peakY = BASE_Y - rise;
  const x1 = CENTER_X - dx;
  const x2 = CENTER_X + dx;

  const cx = CORNER_R * cosA;
  const cy = CORNER_R * sinA;
  const a1x = x1 - CORNER_R;
  const b1x = x1 + cx;
  const b1y = BASE_Y - cy;
  const c1x = CENTER_X - cx;
  const c1y = peakY + cy;
  const c2x = CENTER_X + cx;
  const c2y = peakY + cy;
  const d1x = x2 - cx;
  const d1y = BASE_Y - cy;
  const d2x = x2 + CORNER_R;

  const pipePath =
    `M ${START_X} ${BASE_Y} H ${a1x} ` +
    `Q ${x1} ${BASE_Y} ${b1x} ${b1y} ` +
    `L ${c1x} ${c1y} ` +
    `Q ${CENTER_X} ${peakY} ${c2x} ${c2y} ` +
    `L ${d1x} ${d1y} ` +
    `Q ${x2} ${BASE_Y} ${d2x} ${BASE_Y} ` +
    `H ${END_X}`;

  return {
    rise,
    dx,
    peakY,
    x1,
    x2,
    obsRadius,
    pipePath,
    bendLeft: `M ${a1x} ${BASE_Y} Q ${x1} ${BASE_Y} ${b1x} ${b1y}`,
    bendRight: `M ${d1x} ${d1y} Q ${x2} ${BASE_Y} ${d2x} ${BASE_Y}`,
  };
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
    <View style={styles.frame}>
      {!data || isEmpty || isInvalid ? (
        <Saddle3GhostDiagram message={message} />
      ) : (
        <Saddle3LiveDiagram data={data} />
      )}
    </View>
  );
}

function Saddle3GhostDiagram({ message }: { message: string }) {
  const geo = buildSaddleGeometry(2, 5.23, 22.5);

  return (
    <Svg viewBox={SADDLE3_CONFIG.diagramViewBox} width="100%" height={SADDLE3_CONFIG.diagramHeight}>
      <DiagramDefs gradientId="saddle3GhostGradient" ghost />
      <DiagramCanvas />
      <ObstructionCircle centerX={CENTER_X} baselineY={BASE_Y} radius={geo.obsRadius} ghost />
      <PipeSegment d={geo.pipePath} variant="shadow" opacity={0.5} />
      <PipeSegment d={geo.pipePath} variant="pipe" gradientId="saddle3GhostGradient" />
      <MarkLine x1={geo.x1} y1={BASE_Y - 11} x2={geo.x1} y2={BASE_Y + 11} opacity={0.34} />
      <MarkLine x1={CENTER_X} y1={geo.peakY - 12} x2={CENTER_X} y2={geo.peakY + 7} opacity={0.38} />
      <MarkLine x1={geo.x2} y1={BASE_Y - 11} x2={geo.x2} y2={BASE_Y + 11} opacity={0.34} />
      <DiagramLabel x={180} y={286} text={message} variant="muted" fontSize={11} fontWeight="500" />
    </Svg>
  );
}

type ObstructionCircleProps = {
  centerX: number;
  baselineY: number;
  radius: number;
  ghost?: boolean;
};

/** Single circular obstruction on the baseline — pipe clears above it. */
function ObstructionCircle({
  centerX,
  baselineY,
  radius,
  ghost = false,
}: ObstructionCircleProps) {
  const cy = baselineY - radius;
  const fill = ghost ? 'rgba(143, 155, 173, 0.1)' : 'rgba(143, 155, 173, 0.16)';
  const stroke = ghost ? 'rgba(143, 155, 173, 0.32)' : 'rgba(143, 155, 173, 0.58)';

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
  const { visualObsIn, visualCenterToSide } = visualDiagramInputs(
    data.obstructionHeightInches,
    data.centerToSideInches,
  );
  const geo = buildSaddleGeometry(visualObsIn, visualCenterToSide, data.sideAngle);
  const { peakY, x1, x2, obsRadius, pipePath, bendLeft, bendRight } = geo;

  const hasMarks = data.centerMarkInches !== undefined;

  // Between Bends — above the left diagonal; labels biased toward the side
  // mark so they stay clear of the center mark (offset-style spacing).
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
    <Svg viewBox={SADDLE3_CONFIG.diagramViewBox} width="100%" height={SADDLE3_CONFIG.diagramHeight}>
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
    </Svg>
  );
}

const styles = StyleSheet.create({
  frame: {
    overflow: 'hidden',
    backgroundColor: diagramTheme.canvas,
  },
});
