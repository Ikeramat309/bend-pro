import { Rect } from 'react-native-svg';

import { diagramMetrics, diagramTheme } from './diagramTheme';

/** Full-bleed diagram background inside the pipe card well. */
export function DiagramCanvas() {
  return (
    <Rect
      x={0}
      y={0}
      width={diagramMetrics.width}
      height={diagramMetrics.height}
      fill={diagramTheme.canvas}
    />
  );
}
