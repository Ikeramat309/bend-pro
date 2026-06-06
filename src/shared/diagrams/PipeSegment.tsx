import { Path } from 'react-native-svg';

import { diagramMetrics, diagramTheme } from './diagramTheme';

export type PipeSegmentVariant = 'pipe' | 'shadow' | 'highlight';

export type PipeSegmentProps = {
  d: string;
  variant?: PipeSegmentVariant;
  strokeWidth?: number;
  opacity?: number;
  gradientId?: string;
};

const variantStyles: Record<
  PipeSegmentVariant,
  { stroke: string; width: number; opacity?: number }
> = {
  pipe: { stroke: diagramTheme.pipe, width: diagramMetrics.pipeStroke },
  shadow: { stroke: diagramTheme.pipeShadow, width: 20, opacity: 0.72 },
  highlight: { stroke: diagramTheme.pipeHighlight, width: 2.4 },
};

/** SVG path for a conduit run (straight, arc, or compound). */
export function PipeSegment({
  d,
  variant = 'pipe',
  strokeWidth,
  opacity,
  gradientId,
}: PipeSegmentProps) {
  const preset = variantStyles[variant];

  return (
    <Path
      d={d}
      fill="none"
      stroke={gradientId ? `url(#${gradientId})` : preset.stroke}
      strokeWidth={strokeWidth ?? preset.width}
      strokeLinecap="round"
      strokeLinejoin="round"
      opacity={opacity ?? preset.opacity}
    />
  );
}
