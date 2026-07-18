import {
  deriveCalculationStatus,
  snapshotSetupFromInput,
  type CalculationResult,
  type FieldStep,
  type SourceNote,
} from '@/core/calculations';

import { parallelOffsetCopy } from '../parallelOffset.copy';
import type {
  ParallelOffsetDiagramData,
  ParallelOffsetEngineInput,
  ParallelOffsetEngineResult,
  ParallelOffsetMode,
  ParallelOffsetShiftDirection,
} from './parallelOffset.types';

export type ParallelOffsetCalculationSpecific = {
  mode: ParallelOffsetMode;
  bendAngle: number;
  adjustmentFactor: number;
  conduitCount: number;
  shiftDirection: ParallelOffsetShiftDirection;
  diagramData?: ParallelOffsetDiagramData;
};

export function toParallelOffsetCalculationResult(
  input: ParallelOffsetEngineInput,
  result: ParallelOffsetEngineResult,
): CalculationResult<'parallelOffset', ParallelOffsetCalculationSpecific> {
  const primaryResults = result.isValid
    ? [
        {
          key: 'adjustmentPerConduit',
          label: parallelOffsetCopy.results.adjustment,
          inches: result.adjustmentPerConduit,
          display: result.adjustmentPerConduitFormatted,
        },
      ]
    : [];
  const secondaryResults =
    result.isValid && result.mode === 'layout'
      ? [
          {
            key: 'distanceBetweenBends',
            label: parallelOffsetCopy.results.distanceBetweenBends,
            inches: result.distanceBetweenBends,
            display: result.distanceBetweenBendsFormatted ?? '—',
          },
          {
            key: 'totalRackShift',
            label: parallelOffsetCopy.results.totalShift,
            inches: result.totalRackShift,
            display: result.totalRackShiftFormatted,
          },
        ]
      : [];

  const fieldSteps: FieldStep[] = result.isValid
    ? result.mode === 'simple'
      ? [
          {
            order: 1,
            key: 'shiftBothMarks',
            title: parallelOffsetCopy.results.adjustment,
            detail: 'Shift both bend marks by this amount on each successive conduit.',
            inches: result.adjustmentPerConduit,
            display: result.adjustmentPerConduitFormatted,
          },
        ]
      : result.conduits.map((conduit, index) => ({
          order: index + 1,
          key: `conduit${conduit.conduitNumber}`,
          title: `Pipe ${conduit.conduitNumber}`,
          detail:
            conduit.display.mark1 && conduit.display.mark2
              ? `Mark 1 ${conduit.display.mark1} · Mark 2 ${conduit.display.mark2}`
              : `Shift both marks ${conduit.display.cumulativeShift} from Pipe 1.`,
          inches: conduit.cumulativeShift,
          display: conduit.display.cumulativeShift,
        }))
    : [];

  const sourceNotes: SourceNote[] = [
    {
      key: 'parallelShiftFormula',
      kind: 'table',
      message: 'Parallel shift uses C-C spacing × tan(half the bend angle).',
    },
    {
      key: 'benderSetupOnly',
      kind: 'bender',
      message: `Bender: ${result.benderProfileUsed.name} (setup only; no chart value used).`,
    },
  ];
  if (result.mode === 'layout') {
    sourceNotes.push({
      key: 'offsetGeometry',
      kind: 'assumption',
      message: 'Distance between bends uses exact offset geometry: height ÷ sin(angle).',
    });
  }

  return {
    calculatorId: 'parallelOffset',
    status: deriveCalculationStatus(result.isValid, result.warnings),
    primaryResults,
    secondaryResults,
    warnings: result.warnings,
    assumptions: [
      'All conduits are the same size and use the same bender shoe radius.',
      'Both marks on each conduit move by the same cumulative shift.',
      'Center-to-center spacing is measured perpendicular to the straight runs.',
    ],
    setupSnapshot: snapshotSetupFromInput(input),
    benderProfile: result.benderProfileUsed,
    rawValuesInches: {
      centerSpacing: result.centerSpacing,
      adjustmentPerConduit: result.adjustmentPerConduit,
      totalRackShift: result.totalRackShift,
      offsetHeight: result.offsetHeight,
      distanceBetweenBends: result.distanceBetweenBends,
    },
    displayValues: {
      centerSpacing: result.centerSpacingFormatted,
      adjustmentPerConduit: result.adjustmentPerConduitFormatted,
      totalRackShift: result.totalRackShiftFormatted,
      offsetHeight: result.offsetHeightFormatted,
      distanceBetweenBends: result.distanceBetweenBendsFormatted,
    },
    fieldSteps,
    sourceNotes,
    formulaValues: {
      bendAngle: result.bendAngle,
      halfAngle: result.bendAngle / 2,
      adjustmentFactor: result.adjustmentFactor,
      conduitCount: result.conduitCount,
    },
    specific: {
      mode: result.mode,
      bendAngle: result.bendAngle,
      adjustmentFactor: result.adjustmentFactor,
      conduitCount: result.conduitCount,
      shiftDirection: result.shiftDirection,
      diagramData: result.diagramData,
    },
  };
}

