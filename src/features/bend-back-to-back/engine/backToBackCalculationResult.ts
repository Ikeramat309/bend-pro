/** Maps Back-to-Back engine output to the shared calculation result contract. */
import {
  deriveCalculationStatus,
  snapshotSetupFromInput,
  type CalculationResult,
  type FieldStep,
  type SourceNote,
} from '@/core/calculations';

import { backToBackCopy } from '../backToBack.copy';
import type {
  BackToBackDiagramData,
  BackToBackEngineInput,
  BackToBackEngineResult,
} from './backToBack.types';

export type BackToBackCalculationSpecific = {
  bendAngle: 90;
  directStarMeasurement: true;
  deductSource: BackToBackEngineResult['deductSource'];
  isDeductOverridden: boolean;
  diagramData?: BackToBackDiagramData;
};

export function toBackToBackCalculationResult(
  input: BackToBackEngineInput,
  result: BackToBackEngineResult,
): CalculationResult<'backToBack', BackToBackCalculationSpecific> {
  const status = deriveCalculationStatus(result.isValid, result.warnings);
  const primaryResults =
    result.isValid && result.second90MarkFormatted
      ? [
          {
            key: 'second90Mark',
            label: backToBackCopy.results.second90Mark,
            inches: result.second90Mark,
            display: result.second90MarkFormatted,
          },
        ]
      : [];

  const secondaryResults = result.isValid && result.isFirstStubLayoutValid
    ? [
        {
          key: 'firstDeductMark',
          label: backToBackCopy.results.firstDeductMark,
          inches: result.firstDeductMark,
          display: result.firstDeductMarkFormatted!,
        },
        {
          key: 'deduct',
          label: result.isDeductOverridden
            ? backToBackCopy.results.deductCustom
            : backToBackCopy.results.deduct,
          inches: result.deduct,
          display: result.deductFormatted!,
          tone: result.isDeductOverridden ? ('primary' as const) : undefined,
        },
      ]
    : [];

  const fieldSteps: FieldStep[] = [];
  if (result.isValid && result.isFirstStubLayoutValid && result.firstDeductMarkFormatted) {
    fieldSteps.push({
      order: 1,
      key: 'firstDeductMark',
      title: backToBackCopy.results.firstDeductMark,
      detail: 'Mark from the conduit end, align the arrow, and form the first 90.',
      inches: result.firstDeductMark,
      display: result.firstDeductMarkFormatted,
    });
  } else if (input.firstStubLength === undefined) {
    fieldSteps.push({
      order: 1,
      key: 'first90',
      title: 'First 90',
      detail: 'Form the first 90 before measuring the back-to-back distance.',
    });
  }

  if (result.isValid && result.second90MarkFormatted) {
    fieldSteps.push({
      order: 2,
      key: 'second90Mark',
      title: backToBackCopy.results.second90Mark,
      detail: 'Measure from the back of the first 90, align the star, and bend opposite.',
      inches: result.second90Mark,
      display: result.second90MarkFormatted,
    });
  }

  const sourceNotes: SourceNote[] = [
    {
      key: 'fieldRule',
      kind: 'info',
      message: 'Second 90 mark is measured directly from the back of the first bend to the bender star.',
    },
  ];

  if (input.firstStubLength !== undefined) {
    sourceNotes.unshift({
      key: 'benderProfile',
      kind: 'bender',
      message: `Bender: ${result.benderProfileUsed.name}`,
    });
  }

  return {
    calculatorId: 'backToBack',
    status,
    primaryResults,
    secondaryResults,
    warnings: result.warnings,
    assumptions: [
      'Back-to-back distance is measured from the back of the first 90 to the back of the second.',
      'No gain or setback is computed; the second bend uses the bender star as published by hand-bender manufacturers.',
    ],
    setupSnapshot: snapshotSetupFromInput(input),
    benderProfile: result.benderProfileUsed,
    rawValuesInches: {
      backToBackDistance: result.backToBackDistance,
      second90Mark: result.second90Mark,
      firstStubLength: result.firstStubLength,
      firstDeductMark: result.firstDeductMark,
      deduct: result.deduct,
    },
    displayValues: {
      backToBackDistance: result.backToBackDistanceFormatted,
      second90Mark: result.second90MarkFormatted,
      firstStubLength: result.firstStubLengthFormatted,
      firstDeductMark: result.firstDeductMarkFormatted,
      deduct: result.deductFormatted,
    },
    fieldSteps,
    sourceNotes,
    formulaValues: {
      bendAngle: result.bendAngle,
      directStarMeasurement: true,
      deductSource: result.deductSource,
      isDeductOverridden: result.isDeductOverridden,
    },
    specific: {
      bendAngle: result.bendAngle,
      directStarMeasurement: true,
      deductSource: result.deductSource,
      isDeductOverridden: result.isDeductOverridden,
      diagramData: result.diagramData,
    },
  };
}
