import { Fragment } from 'react';
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

/**
 * Relative widths for the three concentric strokes that fake a rounded steel
 * cylinder: a dark steel edge at full width, the metallic body, and a thin
 * light core sheen. Tuned to read as a tube at any orientation.
 */
const PIPE_BODY_RATIO = 0.7;
const PIPE_SHEEN_RATIO = 0.28;
const PIPE_SHEEN_OPACITY = 0.5;

/** SVG path for a conduit run (straight, arc, or compound). */
export function PipeSegment({
  d,
  variant = 'pipe',
  strokeWidth,
  opacity,
  gradientId,
}: PipeSegmentProps) {
  const theme = useDiagramTheme();

  if (variant === 'pipe') {
    const fullWidth = strokeWidth ?? diagramMetrics.pipeStroke;
    const bodyStroke = gradientId ? `url(#${gradientId})` : theme.pipe;

    // Three concentric strokes on the same path: dark edge → metallic body →
    // light sheen core. Together they give the run rounded-tube depth.
    return (
      <Fragment>
        <Path
          d={d}
          fill="none"
          stroke={theme.pipeCore}
          strokeWidth={fullWidth}
          strokeLinecap="round"
          strokeLinejoin="round"
          opacity={opacity}
        />
        <Path
          d={d}
          fill="none"
          stroke={bodyStroke}
          strokeWidth={fullWidth * PIPE_BODY_RATIO}
          strokeLinecap="round"
          strokeLinejoin="round"
          opacity={opacity}
        />
        <Path
          d={d}
          fill="none"
          stroke={theme.pipeSheen}
          strokeWidth={fullWidth * PIPE_SHEEN_RATIO}
          strokeLinecap="round"
          strokeLinejoin="round"
          opacity={(opacity ?? 1) * PIPE_SHEEN_OPACITY}
        />
      </Fragment>
    );
  }

  const variantStyles: Record<
    Exclude<PipeSegmentVariant, 'pipe'>,
    { stroke: string; width: number; opacity?: number }
  > = {
    shadow: { stroke: theme.pipeShadow, width: 30, opacity: 0.72 },
    highlight: { stroke: theme.pipeHighlight, width: 2.4 },
  };
  const preset = variantStyles[variant];

  return (
    <Path
      d={d}
      fill="none"
      stroke={preset.stroke}
      strokeWidth={strokeWidth ?? preset.width}
      strokeLinecap="round"
      strokeLinejoin="round"
      opacity={opacity ?? preset.opacity}
    />
  );
}
