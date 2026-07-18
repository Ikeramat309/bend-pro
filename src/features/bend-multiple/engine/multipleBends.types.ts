export type MultipleBendsMarkKind = 'bend' | 'cut';
export type MultipleBendsDirection = 'up' | 'down';
export type MultipleBendsMarkState =
  | 'ok'
  | 'collision'
  | 'before-stick'
  | 'after-stick'
  | 'invalid';

export type MultipleBendsMarkInput = {
  id: string;
  positionInches: number;
  kind: MultipleBendsMarkKind;
  /** Bend metadata only. Cut marks ignore these fields. */
  angleDegrees?: number;
  direction?: MultipleBendsDirection;
  flip?: boolean;
};

export type MultipleBendsEngineInput = {
  totalLengthInches: number;
  marks: readonly MultipleBendsMarkInput[];
};

export type MultipleBendsLayoutMark = {
  id: string;
  inputOrder: number;
  layoutOrder: number;
  positionInches: number | null;
  kind: MultipleBendsMarkKind;
  angleDegrees: number | null;
  direction: MultipleBendsDirection | null;
  flip: boolean;
  gapFromPreviousInches: number | null;
  remainingAfterInches: number | null;
  normalizedPosition: number | null;
  state: MultipleBendsMarkState;
  issues: readonly string[];
};

/** JSON-safe model used by persistence, export, and the diagram. */
export type MultipleBendsLayoutModel = {
  schemaVersion: 1;
  totalLengthInches: number | null;
  marks: readonly MultipleBendsLayoutMark[];
  totalBendDegrees: number;
  tailAfterLastMarkInches: number | null;
  isInputOrderSorted: boolean;
  hasCollisions: boolean;
  hasOverflow: boolean;
};

export type MultipleBendsDiagramData = MultipleBendsLayoutModel & {
  calculatorType: 'multiple-bends';
};

export type MultipleBendsEngineResult = {
  isValid: boolean;
  warnings: readonly string[];
  layout: MultipleBendsLayoutModel;
  diagramData: MultipleBendsDiagramData;
};

