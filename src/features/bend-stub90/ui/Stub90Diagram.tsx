import { Ellipse, G, Path } from 'react-native-svg';

import {
  BendRadiusZone,
  DiagramCanvas,
  DiagramDefs,
  DiagramFrame,
  DiagramGhostMessage,
  DiagramLabel,
  DiagramSvg,
  DimensionLine,
  useDiagramTheme,
} from '@/shared/diagrams';
import type { Stub90DiagramData } from '../engine/stub90.types';
import { STUB90_CONFIG } from '../stub90.config';
import { stub90Copy } from '../stub90.copy';

/**
 * Fixed instructional schematic. Values change with the calculation, while the
 * bend stays large enough to read clearly at every supported stub length.
 */
const LAYOUT = {
  startX: 26,
  bottomY: 211,
  cornerX: 288,
  bendStartX: 240,
  bendTopY: 163,
  topY: 32,
  markY: 149,
  pipePath: 'M 26 211 H 240 Q 288 211 288 163 V 32',
  bendZonePath: 'M 240 211 Q 288 211 288 163',
  deductDimX: 260,
  /** Keep the vertical vector at the far edge so its horizontal label never crosses it. */
  stubDimX: 353,
  legDimY: 270,
} as const;

const PIPE_WIDTH = 19;
const VALUE_FONT_SIZE = 13.5;

export type Stub90DiagramProps = {
  data?: Stub90DiagramData;
  isEmpty?: boolean;
  isInvalid?: boolean;
};

/** Feature diagram for Stub 90 - built from shared SVG primitives. */
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

/** Satin EMT body with flat cuts so the hollow cross-sections remain visible. */
function Stub90SatinPipe({ ghost = false }: { ghost?: boolean }) {
  const theme = useDiagramTheme();
  const opacity = ghost ? 0.24 : 1;

  return (
    <G opacity={opacity}>
      <Path
        d={LAYOUT.pipePath}
        fill="none"
        stroke={theme.pipeShadow}
        strokeWidth={23}
        strokeLinecap="butt"
        strokeLinejoin="round"
        opacity={ghost ? 0.35 : 0.24}
      />
      <Path
        d={LAYOUT.pipePath}
        fill="none"
        stroke={theme.pipeCore}
        strokeWidth={PIPE_WIDTH}
        strokeLinecap="butt"
        strokeLinejoin="round"
      />
      <Path
        d={LAYOUT.pipePath}
        fill="none"
        stroke="url(#stub90PipeGradient)"
        strokeWidth={PIPE_WIDTH * 0.86}
        strokeLinecap="butt"
        strokeLinejoin="round"
      />
      <Path
        d={LAYOUT.pipePath}
        fill="none"
        stroke={theme.pipeSheen}
        strokeWidth={PIPE_WIDTH * 0.13}
        strokeLinecap="butt"
        strokeLinejoin="round"
        opacity={ghost ? 0.16 : 0.25}
      />
    </G>
  );
}

function Stub90EndCaps({ ghost = false }: { ghost?: boolean }) {
  const theme = useDiagramTheme();

  return (
    <G opacity={ghost ? 0.34 : 1}>
      {/* Horizontal run: the cut face is vertical. */}
      <Ellipse
        cx={LAYOUT.startX}
        cy={LAYOUT.bottomY}
        rx={2.8}
        ry={PIPE_WIDTH / 2}
        fill={theme.pipe}
        stroke={theme.pipeSheen}
        strokeWidth={0.8}
      />
      <Ellipse
        cx={LAYOUT.startX}
        cy={LAYOUT.bottomY}
        rx={1.65}
        ry={PIPE_WIDTH * 0.35}
        fill={theme.endCap.fill}
        stroke={theme.endCap.stroke}
        strokeWidth={0.65}
      />

      {/* Stub: the top cut face is horizontal. */}
      <Ellipse
        cx={LAYOUT.cornerX}
        cy={LAYOUT.topY}
        rx={PIPE_WIDTH / 2}
        ry={2.8}
        fill={theme.pipe}
        stroke={theme.pipeSheen}
        strokeWidth={0.8}
      />
      <Ellipse
        cx={LAYOUT.cornerX}
        cy={LAYOUT.topY}
        rx={PIPE_WIDTH * 0.35}
        ry={1.65}
        fill={theme.endCap.fill}
        stroke={theme.endCap.stroke}
        strokeWidth={0.65}
      />
    </G>
  );
}

/** A compact wrap-style field mark, drawn around the conduit instead of across it. */
function DeductMarkCollar({ opacity = 1 }: { opacity?: number }) {
  const theme = useDiagramTheme();

  return (
    <G opacity={opacity}>
      <Ellipse
        cx={LAYOUT.cornerX}
        cy={LAYOUT.markY}
        rx={PIPE_WIDTH / 2 + 0.8}
        ry={2.45}
        fill="none"
        stroke={theme.markGlow}
        strokeWidth={3.4}
      />
      <Ellipse
        cx={LAYOUT.cornerX}
        cy={LAYOUT.markY}
        rx={PIPE_WIDTH / 2 + 0.8}
        ry={2.45}
        fill="none"
        stroke={theme.mark}
        strokeWidth={1.45}
      />
    </G>
  );
}

