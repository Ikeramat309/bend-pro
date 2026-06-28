import { Path } from 'react-native-svg';

import { diagramMetrics } from './diagramTheme';
import { useDiagramTheme } from './useDiagramTheme';

export type PipeSegmentVariant = 'pipe' | 'shadow' | 'highlight';

export type PipeSegmentProps = {
  d: string;
  variant?: PipeSegmentVariant;
  strokeWidth?: number;
  opacity?: number;
  gradientId?: string;
};

/** SVG path for a conduit run (straight, arc, or compound). */
export function PipeSegment({
  d,
  variant = 'pipe',
  strokeWidth,
  opacity,
  gradientId,
}: PipeSegmentProps) {
  const theme = useDiagramTheme();
  const variantStyles: Record<
    PipeSegmentVariant,
    { stroke: string; width: number; opacity?: number }
  > = {
    pipe: { stroke: theme.pipe, width: diagramMetrics.pipeStroke },
    shadow: { stroke: theme.pipeShadow, width: 20, opacity: 0.72 },
    highlight: { stroke: theme.pipeHighlight, width: 2.4 },
  };
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
