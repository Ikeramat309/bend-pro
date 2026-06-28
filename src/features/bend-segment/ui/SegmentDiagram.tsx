import { Circle } from 'react-native-svg';

import {
  DiagramBendBadge,
  DiagramCallout,
  DiagramCanvas,
  DiagramDefs,
  DiagramFieldCue,
  DiagramFrame,
  DiagramGhostMessage,
  DiagramLabel,
  DiagramLeaderLine,
  DiagramSvg,
  MarkLine,
  PipeSegment,
  useDiagramTheme,
} from '@/shared/diagrams';
import type { SegmentDiagramData } from '../engine/segment.types';
import { SEGMENT_CONFIG } from '../segment.config';
import { segmentCopy } from '../segment.copy';

/** Arc center and size, in viewBox units. */
const CX = 150;
const CY = 84;
const R_PX = 92;
const LEAD_IN = 96;
const LEAD_OUT = 64;
const TICK_HALF = 13;

const GHOST_PIPE =
  'M 54 176 L 150 176 L 158 175 L 178 168 L 205 150 L 226 124 L 238 96 L 242 84 L 242 20';

/** Point on the bend arc at angle t (radians from the horizontal-tangent start). */
function arcPoint(t: number): { x: number; y: number } {
  return { x: CX + R_PX * Math.sin(t), y: CY + R_PX * Math.cos(t) };
}

export type SegmentDiagramProps = {
  data?: SegmentDiagramData;
  isEmpty?: boolean;
  isInvalid?: boolean;
};

/** Feature diagram for Segment Bend — built from shared SVG primitives. */
export function SegmentDiagram({ data, isEmpty = false, isInvalid = false }: SegmentDiagramProps) {
  const message = isInvalid ? segmentCopy.diagram.invalidMessage : segmentCopy.diagram.emptyMessage;

  return (
    <DiagramFrame>
      {!data || isEmpty || isInvalid ? (
        <SegmentGhostDiagram message={message} invalid={isInvalid} />
      ) : (
        <SegmentLiveDiagram data={data} />
      )}
    </DiagramFrame>
  );
}

function SegmentGhostDiagram({ message, invalid }: { message: string; invalid?: boolean }) {
  const theme = useDiagramTheme();

  return (
    <DiagramSvg viewBox={SEGMENT_CONFIG.diagramViewBox}>
      <DiagramDefs gradientId="segmentGhostGradient" ghost />
      <DiagramCanvas />
      <PipeSegment d={GHOST_PIPE} variant="shadow" opacity={theme.ghost.pipeShadowOpacity} />
      <PipeSegment d={GHOST_PIPE} variant="pipe" gradientId="segmentGhostGradient" />
      <DiagramGhostMessage text={message} invalid={invalid} y={SEGMENT_CONFIG.diagramHeight - 14} />
    </DiagramSvg>
  );
}

