import { DiagramLabel } from './DiagramLabel';

export type DiagramFieldCueProps = {
  text: string;
  x?: number;
  y?: number;
};

/** Compact field-work legend — bend order, direction, and watch-fors. */
export function DiagramFieldCue({ text, x = 180, y = 293 }: DiagramFieldCueProps) {
  return (
    <DiagramLabel
      x={x}
      y={y}
      text={text}
      variant="muted"
      fontSize={9}
      fontWeight="600"
      textAnchor="middle"
    />
  );
}
