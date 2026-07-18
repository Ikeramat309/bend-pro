import type { MultipleBendsDiagramData, MultipleBendsMarkState } from '../engine/multipleBends.types';

export type MultipleBendsDiagramMarkGeometry = {
  id: string;
  x: number;
  labelY: number;
  cueY: number;
  layoutOrder: number;
  state: MultipleBendsMarkState;
  isOverflow: boolean;
  showGap: boolean;
};

export type MultipleBendsDiagramGeometry = {
  startX: number;
  endX: number;
  pipeY: number;
  marks: readonly MultipleBendsDiagramMarkGeometry[];
};

const START_X = 28;
const END_X = 332;
const PIPE_Y = 112;

function clamp(value: number, min: number, max: number): number {
  return Math.min(Math.max(value, min), max);
}

export function buildMultipleBendsDiagramGeometry(
  data: MultipleBendsDiagramData,
): MultipleBendsDiagramGeometry {
  const usableWidth = END_X - START_X;
  const marks = data.marks.map((mark, index) => {
    const ratio = mark.normalizedPosition ?? 0;
    const isOverflow = ratio < 0 || ratio > 1 || mark.state === 'invalid';
    return {
      id: mark.id,
      x: START_X + clamp(ratio, 0, 1) * usableWidth,
      labelY: index % 2 === 0 ? 72 : 164,
      cueY: index % 2 === 0 ? 88 : 138,
      layoutOrder: mark.layoutOrder,
      state: mark.state,
      isOverflow,
      showGap: data.marks.length <= 7 && mark.gapFromPreviousInches !== null,
    };
  });

  return { startX: START_X, endX: END_X, pipeY: PIPE_Y, marks };
}

