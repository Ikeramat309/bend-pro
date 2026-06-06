import { Text as SvgText } from 'react-native-svg';

import { diagramTheme } from './diagramTheme';

export type DiagramLabelVariant = 'default' | 'muted' | 'mark' | 'strong';

export type DiagramLabelProps = {
  x: number;
  y: number;
  text: string;
  variant?: DiagramLabelVariant;
  fontSize?: number;
  fontWeight?: string;
  textAnchor?: 'start' | 'middle' | 'end';
  rotation?: number;
};

const variantColors: Record<DiagramLabelVariant, string> = {
  default: diagramTheme.label,
  muted: diagramTheme.mutedLabel,
  mark: diagramTheme.mark,
  strong: diagramTheme.dimensionStrong,
};

/** SVG text label for diagram annotations. */
export function DiagramLabel({
  x,
  y,
  text,
  variant = 'default',
  fontSize = 10.5,
  fontWeight = '700',
  textAnchor = 'middle',
  rotation,
}: DiagramLabelProps) {
  const transform = rotation != null ? `rotate(${rotation} ${x} ${y})` : undefined;

  return (
    <SvgText
      x={x}
      y={y}
      fill={variantColors[variant]}
      fontSize={fontSize}
      fontWeight={fontWeight}
      textAnchor={textAnchor}
      transform={transform}>
      {text}
    </SvgText>
  );
}
