import { Circle } from 'react-native-svg';

import {
  BendRadiusZone,
  DiagramCanvas,
  DiagramDefs,
  DiagramFrame,
  DiagramGhostMessage,
  DiagramLabel,
  DiagramSvg,
  DimensionLine,
  MarkLine,
  PipeSegment,
  useDiagramTheme,
} from '@/shared/diagrams';
import type { Stub90DiagramData } from '../engine/stub90.types';
import { STUB90_CONFIG } from '../stub90.config';
import { stub90Copy } from '../stub90.copy';

const GHOST_PIPE_PATH = 'M 18 218 H 252 Q 298 218 298 172 V 34';

/**
 * Fixed instructional schematic — pipe shape and vector positions never change.
 * Actual stub, deduct mark, and leg values update label text only.
 */
const STATIC = {
  startX: 18,
  bottomY: 218,
  cornerX: 298,
  bendStartX: 252,
  arcTopY: 172,
  topY: 34,
  /** Orange deduct mark — just above the bend radius on the stub. */
  markY: 164,
  pipePath: GHOST_PIPE_PATH,
  highlightPath: 'M 34 213 H 252 Q 290 213 290 172 V 50',
  bendZonePath: 'M 252 218 Q 298 218 298 172',
  stubDimX: 324,
  stubLabelX: 342,
  stubMidY: 126,
  deductMarkDimX: 270,
  deductMarkLabelMidY: 99,
  legDimY: 268,
  legLabelY: 260,
  legValueY: 282,
  legEndX: 304,
  legMidX: 161,
} as const;

const VECTOR_VALUE_FONT_SIZE = 13.5;

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
  const { ghost } = useDiagramTheme();

  return (
    <DiagramSvg viewBox={STUB90_CONFIG.diagramViewBox}>
      <DiagramDefs gradientId="ghostPipeGradient" ghost />
      <DiagramCanvas />
      <PipeSegment d={GHOST_PIPE_PATH} variant="shadow" opacity={ghost.pipeShadowOpacity} />
      <PipeSegment d={GHOST_PIPE_PATH} variant="pipe" gradientId="ghostPipeGradient" />
      <MarkLine x1={284} y1={STATIC.markY} x2={312} y2={STATIC.markY} opacity={ghost.markOpacity} />
      <DimensionLine
        x1={STATIC.stubDimX}
        y1={STATIC.bottomY}
        x2={STATIC.stubDimX}
        y2={STATIC.topY}
        showArrows={false}
        opacity={ghost.dimensionOpacity}
      />
      <DimensionLine
        x1={STATIC.startX}
        y1={STATIC.legDimY}
        x2={STATIC.legEndX}
        y2={STATIC.legDimY}
        showArrows={false}
        opacity={ghost.dimensionOpacity}
      />
      <DiagramGhostMessage text={message} invalid={invalid} />
    </DiagramSvg>
  );
}

function Stub90LiveDiagram({ data }: { data: Stub90DiagramData }) {
  const theme = useDiagramTheme();
  const legDisplay = data.legLengthInches !== undefined ? data.display.leg : undefined;
  const {
    startX,
    bottomY,
    cornerX,
    topY,
    markY,
    pipePath,
    highlightPath,
    bendZonePath,
    stubDimX,
    stubLabelX,
    stubMidY,
    deductMarkDimX,
    deductMarkLabelMidY,
    legDimY,
    legLabelY,
    legValueY,
    legEndX,
    legMidX,
  } = STATIC;

  return (
    <DiagramSvg viewBox={STUB90_CONFIG.diagramViewBox}>
      <DiagramDefs gradientId="pipeGradient" />
      <DiagramCanvas />

      <PipeSegment d={pipePath} variant="shadow" />
      <PipeSegment d={pipePath} variant="pipe" gradientId="pipeGradient" />
      <PipeSegment d={highlightPath} variant="highlight" />

      <BendRadiusZone d={bendZonePath} />

      <Circle cx={startX} cy={bottomY} r={5.5} fill={theme.pipeCore} />
      <Circle cx={cornerX} cy={topY} r={5.5} fill={theme.pipeCore} />

      <MarkLine x1={cornerX - 13} y1={markY} x2={cornerX + 13} y2={markY} />

      <DimensionLine
        x1={deductMarkDimX}
        y1={topY + 2}
        x2={deductMarkDimX}
        y2={markY - 2}
        extensionLines={[
          { x1: cornerX - 36, y1: topY, x2: cornerX - 8, y2: topY },
          { x1: cornerX - 36, y1: markY, x2: cornerX - 14, y2: markY },
        ]}
      />
      <DiagramLabel
        x={deductMarkDimX - 16}
        y={deductMarkLabelMidY - 8}
        text={stub90Copy.diagram.deductMark}
        variant="muted"
        fontSize={9.5}
        fontWeight="600"
        textAnchor="end"
      />
      <DiagramLabel
        x={deductMarkDimX - 16}
        y={deductMarkLabelMidY + 14}
        text={data.display.deductMark}
        variant="default"
        fontSize={VECTOR_VALUE_FONT_SIZE}
        fontWeight="700"
        textAnchor="end"
      />

      <DimensionLine
        x1={stubDimX}
        y1={bottomY}
        x2={stubDimX}
        y2={topY}
        extensionLines={[
          { x1: cornerX + 6, y1: bottomY, x2: cornerX + 42, y2: bottomY },
          { x1: cornerX + 8, y1: topY, x2: cornerX + 42, y2: topY },
        ]}
      />
      <DiagramLabel
        x={stubLabelX}
        y={stubMidY - 36}
        text={stub90Copy.diagram.stubLength}
        variant="muted"
        fontSize={9.5}
        fontWeight="600"
        rotation={90}
      />
      <DiagramLabel
        x={stubLabelX}
        y={stubMidY + 36}
        text={data.display.stubLength}
        variant="default"
        fontSize={VECTOR_VALUE_FONT_SIZE}
        fontWeight="700"
        rotation={90}
      />

      {legDisplay ? (
        <>
          <DimensionLine
            x1={startX + 2}
            y1={legDimY}
            x2={legEndX - 2}
            y2={legDimY}
            extensionLines={[
              { x1: startX, y1: 238, x2: startX, y2: 276 },
              { x1: legEndX, y1: 238, x2: legEndX, y2: 276 },
            ]}
          />
          <DiagramLabel
            x={legMidX}
            y={legLabelY}
            text={stub90Copy.diagram.leg}
            variant="muted"
            fontSize={9.5}
            fontWeight="600"
          />
          <DiagramLabel
            x={legMidX}
            y={legValueY}
            text={legDisplay}
            variant="default"
            fontSize={VECTOR_VALUE_FONT_SIZE}
            fontWeight="700"
          />
        </>
      ) : null}
    </DiagramSvg>
  );
}