function Stub90GhostDiagram({ message, invalid }: { message: string; invalid?: boolean }) {
  const { ghost } = useDiagramTheme();

  return (
    <DiagramSvg viewBox={STUB90_CONFIG.diagramViewBox}>
      <DiagramDefs gradientId="stub90PipeGradient" ghost />
      <DiagramCanvas />
      <Stub90SatinPipe ghost />
      <Stub90EndCaps ghost />
      <DeductMarkCollar opacity={ghost.markOpacity} />
      <DimensionLine
        x1={LAYOUT.stubDimX}
        y1={LAYOUT.bottomY}
        x2={LAYOUT.stubDimX}
        y2={LAYOUT.topY}
        showArrows={false}
        opacity={ghost.dimensionOpacity}
      />
      <DimensionLine
        x1={LAYOUT.startX}
        y1={LAYOUT.legDimY}
        x2={LAYOUT.cornerX}
        y2={LAYOUT.legDimY}
        showArrows={false}
        opacity={ghost.dimensionOpacity}
      />
      <DiagramGhostMessage text={message} invalid={invalid} />
    </DiagramSvg>
  );
}

function Stub90LiveDiagram({ data }: { data: Stub90DiagramData }) {
  const legDisplay = data.legLengthInches !== undefined ? data.display.leg : undefined;

  return (
    <DiagramSvg viewBox={STUB90_CONFIG.diagramViewBox}>
      <DiagramDefs gradientId="stub90PipeGradient" />
      <DiagramCanvas />

      <Stub90SatinPipe />
      <BendRadiusZone d={LAYOUT.bendZonePath} glowWidth={16} />
      <Stub90EndCaps />
      <DeductMarkCollar />

      {/* Deduct Mark: measure down the stub from its finished end. */}
      <DimensionLine
        x1={LAYOUT.deductDimX}
        y1={LAYOUT.topY + 2}
        x2={LAYOUT.deductDimX}
        y2={LAYOUT.markY - 2}
        extensionLines={[
          { x1: LAYOUT.deductDimX + 5, y1: LAYOUT.topY, x2: LAYOUT.cornerX - 10, y2: LAYOUT.topY },
          { x1: LAYOUT.deductDimX + 5, y1: LAYOUT.markY, x2: LAYOUT.cornerX - 11, y2: LAYOUT.markY },
        ]}
      />
      <DiagramLabel
        x={LAYOUT.deductDimX - 11}
        y={83}
        text={stub90Copy.diagram.deductMark.toUpperCase()}
        variant="mark"
        fontSize={8.5}
        fontWeight="700"
        textAnchor="end"
      />
      <DiagramLabel
        x={LAYOUT.deductDimX - 11}
        y={101}
        text={data.display.deductMark}
        variant="mark"
        fontSize={VALUE_FONT_SIZE}
        fontWeight="700"
        textAnchor="end"
      />

      {/* Stub Length: finished floor line at the 90 to the finished stub end. */}
      <DimensionLine
        x1={LAYOUT.stubDimX}
        y1={LAYOUT.bottomY}
        x2={LAYOUT.stubDimX}
        y2={LAYOUT.topY}
        extensionLines={[
          { x1: LAYOUT.cornerX + 10, y1: LAYOUT.bottomY, x2: LAYOUT.stubDimX + 5, y2: LAYOUT.bottomY },
          { x1: LAYOUT.cornerX + 10, y1: LAYOUT.topY, x2: LAYOUT.stubDimX + 5, y2: LAYOUT.topY },
        ]}
      />
      <DiagramLabel
        x={LAYOUT.cornerX + 15}
        y={105}
        text={stub90Copy.diagram.stubLength.toUpperCase()}
        variant="muted"
        fontSize={7.7}
        fontWeight="700"
        textAnchor="start"
      />
      <DiagramLabel
        x={LAYOUT.cornerX + 15}
        y={124}
        text={data.display.stubLength}
        variant="strong"
        fontSize={VALUE_FONT_SIZE}
        fontWeight="700"
        textAnchor="start"
      />

      {legDisplay ? (
        <>
          <DimensionLine
            x1={LAYOUT.startX + 2}
            y1={LAYOUT.legDimY}
            x2={LAYOUT.cornerX - 2}
            y2={LAYOUT.legDimY}
            extensionLines={[
              { x1: LAYOUT.startX, y1: LAYOUT.bottomY + 11, x2: LAYOUT.startX, y2: LAYOUT.legDimY + 5 },
              { x1: LAYOUT.cornerX, y1: LAYOUT.bottomY + 11, x2: LAYOUT.cornerX, y2: LAYOUT.legDimY + 5 },
            ]}
          />
          <DiagramLabel
            x={(LAYOUT.startX + LAYOUT.cornerX) / 2}
            y={254}
            text={stub90Copy.diagram.leg.toUpperCase()}
            variant="muted"
            fontSize={8.5}
            fontWeight="700"
          />
          <DiagramLabel
            x={(LAYOUT.startX + LAYOUT.cornerX) / 2}
            y={290}
            text={legDisplay}
            variant="strong"
            fontSize={VALUE_FONT_SIZE}
            fontWeight="700"
          />
        </>
      ) : null}
    </DiagramSvg>
  );
}
