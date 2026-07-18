import { Ellipse, G } from 'react-native-svg';

import {
  BendRadiusZone,
  DiagramCanvas,
  DiagramDefs,
  DiagramFieldCue,
  DiagramFrame,
  DiagramGhostMessage,
  DiagramLabel,
  DiagramLeaderLine,
  DiagramSvg,
  DimensionLine,
  PipeSegment,
  useDiagramTheme,
} from '@/shared/diagrams';

import {
  buildBackToBackDiagramGeometry,
  type BackToBackDiagramGeometry,
} from '../diagram/backToBackDiagramGeometry';
import type { BackToBackDiagramData } from '../engine/backToBack.types';
import { BACK_TO_BACK_CONFIG } from '../backToBack.config';
import { backToBackCopy } from '../backToBack.copy';

function MarkCollar({
  x,
  y,
  direction,
  ghost = false,
}: {
  x: number;
  y: number;
  direction: 'horizontal' | 'vertical';
  ghost?: boolean;
}) {
  const theme = useDiagramTheme();
  const rx = direction === 'horizontal' ? 2.15 : 9.2;
  const ry = direction === 'horizontal' ? 9.2 : 2.15;

  return (
    <G opacity={ghost ? 0.38 : 1}>
      <Ellipse
        cx={x}
        cy={y}
        rx={rx}
        ry={ry}
        fill="none"
        stroke={theme.markGlow}
        strokeWidth={2.7}
        opacity={0.34}
      />
      <Ellipse
        cx={x}
        cy={y}
        rx={rx}
        ry={ry}
        fill="none"
        stroke={theme.mark}
        strokeWidth={1.4}
      />
    </G>
  );
}

function EndCaps({ geo, ghost = false }: { geo: BackToBackDiagramGeometry; ghost?: boolean }) {
  const theme = useDiagramTheme();

  return (
    <G opacity={ghost ? 0.48 : 1}>
      {[geo.leftX, geo.rightX].map((x, index) => (
        <G key={`end-${index}`}>
          <Ellipse
            cx={x}
            cy={geo.bottomY}
            rx={9.1}
            ry={3.4}
            fill={theme.pipe}
            stroke={theme.pipeSheen}
            strokeWidth={0.75}
          />
          <Ellipse
            cx={x}
            cy={geo.bottomY}
            rx={6.55}
            ry={2.35}
            fill={theme.endCap.fill}
            stroke={theme.endCap.stroke}
            strokeWidth={0.65}
          />
        </G>
      ))}
    </G>
  );
}

function DistanceVector({ geo, value }: { geo: BackToBackDiagramGeometry; value: string }) {
  const y = 43;

  return (
    <G>
      <DimensionLine
        x1={geo.leftX}
        y1={y}
        x2={geo.rightX}
        y2={y}
        extensionLines={[
          { x1: geo.leftX, y1: y + 5, x2: geo.leftX, y2: geo.topY - 8 },
          { x1: geo.rightX, y1: y + 5, x2: geo.rightX, y2: geo.topY - 8 },
        ]}
        opacity={0.86}
      />
      <DiagramLabel
        x={180}
        y={17}
        text={backToBackCopy.diagram.backToBackDistance.toUpperCase()}
        variant="muted"
        fontSize={8.2}
      />
      <DiagramLabel x={180} y={33} text={value} variant="strong" fontSize={12.4} />
    </G>
  );
}

function FirstStubVector({ geo, value }: { geo: BackToBackDiagramGeometry; value: string }) {
  const x = Math.max(19, geo.leftX - 28);

  return (
    <G>
      <DimensionLine
        x1={x}
        y1={geo.topY}
        x2={x}
        y2={geo.bottomY}
        extensionLines={[
          { x1: x + 5, y1: geo.topY, x2: geo.leftX - 9, y2: geo.topY },
          { x1: x + 5, y1: geo.bottomY, x2: geo.leftX - 9, y2: geo.bottomY },
        ]}
        opacity={0.66}
      />
      <DiagramLabel
        x={x}
        y={geo.bottomY + 22}
        text={`${backToBackCopy.diagram.firstStub.toUpperCase()}  ${value}`}
        variant="strong"
        fontSize={8.4}
        textAnchor="start"
      />
    </G>
  );
}

