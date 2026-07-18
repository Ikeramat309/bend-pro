import { Ellipse, G, Line, Path, Polygon } from 'react-native-svg';

import {
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
import { formatLength } from '@/utils/formatLength';
import type { RoundingOption, UnitSystem } from '@/core/types';

import { buildMultipleBendsDiagramGeometry } from '../diagram/multipleBendsDiagramGeometry';
import type { MultipleBendsDiagramData, MultipleBendsLayoutMark } from '../engine/multipleBends.types';
import { MULTIPLE_BENDS_CONFIG } from '../multipleBends.config';
import { multipleBendsCopy } from '../multipleBends.copy';

export type MultipleBendsDiagramProps = {
  data: MultipleBendsDiagramData;
  unitSystem: UnitSystem;
  roundingPrecision: RoundingOption;
  isEmpty?: boolean;
};

function displayLength(value: number | null, unit: UnitSystem, rounding: RoundingOption): string {
  return value === null ? '—' : formatLength(value, unit, rounding);
}

function EndCaps({ startX, endX, y }: { startX: number; endX: number; y: number }) {
  const theme = useDiagramTheme();
  return (
    <G>
      {[startX, endX].map((x) => (
        <G key={x}>
          <Ellipse cx={x} cy={y} rx={3.3} ry={9.1} fill={theme.pipe} stroke={theme.pipeSheen} strokeWidth={0.7} />
          <Ellipse cx={x} cy={y} rx={2.2} ry={6.4} fill={theme.endCap.fill} stroke={theme.endCap.stroke} strokeWidth={0.65} />
        </G>
      ))}
    </G>
  );
}

function MarkGlyph({
  mark,
  x,
  y,
  labelY,
  cueY,
}: {
  mark: MultipleBendsLayoutMark;
  x: number;
  y: number;
  labelY: number;
  cueY: number;
}) {
  const theme = useDiagramTheme();
  const problem = mark.state !== 'ok';
  const stroke = problem ? theme.obstruction.stroke : theme.mark;
  const label = `${mark.layoutOrder}`;

  return (
    <G>
      {mark.kind === 'bend' ? (
        <>
          <Ellipse cx={x} cy={y} rx={2.2} ry={10.2} fill="none" stroke={stroke} strokeWidth={2.2} />
          <Polygon
            points={
              mark.direction === 'down'
                ? `${x - 4},${cueY - 3} ${x + 4},${cueY - 3} ${x},${cueY + 4}`
                : `${x - 4},${cueY + 3} ${x + 4},${cueY + 3} ${x},${cueY - 4}`
            }
            fill={theme.bendZone.stroke}
          />
          {mark.flip ? (
            <DiagramLabel x={x + 9} y={cueY + 3} text="F" variant="muted" fontSize={7.5} fontWeight="700" />
          ) : null}
        </>
      ) : (
        <>
          <Line x1={x - 4} y1={y - 11} x2={x + 4} y2={y + 11} stroke={stroke} strokeWidth={2} />
          <Line x1={x + 3} y1={y - 11} x2={x + 11} y2={y + 11} stroke={stroke} strokeWidth={2} />
        </>
      )}
      <Line x1={x} y1={y + (labelY < y ? -12 : 12)} x2={x} y2={labelY < y ? labelY + 7 : labelY - 12} stroke={theme.dimension} strokeWidth={0.8} />
      <DiagramLabel
        x={x}
        y={labelY}
        text={problem ? `!${label}` : label}
        variant={problem ? 'strong' : 'mark'}
        fontSize={9}
        fontWeight="700"
      />
      {mark.kind === 'bend' ? (
        <DiagramLabel x={x} y={labelY + 11} text={`${mark.angleDegrees ?? 0}°`} variant="muted" fontSize={7.3} />
      ) : (
        <DiagramLabel x={x} y={labelY + 11} text="CUT" variant="muted" fontSize={7.3} />
      )}
    </G>
  );
}

export function MultipleBendsDiagram({
  data,
  unitSystem,
  roundingPrecision,
  isEmpty = false,
}: MultipleBendsDiagramProps) {
  const theme = useDiagramTheme();
  const geo = buildMultipleBendsDiagramGeometry(data);
  const pipePath = `M ${geo.startX} ${geo.pipeY} L ${geo.endX} ${geo.pipeY}`;

  return (
    <DiagramFrame>
      <DiagramSvg viewBox={MULTIPLE_BENDS_CONFIG.diagramViewBox}>
        <DiagramDefs gradientId="multipleBendsPipeGradient" />
        <DiagramCanvas />
        <PipeSegment d={pipePath} variant="shadow" strokeWidth={23} opacity={0.2} />
        <PipeSegment d={pipePath} gradientId="multipleBendsPipeGradient" material="satin" lineCap="butt" />
        <EndCaps startX={geo.startX} endX={geo.endX} y={geo.pipeY} />

        <DiagramLabel x={geo.startX} y={25} text="START" variant="muted" fontSize={8} textAnchor="start" />
        <DiagramLabel
          x={geo.endX}
          y={25}
          text={displayLength(data.totalLengthInches, unitSystem, roundingPrecision)}
          variant="strong"
          fontSize={9}
          textAnchor="end"
        />

        {geo.marks.map((markGeo) => {
          const mark = data.marks.find((candidate) => candidate.id === markGeo.id);
          if (!mark) return null;
          return (
            <G key={mark.id}>
              <MarkGlyph mark={mark} x={markGeo.x} y={geo.pipeY} labelY={markGeo.labelY} cueY={markGeo.cueY} />
              {markGeo.isOverflow ? (
                <Path
                  d={`M ${markGeo.x - 7} 202 L ${markGeo.x + 7} 202 L ${markGeo.x} 190 Z`}
                  fill={theme.obstruction.stroke}
                />
              ) : null}
            </G>
          );
        })}

        {data.marks.length <= 7
          ? data.marks.slice(1).map((mark, index) => {
              const left = geo.marks[index];
              const right = geo.marks[index + 1];
              if (!left || !right || mark.gapFromPreviousInches === null || right.x - left.x < 30) return null;
              const centerX = (left.x + right.x) / 2;
              return (
                <G key={`gap-${mark.id}`}>
                  <Line x1={left.x + 5} y1={220} x2={right.x - 5} y2={220} stroke={theme.dimension} strokeWidth={0.8} />
                  <DiagramLabel
                    x={centerX}
                    y={216}
                    text={displayLength(mark.gapFromPreviousInches, unitSystem, roundingPrecision)}
                    variant="muted"
                    fontSize={7.6}
                  />
                </G>
              );
            })
          : null}

        {isEmpty ? (
          <DiagramGhostMessage text={multipleBendsCopy.diagram.empty} y={202} />
        ) : (
          <DiagramFieldCue text={multipleBendsCopy.diagram.fieldCue} y={246} />
        )}
      </DiagramSvg>
    </DiagramFrame>
  );
}
