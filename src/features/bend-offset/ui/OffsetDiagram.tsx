import {
  BendRadiusZone,
  DiagramBendBadge,
  DiagramCallout,
  DiagramCanvas,
  DiagramDefs,
  DiagramFieldCue,
  DiagramFlowArrow,
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

const { startX: START_X, bottomY: BOTTOM_Y } = OFFSET_DIAGRAM_LAYOUT;
const GHOST_PIPE = OFFSET_GHOST_PIPE;
const { ghost } = diagramTheme;

export type OffsetDiagramProps = {
  data?: OffsetDiagramData;
  isEmpty?: boolean;
  isInvalid?: boolean;
};

/** Feature diagram for Offset — built from shared SVG primitives. */
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
      <MarkLine x1={88} y1={218} x2={88} y2={242} opacity={ghost.markOpacity} />
      <MarkLine x1={192} y1={114} x2={192} y2={138} opacity={ghost.markOpacity} />
      <DimensionLine x1={88} y1={268} x2={192} y2={268} showArrows={false} opacity={ghost.dimensionOpacity} />
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
    topY,
    x1,
    x2,
    pipePath,
    bendZone1,
    bendZone2,
    dbb1,
    dbb2,
    dbbLabelX,
    dbbLabelY,
    offsetMidY,
    rise,
    cosA,
    sinA,
  } = geo;
  const nx = sinA;
  const ny = cosA;

  return (
    <DiagramSvg viewBox={OFFSET_CONFIG.diagramViewBox}>
      <DiagramDefs gradientId="offsetPipeGradient" />
      <DiagramCanvas />

      <PipeSegment d={pipePath} variant="shadow" />
      <PipeSegment d={pipePath} variant="pipe" gradientId="offsetPipeGradient" />

      <BendRadiusZone d={bendZone1} glowWidth={18} />
      <BendRadiusZone d={bendZone2} glowWidth={18} />

      <DiagramBendBadge x={x1} y={BOTTOM_Y - 22} order={1} />
      <DiagramBendBadge x={x2} y={topY - 22} order={2} />
      <DiagramFlowArrow x={START_X - 6} y={BOTTOM_Y} />

      <MarkLine x1={x1} y1={BOTTOM_Y - 12} x2={x1} y2={BOTTOM_Y + 12} />
      <DiagramLabel
        x={x1}
        y={262}
        text={offsetCopy.diagram.mark1}
        variant="muted"
        fontSize={9.5}
        fontWeight="600"
      />
      {mark1Display ? (
        <DiagramLabel x={x1} y={276} text={mark1Display} variant="default" fontSize={11} />
      ) : null}

      <MarkLine x1={x2} y1={topY - 12} x2={x2} y2={topY + 12} />
      <DiagramLabel
        x={x2}
        y={topY - 30}
        text={offsetCopy.diagram.mark2}
        variant="muted"
        fontSize={9.5}
        fontWeight="600"
      />
      {mark2Display ? (
        <DiagramLabel x={x2} y={topY - 16} text={mark2Display} variant="default" fontSize={11} />
      ) : null}

      <DimensionLine
        x1={dbb1.x}
        y1={dbb1.y}
        x2={dbb2.x}
        y2={dbb2.y}
        extensionLines={[
          { x1: x1 + nx * 8, y1: BOTTOM_Y + ny * 8, x2: x1 + nx * 30, y2: BOTTOM_Y + ny * 30 },
          { x1: x2 + nx * 8, y1: topY + ny * 8, x2: x2 + nx * 30, y2: topY + ny * 30 },
        ]}
      />
      <DiagramLabel
        x={dbbLabelX}
        y={dbbLabelY}
        text={offsetCopy.diagram.distanceBetweenBends}
        variant="muted"
        fontSize={9.5}
        fontWeight="600"
      />
      <DiagramLabel
        x={dbbLabelX}
        y={dbbLabelY + 14}
        text={data.display.distanceBetweenBends}
        variant="default"
        fontSize={11}
      />

      <DimensionLine
        x1={52}
        y1={BOTTOM_Y}
        x2={52}
        y2={topY}
        showArrows={rise >= 28}
        extensionLines={[
          { x1: START_X, y1: BOTTOM_Y, x2: 80, y2: BOTTOM_Y },
          { x1: START_X, y1: topY, x2: 80, y2: topY },
        ]}
      />
      <DiagramLabel
        x={12}
        y={offsetMidY - 28}
        text={offsetCopy.diagram.offsetHeight}
        variant="muted"
        fontSize={9.5}
        fontWeight="600"
        rotation={-90}
      />
      <DiagramLabel
        x={12}
        y={offsetMidY + 28}
        text={data.display.offsetHeight}
        variant="default"
        fontSize={10.5}
        rotation={-90}
      />

      <DiagramCallout x={214} y={16} width={132} height={28}>
        <DiagramLabel
          x={228}
          y={34}
          text={`${offsetCopy.diagram.shrink}  ${data.display.shrink}`}
          variant="default"
          fontSize={10}
          textAnchor="start"
        />
      </DiagramCallout>

      <DiagramLabel
        x={346}
        y={292}
        text={`${offsetCopy.diagram.title} • ${data.bendAngle}°`}
        variant="muted"
        fontSize={10}
        fontWeight="600"
        textAnchor="end"
      />
      <DiagramFieldCue text={offsetCopy.diagram.fieldCue} />
    </DiagramSvg>
  );
}
