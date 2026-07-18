import { Ellipse, G, Line, Text as SvgText } from 'react-native-svg';

import {
  BendRadiusZone,
  DiagramCanvas,
  DiagramDefs,
  DiagramFieldCue,
  DiagramFrame,
  DiagramGhostMessage,
  DiagramLabel,
  DiagramSvg,
  PipeSegment,
  useDiagramTheme,
} from '@/shared/diagrams';

import {
  PARALLEL_OFFSET_DIAGRAM_LAYOUT,
  buildParallelOffsetDiagramGeometry,
  type ParallelOffsetDiagramGeometry,
  type ParallelOffsetPipeGeometry,
} from '../diagram/parallelOffsetDiagramGeometry';
import type { ParallelOffsetDiagramData } from '../engine/parallelOffset.types';
import { PARALLEL_OFFSET_CONFIG } from '../parallelOffset.config';
import { parallelOffsetCopy } from '../parallelOffset.copy';

const PIPE_STROKE = 15;

type MarkProps = {
  point: { x: number; y: number };
  angle: number;
  ghost?: boolean;
};

function ParallelMark({ point, angle, ghost = false }: MarkProps) {
  const theme = useDiagramTheme();
  return (
    <G opacity={ghost ? 0.42 : 1} transform={`rotate(${-angle / 2} ${point.x} ${point.y})`}>
      <Ellipse
        cx={point.x}
        cy={point.y}
        rx={2}
        ry={7.5}
        fill="none"
        stroke={theme.markGlow}
        strokeWidth={3}
      />
      <Ellipse
        cx={point.x}
        cy={point.y}
        rx={1.9}
        ry={7.5}
        fill="none"
        stroke={theme.mark}
        strokeWidth={1.25}
      />
    </G>
  );
}

function PipeEndCaps({ pipe, ghost = false }: { pipe: ParallelOffsetPipeGeometry; ghost?: boolean }) {
  const theme = useDiagramTheme();
  return (
    <G opacity={ghost ? 0.48 : 1}>
      {[
        { x: PARALLEL_OFFSET_DIAGRAM_LAYOUT.startX, y: pipe.y },
        { x: PARALLEL_OFFSET_DIAGRAM_LAYOUT.endX, y: pipe.topY },
      ].map((point, index) => (
        <G key={`cap-${pipe.conduitNumber}-${index}`}>
          <Ellipse
            cx={point.x}
            cy={point.y}
            rx={2.7}
            ry={6.9}
            fill={theme.pipe}
            stroke={theme.pipeSheen}
            strokeWidth={0.65}
          />
          <Ellipse
            cx={point.x}
            cy={point.y}
            rx={1.75}
            ry={4.8}
            fill={theme.endCap.fill}
            stroke={theme.endCap.stroke}
            strokeWidth={0.55}
          />
        </G>
      ))}
    </G>
  );
}

function RackDimensions({
  geometry,
  data,
}: {
  geometry: ParallelOffsetDiagramGeometry;
  data: ParallelOffsetDiagramData;
}) {
  const theme = useDiagramTheme();
  const first = geometry.pipes[0];
  const second = geometry.pipes[1];
  const shiftMid = {
    x: (first.mark1.x + second.mark1.x) / 2,
    y: (first.mark1.y + second.mark1.y) / 2,
  };
  const spacingX = geometry.directionSign === -1 ? 29 : 326;
  const labelX = geometry.directionSign === -1 ? 20 : 337;
  const shiftLabel = { x: 270, y: 26 };

  return (
    <G>
      <Line
        x1={spacingX}
        y1={first.y}
        x2={spacingX}
        y2={second.y}
        stroke={theme.dimensionStrong}
        strokeWidth={1}
        opacity={0.72}
      />
      {[first.y, second.y].map((y, index) => (
        <Line
          key={`spacing-tick-${index}`}
          x1={spacingX - 3}
          y1={y}
          x2={spacingX + 3}
          y2={y}
          stroke={theme.dimensionStrong}
          strokeWidth={0.9}
          opacity={0.72}
        />
      ))}
      <SvgText
        x={labelX}
        y={(first.y + second.y) / 2 + 3}
        fill={theme.mutedLabel}
        fontSize={7.2}
        fontWeight="700"
        textAnchor="middle"
        transform={`rotate(-90 ${labelX} ${(first.y + second.y) / 2 + 3})`}>
        C-C {data.display.centerSpacing}
      </SvgText>

      <Line
        x1={shiftLabel.x - 36}
        y1={shiftLabel.y + 5}
        x2={shiftMid.x}
        y2={shiftMid.y}
        stroke={theme.dimensionStrong}
        strokeWidth={0.65}
        strokeDasharray="2 3"
        opacity={0.46}
      />
      <Ellipse cx={shiftMid.x} cy={shiftMid.y} rx={1.2} ry={1.2} fill={theme.mark} />
      <DiagramLabel
        x={shiftLabel.x}
        y={shiftLabel.y - 2}
        text="SHIFT PER PIPE"
        variant="muted"
        fontSize={7.8}
        textAnchor="middle"
      />
      <DiagramLabel
        x={shiftLabel.x}
        y={shiftLabel.y + 13}
        text={data.display.adjustmentPerConduit}
        variant="mark"
        fontSize={12.5}
        textAnchor="middle"
      />
    </G>
  );
}

