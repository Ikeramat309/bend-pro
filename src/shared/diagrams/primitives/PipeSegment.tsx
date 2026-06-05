import Svg, { Path } from 'react-native-svg';

import { workspaceColors } from '@/theme/workspaceTheme';

type PipeSegmentProps = {
  d: string;
  color?: string;
  strokeWidth?: number;
  active?: boolean;
  shadow?: boolean;
};

export function PipeSegment({
  d,
  color = workspaceColors.pipeSteel,
  strokeWidth = 12,
  active = false,
  shadow = false,
}: PipeSegmentProps) {
  const stroke = active ? workspaceColors.accentBlue : color;
  const width = active ? strokeWidth + 1.5 : strokeWidth;

  return (
    <>
      {shadow ? (
        <Path
          d={d}
          fill="none"
          stroke="rgba(0, 0, 0, 0.35)"
          strokeWidth={width + 6}
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      ) : null}
      <Path
        d={d}
        fill="none"
        stroke={stroke}
        strokeWidth={width}
        strokeLinecap="round"
        strokeLinejoin="round"
        opacity={active ? 1 : 0.95}
      />
      {active ? (
        <Path
          d={d}
          fill="none"
          stroke={workspaceColors.pipeHighlight}
          strokeWidth={2}
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      ) : null}
    </>
  );
}
