import {
  BendRadiusZone,
  DiagramBendBadge,
  DiagramCallout,
  DiagramCanvas,
  DiagramDefs,
  DiagramFrame,
  DiagramGhostMessage,
  DiagramLabel,
  DiagramSvg,
  DimensionLine,
  MarkLine,
  PipeSegment,
  diagramTheme,
} from '@/shared/diagrams';
import type { OffsetDiagramData } from '../engine/offset.types';
import { OFFSET_CONFIG } from '../offset.config';
import { offsetCopy } from '../offset.copy';
import {
  OFFSET_GHOST_PIPE,
  OFFSET_DIAGRAM_LAYOUT,
  buildOffsetDiagramGeometry,
} from '../diagram/offsetDiagramGeometry';

const { leftX: LEFT_X } = OFFSET_DIAGRAM_LAYOUT;
const GHOST_PIPE = OFFSET_GHOST_PIPE;
const { ghost } = diagramTheme;
const MARK_HALF = 15;

export type OffsetDiagramProps = {
  data?: OffsetDiagramData;
  isEmpty?: boolean;
  isInvalid?: boolean;
};

/** Feature diagram for Offset — vertical pipe built from shared SVG primitives. */
export function OffsetDiagram({ data, isEmpty = false, isInvalid = false }: OffsetDiagramProps) {
  const message = isInvalid
    ? offsetCopy.diagram.invalidMessage
    : offsetCopy.diagram.emptyMessage;
  const showLive = Boolean(data) && !isEmpty && !isInvalid;
  const fallbackMessage = !isEmpty && !isInvalid ? offsetCopy.diagram.unavailableMessage : message;

  return (
    <DiagramFrame>
      {showLive ? (
        <OffsetLiveDiagram data={data!} />
      ) : (
        <OffsetGhostDiagram message={fallbackMessage} invalid={isInvalid} />
      )}
    </DiagramFrame>
  );
}

function OffsetGhostDiagram({ message, invalid }: { message: string; invalid?: boolean }) {
  return (
    <DiagramSvg viewBox={OFFSET_CONFIG.diagramViewBox}>
      <DiagramDefs gradientId="offsetGhostGradient" ghost />
      <DiagramCanvas />
      <PipeSegment d={GHOST_PIPE} variant="shadow" opacity={ghost.pipeShadowOpacity} />
      <PipeSegment d={GHOST_PIPE} variant="pipe" gradientId="offsetGhostGradient" />
      <MarkLine x1={LEFT_X - 14} y1={250} x2={LEFT_X + 14} y2={250} opacity={ghost.markOpacity} />
      <MarkLine x1={202} y1={142} x2={230} y2={142} opacity={ghost.markOpacity} />
      <DiagramGhostMessage text={message} invalid={invalid} />
    </DiagramSvg>
  );
}

function OffsetLiveDiagram({ data }: { data: OffsetDiagramData }) {
  const mark1Display = data.mark1Inches !== undefined ? data.display.mark1 : undefined;
  const mark2Display = data.mark2Inches !== undefined ? data.display.mark2 : undefined;

  const geo = buildOffsetDiagramGeometry({
    bendAngleDeg: data.bendAngle,
    distanceBetweenBendsInches: data.distanceBetweenBendsInches,
    mark1Inches: data.mark1Inches,
  });

  const {
    x1,
    y1,
    x2,
    y2,
    pipePath,
    bendZone1,
    bendZone2,
    dbb1,
    dbb2,
    dbbLabelX,
    dbbLabelY,
    offsetDimY,
    offsetLabelX,
    offsetLabelY,
  } = geo;

  return (
    <DiagramSvg viewBox={OFFSET_CONFIG.diagramViewBox}>
      <DiagramDefs gradientId="offsetPipeGradient" />
      <DiagramCanvas />

      <PipeSegment d={pipePath} variant="shadow" />
      <PipeSegment d={pipePath} variant="pipe" gradientId="offsetPipeGradient" />

      <BendRadiusZone d={bendZone1} glowWidth={18} />
      <BendRadiusZone d={bendZone2} glowWidth={18} />

      {/* Bend 1 (lower) */}
      <MarkLine x1={x1 - MARK_HALF} y1={y1} x2={x1 + MARK_HALF} y2={y1} />
      <DiagramBendBadge x={x1 - 30} y={y1} order={1} />
      <DiagramLabel
        x={x1 - 22}
        y={y1 - 6}
        text={offsetCopy.diagram.mark1}
        variant="muted"
        fontSize={9.5}
        fontWeight="600"
        textAnchor="end"
      />
      {mark1Display ? (
        <DiagramLabel
          x={x1 - 22}
          y={y1 + 9}
          text={mark1Display}
          variant="default"
          fontSize={11}
          textAnchor="end"
        />
      ) : null}

      {/* Bend 2 (upper) */}
      <MarkLine x1={x2 - MARK_HALF} y1={y2} x2={x2 + MARK_HALF} y2={y2} />
      <DiagramBendBadge x={x2 + 30} y={y2} order={2} />
      <DiagramLabel
        x={x2 + 22}
        y={y2 - 6}
        text={offsetCopy.diagram.mark2}
        variant="muted"
        fontSize={9.5}
        fontWeight="600"
        textAnchor="start"
      />
      {mark2Display ? (
        <DiagramLabel
          x={x2 + 22}
          y={y2 + 9}
          text={mark2Display}
          variant="default"
          fontSize={11}
          textAnchor="start"
        />
      ) : null}

      {/* Distance between bends — along the diagonal, on the right */}
      <DimensionLine x1={dbb1.x} y1={dbb1.y} x2={dbb2.x} y2={dbb2.y} />
      <DiagramLabel
        x={dbbLabelX}
        y={dbbLabelY - 6}
        text={offsetCopy.diagram.distanceBetweenBends}
        variant="muted"
        fontSize={9}
        fontWeight="600"
        textAnchor="start"
      />
      <DiagramLabel
        x={dbbLabelX}
        y={dbbLabelY + 9}
        text={data.display.distanceBetweenBends}
        variant="default"
        fontSize={11}
        textAnchor="start"
      />

      {/* Offset height — horizontal jog, below the runs */}
      <DimensionLine
        x1={x1}
        y1={offsetDimY}
        x2={x2}
        y2={offsetDimY}
        extensionLines={[
          { x1, y1: y1 + 12, x2: x1, y2: offsetDimY },
          { x1: x2, y1: y2 + 12, x2, y2: offsetDimY },
        ]}
      />
      <DiagramLabel
        x={offsetLabelX}
        y={offsetLabelY}
        text={`${offsetCopy.diagram.offsetHeight}  ${data.display.offsetHeight}`}
        variant="muted"
        fontSize={9.5}
        fontWeight="600"
        textAnchor="middle"
      />

      <DiagramCallout x={16} y={14} width={150} height={28}>
        <DiagramLabel
          x={28}
          y={32}
          text={`${offsetCopy.diagram.shrink}  ${data.display.shrink}`}
          variant="default"
          fontSize={10}
          textAnchor="start"
        />
      </DiagramCallout>
    </DiagramSvg>
  );
}
