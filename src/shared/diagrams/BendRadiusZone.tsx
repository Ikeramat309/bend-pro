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
 * consumes. Drawn as a soft green glow plus a thin accent line over the arc,
 * so the bend areas read clearly against the metallic pipe and orange marks.
 */
export function BendRadiusZone({ d, glowWidth = 22 }: BendRadiusZoneProps) {
  return (
    <>
      <Path
        d={d}
        fill="none"
        stroke={diagramTheme.bendZone.fill}
        strokeWidth={glowWidth}
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <Path
        d={d}
        fill="none"
        stroke={diagramTheme.bendZone.stroke}
        strokeWidth={1.25}
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </>
  );
}
