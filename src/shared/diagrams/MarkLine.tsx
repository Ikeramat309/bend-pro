import { G, Line } from 'react-native-svg';

import { DiagramLabel, type DiagramLabelVariant } from './DiagramLabel';
import { diagramMetrics } from './diagramTheme';
import { useDiagramTheme } from './useDiagramTheme';

export type MarkLineProps = {
  x1: number;
  y1: number;
  x2: number;
  y2: number;
  label?: string;
  labelX?: number;
  labelY?: number;
  labelVariant?: DiagramLabelVariant;
  opacity?: number;
};

/** Bend mark tick on the pipe — orange for visibility. */
export function MarkLine({
  x1,
  y1,
  x2,
  y2,
  label,
  labelX,
  labelY,
  labelVariant = 'muted',
  opacity = 1,
}: MarkLineProps) {
  const theme = useDiagramTheme();

  return (
    <G opacity={opacity}>
      <Line
        x1={x1}
        y1={y1}
        x2={x2}
        y2={y2}
        stroke={theme.markGlow}
        strokeWidth={diagramMetrics.markStroke + 5}
        strokeLinecap="round"
      />
      <Line
        x1={x1}
        y1={y1}
        x2={x2}
        y2={y2}
        stroke={theme.mark}
        strokeWidth={diagramMetrics.markStroke}
        strokeLinecap="round"
      />
      {label && labelX != null && labelY != null ? (
        <DiagramLabel
          x={labelX}
          y={labelY}
          text={label}
          variant={labelVariant}
          fontSize={9.5}
          fontWeight="600"
        />
      ) : null}
    </G>
  );
}
