import {
  snapshotSetupFromInput,
  type BenderProfileSnapshot,
  type CalculationResult,
  type FieldStep,
  type SetupSnapshotInput,
} from '@/core/calculations';
import { formatLength } from '@/utils/formatLength';

import type {
  MultipleBendsDirection,
  MultipleBendsEngineResult,
  MultipleBendsMarkInput,
  MultipleBendsMarkKind,
} from './multipleBends.types';
import {
  createMultipleBendsInputSnapshot,
  type MultipleBendsInputSnapshot,
} from './multipleBendsInputSnapshot';

export type MultipleBendsCalculationSpecific = {
  markCount: number;
  totalBendDegrees: number;
  layout: MultipleBendsEngineResult['layout'];
  diagramData: MultipleBendsEngineResult['diagramData'];
};

export type MultipleBendsResultContext = SetupSnapshotInput & {
  benderProfile: BenderProfileSnapshot;
};

export function toMultipleBendsCalculationResult(
  result: MultipleBendsEngineResult,
  context: MultipleBendsResultContext,
): CalculationResult<'multipleBends', MultipleBendsCalculationSpecific> {
  const markCount = result.layout.marks.length;
  const tail = result.layout.tailAfterLastMarkInches;
  const fieldSteps: FieldStep[] = result.layout.marks.map((mark) => {
    const step: FieldStep = {
      order: mark.layoutOrder,
      key: mark.id,
      title: mark.kind === 'cut' ? 'Cut mark' : `${mark.angleDegrees ?? 0}° bend mark`,
      detail:
        mark.kind === 'cut'
          ? 'Measure from the same start end and mark for cut.'
          : `${mark.direction === 'down' ? 'Bend down' : 'Bend up'}${mark.flip ? '; flip the conduit first' : ''}.`,
    };
    if (mark.positionInches !== null) {
      step.inches = mark.positionInches;
      step.display = formatLength(
        mark.positionInches,
        context.unitSystem,
        context.roundingPrecision,
      );
    }
    return step;
  });

  return {
    calculatorId: 'multipleBends',
    status: result.isValid ? (result.warnings.length ? 'warning' : 'valid') : 'invalid',
    primaryResults:
      tail === null
        ? []
        : [
            {
              key: 'tailAfterLastMark',
              label: 'Tail After Last Mark',
              inches: tail,
              display: formatLength(tail, context.unitSystem, context.roundingPrecision),
            },
          ],
    secondaryResults: [
      { key: 'markCount', label: 'Marks', display: String(markCount) },
      {
        key: 'totalBendDegrees',
        label: 'Total Bend',
        display: `${result.layout.totalBendDegrees}°`,
      },
    ],
    warnings: result.warnings,
    assumptions: [
      'Every mark is an absolute measurement from the same conduit start end.',
      'Bend angle, direction, and flip instructions are user-supplied; no take-up, gain, or shoe math is inferred.',
    ],
    setupSnapshot: snapshotSetupFromInput(context),
    benderProfile: context.benderProfile,
    rawValuesInches: {
      totalLength: result.layout.totalLengthInches ?? undefined,
      tailAfterLastMark: tail ?? undefined,
    },
    displayValues: {
      totalLength:
        result.layout.totalLengthInches === null
          ? undefined
          : formatLength(
              result.layout.totalLengthInches,
              context.unitSystem,
              context.roundingPrecision,
            ),
      tailAfterLastMark:
        tail === null ? undefined : formatLength(tail, context.unitSystem, context.roundingPrecision),
      markCount: String(markCount),
      totalBendDegrees: `${result.layout.totalBendDegrees}°`,
    },
    fieldSteps,
    sourceNotes: [
      {
        key: 'plannerBoundary',
        kind: 'assumption',
        message: 'Mark planner only; the selected bender is setup context and does not change marks.',
      },
    ],
    formulaValues: {
      markCount,
      totalBendDegrees: result.layout.totalBendDegrees,
      inputOrderSorted: result.layout.isInputOrderSorted,
    },
    specific: {
      markCount,
      totalBendDegrees: result.layout.totalBendDegrees,
      layout: result.layout,
      diagramData: result.diagramData,
    },
  };
}

export type MultipleBendsFieldStepSeed = Pick<FieldStep, 'key' | 'order' | 'title' | 'inches'>;
export type MultipleBendsSeedMetadata = {
  kind: MultipleBendsMarkKind;
  angleDegrees?: number;
  direction?: MultipleBendsDirection;
  flip?: boolean;
};

/** Caller supplies bend metadata, so the planner never guesses orientation from prose. */
export function seedMultipleBendsSnapshotFromFieldSteps(
  totalLengthInches: number,
  steps: readonly MultipleBendsFieldStepSeed[],
  resolveMetadata: (step: MultipleBendsFieldStepSeed) => MultipleBendsSeedMetadata | null,
): MultipleBendsInputSnapshot {
  const marks: MultipleBendsMarkInput[] = steps
    .filter((step): step is MultipleBendsFieldStepSeed & { inches: number } =>
      Number.isFinite(step.inches),
    )
    .sort((a, b) => a.order - b.order)
    .flatMap((step) => {
      const metadata = resolveMetadata(step);
      if (!metadata) return [];
      return [
        {
          id: step.key,
          positionInches: step.inches,
          kind: metadata.kind,
          angleDegrees: metadata.kind === 'bend' ? metadata.angleDegrees : undefined,
          direction: metadata.kind === 'bend' ? metadata.direction : undefined,
          flip: metadata.kind === 'bend' ? metadata.flip : undefined,
        },
      ];
    });

  return createMultipleBendsInputSnapshot(totalLengthInches, marks);
}
