import { MULTIPLE_BENDS_CONFIG } from '../multipleBends.config';
import type {
  MultipleBendsEngineInput,
  MultipleBendsEngineResult,
  MultipleBendsLayoutMark,
  MultipleBendsMarkInput,
  MultipleBendsMarkState,
} from './multipleBends.types';

function isFiniteNumber(value: number): boolean {
  return Number.isFinite(value);
}

function safePosition(mark: MultipleBendsMarkInput): number {
  return isFiniteNumber(mark.positionInches) ? mark.positionInches : Number.POSITIVE_INFINITY;
}

/** Stable positional sort: equal/invalid marks retain the user's order. */
export function sortMultipleBendsMarks(
  marks: readonly MultipleBendsMarkInput[],
): readonly { mark: MultipleBendsMarkInput; inputOrder: number }[] {
  return marks
    .map((mark, inputOrder) => ({ mark, inputOrder }))
    .sort((a, b) => safePosition(a.mark) - safePosition(b.mark) || a.inputOrder - b.inputOrder);
}

export function calculateMultipleBends(
  input: MultipleBendsEngineInput,
): MultipleBendsEngineResult {
  const lengthValid = isFiniteNumber(input.totalLengthInches) && input.totalLengthInches > 0;
  const totalLength = lengthValid ? input.totalLengthInches : null;
  const sorted = sortMultipleBendsMarks(input.marks);
  const finiteInputPositions = input.marks
    .map((mark) => mark.positionInches)
    .filter(isFiniteNumber);
  const isInputOrderSorted = finiteInputPositions.every(
    (position, index) => index === 0 || position >= finiteInputPositions[index - 1],
  );

  let previousFinitePosition: number | null = null;
  let hasCollisions = false;
  let hasOverflow = false;
  let hasInvalidMark = false;
  let totalBendDegrees = 0;

  const marks: MultipleBendsLayoutMark[] = sorted.map(({ mark, inputOrder }, index) => {
    const positionValid = isFiniteNumber(mark.positionInches);
    const angleValid =
      mark.kind === 'cut' ||
      (isFiniteNumber(mark.angleDegrees ?? Number.NaN) &&
        (mark.angleDegrees ?? 0) > 0 &&
        (mark.angleDegrees ?? 0) <= 90);
    const issues: string[] = [];
    let state: MultipleBendsMarkState = 'ok';

    if (!positionValid || !angleValid) {
      state = 'invalid';
      hasInvalidMark = true;
      if (!positionValid) issues.push('Enter a valid mark position.');
      if (!angleValid) issues.push('Bend angle must be greater than 0° and no more than 90°.');
    }
    if (positionValid && mark.positionInches < 0) {
      if (state === 'ok') state = 'before-stick';
      issues.push('Mark is before the conduit start.');
      hasOverflow = true;
    } else if (positionValid && totalLength !== null && mark.positionInches > totalLength) {
      if (state === 'ok') state = 'after-stick';
      issues.push('Mark is beyond the conduit length.');
      hasOverflow = true;
    }

    const gap = positionValid && previousFinitePosition !== null
      ? mark.positionInches - previousFinitePosition
      : positionValid
        ? mark.positionInches
        : null;
    if (
      positionValid &&
      previousFinitePosition !== null &&
      Math.abs(mark.positionInches - previousFinitePosition) <=
        MULTIPLE_BENDS_CONFIG.collisionToleranceInches
    ) {
      state = state === 'ok' ? 'collision' : state;
      issues.push('This mark overlaps the previous mark.');
      hasCollisions = true;
    }

    if (positionValid) previousFinitePosition = mark.positionInches;
    if (mark.kind === 'bend' && angleValid) totalBendDegrees += mark.angleDegrees ?? 0;

    return {
      id: mark.id,
      inputOrder,
      layoutOrder: index + 1,
      positionInches: positionValid ? mark.positionInches : null,
      kind: mark.kind,
      angleDegrees: mark.kind === 'bend' && angleValid ? (mark.angleDegrees ?? null) : null,
      direction: mark.kind === 'bend' ? (mark.direction ?? 'up') : null,
      flip: mark.kind === 'bend' ? Boolean(mark.flip) : false,
      gapFromPreviousInches: gap,
      remainingAfterInches:
        positionValid && totalLength !== null ? totalLength - mark.positionInches : null,
      normalizedPosition:
        positionValid && totalLength !== null ? mark.positionInches / totalLength : null,
      state,
      issues,
    };
  });

  const lastUsableMark = [...marks]
    .reverse()
    .find((mark) => mark.positionInches !== null && mark.positionInches <= (totalLength ?? -1));
  const tailAfterLastMarkInches =
    totalLength !== null
      ? Math.max(0, totalLength - (lastUsableMark?.positionInches ?? 0))
      : null;
  const warnings: string[] = [];
  if (!lengthValid) warnings.push('Enter a conduit length greater than 0.');
  if (!isInputOrderSorted) warnings.push('Marks were out of order and have been sorted from the start end.');
  if (hasCollisions) warnings.push('Two or more marks overlap. Separate or intentionally combine them.');
  if (hasOverflow) warnings.push('One or more marks fall outside the conduit length.');
  if (hasInvalidMark) warnings.push('One or more marks have invalid values.');
  if (totalBendDegrees > 360) {
    warnings.push('Total bend adds up to more than 360°. Review pull difficulty and layout intent.');
  }

  const layout = {
    schemaVersion: 1 as const,
    totalLengthInches: totalLength,
    marks,
    totalBendDegrees,
    tailAfterLastMarkInches,
    isInputOrderSorted,
    hasCollisions,
    hasOverflow,
  };

  return {
    isValid: lengthValid && !hasInvalidMark && !hasOverflow && !hasCollisions,
    warnings,
    layout,
    diagramData: { calculatorType: 'multiple-bends', ...layout },
  };
}
