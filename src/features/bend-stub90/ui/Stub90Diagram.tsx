import { StyleSheet, View } from 'react-native';
import Svg, { Circle, Path } from 'react-native-svg';

import {
    DiagramCallout,
    DiagramCanvas,
    DiagramDefs,
    DiagramLabel,
    DimensionLine,
    MarkLine,
    PipeSegment,
    diagramTheme,
} from '@/shared/diagrams';
import type { Stub90DiagramViewData } from '../engine/stub90.types';
import { STUB90_CONFIG } from '../stub90.config';
import { stub90Copy } from '../stub90.copy';

const PIPE_PATH = 'M 18 218 H 262 Q 308 218 308 172 V 34';
const HIGHLIGHT_PATH = 'M 34 213 H 262 Q 300 213 300 172 V 50';
const GHOST_MARK_OPACITY = 0.38;
const GHOST_DIM_OPACITY = 0.34;

export type Stub90DiagramProps = {
  data?: Stub90DiagramViewData;
  isEmpty?: boolean;
  isInvalid?: boolean;
};

/** Feature diagram for Stub 90 — built from shared SVG primitives. */
export function Stub90Diagram({ data, isEmpty = false, isInvalid = false }: Stub90DiagramProps) {
  const message = isInvalid
    ? stub90Copy.diagram.invalidMessage
    : stub90Copy.diagram.emptyMessage;

  return (
    <View style={styles.frame}>
      {!data || isEmpty || isInvalid ? (
        <Stub90GhostDiagram message={message} />
      ) : (
        <Stub90LiveDiagram data={data} />
      )}
    </View>
  );
}

function Stub90GhostDiagram({ message }: { message: string }) {
  return (
    <Svg viewBox={STUB90_CONFIG.diagramViewBox} width="100%" height={STUB90_CONFIG.diagramHeight}>
      <DiagramDefs gradientId="ghostPipeGradient" ghost />
      <DiagramCanvas />
      <PipeSegment d={PIPE_PATH} variant="shadow" opacity={0.55} />
      <PipeSegment d={PIPE_PATH} variant="pipe" gradientId="ghostPipeGradient" />
      <MarkLine x1={238} y1={208} x2={238} y2={232} opacity={GHOST_MARK_OPACITY} />
      <DimensionLine x1={334} y1={218} x2={334} y2={34} showArrows={false} opacity={GHOST_DIM_OPACITY} />
      <DimensionLine x1={18} y1={268} x2={238} y2={268} showArrows={false} opacity={GHOST_DIM_OPACITY} />
      <DiagramLabel
        x={180}
        y={286}
        text={message}
        variant="muted"
        fontSize={11}
        fontWeight="500"
      />
    </Svg>
  );
}

function Stub90LiveDiagram({ data }: { data: Stub90DiagramViewData }) {
  return (
    <Svg viewBox={STUB90_CONFIG.diagramViewBox} width="100%" height={STUB90_CONFIG.diagramHeight}>
      <DiagramDefs gradientId="pipeGradient" />
      <DiagramCanvas />

      <PipeSegment d={PIPE_PATH} variant="shadow" />
      <PipeSegment d={PIPE_PATH} variant="pipe" gradientId="pipeGradient" />
      <PipeSegment d={HIGHLIGHT_PATH} variant="highlight" />

      <Path
        d="M 260 218 Q 308 218 308 170"
        fill="none"
        stroke={diagramTheme.deduct}
        strokeWidth={22}
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <Path
        d="M 262 218 Q 308 218 308 172"
        fill="none"
        stroke={diagramTheme.deductStroke}
        strokeWidth={1}
        strokeLinecap="round"
        strokeLinejoin="round"
      />

      <Circle cx={18} cy={218} r={5.5} fill={diagramTheme.pipeCore} />

      <MarkLine
        x1={238}
        y1={206}
        x2={238}
        y2={234}
        label={stub90Copy.diagram.bendMark}
        labelX={218}
        labelY={248}
        labelVariant="mark"
      />

      <DiagramCallout x={196} y={148} width={88} height={34}>
        <DiagramLabel
          x={204}
          y={164}
          text={stub90Copy.diagram.deduct}
          variant="muted"
          fontSize={9}
          textAnchor="start"
        />
        <DiagramLabel
          x={204}
          y={178}
          text={data.deduct}
          variant="default"
          fontSize={10}
          textAnchor="start"
        />
      </DiagramCallout>

      <DimensionLine
        x1={20}
        y1={268}
        x2={236}
        y2={268}
        extensionLines={[
          { x1: 18, y1: 238, x2: 18, y2: 276 },
          { x1: 238, y1: 238, x2: 238, y2: 276 },
        ]}
      />
      <DiagramLabel
        x={128}
        y={260}
        text={stub90Copy.diagram.deductMark}
        variant="muted"
        fontSize={9.5}
        fontWeight="600"
      />
      <DiagramLabel x={128} y={282} text={data.deductMark} variant="default" fontSize={11} />

      <DimensionLine
        x1={334}
        y1={218}
        x2={334}
        y2={34}
        extensionLines={[
          { x1: 314, y1: 218, x2: 342, y2: 218 },
          { x1: 314, y1: 34, x2: 342, y2: 34 },
        ]}
      />
      <DiagramLabel
        x={354}
        y={126}
        text={stub90Copy.diagram.stubLength}
        variant="muted"
        fontSize={9.5}
        fontWeight="600"
        rotation={90}
      />
      <DiagramLabel
        x={354}
        y={142}
        text={data.stubLength}
        variant="default"
        fontSize={10.5}
        rotation={90}
      />

      {data.showLeg && data.leg ? (
        <>
          <DimensionLine
            x1={18}
            y1={20}
            x2={262}
            y2={20}
            extensionLines={[
              { x1: 18, y1: 14, x2: 18, y2: 28 },
              { x1: 262, y1: 14, x2: 262, y2: 28 },
            ]}
          />
          <DiagramLabel
            x={140}
            y={12}
            text={`${stub90Copy.diagram.leg}  ${data.leg}`}
            variant="default"
            fontSize={10}
          />
        </>
      ) : null}

      <DiagramLabel
        x={286}
        y={18}
        text={stub90Copy.diagram.title}
        variant="muted"
        fontSize={10}
        fontWeight="600"
        textAnchor="end"
      />
    </Svg>
  );
}

const styles = StyleSheet.create({
  frame: {
    overflow: 'hidden',
    backgroundColor: diagramTheme.canvas,
  },
});
