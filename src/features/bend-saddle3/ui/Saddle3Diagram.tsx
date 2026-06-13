import { StyleSheet, View } from 'react-native';
import Svg from 'react-native-svg';

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
const START_X = 28;
const END_X = 332;
const CENTER_X = 180;
/** Baseline (centerline of the flat runs). */
const BASE_Y = 158;

/** Semi-proportional rise sizing, clamped so the saddle always reads well. */
const RISE_PER_INCH = 19;
const RISE_MIN = 40;
const RISE_MAX = 80;
/** Horizontal room each side of center — kept tighter so the flat runs stay
 *  long and the saddle reads as a compact hump, not the whole pipe. */
const MAX_HALF_SPAN = 122;
const MIN_FLAT = 30;
/** Bend corner radius, px — tight so the three bends read as crisp, intentional. */
const CORNER_R = 9;

const GHOST_PIPE =
  'M 28 158 H 91 Q 100 158 106 152 L 171 124 Q 180 120 189 124 L 254 152 Q 260 158 269 158 H 332';

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
  return (
    <Svg viewBox={SADDLE3_CONFIG.diagramViewBox} width="100%" height={SADDLE3_CONFIG.diagramHeight}>
      <DiagramDefs gradientId="saddle3GhostGradient" ghost />
      <DiagramCanvas />
      <PipeSegment d={GHOST_PIPE} variant="shadow" opacity={0.5} />
      <PipeSegment d={GHOST_PIPE} variant="pipe" gradientId="saddle3GhostGradient" />
      <MarkLine x1={100} y1={147} x2={100} y2={169} opacity={0.34} />
      <MarkLine x1={180} y1={109} x2={180} y2={131} opacity={0.38} />
      <MarkLine x1={260} y1={147} x2={260} y2={169} opacity={0.34} />
      <DiagramLabel x={180} y={210} text={message} variant="muted" fontSize={11} fontWeight="500" />
    </Svg>
  );
}

