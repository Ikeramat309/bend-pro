import { G, Line } from 'react-native-svg';

import { DiagramLabel } from './DiagramLabel';
import { diagramMetrics, diagramTheme } from './diagramTheme';

export type MarkLineProps = {
  x1: number;
  y1: number;
  x2: number;
  y2: number;
  label?: string;
  labelX?: number;
  labelY?: number;
};

/** Bend mark indicator on the pipe. */
export function MarkLine({ x1, y1, x2, y2, label, labelX, labelY }: MarkLineProps) {
  return (
    <G>
      <Line
        x1={x1}
        y1={y1}
        x2={x2}
        y2={y2}
        stroke={diagramTheme.mark}
        strokeWidth={diagramMetrics.markStroke}
        strokeLinecap="round"
      />
      {label && labelX != null && labelY != null ? (
        <DiagramLabel x={labelX} y={labelY} text={label} variant="mark" />
      ) : null}
    </G>
  );
}
