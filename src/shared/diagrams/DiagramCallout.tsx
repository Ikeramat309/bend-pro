import type { ReactNode } from 'react';
import { G, Rect } from 'react-native-svg';

import { diagramTheme } from './diagramTheme';

export type DiagramCalloutProps = {
  x: number;
  y: number;
  width: number;
  height: number;
  children: ReactNode;
};

/** Small label badge for diagram readouts — keeps text off the pipe. */
export function DiagramCallout({ x, y, width, height, children }: DiagramCalloutProps) {
  return (
    <G>
      <Rect
        x={x}
        y={y}
        width={width}
        height={height}
        rx={8}
        fill={diagramTheme.calloutFill}
        stroke={diagramTheme.calloutStroke}
      />
      {children}
    </G>
  );
}