function Saddle3LiveDiagram({ data }: { data: Saddle3DiagramData }) {
  const radians = (data.sideAngle * Math.PI) / 180;
  const tan = Math.tan(radians);
  const cosA = Math.cos(radians);
  const sinA = Math.sin(radians);

  // The diagonal slope IS the real side-bend angle (22.5° draws shallow,
  // 45° steep). Rise tracks obstruction height, clamped; if that makes the
  // span too wide for the frame, the span caps and the rise follows it.
  let rise = clamp(data.obstructionHeightInches * RISE_PER_INCH, RISE_MIN, RISE_MAX);
  let dx = rise / tan;
  const maxDx = MAX_HALF_SPAN - MIN_FLAT;
  if (dx > maxDx) {
    dx = maxDx;
    rise = dx * tan;
  }

  const peakY = BASE_Y - rise;
  const x1 = CENTER_X - dx;
  const x2 = CENTER_X + dx;

  // Rounded bend vertices: two side bends on the baseline, one center bend
  // at the apex. Corners blend the flat runs into the diagonals smoothly.
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

  const bendLeft = `M ${a1x} ${BASE_Y} Q ${x1} ${BASE_Y} ${b1x} ${b1y}`;
  const bendCenter = `M ${c1x} ${c1y} Q ${CENTER_X} ${peakY} ${c2x} ${c2y}`;
  const bendRight = `M ${d1x} ${d1y} Q ${x2} ${BASE_Y} ${d2x} ${BASE_Y}`;

  const hasMarks = data.centerMarkInches !== undefined;
  // Between Bends dimension sits under the right half (center → side), below
  // the side-mark labels so nothing crosses.
  const bbDimY = BASE_Y + 48;
  const bbMidX = (CENTER_X + x2) / 2;
  // Obstruction height reads as a vertical clearance at the center, directly
  // under the apex — that is where the obstacle sits in the field.
  const obsMidY = (BASE_Y + peakY) / 2;

  return (
    <Svg viewBox={SADDLE3_CONFIG.diagramViewBox} width="100%" height={SADDLE3_CONFIG.diagramHeight}>
      <DiagramDefs gradientId="saddle3PipeGradient" />
      <DiagramCanvas />

      <PipeSegment d={pipePath} variant="shadow" />
      <PipeSegment d={pipePath} variant="pipe" gradientId="saddle3PipeGradient" />

      <BendRadiusZone d={bendLeft} glowWidth={13} />
      <BendRadiusZone d={bendCenter} glowWidth={15} />
      <BendRadiusZone d={bendRight} glowWidth={13} />

      {/* Obstruction height — vertical clearance under the apex, at center. */}
      <DimensionLine
        x1={CENTER_X}
        y1={BASE_Y}
        x2={CENTER_X}
        y2={peakY}
        showArrows={rise >= 26}
        extensionLines={[{ x1: CENTER_X - 32, y1: BASE_Y, x2: CENTER_X + 32, y2: BASE_Y }]}
      />
      <DiagramCallout x={CENTER_X - 24} y={obsMidY - 4} width={48} height={22}>
        <DiagramLabel
          x={CENTER_X}
          y={obsMidY + 11}
          text={data.display.obstructionHeight}
          variant="default"
          fontSize={10.5}
        />
      </DiagramCallout>

      {/* Side bend 1 (secondary) — angle labels answer "which bend is what". */}
      <MarkLine x1={x1} y1={BASE_Y - 11} x2={x1} y2={BASE_Y + 11} opacity={0.62} />
      <DiagramLabel
        x={x1}
        y={BASE_Y + 22}
        text={`${saddle3Copy.diagram.sideMark1} · ${data.sideAngle}°`}
        variant="muted"
        fontSize={8.5}
        fontWeight="600"
      />
      {hasMarks && data.display.sideMark1 ? (
        <DiagramLabel x={x1} y={BASE_Y + 33} text={data.display.sideMark1} variant="muted" fontSize={9.5} />
      ) : null}

      {/* Center bend (primary mark). */}
      <MarkLine x1={CENTER_X} y1={peakY - 12} x2={CENTER_X} y2={peakY + 7} />
      <DiagramLabel
        x={CENTER_X}
        y={peakY - 28}
        text={`${saddle3Copy.diagram.centerMark} · ${data.centerAngle}°`}
        variant="mark"
        fontSize={10}
        fontWeight="700"
      />
      {hasMarks && data.display.centerMark ? (
        <DiagramLabel x={CENTER_X} y={peakY - 15} text={data.display.centerMark} variant="default" fontSize={11.5} />
      ) : null}

      {/* Side bend 2 (secondary). */}
      <MarkLine x1={x2} y1={BASE_Y - 11} x2={x2} y2={BASE_Y + 11} opacity={0.62} />
      <DiagramLabel
        x={x2}
        y={BASE_Y + 22}
        text={`${saddle3Copy.diagram.sideMark2} · ${data.sideAngle}°`}
        variant="muted"
        fontSize={8.5}
        fontWeight="600"
      />
      {hasMarks && data.display.sideMark2 ? (
        <DiagramLabel x={x2} y={BASE_Y + 33} text={data.display.sideMark2} variant="muted" fontSize={9.5} />
      ) : null}

      {/* Between Bends — center to side, measured along the pipe. Short end
          ticks only, so nothing crosses the pipe or the side labels. */}
      <DimensionLine
        x1={CENTER_X}
        y1={bbDimY}
        x2={x2}
        y2={bbDimY}
        extensionLines={[
          { x1: CENTER_X, y1: bbDimY - 6, x2: CENTER_X, y2: bbDimY + 6 },
          { x1: x2, y1: bbDimY - 6, x2: x2, y2: bbDimY + 6 },
        ]}
      />
      <DiagramLabel
        x={bbMidX}
        y={bbDimY + 18}
        text={saddle3Copy.diagram.betweenBends}
        variant="muted"
        fontSize={9}
        fontWeight="600"
      />
      <DiagramLabel x={bbMidX} y={bbDimY + 30} text={data.display.centerToSide} variant="default" fontSize={10.5} />

      {/* Shrink — kept off the pipe in a top-left callout. */}
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
