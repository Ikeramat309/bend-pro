import Svg, { G, Line, Text as SvgText } from 'react-native-svg';

import { workspaceColors } from '@/theme/workspaceTheme';

type MarkLineProps = {
  x: number;
  y1: number;
  y2: number;
  label?: string;
  color?: string;
  active?: boolean;
  horizontal?: boolean;
  x2?: number;
};

export function MarkLine({
  x,
  y1,
  y2,
  label,
  color = workspaceColors.accentOrange,
  active = false,
  horizontal = false,
  x2,
}: MarkLineProps) {
  const stroke = active ? workspaceColors.accentOrange : color;
  const strokeWidth = active ? 2.4 : 2;
  const labelColor = active ? workspaceColors.textPrimary : stroke;

  if (horizontal && x2 !== undefined) {
    return (
      <G>
        <Line
          x1={x}
          y1={y1}
          x2={x2}
          y2={y1}
          stroke={stroke}
          strokeWidth={strokeWidth}
          strokeLinecap="round"
          opacity={active ? 1 : 0.85}
        />
        {label ? (
          <SvgText
            x={(x + x2) / 2}
            y={y1 - 8}
            fill={labelColor}
            fontSize={10}
            fontWeight={active ? '800' : '700'}
            textAnchor="middle">
            {label}
          </SvgText>
        ) : null}
      </G>
    );
  }

  return (
    <G>
      <Line
        x1={x}
        y1={y1}
        x2={x}
        y2={y2}
        stroke={stroke}
        strokeWidth={strokeWidth}
        strokeLinecap="round"
        opacity={active ? 1 : 0.85}
      />
      {label ? (
        <SvgText
          x={x}
          y={Math.min(y1, y2) - 8}
          fill={labelColor}
          fontSize={10}
          fontWeight={active ? '800' : '700'}
          textAnchor="middle">
          {label}
        </SvgText>
      ) : null}
    </G>
  );
}
