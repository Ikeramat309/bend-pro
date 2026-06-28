import { G, Line } from 'react-native-svg';

import { diagramMetrics } from './diagramTheme';
import { useDiagramTheme } from './useDiagramTheme';

export type DimensionLineProps = {
  x1: number;
  y1: number;
  x2: number;
  y2: number;
  showArrows?: boolean;
  arrowMarkerId?: string;
  extensionLines?: { x1: number; y1: number; x2: number; y2: number }[];
  opacity?: number;
};

/** Measurement dimension line with optional arrow markers and extension ticks. */
export function DimensionLine({
  x1,
  y1,
  x2,
  y2,
  showArrows = true,
  arrowMarkerId = 'diagramArrow',
  extensionLines = [],
  opacity = 1,
}: DimensionLineProps) {
  const theme = useDiagramTheme();

  return (
    <G opacity={opacity}>
      <Line
        x1={x1}
        y1={y1}
        x2={x2}
        y2={y2}
        stroke={theme.dimension}
        strokeWidth={diagramMetrics.dimensionStroke}
        markerStart={showArrows ? `url(#${arrowMarkerId})` : undefined}
        markerEnd={showArrows ? `url(#${arrowMarkerId})` : undefined}
      />
      {extensionLines.map((line, index) => (
        <Line
          key={`ext-${index}`}
          x1={line.x1}
          y1={line.y1}
          x2={line.x2}
          y2={line.y2}
          stroke={theme.dimension}
          strokeWidth={diagramMetrics.extensionStroke}
        />
      ))}
    </G>
  );
}
