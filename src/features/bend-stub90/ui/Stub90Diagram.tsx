import { StyleSheet, View } from 'react-native';
import Svg, { Circle, Defs, G, LinearGradient, Marker, Path, Rect, Stop } from 'react-native-svg';

import {
  DiagramLabel,
  DimensionLine,
  MarkLine,
  PipeSegment,
  diagramMetrics,
  diagramTheme,
} from '@/shared/diagrams';
import { radius, spacing } from '@/theme';

import type { Stub90DiagramViewData } from '../engine/stub90.types';
import { STUB90_CONFIG } from '../stub90.config';
import { stub90Copy } from '../stub90.copy';

const PIPE_PATH = 'M 18 218 H 262 Q 308 218 308 172 V 34';
const HIGHLIGHT_PATH = 'M 34 213 H 262 Q 300 213 300 172 V 50';

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
      <Defs>
        <LinearGradient id="ghostPipeGradient" x1="0" y1="0" x2="1" y2="1">
          <Stop offset="0" stopColor={diagramTheme.pipe} stopOpacity="0.28" />
          <Stop offset="1" stopColor={diagramTheme.pipeCore} stopOpacity="0.24" />
        </LinearGradient>
      </Defs>

      <Rect
        x={1}
        y={1}
        width={358}
        height={298}
        rx={16}
        fill={diagramTheme.canvas}
        stroke={diagramTheme.border}
      />
      <PipeSegment d={PIPE_PATH} variant="shadow" />
      <PipeSegment d={PIPE_PATH} variant="pipe" gradientId="ghostPipeGradient" />
      <MarkLine x1={238} y1={205} x2={238} y2={230} />
      <DimensionLine x1={332} y1={218} x2={332} y2={34} showArrows={false} />
      <DimensionLine x1={18} y1={262} x2={238} y2={262} showArrows={false} />
      <DiagramLabel x={180} y={282} text={message} variant="muted" fontSize={12} />
    </Svg>
  );
}

function Stub90LiveDiagram({ data }: { data: Stub90DiagramViewData }) {
  return (
    <Svg viewBox={STUB90_CONFIG.diagramViewBox} width="100%" height={STUB90_CONFIG.diagramHeight}>
      <Defs>
        <LinearGradient id="pipeGradient" x1="0" y1="0" x2="1" y2="1">
          <Stop offset="0" stopColor={diagramTheme.pipe} stopOpacity="1" />
          <Stop offset="1" stopColor={diagramTheme.pipeCore} stopOpacity="1" />
        </LinearGradient>
        <Marker
          id="diagramArrow"
          markerWidth={diagramMetrics.arrowSize}
          markerHeight={diagramMetrics.arrowSize}
          refX={3.2}
          refY={3.2}
          orient="auto"
          markerUnits="strokeWidth">
          <Path d="M 0 0 L 6.4 3.2 L 0 6.4 z" fill={diagramTheme.arrowFill} />
        </Marker>
      </Defs>

      <Rect
        x={1}
        y={1}
        width={358}
        height={298}
        rx={16}
        fill={diagramTheme.canvas}
        stroke={diagramTheme.border}
      />

      <PipeSegment d={PIPE_PATH} variant="shadow" opacity={1} />
      <PipeSegment d={PIPE_PATH} variant="pipe" gradientId="pipeGradient" />
      <PipeSegment d={HIGHLIGHT_PATH} variant="highlight" />

      {/* Deduct zone at the bend */}
      <Path
        d="M 260 218 Q 308 218 308 170"
        fill="none"
        stroke={diagramTheme.deduct}
        strokeWidth={25}
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
      <Path d="M 278 173 L 238 151" stroke={diagramTheme.deductStroke} strokeWidth={0.9} />
      <DiagramLabel
        x={216}
        y={147}
        text={stub90Copy.diagram.deduct}
        variant="mark"
        fontSize={10.5}
      />
      <DiagramLabel x={216} y={161} text={data.deduct} variant="muted" fontSize={10.5} />

      <Circle cx={18} cy={218} r={6.5} fill={diagramTheme.pipeCore} />
      <Path d="M 18 207 V 229" stroke={diagramTheme.dimensionStrong} strokeWidth={0.9} opacity={0.7} />

      <MarkLine
        x1={238}
        y1={203}
        x2={238}
        y2={232}
        label={stub90Copy.diagram.deductMark}
        labelX={238}
        labelY={190}
      />

      <DimensionLine
        x1={20}
        y1={264}
        x2={236}
        y2={264}
        extensionLines={[
          { x1: 18, y1: 236, x2: 18, y2: 272 },
          { x1: 238, y1: 236, x2: 238, y2: 272 },
        ]}
      />
      <DiagramLabel
        x={128}
        y={256}
        text={stub90Copy.diagram.deductMark}
        variant="muted"
        fontSize={10.5}
      />
      <DiagramLabel x={128} y={279} text={data.deductMark} variant="default" fontSize={11.5} />

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
        x={351}
        y={126}
        text={`${stub90Copy.diagram.stubLength} ${data.stubLength}`}
        variant="default"
        fontSize={10.5}
        rotation={90}
      />

      {data.showLeg && data.leg ? (
        <G>
          <DimensionLine
            x1={18}
            y1={20}
            x2={262}
            y2={20}
            extensionLines={[
              { x1: 18, y1: 14, x2: 18, y2: 30 },
              { x1: 262, y1: 14, x2: 262, y2: 30 },
            ]}
          />
          <DiagramLabel
            x={140}
            y={13}
            text={`${stub90Copy.diagram.leg} ${data.leg}`}
            variant="default"
            fontSize={10.5}
          />
        </G>
      ) : null}

      <DiagramLabel
        x={306}
        y={28}
        text={stub90Copy.diagram.title}
        variant="muted"
        fontSize={11}
      />
    </Svg>
  );
}

const styles = StyleSheet.create({
  frame: {
    overflow: 'hidden',
    borderRadius: radius.lg,
    backgroundColor: diagramTheme.canvas,
    marginHorizontal: -spacing.xs,
  },
});
