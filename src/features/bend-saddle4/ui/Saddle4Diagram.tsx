import { StyleSheet, View } from 'react-native';
import Svg, { Rect } from 'react-native-svg';

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

const START_X = 24;
const END_X = 336;
const CENTER_X = 180;
const BASE_Y = 228;

const PX_PER_INCH = 16;
const OBS_HEIGHT_MIN = 22;
const DIAGRAM_OBS_MAX_IN = 4;
const PEAK_MIN_Y = 72;
const PIPE_HALF = 6;
const CLEARANCE_PX = 14;
const MIN_FLAT = 36;
const CORNER_R = 10;
const DIAG_MIN = 40;
const DIAG_MAX = 128;
/** Default flat-top half-width when saddle width is not entered. */
const DEFAULT_HALF_TOP_PX = 40;
const HALF_TOP_MIN = 32;

const MAX_RISE = BASE_Y - PEAK_MIN_Y;
const MAX_HALF_SPAN = (END_X - START_X) / 2 - MIN_FLAT;

function clamp(value: number, min: number, max: number): number {
  return Math.min(Math.max(value, min), max);
}

function visualDiagramInputs(
  obstructionHeightInches: number,
  betweenBendsInches: number,
  saddleWidthInches?: number,
): {
  visualObsIn: number;
  visualBetweenBends: number;
  visualSaddleWidthIn?: number;
} {
  const visualObsIn = Math.min(obstructionHeightInches, DIAGRAM_OBS_MAX_IN);
  const betweenRatio =
    obstructionHeightInches > 0 ? betweenBendsInches / obstructionHeightInches : 0;
  return {
    visualObsIn,
    visualBetweenBends: visualObsIn * betweenRatio,
    visualSaddleWidthIn:
      saddleWidthInches !== undefined
        ? Math.min(saddleWidthInches, DIAGRAM_OBS_MAX_IN * 2.5)
        : undefined,
  };
}

type Saddle4Geometry = {
  topY: number;
  xOL: number;
  xIL: number;
  xIR: number;
  xOR: number;
  obsHeightPx: number;
  obsWidthPx: number;
  halfTopPx: number;
  hasSaddleWidth: boolean;
  pipePath: string;
  bendOuterL: string;
  bendInnerL: string;
  bendInnerR: string;
  bendOuterR: string;
};

function buildSaddle4Geometry(
  visualObsIn: number,
  visualBetweenBends: number,
  visualSaddleWidthIn: number | undefined,
  bendAngleDeg: number,
): Saddle4Geometry {
  const radians = (bendAngleDeg * Math.PI) / 180;
  const tan = Math.tan(radians);
  const cosA = Math.cos(radians);
  const sinA = Math.sin(radians);

  const maxObsHeightPx = MAX_RISE - CLEARANCE_PX - PIPE_HALF - 10;
  let obsHeightPx = clamp(visualObsIn * PX_PER_INCH, OBS_HEIGHT_MIN, maxObsHeightPx);
  let minRise = obsHeightPx + CLEARANCE_PX + PIPE_HALF;

  if (minRise > MAX_RISE) {
    obsHeightPx = MAX_RISE - CLEARANCE_PX - PIPE_HALF - 10;
    minRise = obsHeightPx + CLEARANCE_PX + PIPE_HALF;
  }

  let diagonalPx = clamp(visualBetweenBends * PX_PER_INCH, DIAG_MIN, DIAG_MAX);
  let rise = clamp(diagonalPx * sinA, minRise, MAX_RISE);
  let dxDiag = rise / tan;

  const maxDxDiag = MAX_HALF_SPAN - HALF_TOP_MIN;
  if (dxDiag > maxDxDiag) {
    dxDiag = maxDxDiag;
    rise = clamp(dxDiag * tan, minRise, MAX_RISE);
  }

  if (rise < minRise) {
    rise = Math.min(minRise, MAX_RISE);
    dxDiag = Math.min(rise / tan, maxDxDiag);
  }

  const topY = BASE_Y - rise;
  const hasSaddleWidth = visualSaddleWidthIn !== undefined;
  const halfTopPx = hasSaddleWidth
    ? clamp((visualSaddleWidthIn * PX_PER_INCH) / 2, HALF_TOP_MIN, MAX_HALF_SPAN - dxDiag)
    : clamp(
        Math.max(visualBetweenBends * PX_PER_INCH * 0.9, DEFAULT_HALF_TOP_PX),
        HALF_TOP_MIN,
        MAX_HALF_SPAN - dxDiag,
      );

  const xIL = CENTER_X - halfTopPx;
  const xIR = CENTER_X + halfTopPx;
  const xOL = xIL - dxDiag;
  const xOR = xIR + dxDiag;

  const obsWidthPx = halfTopPx * 2;
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

  return {
    topY,
    xOL,
    xIL,
    xIR,
    xOR,
    obsHeightPx,
    obsWidthPx,
    halfTopPx,
    hasSaddleWidth,
    pipePath,
    bendOuterL: `M ${xOL - CORNER_R} ${BASE_Y} Q ${xOL} ${BASE_Y} ${xOL + cx} ${BASE_Y - cy}`,
    bendInnerL: `M ${xIL - cx} ${topY + cy} Q ${xIL} ${topY} ${xIL + CORNER_R} ${topY}`,
    bendInnerR: `M ${xIR - CORNER_R} ${topY} Q ${xIR} ${topY} ${xIR + cx} ${topY + cy}`,
    bendOuterR: `M ${xOR - cx} ${BASE_Y - cy} Q ${xOR} ${BASE_Y} ${xOR + CORNER_R} ${BASE_Y}`,
  };
}

