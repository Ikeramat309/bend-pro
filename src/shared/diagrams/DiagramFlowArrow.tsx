import { G, Path } from 'react-native-svg';

import { diagramTheme } from './diagramTheme';

export type DiagramFlowArrowProps = {
  x: number;
  y: number;
  /** Direction the arrow points, in degrees (0 = east). */
  angleDeg?: number;
  scale?: number;
};

const ARROW_PATH = 'M -6 0 L 0 -4 L 6 0 L 0 4 Z';

/** Small arrow showing measure-from / pipe-flow direction on a diagram. */
export function DiagramFlowArrow({ x, y, angleDeg = 0, scale = 1 }: DiagramFlowArrowProps) {
  return (
    <G transform={`translate(${x} ${y}) rotate(${angleDeg}) scale(${scale})`}>
      <Path d={ARROW_PATH} fill={diagramTheme.flowArrow} opacity={0.88} />
    </G>
  );
}
