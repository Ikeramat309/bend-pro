import Svg, { Circle } from 'react-native-svg';

import {
    BendRadiusZone,
    DiagramCallout,
    DiagramCanvas,
    DiagramDefs,
    DiagramFrame,
    DiagramGhostMessage,
    DiagramLabel,
    DiagramLeaderLine,
    DimensionLine,
    MarkLine,
    PipeSegment,
    diagramTheme,
    resolveProportionalSpans,
} from '@/shared/diagrams';
import type { Stub90DiagramData } from '../engine/stub90.types';
import { STUB90_CONFIG } from '../stub90.config';
import { stub90Copy } from '../stub90.copy';

const GHOST_PIPE_PATH = 'M 18 218 H 252 Q 298 218 298 172 V 34';
const { ghost } = diagramTheme;

/** Free end of the leg (left edge of the horizontal run). */
const START_X = 18;
/** Centerline of the horizontal run. */
const BOTTOM_Y = 218;
/**
 * Bend arc radius in px. Intentionally fixed — the radius is bender-shoe
 * geometry, not something that should scale with the user's numbers.
 */
const BEND_RADIUS = 46;

/** Pixel bounds for the horizontal run (leg). */
const H_SPAN = { minPx: 120, maxPx: 280 };
/** Pixel bounds for the stub-height span (bottom run → stub tip). */
const V_SPAN = { minPx: 90, maxPx: 184 };

function clamp(value: number, min: number, max: number): number {
  return Math.min(Math.max(value, min), max);
}

export type Stub90DiagramProps = {
  data?: Stub90DiagramData;
  isEmpty?: boolean;
  isInvalid?: boolean;
};

/** Feature diagram for Stub 90 — built from shared SVG primitives. */
export function Stub90Diagram({ data, isEmpty = false, isInvalid = false }: Stub90DiagramProps) {
  const message = isInvalid
    ? stub90Copy.diagram.invalidMessage
    : stub90Copy.diagram.emptyMessage;

  return (
    <DiagramFrame>
      {!data || isEmpty || isInvalid ? (
        <Stub90GhostDiagram message={message} invalid={isInvalid} />
      ) : (
        <Stub90LiveDiagram data={data} />
      )}
    </DiagramFrame>
  );
}

function Stub90GhostDiagram({ message, invalid }: { message: string; invalid?: boolean }) {
  return (
    <Svg viewBox={STUB90_CONFIG.diagramViewBox} width="100%" height={STUB90_CONFIG.diagramHeight}>
      <DiagramDefs gradientId="ghostPipeGradient" ghost />
      <DiagramCanvas />
      <PipeSegment d={GHOST_PIPE_PATH} variant="shadow" opacity={ghost.pipeShadowOpacity} />
      <PipeSegment d={GHOST_PIPE_PATH} variant="pipe" gradientId="ghostPipeGradient" />
      <MarkLine x1={284} y1={88} x2={312} y2={88} opacity={ghost.markOpacity} />
      <DimensionLine x1={324} y1={218} x2={324} y2={34} showArrows={false} opacity={ghost.dimensionOpacity} />
      <DimensionLine x1={18} y1={268} x2={304} y2={268} showArrows={false} opacity={ghost.dimensionOpacity} />
      <DiagramGhostMessage text={message} invalid={invalid} />
    </Svg>
  );
}