export type Saddle4DiagramProps = {
  data?: Saddle4DiagramData;
  isEmpty?: boolean;
  isInvalid?: boolean;
};

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
  const geo = buildSaddle4Geometry(2, 2 * 2.6, 4, 22.5);

  return (
    <Svg viewBox={SADDLE4_CONFIG.diagramViewBox} width="100%" height={SADDLE4_CONFIG.diagramHeight}>
      <DiagramDefs gradientId="saddle4GhostGradient" ghost />
      <DiagramCanvas />
      <ObstructionBlock
        centerX={CENTER_X}
        baselineY={BASE_Y}
        width={geo.obsWidthPx}
        height={geo.obsHeightPx}
        ghost
      />
      <PipeSegment d={geo.pipePath} variant="shadow" opacity={0.5} />
      <PipeSegment d={geo.pipePath} variant="pipe" gradientId="saddle4GhostGradient" />
      <MarkLine x1={geo.xOL} y1={BASE_Y - 11} x2={geo.xOL} y2={BASE_Y + 11} opacity={0.34} />
      <MarkLine x1={geo.xIL} y1={geo.topY - 11} x2={geo.xIL} y2={geo.topY + 11} opacity={0.34} />
      <MarkLine x1={geo.xIR} y1={geo.topY - 11} x2={geo.xIR} y2={geo.topY + 11} opacity={0.34} />
      <MarkLine x1={geo.xOR} y1={BASE_Y - 11} x2={geo.xOR} y2={BASE_Y + 11} opacity={0.34} />
      <DiagramLabel x={180} y={286} text={message} variant="muted" fontSize={11} fontWeight="500" />
    </Svg>
  );
}

function ObstructionBlock({
  centerX,
  baselineY,
  width,
  height,
  ghost = false,
}: {
  centerX: number;
  baselineY: number;
  width: number;
  height: number;
  ghost?: boolean;
}) {
  const fill = ghost ? 'rgba(143, 155, 173, 0.1)' : 'rgba(143, 155, 173, 0.16)';
  const stroke = ghost ? 'rgba(143, 155, 173, 0.32)' : 'rgba(143, 155, 173, 0.58)';

  return (
    <Rect
      x={centerX - width / 2}
      y={baselineY - height}
      width={width}
      height={height}
      fill={fill}
      stroke={stroke}
      strokeWidth={1.5}
    />
  );
}

function ObstructionHeightLabel({
  centerX,
  baselineY,
  height,
  heightLabel,
}: {
  centerX: number;
  baselineY: number;
  height: number;
  heightLabel: string;
}) {
  const fontSize = clamp(height * 0.14, 8.5, 11);

  return (
    <DiagramLabel
      x={centerX}
      y={baselineY - height / 2 + 4}
      text={heightLabel}
      variant="default"
      fontSize={fontSize}
      fontWeight="700"
    />
  );
}

