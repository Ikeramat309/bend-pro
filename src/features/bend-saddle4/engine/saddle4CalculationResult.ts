/**
 * Maps 4-Point Saddle engine output to the shared calculation result contract.
 */
import {
  deriveCalculationStatus,
  snapshotSetupFromInput,
  type CalculationResult,
  type FieldStep,
  type SourceNote,
} from '@/core/calculations';

import { saddle4Copy } from '../saddle4.copy';
import { getSaddle4AngleData } from './saddle4AngleData';
import type { Saddle4DiagramData, Saddle4EngineInput, Saddle4EngineResult } from './saddle4.types';

export type Saddle4CalculationSpecific = {
  bendAngle: Saddle4EngineResult['bendAngle'];
  multiplier: number;
  shrinkPerInch: number;
  shrinkToCenter: number;
  diagramData?: Saddle4DiagramData;
};

function hasDistanceToCenter(input: Saddle4EngineInput): boolean {
  return input.distanceToCenter !== undefined && Number.isFinite(input.distanceToCenter);
}

export function toSaddle4CalculationResult(
  input: Saddle4EngineInput,
  result: Saddle4EngineResult,
): CalculationResult<'saddle4', Saddle4CalculationSpecific> {
  const status = deriveCalculationStatus(result.isValid, result.warnings);
  const showCenterAsHero = result.isValid && hasDistanceToCenter(input);
  const angleLabel = getSaddle4AngleData(input.bendAngle).label;

  const primaryResults = result.isValid
    ? [
        showCenterAsHero && result.centerMarkFormatted
          ? {
              key: 'centerMark',
              label: saddle4Copy.results.centerMark,
              inches: result.centerMark,
              display: result.centerMarkFormatted,
            }
          : {
              key: 'betweenBends',
              label: saddle4Copy.results.betweenBends,
              inches: result.betweenBends,
              display: result.betweenBendsFormatted,
            },
      ]
    : [];

  const secondaryResults = result.isValid
    ? showCenterAsHero
      ? [
          {
            key: 'betweenBends',
            label: saddle4Copy.results.betweenBends,
            inches: result.betweenBends,
            display: result.betweenBendsFormatted,
          },
          {
            key: 'shrink',
            label: saddle4Copy.results.shrink,
            inches: result.shrink,
            display: result.shrinkFormatted,
          },
        ]
      : [
          {
            key: 'shrink',
            label: saddle4Copy.results.shrink,
            inches: result.shrink,
            display: result.shrinkFormatted,
          },
        ]
    : [];

  const fieldSteps: FieldStep[] = [];
  let stepOrder = 1;

  if (result.isValid && result.centerMark !== undefined && result.centerMarkFormatted) {
    fieldSteps.push({
      order: stepOrder++,
      key: 'centerMark',
      title: saddle4Copy.results.centerMark,
      inches: result.centerMark,
      display: result.centerMarkFormatted,
    });
  }

  if (result.isValid) {
    fieldSteps.push({
      order: stepOrder++,
      key: 'betweenBends',
      title: saddle4Copy.results.betweenBends,
      inches: result.betweenBends,
      display: result.betweenBendsFormatted,
    });
  }

  if (result.isValid && result.saddleWidth !== undefined && result.saddleWidthFormatted) {
    fieldSteps.push({
      order: stepOrder++,
      key: 'saddleWidth',
      title: saddle4Copy.fields.saddleWidth.label,
      inches: result.saddleWidth,
      display: result.saddleWidthFormatted,
    });
  }

  for (const [key, title, inches, display] of [
    ['outerMark1', `${saddle4Copy.diagram.outer} Mark 1`, result.outerMark1, result.outerMark1Formatted],
    ['innerMark1', `${saddle4Copy.diagram.top} Mark 1`, result.innerMark1, result.innerMark1Formatted],
    ['innerMark2', `${saddle4Copy.diagram.top} Mark 2`, result.innerMark2, result.innerMark2Formatted],
    ['outerMark2', `${saddle4Copy.diagram.outer} Mark 2`, result.outerMark2, result.outerMark2Formatted],
  ] as const) {
    if (result.isValid && inches !== undefined && display) {
      fieldSteps.push({ order: stepOrder++, key, title, inches, display });
    }
  }

  if (result.isValid) {
    fieldSteps.push({
      order: stepOrder++,
      key: 'shrink',
      title: saddle4Copy.results.shrink,
      inches: result.shrink,
      display: result.shrinkFormatted,
    });
  }

  const sourceNotes: SourceNote[] = [
    {
      key: 'benderProfile',
      kind: 'bender',
      message: `Bender: ${result.benderProfileUsed.name}`,
    },
    {
      key: 'angleTable',
      kind: 'table',
      message: `Standard ${angleLabel} offset table applied twice.`,
    },
  ];

  if (result.isValid && !hasDistanceToCenter(input)) {
    sourceNotes.push({
      key: 'markWorkflow',
      kind: 'info',
      message:
        'Absolute mark field steps require Distance to Center — without it the engine exposes spacing/shrink only.',
    });
  }

  if (result.isValid && input.saddleWidth === undefined) {
    sourceNotes.push({
      key: 'saddleWidth',
      kind: 'info',
      message: 'Inner mark spacing uses default geometry when Saddle Width is not entered.',
    });
  }

  return {
    calculatorId: 'saddle4',
    status,
    primaryResults,
    secondaryResults,
    warnings: result.warnings,
    assumptions: [
      `All four bends at ${result.bendAngle}°.`,
      'Between-bends spacing from the standard offset table.',
    ],
    setupSnapshot: snapshotSetupFromInput(input),
    benderProfile: result.benderProfileUsed,
    rawValuesInches: {
      obstructionHeight: result.obstructionHeight,
      saddleWidth: result.saddleWidth,
      betweenBends: result.betweenBends,
      shrink: result.shrink,
      shrinkToCenter: result.shrinkToCenter,
      centerMark: result.centerMark,
      outerMark1: result.outerMark1,
      innerMark1: result.innerMark1,
      innerMark2: result.innerMark2,
      outerMark2: result.outerMark2,
    },
    displayValues: {
      obstructionHeight: result.obstructionHeightFormatted,
      saddleWidth: result.saddleWidthFormatted,
      betweenBends: result.betweenBendsFormatted,
      shrink: result.shrinkFormatted,
      centerMark: result.centerMarkFormatted,
      outerMark1: result.outerMark1Formatted,
      innerMark1: result.innerMark1Formatted,
      innerMark2: result.innerMark2Formatted,
      outerMark2: result.outerMark2Formatted,
    },
    fieldSteps,
    sourceNotes,
    formulaValues: {
      bendAngle: result.bendAngle,
      multiplier: result.multiplier,
      shrinkPerInch: result.shrinkPerInch,
      shrinkToCenter: result.shrinkToCenter,
    },
    specific: {
      bendAngle: result.bendAngle,
      multiplier: result.multiplier,
      shrinkPerInch: result.shrinkPerInch,
      shrinkToCenter: result.shrinkToCenter,
      diagramData: result.diagramData,
    },
  };
}
