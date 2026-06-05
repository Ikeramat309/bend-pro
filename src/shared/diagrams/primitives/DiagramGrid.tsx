import Svg, { Line } from 'react-native-svg';

import { workspaceColors } from '@/theme/workspaceTheme';

type DiagramGridProps = {
  width: number | string;
  height: number | string;
  cellSize?: number;
  color?: string;
};

export function DiagramGrid({
  width,
  height,
  cellSize = 24,
  color = workspaceColors.gridLine,
}: DiagramGridProps) {
  const numericWidth = typeof width === 'number' ? width : 360;
  const numericHeight = typeof height === 'number' ? height : 320;

  const verticalLines: number[] = [];
  const horizontalLines: number[] = [];

  for (let x = cellSize; x < numericWidth; x += cellSize) {
    verticalLines.push(x);
  }

  for (let y = cellSize; y < numericHeight; y += cellSize) {
    horizontalLines.push(y);
  }

  return (
    <Svg width={width} height={height} viewBox={`0 0 ${numericWidth} ${numericHeight}`}>
      {verticalLines.map((x) => (
        <Line key={`v-${x}`} x1={x} y1={0} x2={x} y2={numericHeight} stroke={color} strokeWidth={1} />
      ))}
      {horizontalLines.map((y) => (
        <Line key={`h-${y}`} x1={0} y1={y} x2={numericWidth} y2={y} stroke={color} strokeWidth={1} />
      ))}
    </Svg>
  );
}