function Stub90LiveDiagram({ data }: { data: Stub90DiagramData }) {
  const legDisplay = data.legLengthInches !== undefined ? data.display.leg : undefined;

  // Semi-proportional layout: the leg drives the horizontal span (square-ish
  // default when no leg is given) and stub height drives the vertical span,
  // both clamped to readable bounds.
  const { horizontalPx, verticalPx } = resolveProportionalSpans(
    { value: data.legLengthInches ?? data.stubHeightInches, ...H_SPAN },
    { value: data.stubHeightInches, ...V_SPAN },
  );

  const cornerX = START_X + horizontalPx;
  const bendStartX = cornerX - BEND_RADIUS;
  const arcTopY = BOTTOM_Y - BEND_RADIUS;
  const topY = BOTTOM_Y - verticalPx;

  // Field reality: the deduct mark is measured from the end of the pipe that
  // becomes the stub. After the bend that mark sits ON THE STUB, just above
  // the arc — never on the leg. Position it at the deduct-mark fraction of
  // the stub, clamped onto the straight section.
  const markY = clamp(
    topY + (data.deductMarkInches / data.stubHeightInches) * verticalPx,
    topY + 12,
    arcTopY - 6,
  );

  const pipePath = `M ${START_X} ${BOTTOM_Y} H ${bendStartX} Q ${cornerX} ${BOTTOM_Y} ${cornerX} ${arcTopY} V ${topY}`;
  const highlightPath = `M ${START_X + 16} ${BOTTOM_Y - 5} H ${bendStartX} Q ${cornerX - 8} ${BOTTOM_Y - 5} ${cornerX - 8} ${arcTopY} V ${topY + 16}`;
  const bendZonePath = `M ${bendStartX} ${BOTTOM_Y} Q ${cornerX} ${BOTTOM_Y} ${cornerX} ${arcTopY}`;

  // Stub Length dimension — right of the stub, full height.
  const stubDimX = cornerX + 26;
  const stubLabelX = cornerX + 46;
  const stubMidY = (BOTTOM_Y + topY) / 2;

  // Deduct Mark dimension — inside the L, stub tip down to the mark.
  const deductMarkDimX = cornerX - 26;
  const deductMarkLabelMidY = Math.min((topY + markY) / 2, 141);

  // Deduct callout — inside the corner, leader line pointing at the arc.
  const calloutX = Math.max(cornerX - 134, 20);
  const calloutY = 158;

  /** Outer face of the vertical stub — what the leg is measured to. */
  const legEndX = cornerX + 6;
  const legMidX = (START_X + legEndX) / 2;

  return (
    <Svg viewBox={STUB90_CONFIG.diagramViewBox} width="100%" height={STUB90_CONFIG.diagramHeight}>
      <DiagramDefs gradientId="pipeGradient" />
      <DiagramCanvas />

      <PipeSegment d={pipePath} variant="shadow" />
      <PipeSegment d={pipePath} variant="pipe" gradientId="pipeGradient" />
      <PipeSegment d={highlightPath} variant="highlight" />

      <BendRadiusZone d={bendZonePath} />

      {/* Free ends: leg end (left) and stub tip (top) — the stub tip is the
          end the deduct mark is measured from. */}
      <Circle cx={START_X} cy={BOTTOM_Y} r={5.5} fill={diagramTheme.pipeCore} />
      <Circle cx={cornerX} cy={topY} r={5.5} fill={diagramTheme.pipeCore} />

      {/* The bend mark, on the stub just above the arc. */}
      <MarkLine x1={cornerX - 13} y1={markY} x2={cornerX + 13} y2={markY} />

      {/* Deduct Mark — measured from the stub tip down to the mark. */}
      <DimensionLine
        x1={deductMarkDimX}
        y1={topY + 2}
        x2={deductMarkDimX}
        y2={markY - 2}
        showArrows={markY - topY >= 24}
        extensionLines={[
          { x1: cornerX - 34, y1: topY, x2: cornerX - 8, y2: topY },
          { x1: cornerX - 34, y1: markY, x2: cornerX - 16, y2: markY },
        ]}
      />
      <DiagramLabel
        x={deductMarkDimX - 14}
        y={deductMarkLabelMidY - 3}
        text={stub90Copy.diagram.deductMark}
        variant="muted"
        fontSize={9.5}
        fontWeight="600"
        textAnchor="end"
      />
      <DiagramLabel
        x={deductMarkDimX - 14}
        y={deductMarkLabelMidY + 11}
        text={data.display.deductMark}
        variant="default"
        fontSize={11}
        textAnchor="end"
      />

      {/* Deduct — anchored to the bend arc it describes. */}
      <DiagramCallout x={calloutX} y={calloutY} width={88} height={34}>
        <DiagramLabel
          x={calloutX + 8}
          y={calloutY + 14}
          text={stub90Copy.diagram.deduct}
          variant="muted"
          fontSize={9}
          textAnchor="start"
        />
        <DiagramLabel
          x={calloutX + 8}
          y={calloutY + 28}
          text={data.display.deduct}
          variant="default"
          fontSize={10}
          textAnchor="start"
        />
      </DiagramCallout>
      <DiagramLeaderLine
        x1={calloutX + 80}
        y1={calloutY + 34}
        x2={cornerX - 22}
        y2={204}
      />

      {/* Stub Length — full height of the vertical run. */}
      <DimensionLine
        x1={stubDimX}
        y1={BOTTOM_Y}
        x2={stubDimX}
        y2={topY}
        extensionLines={[
          { x1: cornerX + 6, y1: BOTTOM_Y, x2: cornerX + 34, y2: BOTTOM_Y },
          { x1: cornerX + 8, y1: topY, x2: cornerX + 34, y2: topY },
        ]}
      />
      {/* Rotated label and value share one column; separated along the
          rotated axis so the texts cannot overlap. */}
      <DiagramLabel
        x={stubLabelX}
        y={stubMidY - 30}
        text={stub90Copy.diagram.stubLength}
        variant="muted"
        fontSize={9.5}
        fontWeight="600"
        rotation={90}
      />
      <DiagramLabel
        x={stubLabelX}
        y={stubMidY + 30}
        text={data.display.stubLength}
        variant="default"
        fontSize={10.5}
        rotation={90}
      />

      {/* Leg — under the horizontal run it measures. */}
      {legDisplay ? (
        <>
          <DimensionLine
            x1={START_X + 2}
            y1={268}
            x2={legEndX - 2}
            y2={268}
            extensionLines={[
              { x1: START_X, y1: 238, x2: START_X, y2: 276 },
              { x1: legEndX, y1: 238, x2: legEndX, y2: 276 },
            ]}
          />
          <DiagramLabel
            x={legMidX}
            y={260}
            text={stub90Copy.diagram.leg}
            variant="muted"
            fontSize={9.5}
            fontWeight="600"
          />
          <DiagramLabel x={legMidX} y={282} text={legDisplay} variant="default" fontSize={11} />
        </>
      ) : null}

      <DiagramLabel
        x={346}
        y={292}
        text={stub90Copy.diagram.title}
        variant="muted"
        fontSize={10}
        fontWeight="600"
        textAnchor="end"
      />
    </Svg>
  );
}
