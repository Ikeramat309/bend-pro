import { StyleSheet, View } from 'react-native';
import Svg from 'react-native-svg';

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
import type { OffsetDiagramViewData } from '../engine/offset.types';
import { OFFSET_CONFIG } from '../offset.config';
import { offsetCopy } from '../offset.copy';

const RUN_LEFT = 'M 24 230 H 130';
const RUN_RISE = 'M 130 230 L 210 150';
const RUN_RIGHT = 'M 210 150 H 336';
const GHOST_PIPE = 'M 24 230 H 130 L 210 150 H 336';
const GHOST_MARK_OPACITY = 0.38;
const GHOST_DIM_OPACITY = 0.34;

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
      <DiagramDefs gradientId="offsetGhostGradient" ghost />
      <DiagramCanvas />
      <PipeSegment d={GHOST_PIPE} variant="shadow" opacity={0.55} />
      <PipeSegment d={GHOST_PIPE} variant="pipe" gradientId="offsetGhostGradient" />
      <MarkLine x1={130} y1={220} x2={130} y2={244} opacity={GHOST_MARK_OPACITY} />
      <MarkLine x1={210} y1={140} x2={210} y2={164} opacity={GHOST_MARK_OPACITY} />
      <DimensionLine x1={130} y1={268} x2={210} y2={268} showArrows={false} opacity={GHOST_DIM_OPACITY} />
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

function OffsetLiveDiagram({ data }: { data: OffsetDiagramViewData }) {
  return (
    <Svg viewBox={OFFSET_CONFIG.diagramViewBox} width="100%" height={OFFSET_CONFIG.diagramHeight}>
      <DiagramDefs gradientId="offsetPipeGradient" />
      <DiagramCanvas />

      <PipeSegment d={RUN_LEFT} variant="shadow" />
      <PipeSegment d={RUN_RISE} variant="shadow" />
      <PipeSegment d={RUN_RIGHT} variant="shadow" />
      <PipeSegment d={RUN_LEFT} variant="pipe" gradientId="offsetPipeGradient" />
      <PipeSegment d={RUN_RISE} variant="pipe" gradientId="offsetPipeGradient" />
      <PipeSegment d={RUN_RIGHT} variant="pipe" gradientId="offsetPipeGradient" />

      <MarkLine
        x1={130}
        y1={220}
        x2={130}
        y2={244}
        label={offsetCopy.diagram.mark1}
        labelX={108}
        labelY={232}
        labelVariant="muted"
      />
      <MarkLine
        x1={210}
        y1={140}
        x2={210}
        y2={164}
        label={offsetCopy.diagram.mark2}
        labelX={210}
        labelY={128}
        labelVariant="muted"
      />

      <DimensionLine
        x1={130}
        y1={268}
        x2={210}
        y2={268}
        extensionLines={[
          { x1: 130, y1: 246, x2: 130, y2: 280 },
          { x1: 210, y1: 166, x2: 210, y2: 280 },
        ]}
      />
      <DiagramLabel
        x={170}
        y={260}
        text={offsetCopy.diagram.distanceBetweenBends}
        variant="muted"
        fontSize={9.5}
        fontWeight="600"
      />
      <DiagramLabel
        x={170}
        y={282}
        text={data.distanceBetweenBends}
        variant="default"
        fontSize={11}
      />

      <DimensionLine
        x1={52}
        y1={230}
        x2={52}
        y2={150}
        extensionLines={[
          { x1: 24, y1: 230, x2: 80, y2: 230 },
          { x1: 24, y1: 150, x2: 80, y2: 150 },
        ]}
      />
      <DiagramLabel
        x={12}
        y={190}
        text={offsetCopy.diagram.offsetHeight}
        variant="muted"
        fontSize={9.5}
        fontWeight="600"
        rotation={-90}
      />
      <DiagramLabel
        x={12}
        y={206}
        text={data.offsetHeight}
        variant="default"
        fontSize={10.5}
        rotation={-90}
      />

      <DiagramLabel
        x={286}
        y={18}
        text={`${offsetCopy.diagram.title} • ${data.angleDeg}°`}
        variant="muted"
        fontSize={10}
        fontWeight="600"
        textAnchor="end"
      />

      {data.showMarks ? (
        <DiagramCallout x={88} y={16} width={184} height={40}>
          <DiagramLabel
            x={104}
            y={30}
            text={`${offsetCopy.diagram.mark1}  ${data.mark1}`}
            variant="default"
            fontSize={10}
            textAnchor="start"
          />
          <DiagramLabel
            x={104}
            y={46}
            text={`${offsetCopy.diagram.mark2}  ${data.mark2}`}
            variant="default"
            fontSize={10}
            textAnchor="start"
          />
        </DiagramCallout>
      ) : (
        <DiagramCallout x={214} y={16} width={132} height={28}>
          <DiagramLabel
            x={228}
            y={34}
            text={`${offsetCopy.diagram.shrink}  ${data.shrink}`}
            variant="default"
            fontSize={10}
            textAnchor="start"
          />
        </DiagramCallout>
      )}
    </Svg>
  );
}

const styles = StyleSheet.create({
  frame: {
    overflow: 'hidden',
    backgroundColor: diagramTheme.canvas,
  },
});
