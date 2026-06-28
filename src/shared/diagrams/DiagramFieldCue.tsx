import { G } from 'react-native-svg';

import { DiagramLabel } from './DiagramLabel';

export type DiagramFieldCueProps = {
  text: string;
  x?: number;
  y?: number;
};

/** Compact field-work legend — bend order, direction, and watch-fors. */
export function DiagramFieldCue({ text, x = 180, y = 293 }: DiagramFieldCueProps) {
  return (
    <G opacity={0.72}>
      <DiagramLabel
        x={x}
        y={y}
        text={text}
        variant="muted"
        fontSize={8.5}
        fontWeight="500"
        textAnchor="middle"
      />
    </G>
  );
}
