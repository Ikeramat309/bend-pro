import { diagramMetrics, diagramTheme } from './diagramTheme';
import { DiagramCallout } from './DiagramCallout';
import { DiagramLabel } from './DiagramLabel';

export type DiagramGhostMessageProps = {
  text: string;
  /** Baseline Y for the message label inside the callout. */
  y?: number;
  invalid?: boolean;
};

function estimateCalloutWidth(text: string): number {
  const charWidth = 6.1;
  const padding = 28;
  return Math.min(Math.max(text.length * charWidth + padding, 160), diagramMetrics.width - 24);
}

/** Standard empty / invalid prompt — muted ghost pipe + readable callout. */
export function DiagramGhostMessage({
  text,
  y = diagramMetrics.height - 14,
  invalid = false,
}: DiagramGhostMessageProps) {
  const width = estimateCalloutWidth(text);
  const height = 24;
  const x = (diagramMetrics.width - width) / 2;
  const calloutY = y - 17;

  return (
    <DiagramCallout
      x={x}
      y={calloutY}
      width={width}
      height={height}
      fill={diagramTheme.ghost.calloutFill}
      stroke={invalid ? diagramTheme.ghost.calloutInvalidStroke : diagramTheme.ghost.calloutStroke}>
      <DiagramLabel
        x={diagramMetrics.width / 2}
        y={y}
        text={text}
        variant={invalid ? 'mark' : 'muted'}
        fontSize={11}
        fontWeight={invalid ? '600' : '500'}
      />
    </DiagramCallout>
  );
}
