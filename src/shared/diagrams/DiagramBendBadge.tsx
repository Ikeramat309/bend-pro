import { Circle, Text as SvgText } from 'react-native-svg';

import { useDiagramTheme } from './useDiagramTheme';

export type DiagramBendBadgeProps = {
  x: number;
  y: number;
  order: number;
  /** First bend in the field sequence (e.g. center on a saddle). */
  primary?: boolean;
  size?: number;
};

/** Numbered badge for bend sequence on a pipe diagram. */
export function DiagramBendBadge({
  x,
  y,
  order,
  primary = false,
  size = 11,
}: DiagramBendBadgeProps) {
  const theme = useDiagramTheme();
  const r = size / 2 + 2;
  const badge = theme.bendBadge;

  return (
    <>
      <Circle
        cx={x}
        cy={y}
        r={r}
        fill={primary ? badge.primaryFill : badge.fill}
        stroke={primary ? badge.primaryStroke : badge.stroke}
        strokeWidth={1}
      />
      <SvgText
        x={x}
        y={y + 3.5}
        fill={primary ? badge.primaryText : badge.text}
        fontSize={size - 1}
        fontWeight="700"
        textAnchor="middle">
        {String(order)}
      </SvgText>
    </>
  );
}