export type ParallelOffsetDiagramProps = {
  data?: ParallelOffsetDiagramData;
  mode: 'simple' | 'layout';
  bendAngle: number;
  isEmpty?: boolean;
  isInvalid?: boolean;
};

export function ParallelOffsetDiagram({
  data,
  mode,
  bendAngle,
  isEmpty = false,
  isInvalid = false,
}: ParallelOffsetDiagramProps) {
  const showLive = Boolean(data) && !isEmpty && !isInvalid;
  const message = isInvalid
    ? parallelOffsetCopy.diagram.invalid
    : mode === 'simple'
      ? parallelOffsetCopy.diagram.emptySimple
      : parallelOffsetCopy.diagram.emptyLayout;

  return (
    <DiagramFrame>
      {showLive ? (
        <LiveDiagram data={data!} />
      ) : (
        <GhostDiagram mode={mode} bendAngle={bendAngle} message={message} invalid={isInvalid} />
      )}
    </DiagramFrame>
  );
}

function GhostDiagram({
  mode,
  bendAngle,
  message,
  invalid,
}: {
  mode: 'simple' | 'layout';
  bendAngle: number;
  message: string;
  invalid?: boolean;
}) {
  const theme = useDiagramTheme();
  const geometry = buildParallelOffsetDiagramGeometry({
    mode,
    bendAngleDeg: bendAngle,
    conduitCount: 4,
    shiftDirection: 'toward-free-end',
  });

  return (
    <DiagramSvg viewBox={PARALLEL_OFFSET_CONFIG.diagramViewBox}>
      <DiagramDefs gradientId="parallelGhostGradient" ghost />
      <DiagramCanvas />
      {geometry.pipes.map((pipe) => (
        <G key={pipe.conduitNumber} opacity={theme.ghost.pipeShadowOpacity}>
          <PipeSegment d={pipe.pipePath} variant="shadow" strokeWidth={18} opacity={0.28} />
          <PipeSegment
            d={pipe.pipePath}
            variant="pipe"
            strokeWidth={PIPE_STROKE}
            gradientId="parallelGhostGradient"
            material="satin"
            lineCap="butt"
          />
          <PipeEndCaps pipe={pipe} ghost />
          <ParallelMark point={pipe.mark1} angle={bendAngle} ghost />
          <ParallelMark point={pipe.mark2} angle={bendAngle} ghost />
        </G>
      ))}
      <DiagramGhostMessage text={message} invalid={invalid} />
    </DiagramSvg>
  );
}

function LiveDiagram({ data }: { data: ParallelOffsetDiagramData }) {
  const theme = useDiagramTheme();
  const geometry = buildParallelOffsetDiagramGeometry({
    mode: data.mode,
    bendAngleDeg: data.bendAngle,
    conduitCount: data.conduitCount,
    shiftDirection: data.shiftDirection,
  });
  const cue =
    data.mode === 'simple'
      ? parallelOffsetCopy.diagram.fieldCueSimple
      : data.shiftDirection === 'toward-free-end'
        ? parallelOffsetCopy.diagram.fieldCueToward
        : parallelOffsetCopy.diagram.fieldCueAway;

  return (
    <DiagramSvg viewBox={PARALLEL_OFFSET_CONFIG.diagramViewBox}>
      <DiagramDefs gradientId="parallelPipeGradient" />
      <DiagramCanvas />
      <RackDimensions geometry={geometry} data={data} />

      {geometry.pipes.map((pipe, index) => (
        <G key={pipe.conduitNumber}>
          <PipeSegment d={pipe.pipePath} variant="shadow" strokeWidth={19} opacity={0.2} />
          <PipeSegment
            d={pipe.pipePath}
            variant="pipe"
            strokeWidth={PIPE_STROKE}
            gradientId="parallelPipeGradient"
            material="satin"
            lineCap="butt"
          />
          <BendRadiusZone d={pipe.bendZone1} glowWidth={11} />
          <BendRadiusZone d={pipe.bendZone2} glowWidth={11} />
          <PipeEndCaps pipe={pipe} />
          <ParallelMark point={pipe.mark1} angle={data.bendAngle} />
          <ParallelMark point={pipe.mark2} angle={data.bendAngle} />
          <SvgText
            x={pipe.mark1.x - 16}
            y={pipe.mark1.y + 2.5}
            fill={theme.label}
            fontSize={7}
            fontWeight="800"
            textAnchor="middle"
            opacity={0.86}>
            P{index + 1}
          </SvgText>
        </G>
      ))}

      <DiagramLabel
        x={65}
        y={24}
        text={`${data.bendAngle}° × 2`}
        variant="strong"
        fontSize={11}
        textAnchor="middle"
      />
      <Line
        x1={83}
        y1={25}
        x2={geometry.pipes[0].x2}
        y2={geometry.pipes[0].topY}
        stroke={theme.bendZone.stroke}
        strokeWidth={0.7}
        strokeDasharray="2 3"
        opacity={0.44}
      />
      <DiagramFieldCue text={cue} />
    </DiagramSvg>
  );
}

