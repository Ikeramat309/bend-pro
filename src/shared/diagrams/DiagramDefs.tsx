import { Defs, LinearGradient, Marker, Path, Stop } from 'react-native-svg';

import { diagramMetrics } from './diagramTheme';
import { useDiagramTheme } from './useDiagramTheme';

export type DiagramDefsProps = {
  gradientId: string;
  arrowId?: string;
  ghost?: boolean;
};

/** Shared pipe gradient and dimension arrow markers. */
export function DiagramDefs({ gradientId, arrowId = 'diagramArrow', ghost = false }: DiagramDefsProps) {
  const theme = useDiagramTheme();
  const startOpacity = ghost ? diagramMetrics.ghostPipeOpacity : 1;
  const endOpacity = ghost ? diagramMetrics.ghostPipeOpacity * 0.85 : 1;

  // Ghost (preview) pipes fade out; live pipes keep the full metallic sheen.
  const stopOpacity = (offset: number) =>
    ghost ? String(startOpacity - (startOpacity - endOpacity) * offset) : '1';

  return (
    <Defs>
      <LinearGradient id={gradientId} x1="0" y1="0" x2="1" y2="1">
        {theme.pipeGradientStops.map((stop) => (
          <Stop
            key={stop.offset}
            offset={String(stop.offset)}
            stopColor={stop.color}
            stopOpacity={stopOpacity(stop.offset)}
          />
        ))}
      </LinearGradient>
      {!ghost ? (
        <Marker
          id={arrowId}
          markerWidth={diagramMetrics.arrowSize}
          markerHeight={diagramMetrics.arrowSize}
          refX={3}
          refY={3}
          orient="auto"
          markerUnits="strokeWidth">
          <Path d="M 0 0 L 6 3 L 0 6 z" fill={theme.arrowFill} />
        </Marker>
      ) : null}
    </Defs>
  );
}