function SegmentLiveDiagram({ data }: { data: SegmentDiagramData }) {
  const theme = useDiagramTheme();
  const totalRad = (data.totalAngle * Math.PI) / 180;
  // Cap the drawn sweep so very large angles still fit the frame; the labels
  // carry the true numbers.
  const sweep = Math.min(totalRad, (135 * Math.PI) / 180);
  const segRad = sweep / Math.max(1, data.numberOfBends);

  // Pipe centerline: straight lead-in → sampled arc → straight lead-out.
  const start = arcPoint(0);
  const end = arcPoint(sweep);
  const steps = Math.max(8, Math.ceil((sweep * 180) / Math.PI / 3));
  let path = `M ${start.x - LEAD_IN} ${start.y} L ${start.x} ${start.y}`;
  for (let i = 1; i <= steps; i += 1) {
    const p = arcPoint((sweep * i) / steps);
    path += ` L ${p.x} ${p.y}`;
  }
  const tangentX = end.x + LEAD_OUT * Math.cos(sweep);
  const tangentY = end.y - LEAD_OUT * Math.sin(sweep);
  path += ` L ${tangentX} ${tangentY}`;

  // Evenly spaced shot ticks. Thin them only for visual sanity on huge counts.
  const drawnCount = Math.min(data.numberOfBends, SEGMENT_CONFIG.maxRenderedTicks);
  const ratio = data.numberOfBends / drawnCount;
  const ticks = Array.from({ length: drawnCount }, (_, k) => {
    const i = Math.round((k + 0.5) * ratio - 0.5);
    return (i + 0.5) * segRad;
  });

  // Radius leader to the middle of the arc.
  const mid = arcPoint(sweep / 2);
  const labelPos = arcPoint(sweep / 2);
  const rLabelX = CX + (labelPos.x - CX) * 0.55;
  const rLabelY = CY + (labelPos.y - CY) * 0.55;

  // Between-bends callout: leader to the gap between two middle ticks.
  const midIdx = Math.floor(ticks.length / 2);
  const gapT = (ticks[Math.max(0, midIdx - 1)] + ticks[Math.min(ticks.length - 1, midIdx)]) / 2;
  const gapPoint = arcPoint(gapT);
  const gapOuter = {
    x: gapPoint.x + 26 * Math.sin(gapT),
    y: gapPoint.y + 26 * Math.cos(gapT),
  };

  return (
    <DiagramSvg viewBox={SEGMENT_CONFIG.diagramViewBox}>
      <DiagramDefs gradientId="segmentPipeGradient" />
      <DiagramCanvas />

      <PipeSegment d={path} variant="shadow" />
      <PipeSegment d={path} variant="pipe" gradientId="segmentPipeGradient" />

      {/* Radius leader + center pivot. */}
      <Circle cx={CX} cy={CY} r={2.5} fill={theme.dimension} />
      <DiagramLeaderLine x1={CX} y1={CY} x2={mid.x} y2={mid.y} opacity={0.7} />
      <DiagramLabel
        x={rLabelX + 8}
        y={rLabelY}
        text={`${segmentCopy.diagram.radius} ${data.display.radius}`}
        variant="muted"
        fontSize={10}
        fontWeight="600"
        textAnchor="start"
      />

      {/* Shot ticks. */}
      {ticks.map((t, i) => {
        const p = arcPoint(t);
        const nx = Math.sin(t);
        const ny = Math.cos(t);

        return (
          <MarkLine
            key={i}
            x1={p.x - TICK_HALF * nx}
            y1={p.y - TICK_HALF * ny}
            x2={p.x + TICK_HALF * nx}
            y2={p.y + TICK_HALF * ny}
            opacity={0.85}
          />
        );
      })}
      {ticks.length > 0 ? (
        <>
          <DiagramBendBadge
            x={arcPoint(ticks[0]).x + Math.sin(ticks[0]) * 18}
            y={arcPoint(ticks[0]).y + Math.cos(ticks[0]) * 18}
            order={1}
            primary
          />
          {data.numberOfBends > 1 ? (
            <DiagramBendBadge
              x={
                arcPoint(ticks[ticks.length - 1]).x +
                Math.sin(ticks[ticks.length - 1]) * 18
              }
              y={
                arcPoint(ticks[ticks.length - 1]).y +
                Math.cos(ticks[ticks.length - 1]) * 18
              }
              order={data.numberOfBends}
            />
          ) : null}
        </>
      ) : null}

      {/* Between-bends spacing callout. */}
      <DiagramLeaderLine x1={gapPoint.x} y1={gapPoint.y} x2={gapOuter.x} y2={gapOuter.y} opacity={0.7} />
      <DiagramCallout x={gapOuter.x - 4} y={gapOuter.y - 2} width={56} height={22}>
        <DiagramLabel
          x={gapOuter.x + 24}
          y={gapOuter.y + 13}
          text={data.display.spacing}
          variant="default"
          fontSize={10.5}
        />
      </DiagramCallout>

      {/* Bend recipe — total angle and shot count, off the pipe. */}
      <DiagramCallout x={16} y={14} width={150} height={26}>
        <DiagramLabel
          x={30}
          y={31}
          text={`${data.display.totalAngle} bend · ${data.display.numberOfBends} × ${data.display.degreesPerBend}`}
          variant="default"
          fontSize={10}
          fontWeight="700"
          textAnchor="start"
        />
      </DiagramCallout>
      <DiagramFieldCue text={segmentCopy.diagram.fieldCue} />
    </DiagramSvg>
  );
}
