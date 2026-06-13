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
import type { Saddle4DiagramData } from '../engine/saddle4.types';
import { SADDLE4_CONFIG } from '../saddle4.config';
import { saddle4Copy } from '../saddle4.copy';

/** Left/right ends of the conduit run. */
const START_X = 28;
const END_X = 332;
const CENTER_X = 180;
/** Baseline (centerline of the flat runs). */
const BASE_Y = 158;

/** Semi-proportional rise sizing, clamped so the saddle always reads well. */
const RISE_PER_INCH = 19;
const RISE_MIN = 40;
const RISE_MAX = 78;
/** Flat-top scale: pixels per inch of saddle width. */
const TOP_PX_PER_INCH = 19;
const HALF_TOP_MIN = 18;
/** Straight run kept at each end. */
const MIN_FLAT = 24;
const MAX_HALF_SPAN = (END_X - START_X) / 2 - MIN_FLAT;
/** Bend corner radius, px — tight so the four bends read as crisp. */
const CORNER_R = 8;

const GHOST_PIPE =
  'M 28 158 H 64 Q 72 158 78 151 L 142 122 Q 150 118 158 118 H 202 Q 210 118 218 122 L 282 151 Q 288 158 296 158 H 332';

function clamp(value: number, min: number, max: number): number {
  return Math.min(Math.max(value, min), max);
}

export type Saddle4DiagramProps = {
  data?: Saddle4DiagramData;
  isEmpty?: boolean;
  isInvalid?: boolean;
};

/** Feature diagram for 4-Point Saddle — built from shared SVG primitives. */
export function Saddle4Diagram({ data, isEmpty = false, isInvalid = false }: Saddle4DiagramProps) {
  const message = isInvalid ? saddle4Copy.diagram.invalidMessage : saddle4Copy.diagram.emptyMessage;

  return (
    <View style={styles.frame}>
      {!data || isEmpty || isInvalid ? (
        <Saddle4GhostDiagram message={message} />
      ) : (
        <Saddle4LiveDiagram data={data} />
      )}
    </View>
  );
}

function Saddle4GhostDiagram({ message }: { message: string }) {
  return (
    <Svg viewBox={SADDLE4_CONFIG.diagramViewBox} width="100%" height={SADDLE4_CONFIG.diagramHeight}>
      <DiagramDefs gradientId="saddle4GhostGradient" ghost />
      <DiagramCanvas />
      <PipeSegment d={GHOST_PIPE} variant="shadow" opacity={0.5} />
      <PipeSegment d={GHOST_PIPE} variant="pipe" gradientId="saddle4GhostGradient" />
      <MarkLine x1={72} y1={147} x2={72} y2={169} opacity={0.34} />
      <MarkLine x1={150} y1={107} x2={150} y2={129} opacity={0.34} />
      <MarkLine x1={210} y1={107} x2={210} y2={129} opacity={0.34} />
      <MarkLine x1={288} y1={147} x2={288} y2={169} opacity={0.34} />
      <DiagramLabel x={180} y={210} text={message} variant="muted" fontSize={11} fontWeight="500" />
    </Svg>
  );
}

