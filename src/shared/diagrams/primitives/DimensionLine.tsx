import Svg, { G, Line, Text as SvgText } from 'react-native-svg';

import { workspaceColors } from '@/theme/workspaceTheme';

type DimensionLineProps = {
  x1: number;
  y1: number;
  x2: number;
  y2: number;
  label?: string;
  color?: string;
  tone?: 'default' | 'blue' | 'orange';
  active?: boolean;
  showArrows?: boolean;
};

function arrowHead(x: number, y: number, angleDeg: number, color: string, size = 5) {
  const angle = (angleDeg * Math.PI) / 180;
  const x1 = x - size * Math.cos(angle - Math.PI / 6);
  const y1 = y - size * Math.sin(angle - Math.PI / 6);
  const x2 = x - size * Math.cos(angle + Math.PI / 6);
  const y2 = y - size * Math.sin(angle + Math.PI / 6);

  return (
    <>
      <Line x1={x} y1={y} x2={x1} y2={y1} stroke={color} strokeWidth={1.2} strokeLinecap="round" />
      <Line x1={x} y1={y} x2={x2} y2={y2} stroke={color} strokeWidth={1.2} strokeLinecap="round" />
    </>
  );
}

function lineAngle(x1: number, y1: number, x2: number, y2: number) {
  return (Math.atan2(y2 - y1, x2 - x1) * 180) / Math.PI;
}

export function DimensionLine({
  x1,
  y1,
  x2,
  y2,
  label,
  color = workspaceColors.textMuted,
  tone = 'blue',
  active = false,
  showArrows = true,
}: DimensionLineProps) {
  const inactiveColor = tone === 'orange' ? workspaceColors.accentOrange : color;
  const activeColor = tone === 'orange' ? workspaceColors.accentOrange : workspaceColors.accentBlue;
  const stroke = active ? activeColor : inactiveColor;
  const strokeWidth = active ? 1.4 : 1;
  const labelColor = active ? workspaceColors.textPrimary : workspaceColors.textMuted;
  const labelX = (x1 + x2) / 2;
  const labelY = (y1 + y2) / 2 - 8;
  const angle = lineAngle(x1, y1, x2, y2);

  return (
    <G>
      <Line
        x1={x1}
        y1={y1}
        x2={x2}
        y2={y2}
        stroke={stroke}
        strokeWidth={strokeWidth}
        strokeLinecap="round"
        opacity={active ? 1 : 0.75}
      />
      {showArrows ? (
        <>
          {arrowHead(x1, y1, angle + 180, stroke)}
          {arrowHead(x2, y2, angle, stroke)}
        </>
      ) : null}
      {label ? (
        <SvgText
          x={labelX}
          y={labelY}
          fill={labelColor}
          fontSize={10.5}
          fontWeight={active ? '800' : '600'}
          textAnchor="middle">
          {label}
        </SvgText>
      ) : null}
    </G>
  );
}