function MarkLabels({ geo, firstMark }: { geo: BackToBackDiagramGeometry; firstMark?: string }) {
  const arrowLabelX = geo.leftX + 34;
  const arrowLabelY = geo.arrowMark.y + 28;
  const starLabelX = geo.rightX - 28;
  const starLabelY = geo.topY + 43;

  return (
    <G>
      <DiagramLeaderLine
        x1={geo.arrowMark.x + 4}
        y1={geo.arrowMark.y + 3}
        x2={arrowLabelX - 9}
        y2={arrowLabelY - 7}
        opacity={0.48}
      />
      <DiagramLabel
        x={arrowLabelX}
        y={arrowLabelY}
        text={backToBackCopy.diagram.arrowMark.toUpperCase()}
        variant="mark"
        fontSize={8.2}
      />
      {firstMark ? (
        <DiagramLabel
          x={arrowLabelX}
          y={arrowLabelY + 13}
          text={`FROM END  ${firstMark}`}
          variant="muted"
          fontSize={7.6}
        />
      ) : null}

      <DiagramLeaderLine
        x1={geo.starMark.x}
        y1={geo.starMark.y + 4}
        x2={starLabelX}
        y2={starLabelY - 9}
        opacity={0.48}
      />
      <DiagramLabel
        x={starLabelX}
        y={starLabelY}
        text={backToBackCopy.diagram.starMark.toUpperCase()}
        variant="mark"
        fontSize={8.2}
      />
    </G>
  );
}

export type BackToBackDiagramProps = {
  data?: BackToBackDiagramData;
  isEmpty?: boolean;
  isInvalid?: boolean;
};

export function BackToBackDiagram({
  data,
  isEmpty = false,
  isInvalid = false,
}: BackToBackDiagramProps) {
  const message = isInvalid
    ? backToBackCopy.diagram.invalidMessage
    : backToBackCopy.diagram.emptyMessage;

  return (
    <DiagramFrame>
      {!data || isEmpty || isInvalid ? (
        <GhostDiagram message={message} invalid={isInvalid} />
      ) : (
        <LiveDiagram data={data} />
      )}
    </DiagramFrame>
  );
}

function GhostDiagram({ message, invalid }: { message: string; invalid?: boolean }) {
  const theme = useDiagramTheme();
  const geo = buildBackToBackDiagramGeometry({
    backToBackDistanceInches: 36,
    firstStubLengthInches: 12,
  });

  return (
    <DiagramSvg viewBox={BACK_TO_BACK_CONFIG.diagramViewBox}>
      <DiagramDefs gradientId="backToBackGhostGradient" ghost />
      <DiagramCanvas />
      <PipeSegment d={geo.pipePath} variant="shadow" opacity={theme.ghost.pipeShadowOpacity} />
      <PipeSegment
        d={geo.pipePath}
        gradientId="backToBackGhostGradient"
        material="satin"
        lineCap="butt"
      />
      <EndCaps geo={geo} ghost />
      <MarkCollar {...geo.arrowMark} direction="vertical" ghost />
      <MarkCollar {...geo.starMark} direction="horizontal" ghost />
      <DiagramGhostMessage text={message} invalid={invalid} />
    </DiagramSvg>
  );
}

function LiveDiagram({ data }: { data: BackToBackDiagramData }) {
  const geo = buildBackToBackDiagramGeometry({
    backToBackDistanceInches: data.backToBackDistanceInches,
    firstStubLengthInches: data.firstStubLengthInches,
  });

  return (
    <DiagramSvg viewBox={BACK_TO_BACK_CONFIG.diagramViewBox}>
      <DiagramDefs gradientId="backToBackPipeGradient" />
      <DiagramCanvas />
      <DistanceVector geo={geo} value={data.display.backToBackDistance} />
      {data.display.firstStubLength ? (
        <FirstStubVector geo={geo} value={data.display.firstStubLength} />
      ) : null}

      <PipeSegment d={geo.pipePath} variant="shadow" strokeWidth={23} opacity={0.22} />
      <PipeSegment
        d={geo.pipePath}
        gradientId="backToBackPipeGradient"
        material="satin"
        lineCap="butt"
      />
      <BendRadiusZone d={geo.firstBendPath} glowWidth={15} />
      <BendRadiusZone d={geo.secondBendPath} glowWidth={15} />
      <EndCaps geo={geo} />

      <MarkCollar {...geo.arrowMark} direction="vertical" />
      <MarkCollar {...geo.starMark} direction="horizontal" />
      <MarkLabels geo={geo} firstMark={data.display.firstDeductMark} />

      <DiagramFieldCue text={backToBackCopy.diagram.fieldCue} y={293} />
    </DiagramSvg>
  );
}
