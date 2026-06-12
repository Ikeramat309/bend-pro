import { Line } from 'react-native-svg';

import { diagramMetrics, diagramTheme } from './diagramTheme';

export type DiagramLeaderLineProps = {
  x1: number;
  y1: number;
  x2: number;
  y2: number;
  opacity?: number;
};

/** Thin connector from a callout badge to the pipe element it describes. */
export function DiagramLeaderLine({ x1, y1, x2, y2, opacity = 1 }: DiagramLeaderLineProps) {
  return (
    <Line
      x1={x1}
      y1={y1}
      x2={x2}
      y2={y2}
      stroke={diagramTheme.dimension}
      strokeWidth={diagramMetrics.dimensionStroke}
      opacity={opacity}
    />
  );
}