function Saddle4LiveDiagram({ data }: { data: Saddle4DiagramData }) {
  const radians = (data.bendAngle * Math.PI) / 180;
  const tan = Math.tan(radians);
  const cosA = Math.cos(radians);
  const sinA = Math.sin(radians);

  // Rise tracks obstruction height; the diagonal slope IS the real bend angle.
  // If the rise would push the diagonals past the frame, the diagonal run caps
  // and the rise follows it (keeping the angle true).
  let rise = clamp(data.obstructionHeightInches * RISE_PER_INCH, RISE_MIN, RISE_MAX);
  let dxDiag = rise / tan;
  const maxDxDiag = MAX_HALF_SPAN - HALF_TOP_MIN;
  if (dxDiag > maxDxDiag) {
    dxDiag = maxDxDiag;
    rise = dxDiag * tan;
  }

  const topY = BASE_Y - rise;
  const halfTop = clamp(
    (data.saddleWidthInches * TOP_PX_PER_INCH) / 2,
    HALF_TOP_MIN,
    MAX_HALF_SPAN - dxDiag,
  );

  const xIL = CENTER_X - halfTop;
  const xIR = CENTER_X + halfTop;
  const xOL = xIL - dxDiag;
  const xOR = xIR + dxDiag;

  const cx = CORNER_R * cosA;
  const cy = CORNER_R * sinA;

  const pipePath =
    `M ${START_X} ${BASE_Y} H ${xOL - CORNER_R} ` +
    `Q ${xOL} ${BASE_Y} ${xOL + cx} ${BASE_Y - cy} ` +
    `L ${xIL - cx} ${topY + cy} ` +
    `Q ${xIL} ${topY} ${xIL + CORNER_R} ${topY} ` +
    `H ${xIR - CORNER_R} ` +
    `Q ${xIR} ${topY} ${xIR + cx} ${topY + cy} ` +
    `L ${xOR - cx} ${BASE_Y - cy} ` +
    `Q ${xOR} ${BASE_Y} ${xOR + CORNER_R} ${BASE_Y} ` +
    `H ${END_X}`;

  const bendOuterL = `M ${xOL - CORNER_R} ${BASE_Y} Q ${xOL} ${BASE_Y} ${xOL + cx} ${BASE_Y - cy}`;
  const bendInnerL = `M ${xIL - cx} ${topY + cy} Q ${xIL} ${topY} ${xIL + CORNER_R} ${topY}`;
  const bendInnerR = `M ${xIR - CORNER_R} ${topY} Q ${xIR} ${topY} ${xIR + cx} ${topY + cy}`;
  const bendOuterR = `M ${xOR - cx} ${BASE_Y - cy} Q ${xOR} ${BASE_Y} ${xOR + CORNER_R} ${BASE_Y}`;

  const hasMarks = data.centerMarkInches !== undefined;
  const obsMidY = (BASE_Y + topY) / 2;
  const widthDimY = topY - 14;
  const bbDimY = BASE_Y + 40;
  const bbMidX = (xIR + xOR) / 2;
  const leftDiagMidX = (xOL + xIL) / 2;
  const leftDiagMidY = (BASE_Y + topY) / 2;

  return (
    <Svg viewBox={SADDLE4_CONFIG.diagramViewBox} width="100%" height={SADDLE4_CONFIG.diagramHeight}>
      <DiagramDefs gradientId="saddle4PipeGradient" />
      <DiagramCanvas />

      <PipeSegment d={pipePath} variant="shadow" />
      <PipeSegment d={pipePath} variant="pipe" gradientId="saddle4PipeGradient" />

      <BendRadiusZone d={bendOuterL} glowWidth={12} />
      <BendRadiusZone d={bendInnerL} glowWidth={12} />
      <BendRadiusZone d={bendInnerR} glowWidth={12} />
      <BendRadiusZone d={bendOuterR} glowWidth={12} />

      {/* Saddle width — across the flat top. */}
      <DimensionLine
        x1={xIL}
        y1={widthDimY}
        x2={xIR}
        y2={widthDimY}
        extensionLines={[
          { x1: xIL, y1: topY, x2: xIL, y2: widthDimY },
          { x1: xIR, y1: topY, x2: xIR, y2: widthDimY },
        ]}
      />
      <DiagramLabel
        x={CENTER_X}
        y={widthDimY - 14}
        text={saddle4Copy.diagram.saddleWidth}
        variant="muted"
        fontSize={9}
        fontWeight="600"
      />
      <DiagramLabel x={CENTER_X} y={widthDimY - 3} text={data.display.saddleWidth} variant="default" fontSize={10.5} />

      {/* Obstruction height — vertical clearance under the flat top, at center. */}
      <DimensionLine
        x1={CENTER_X}
        y1={BASE_Y}
        x2={CENTER_X}
        y2={topY}
        showArrows={rise >= 26}
        extensionLines={[{ x1: CENTER_X - 28, y1: BASE_Y, x2: CENTER_X + 28, y2: BASE_Y }]}
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

      {/* Bend angle — labeled on the left diagonal (all four bends are equal). */}
      <DiagramLabel
        x={leftDiagMidX - 6}
        y={leftDiagMidY - 7}
        text={`${data.bendAngle}°`}
        variant="muted"
        fontSize={9}
        fontWeight="600"
      />

      {/* Outer bends (baseline). */}
      <MarkLine x1={xOL} y1={BASE_Y - 11} x2={xOL} y2={BASE_Y + 11} opacity={0.62} />
      <DiagramLabel x={xOL} y={BASE_Y + 22} text={saddle4Copy.diagram.outer} variant="muted" fontSize={8.5} fontWeight="600" />
      {hasMarks && data.display.outerMark1 ? (
        <DiagramLabel x={xOL} y={BASE_Y + 33} text={data.display.outerMark1} variant="muted" fontSize={9.5} />
      ) : null}
      <MarkLine x1={xOR} y1={BASE_Y - 11} x2={xOR} y2={BASE_Y + 11} opacity={0.62} />
      <DiagramLabel x={xOR} y={BASE_Y + 22} text={saddle4Copy.diagram.outer} variant="muted" fontSize={8.5} fontWeight="600" />
      {hasMarks && data.display.outerMark2 ? (
        <DiagramLabel x={xOR} y={BASE_Y + 33} text={data.display.outerMark2} variant="muted" fontSize={9.5} />
      ) : null}

      {/* Top (inner) bends — at the flat-top corners. */}
      <MarkLine x1={xIL} y1={topY - 9} x2={xIL} y2={topY + 9} opacity={0.62} />
      <MarkLine x1={xIR} y1={topY - 9} x2={xIR} y2={topY + 9} opacity={0.62} />

      {/* Between Bends — outer ↔ inner spacing, under the right diagonal. */}
      <DimensionLine
        x1={xIR}
        y1={bbDimY}
        x2={xOR}
        y2={bbDimY}
        extensionLines={[
          { x1: xIR, y1: bbDimY - 6, x2: xIR, y2: bbDimY + 6 },
          { x1: xOR, y1: bbDimY - 6, x2: xOR, y2: bbDimY + 6 },
        ]}
      />
      <DiagramLabel
        x={bbMidX}
        y={bbDimY + 16}
        text={saddle4Copy.diagram.betweenBends}
        variant="muted"
        fontSize={9}
        fontWeight="600"
      />
      <DiagramLabel x={bbMidX} y={bbDimY + 27} text={data.display.betweenBends} variant="default" fontSize={10.5} />

      {/* Shrink — kept off the pipe in a top-left callout. */}
      <DiagramCallout x={16} y={14} width={132} height={26}>
        <DiagramLabel
          x={30}
          y={31}
          text={`${saddle4Copy.diagram.shrink}  ${data.display.shrink}`}
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
