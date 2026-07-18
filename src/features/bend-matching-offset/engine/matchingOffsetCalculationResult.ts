/** Maps Matching Offset engine output to the shared calculation result contract. */
import {
  deriveCalculationStatus,
  snapshotSetupFromInput,
  type CalculationResult,
  type FieldStep,
  type SourceNote,
} from '@/core/calculations';

import { matchingOffsetCopy } from '../matchingOffset.copy';
import type {
  MatchingOffsetDiagramData,
  MatchingOffsetEngineInput,
  MatchingOffsetEngineResult,
  MatchingOffsetMode,
} from './matchingOffset.types';

export type MatchingOffsetCalculationSpecific = {
  mode: MatchingOffsetMode;
  bendAngleDegrees: number;
  multiplier: number;
  shrinkPerInch: number;
  angleExecution: MatchingOffsetEngineResult['angleExecution'];
  diagramData?: MatchingOffsetDiagramData;
};

export function toMatchingOffsetCalculationResult(
  input: MatchingOffsetEngineInput,
  result: MatchingOffsetEngineResult,
): CalculationResult<'matchingOffset', MatchingOffsetCalculationSpecific> {
  const status = deriveCalculationStatus(result.isValid, result.warnings);
  const primaryResults = result.isValid
    ? [
        {
          key: 'bendAngle',
          label: matchingOffsetCopy.results.bendAngle,
          display: result.bendAngleFormatted,
        },
      ]
    : [];
  const secondaryResults = result.isValid
    ? [
        {
          key: 'distanceBetweenBends',
          label: matchingOffsetCopy.results.distanceBetweenBends,
          inches: result.distanceBetweenBends,
          display: result.distanceBetweenBendsFormatted,
        },
        {
          key: 'angleMethod',
          label: matchingOffsetCopy.results.angleMethod,
          display: result.angleExecution.requiresAngleTool
            ? matchingOffsetCopy.results.angleTool
            : matchingOffsetCopy.results.commonAngle,
        },
      ]
    : [];

  const fieldSteps: FieldStep[] = result.isValid
    ? [
        {
          order: 1,
          key: result.mode === 'centers' ? 'adjacent' : 'referenceDistanceBetweenBends',
          title:
            result.mode === 'centers'
              ? matchingOffsetCopy.results.adjacent
              : matchingOffsetCopy.fields.referenceDistanceBetweenBends.label,
          inches:
            result.mode === 'centers' ? result.adjacent : result.distanceBetweenBends,
          display:
            result.mode === 'centers'
              ? result.adjacentFormatted
              : result.distanceBetweenBendsFormatted,
          detail:
            result.mode === 'centers'
              ? 'Measure the straight-run projection between the two bend-center stations.'
              : 'Measure along the existing conduit from bend center to bend center.',
        },
        {
          order: 2,
          key: 'distanceBetweenBends',
          title: matchingOffsetCopy.results.distanceBetweenBends,
          inches: result.distanceBetweenBends,
          display: result.distanceBetweenBendsFormatted,
          detail: 'Transfer this center-to-center spacing to the matching conduit.',
        },
        {
          order: 3,
          key: 'bendAngle',
          title: matchingOffsetCopy.results.bendAngle,
          display: result.bendAngleFormatted,
          detail: result.angleExecution.requiresAngleTool
            ? 'Use an angle tool and calibrated bend-center reference. Make two equal opposite bends.'
            : 'Use the common angle and a calibrated bend-center reference. Make two equal opposite bends.',
        },
      ]
    : [];

  const sourceNotes: SourceNote[] = [
    {
      key: 'geometry',
      kind: 'assumption',
      message: 'Right-triangle centerline geometry (cosecant method).',
    },
    {
      key: 'benderProfile',
      kind: 'info',
      message: `Bender: ${result.benderProfileUsed.name} (setup only; it does not change this calculation).`,
    },
  ];
  if (result.isValid) {
    sourceNotes.push({
      key: 'angleExecution',
      kind: 'info',
      message: result.angleExecution.requiresAngleTool
        ? `Exact ${result.bendAngleFormatted}: use an angle tool and a calibrated bend-center reference. The nearby ${result.angleExecution.nearestCommonAngleFormatted} layout is a comparison, not a substitute.`
        : `${result.bendAngleFormatted} is a common field angle; still locate both bend centers with a calibrated reference.`,
    });
  }
  const comparison = result.angleExecution.comparison;
  if (result.isValid && comparison) {
    const centersDirection = comparison.distanceBetweenBendsDelta < 0 ? 'shorter' : 'longer';
    const runDirection = comparison.adjacentDelta < 0 ? 'shorter' : 'longer';
    sourceNotes.push({
      key: 'commonAngleComparison',
      kind: 'info',
      message: `${comparison.angleFormatted} comparison: Centers Apart ${comparison.distanceBetweenBendsFormatted} (${comparison.distanceBetweenBendsDeltaFormatted} ${centersDirection}); Along Run ${comparison.adjacentFormatted} (${comparison.adjacentDeltaFormatted} ${runDirection}).`,
    });
  }

  return {
    calculatorId: 'matchingOffset',
    status,
    primaryResults,
    secondaryResults,
    warnings: result.warnings,
    assumptions: [
      'Both methods reference bend centers; Match Centers uses their straight-run projection.',
      'The two bends are equal and opposite.',
      'Bender radius and springback corrections are not applied.',
    ],
    setupSnapshot: snapshotSetupFromInput(input),
    benderProfile: result.benderProfileUsed,
    rawValuesInches: {
      offsetHeight: result.offsetHeight,
      distanceBetweenBends: result.distanceBetweenBends,
      adjacent: result.adjacent,
      shrink: result.shrink,
    },
    displayValues: {
      offsetHeight: result.offsetHeightFormatted,
      distanceBetweenBends: result.distanceBetweenBendsFormatted,
      adjacent: result.adjacentFormatted,
      shrink: result.shrinkFormatted,
      bendAngle: result.bendAngleFormatted,
    },
    fieldSteps,
    sourceNotes,
    formulaValues: {
      mode: result.mode,
      bendAngleDegrees: result.bendAngleDegrees,
      multiplier: result.multiplier,
      shrinkPerInch: result.shrinkPerInch,
      requiresAngleTool: result.angleExecution.requiresAngleTool,
      nearestCommonAngleDegrees: result.angleExecution.nearestCommonAngleDegrees,
    },
    specific: {
      mode: result.mode,
      bendAngleDegrees: result.bendAngleDegrees,
      multiplier: result.multiplier,
      shrinkPerInch: result.shrinkPerInch,
      angleExecution: result.angleExecution,
      diagramData: result.diagramData,
    },
  };
}
