/**
 * Maps Segment Bend engine output to the shared calculation result contract.
 */
import {
  deriveCalculationStatus,
  snapshotSetupFromInput,
  type CalculationResult,
  type FieldStep,
  type SourceNote,
} from '@/core/calculations';

import { segmentCopy } from '../segment.copy';
import type { SegmentDiagramData, SegmentEngineInput, SegmentEngineResult } from './segment.types';

export type SegmentCalculationSpecific = {
  totalAngle: number;
  requestedDegreesPerBend: number;
  marks?: number[];
  diagramData?: SegmentDiagramData;
};

export function toSegmentCalculationResult(
  input: SegmentEngineInput,
  result: SegmentEngineResult,
): CalculationResult<'segment', SegmentCalculationSpecific> {
  const status = deriveCalculationStatus(result.isValid, result.warnings);

  const primaryResults = result.isValid
    ? [
        {
          key: 'spacing',
          label: segmentCopy.results.spacing,
          inches: result.spacing,
          display: result.spacingFormatted,
        },
      ]
    : [];

  const secondaryResults = result.isValid
    ? [
        {
          key: 'degreesPerBend',
          label: segmentCopy.results.perBend,
          display: result.degreesPerBendFormatted,
        },
        {
          key: 'numberOfBends',
          label: segmentCopy.results.bends,
          display: result.numberOfBendsFormatted,
        },
      ]
    : [];

  const fieldSteps: FieldStep[] = [];
  let stepOrder = 1;

  if (result.isValid) {
    fieldSteps.push({
      order: stepOrder++,
      key: 'numberOfBends',
      title: segmentCopy.results.bends,
      display: result.numberOfBendsFormatted,
    });
    fieldSteps.push({
      order: stepOrder++,
      key: 'degreesPerBend',
      title: segmentCopy.results.perBend,
      display: result.degreesPerBendFormatted,
    });
    fieldSteps.push({
      order: stepOrder++,
      key: 'spacing',
      title: segmentCopy.results.spacing,
      inches: result.spacing,
      display: result.spacingFormatted,
    });
    fieldSteps.push({
      order: stepOrder++,
      key: 'developedLength',
      title: segmentCopy.results.developedLength,
      inches: result.developedLength,
      display: result.developedLengthFormatted,
    });
  }

  if (result.isValid && result.firstMark !== undefined && result.firstMarkFormatted) {
    fieldSteps.push({
      order: stepOrder++,
      key: 'firstMark',
      title: 'First Mark',
      inches: result.firstMark,
      display: result.firstMarkFormatted,
    });
  }

  if (result.isValid && result.lastMark !== undefined && result.lastMarkFormatted) {
    fieldSteps.push({
      order: stepOrder++,
      key: 'lastMark',
      title: 'Last Mark',
      inches: result.lastMark,
      display: result.lastMarkFormatted,
    });
  }

  const sourceNotes: SourceNote[] = [
    {
      key: 'benderProfile',
      kind: 'bender',
      message: `Bender: ${result.benderProfileUsed.name}`,
    },
    {
      key: 'geometry',
      kind: 'assumption',
      message: segmentCopy.profileContext,
    },
  ];

  if (result.isValid && result.marks && result.marks.length > 2) {
    sourceNotes.push({
      key: 'intermediateMarks',
      kind: 'info',
      message: `${result.marks.length} absolute marks are in specific.marks — field steps show first/last only.`,
    });
  }

  if (result.isValid && input.startOffset === undefined) {
    sourceNotes.push({
      key: 'markWorkflow',
      kind: 'info',
      message: 'Absolute mark field steps require Start of Bend — spacing and shot count still apply.',
    });
  }

  return {
    calculatorId: 'segment',
    status,
    primaryResults,
    secondaryResults,
    warnings: result.warnings,
    assumptions: [
      'Segment spacing is geometric — based on radius and angle.',
      `Arc length = radius × total angle (${result.totalAngleFormatted}).`,
    ],
    setupSnapshot: snapshotSetupFromInput(input),
    benderProfile: result.benderProfileUsed,
    rawValuesInches: {
      radius: result.radius,
      spacing: result.spacing,
      developedLength: result.developedLength,
      startOffset: result.startOffset,
      firstMark: result.firstMark,
      lastMark: result.lastMark,
    },
    displayValues: {
      radius: result.radiusFormatted,
      spacing: result.spacingFormatted,
      developedLength: result.developedLengthFormatted,
      numberOfBends: result.numberOfBendsFormatted,
      degreesPerBend: result.degreesPerBendFormatted,
      firstMark: result.firstMarkFormatted,
      lastMark: result.lastMarkFormatted,
    },
    fieldSteps,
    sourceNotes,
    formulaValues: {
      totalAngle: result.totalAngle,
      requestedDegreesPerBend: result.requestedDegreesPerBend,
      numberOfBends: result.numberOfBends,
      degreesPerBend: result.degreesPerBend,
    },
    specific: {
      totalAngle: result.totalAngle,
      requestedDegreesPerBend: result.requestedDegreesPerBend,
      marks: result.marks,
      diagramData: result.diagramData,
    },
  };
}
