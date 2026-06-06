import { StyleSheet, View } from 'react-native';
import Svg, { Defs, G, LinearGradient, Marker, Path, Rect, Stop } from 'react-native-svg';

import {
  DiagramLabel,
  DimensionLine,
  MarkLine,
  PipeSegment,
  diagramMetrics,
  diagramTheme,
} from '@/shared/diagrams';
import { radius, spacing } from '@/theme';

import type { OffsetDiagramViewData } from '../engine/offset.types';
import { OFFSET_CONFIG } from '../offset.config';
import { offsetCopy } from '../offset.copy';

const RUN_LEFT = 'M 24 230 H 130';
const RUN_RISE = 'M 130 230 L 210 150';
const RUN_RIGHT = 'M 210 150 H 336';
const GHOST_PIPE = 'M 24 230 H 130 L 210 150 H 336';

export type OffsetDiagramProps = {
  data?: OffsetDiagramViewData;
  isEmpty?: boolean;
  isInvalid?: boolean;
};

/** Feature diagram for Offset — built from shared SVG primitives. */
export function OffsetDiagram({ data, isEmpty = false, isInvalid = false }: OffsetDiagramProps) {
  const message = isInvalid
    ? offsetCopy.diagram.invalidMessage
    : offsetCopy.diagram.emptyMessage;

  return (
    <View style={styles.frame}>
      {!data || isEmpty || isInvalid ? (
        <OffsetGhostDiagram message={message} />
      ) : (
        <OffsetLiveDiagram data={data} />
      )}
    </View>
  );
}

function OffsetGhostDiagram({ message }: { message: string }) {
  return (
    <Svg viewBox={OFFSET_CONFIG.diagramViewBox} width="100%" height={OFFSET_CONFIG.diagramHeight}>
      <Defs>
        <LinearGradient id="offsetGhostGradient" x1="0" y1="0" x2="1" y2="1">
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
      <PipeSegment d={GHOST_PIPE} variant="shadow" opacity={0.72} />
      <PipeSegment d={GHOST_PIPE} variant="pipe" gradientId="offsetGhostGradient" />
      <MarkLine x1={130} y1={218} x2={130} y2={242} />
      <MarkLine x1={210} y1={138} x2={210} y2={162} />
      <DimensionLine x1={130} y1={262} x2={210} y2={262} showArrows={false} />
      <DiagramLabel x={180} y={282} text={message} variant="muted" fontSize={12} />
    </Svg>
  );
}

function OffsetLiveDiagram({ data }: { data: OffsetDiagramViewData }) {
  return (
    <Svg viewBox={OFFSET_CONFIG.diagramViewBox} width="100%" height={OFFSET_CONFIG.diagramHeight}>
      <Defs>
        <LinearGradient id="offsetPipeGradient" x1="0" y1="0" x2="1" y2="1">
          <Stop offset="0" stopColor={diagramTheme.pipe} stopOpacity="1" />
          <Stop offset="1" stopColor={diagramTheme.pipeCore} stopOpacity="1" />
        </LinearGradient>
        <Marker
          id="offsetArrow"
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

      <PipeSegment d={RUN_LEFT} variant="shadow" />
      <PipeSegment d={RUN_RISE} variant="shadow" />
      <PipeSegment d={RUN_RIGHT} variant="shadow" />
      <PipeSegment d={RUN_LEFT} variant="pipe" gradientId="offsetPipeGradient" />
      <PipeSegment d={RUN_RISE} variant="pipe" gradientId="offsetPipeGradient" />
      <PipeSegment d={RUN_RIGHT} variant="pipe" gradientId="offsetPipeGradient" />

      <MarkLine
        x1={130}
        y1={218}
        x2={130}
        y2={242}
        label={offsetCopy.diagram.mark1}
        labelX={130}
        labelY={206}
      />
      <MarkLine
        x1={210}
        y1={138}
        x2={210}
        y2={162}
        label={offsetCopy.diagram.mark2}
        labelX={210}
        labelY={126}
      />

      <DimensionLine
        x1={130}
        y1={264}
        x2={210}
        y2={264}
        arrowMarkerId="offsetArrow"
        extensionLines={[
          { x1: 130, y1: 244, x2: 130, y2: 276 },
          { x1: 210, y1: 164, x2: 210, y2: 276 },
        ]}
      />
      <DiagramLabel
        x={170}
        y={256}
        text={offsetCopy.diagram.distanceBetweenBends}
        variant="muted"
        fontSize={10.5}
      />
      <DiagramLabel
        x={170}
        y={279}
        text={data.distanceBetweenBends}
        variant="default"
        fontSize={11.5}
      />

      <DimensionLine
        x1={48}
        y1={230}
        x2={48}
        y2={150}
        arrowMarkerId="offsetArrow"
        extensionLines={[
          { x1: 24, y1: 230, x2: 72, y2: 230 },
          { x1: 24, y1: 150, x2: 72, y2: 150 },
        ]}
      />
      <DiagramLabel
        x={14}
        y={190}
        text={`${offsetCopy.diagram.offsetHeight} ${data.offsetHeight}`}
        variant="default"
        fontSize={10.5}
        rotation={-90}
      />

      <DiagramLabel
        x={300}
        y={28}
        text={`${offsetCopy.diagram.title} • ${data.angleDeg}°`}
        variant="muted"
        fontSize={11}
      />

      {data.showMarks ? (
        <G>
          <Rect
            x={108}
            y={20}
            width={144}
            height={72}
            rx={12}
            fill="rgba(16, 23, 34, 0.92)"
            stroke={diagramTheme.border}
          />
          <DiagramLabel x={180} y={38} text={offsetCopy.diagram.mark1} variant="muted" fontSize={10} />
          <DiagramLabel x={180} y={52} text={data.mark1} variant="default" fontSize={11} />
          <DiagramLabel x={180} y={70} text={offsetCopy.diagram.mark2} variant="muted" fontSize={10} />
          <DiagramLabel x={180} y={84} text={data.mark2} variant="default" fontSize={11} />
        </G>
      ) : (
        <G>
          <Rect
            x={148}
            y={24}
            width={164}
            height={28}
            rx={12}
            fill="rgba(16, 23, 34, 0.92)"
            stroke={diagramTheme.border}
          />
          <DiagramLabel
            x={230}
            y={42}
            text={`${offsetCopy.diagram.shrink} ${data.shrink}`}
            variant="default"
            fontSize={11}
          />
        </G>
      )}
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
