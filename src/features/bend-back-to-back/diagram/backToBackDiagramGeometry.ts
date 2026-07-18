import { resolveProportionalSpans } from '@/shared/diagrams';

export const BACK_TO_BACK_DIAGRAM_LAYOUT = {
  centerX: 180,
  topY: 78,
  radius: 27,
  minBackSpanPx: 150,
  maxBackSpanPx: 244,
  minLegPx: 112,
  maxLegPx: 150,
  arrowMarkInset: 7,
  starMarkInset: 8,
} as const;

export type BackToBackDiagramGeometryInput = {
  backToBackDistanceInches: number;
  firstStubLengthInches?: number;
};

export type BackToBackDiagramGeometry = {
  leftX: number;
  rightX: number;
  topY: number;
  bottomY: number;
  radius: number;
  backSpanPx: number;
  legPx: number;
  pipePath: string;
  firstBendPath: string;
  secondBendPath: string;
  arrowMark: { x: number; y: number };
  starMark: { x: number; y: number };
};

function positiveFiniteOr(value: number | undefined, fallback: number): number {
  return value !== undefined && Number.isFinite(value) && value > 0 ? value : fallback;
}

/** Presentation-only geometry. Field measurements come entirely from engine diagramData. */
export function buildBackToBackDiagramGeometry(
  input: BackToBackDiagramGeometryInput,
): BackToBackDiagramGeometry {
  const layout = BACK_TO_BACK_DIAGRAM_LAYOUT;
  const distance = positiveFiniteOr(input.backToBackDistanceInches, 36);
  const visualFirstStub = positiveFiniteOr(
    input.firstStubLengthInches,
    Math.min(Math.max(distance / 2, 12), 36),
  );
  const spans = resolveProportionalSpans(
    {
      value: distance,
      minPx: layout.minBackSpanPx,
      maxPx: layout.maxBackSpanPx,
    },
    {
      value: visualFirstStub,
      minPx: layout.minLegPx,
      maxPx: layout.maxLegPx,
    },
  );

  const backSpanPx = spans.horizontalPx;
  const legPx = spans.verticalPx;
  const leftX = layout.centerX - backSpanPx / 2;
  const rightX = layout.centerX + backSpanPx / 2;
  const topY = layout.topY;
  const bottomY = topY + legPx;
  const radius = Math.min(layout.radius, backSpanPx / 4, legPx / 3);

  return {
    leftX,
    rightX,
    topY,
    bottomY,
    radius,
    backSpanPx,
    legPx,
    pipePath:
      `M ${leftX} ${bottomY} V ${topY + radius} ` +
      `Q ${leftX} ${topY} ${leftX + radius} ${topY} ` +
      `H ${rightX - radius} ` +
      `Q ${rightX} ${topY} ${rightX} ${topY + radius} ` +
      `V ${bottomY}`,
    firstBendPath:
      `M ${leftX} ${topY + radius} Q ${leftX} ${topY} ${leftX + radius} ${topY}`,
    secondBendPath:
      `M ${rightX - radius} ${topY} Q ${rightX} ${topY} ${rightX} ${topY + radius}`,
    arrowMark: {
      x: leftX,
      y: topY + radius + layout.arrowMarkInset,
    },
    starMark: {
      x: rightX - radius - layout.starMarkInset,
      y: topY,
    },
  };
}
