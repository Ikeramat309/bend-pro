import { Path } from 'react-native-svg';

import { diagramTheme } from './diagramTheme';

export type BendRadiusZoneProps = {
  /** SVG path tracing the pipe centerline through the bend arc. */
  d: string;
  /** Width of the soft glow band around the arc. */
  glowWidth?: number;
};

/**
 * Highlighted bend-radius zone — the take-up region the bender shoe
 * consumes. Drawn as a soft glow plus a thin accent line over the arc.
 */
export function BendRadiusZone({ d, glowWidth = 22 }: BendRadiusZoneProps) {
  return (
    <>
      <Path
        d={d}
        fill="none"
        stroke={diagramTheme.deduct}
        strokeWidth={glowWidth}
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <Path
        d={d}
        fill="none"
        stroke={diagramTheme.deductStroke}
        strokeWidth={1}
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </>
  );
}