function Saddle4LiveDiagram({ data }: { data: Saddle4DiagramData }) {
  const { visualObsIn, visualBetweenBends, visualSaddleWidthIn } = visualDiagramInputs(
    data.obstructionHeightInches,
    data.betweenBendsInches,
    data.saddleWidthInches,
  );
  const geo = buildSaddle4Geometry(
    visualObsIn,
    visualBetweenBends,
    visualSaddleWidthIn,
    data.bendAngle,
  );
  const { topY, xOL, xIL, xIR, xOR, obsHeightPx, obsWidthPx, hasSaddleWidth, pipePath } = geo;

  const hasMarks = data.centerMarkInches !== undefined;
  const showWidthDim = hasSaddleWidth && data.display.saddleWidth !== undefined;

  // Between Bends — above the left diagonal (outer → inner top), saddle3 pattern.
  const segDx = xIL - xOL;
  const segRise = BASE_Y - topY;
  const diagonalPx = Math.hypot(segDx, segRise);
  const nx = -segRise / diagonalPx;
  const ny = -segDx / diagonalPx;
  const dimOffset = 28;
  const dbb1 = { x: xOL + nx * dimOffset, y: BASE_Y + ny * dimOffset };
  const dbb2 = { x: xIL + nx * dimOffset, y: topY + ny * dimOffset };
  const bbLabelT = 0.34;
  const bbLabelX = dbb1.x + (dbb2.x - dbb1.x) * bbLabelT + nx * 24;
  const bbLabelY = dbb1.y + (dbb2.y - dbb1.y) * bbLabelT + ny * 24;

  const widthDimY = topY - 18;

  return (
    <Svg viewBox={SADDLE4_CONFIG.diagramViewBox} width="100%" height={SADDLE4_CONFIG.diagramHeight}>
      <DiagramDefs gradientId="saddle4PipeGradient" />
      <DiagramCanvas />

      <ObstructionBlock
        centerX={CENTER_X}
        baselineY={BASE_Y}
        width={obsWidthPx}
        height={obsHeightPx}
      />

      <PipeSegment d={pipePath} variant="shadow" />
      <PipeSegment d={pipePath} variant="pipe" gradientId="saddle4PipeGradient" />

      <ObstructionHeightLabel
        centerX={CENTER_X}
        baselineY={BASE_Y}
        height={obsHeightPx}
        heightLabel={data.display.obstructionHeight}
      />

      <BendRadiusZone d={geo.bendOuterL} glowWidth={13} />
      <BendRadiusZone d={geo.bendInnerL} glowWidth={13} />
      <BendRadiusZone d={geo.bendInnerR} glowWidth={13} />
      <BendRadiusZone d={geo.bendOuterR} glowWidth={13} />

      <DimensionLine
        x1={dbb1.x}
        y1={dbb1.y}
        x2={dbb2.x}
        y2={dbb2.y}
        showArrows={diagonalPx >= 36}
        extensionLines={[
          { x1: xOL + nx * 8, y1: BASE_Y + ny * 8, x2: xOL + nx * 30, y2: BASE_Y + ny * 30 },
          { x1: xIL + nx * 8, y1: topY + ny * 8, x2: xIL + nx * 30, y2: topY + ny * 30 },
        ]}
      />
      <DiagramLabel
        x={bbLabelX}
        y={bbLabelY}
        text={saddle4Copy.diagram.betweenBends}
        variant="muted"
        fontSize={9.5}
        fontWeight="600"
      />
      <DiagramLabel
        x={bbLabelX}
        y={bbLabelY + 14}
        text={data.display.betweenBends}
        variant="default"
        fontSize={11}
      />

      {showWidthDim ? (
        <>
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
            y={widthDimY - 16}
            text={saddle4Copy.diagram.saddleWidth}
            variant="muted"
            fontSize={9.5}
            fontWeight="600"
          />
          <DiagramLabel
            x={CENTER_X}
            y={widthDimY - 4}
            text={data.display.saddleWidth!}
            variant="default"
            fontSize={11}
          />
        </>
      ) : null}

      <MarkLine x1={xOL} y1={BASE_Y - 12} x2={xOL} y2={BASE_Y + 12} opacity={0.62} />
      <DiagramLabel
        x={xOL}
        y={BASE_Y + 34}
        text={saddle4Copy.diagram.outer}
        variant="muted"
        fontSize={9.5}
        fontWeight="600"
      />
      {hasMarks && data.display.outerMark1 ? (
        <DiagramLabel x={xOL} y={BASE_Y + 48} text={data.display.outerMark1} variant="default" fontSize={11} />
      ) : null}

      <MarkLine x1={xIL} y1={topY - 12} x2={xIL} y2={topY + 12} opacity={0.62} />
      <DiagramLabel
        x={xIL}
        y={topY - 32}
        text={saddle4Copy.diagram.top}
        variant="muted"
        fontSize={9.5}
        fontWeight="600"
      />
      {hasMarks && data.display.innerMark1 ? (
        <DiagramLabel x={xIL} y={topY - 18} text={data.display.innerMark1} variant="mark" fontSize={11} />
      ) : null}

      <MarkLine x1={xIR} y1={topY - 12} x2={xIR} y2={topY + 12} opacity={0.62} />
      <DiagramLabel
        x={xIR}
        y={topY - 32}
        text={saddle4Copy.diagram.top}
        variant="muted"
        fontSize={9.5}
        fontWeight="600"
      />
      {hasMarks && data.display.innerMark2 ? (
        <DiagramLabel x={xIR} y={topY - 18} text={data.display.innerMark2} variant="mark" fontSize={11} />
      ) : null}

      <MarkLine x1={xOR} y1={BASE_Y - 12} x2={xOR} y2={BASE_Y + 12} opacity={0.62} />
      <DiagramLabel
        x={xOR}
        y={BASE_Y + 34}
        text={saddle4Copy.diagram.outer}
        variant="muted"
        fontSize={9.5}
        fontWeight="600"
      />
      {hasMarks && data.display.outerMark2 ? (
        <DiagramLabel x={xOR} y={BASE_Y + 48} text={data.display.outerMark2} variant="default" fontSize={11} />
      ) : null}

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
