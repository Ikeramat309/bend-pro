import { G, Line } from 'react-native-svg';

import { diagramMetrics, diagramTheme } from './diagramTheme';

export type DimensionLineProps = {
  x1: number;
  y1: number;
  x2: number;
  y2: number;
  showArrows?: boolean;
  arrowMarkerId?: string;
  extensionLines?: { x1: number; y1: number; x2: number; y2: number }[];
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
}: DimensionLineProps) {
  return (
    <G>
      <Line
        x1={x1}
        y1={y1}
        x2={x2}
        y2={y2}
        stroke={diagramTheme.dimension}
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
          stroke={diagramTheme.dimension}
          strokeWidth={0.7}
        />
      ))}
    </G>
  );
}
