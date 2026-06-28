import { Rect } from 'react-native-svg';

import { diagramMetrics } from './diagramTheme';
import { useDiagramTheme } from './useDiagramTheme';

/** Full-bleed diagram background inside the pipe card well. */
export function DiagramCanvas() {
  const theme = useDiagramTheme();

  return (
    <Rect
      x={0}
      y={0}
      width={diagramMetrics.width}
      height={diagramMetrics.height}
      fill={theme.canvas}
    />
  );
}
