import { useRouter } from 'expo-router';
import { useMemo, useState } from 'react';

import { snapshotSetupFromInput } from '@/core/calculations';
import { getCalculatorById } from '@/core/calculators';
import { patchCalculatorSetup, useCalculatorSetup } from '@/core/settings';
import { usePersistRecentLayout, useRestoreRecentLayout } from '@/core/sessions';
import { parseStrictPositiveDecimal } from '@/core/validation';
import { DEFAULT_CONDUIT_TYPE } from '@/data/conduit';
import { getBenderProfile, formatSegmentTrustTitle, formatSetupOnlyBenderMeta } from '@/data/benders';
import { Routes, guideRoute } from '@/navigation';
import {
  BendCalculatorLayout,
  EditSetupSheet,
  type SetupValues,
} from '@/shared/workspace';
import { getRoundingLabel } from '@/utils/rounding';
import { getLengthUnitLabel, getLengthInputMode, getUnitSystemLabel } from '@/utils/units';
import { parseLengthInput } from '@/utils/parseLengthInput';

import { calculateSegment } from '../engine/segment.engine';
import { toSegmentCalculationResult } from '../engine/segmentCalculationResult';
import {
  createSegmentInputSnapshot,
  restoreSegmentFromLayout,
  toStoredInputSnapshot,
} from '../engine/segmentInputSnapshot';
import { SEGMENT_CONFIG } from '../segment.config';
import { segmentCopy } from '../segment.copy';
import { SegmentDiagram } from './SegmentDiagram';

/** Plain positive-number parse for angle fields (degrees, no unit conversion). */
function parseAngleInput(text: string): number | undefined {
  return parseStrictPositiveDecimal(text);
}

export default function SegmentScreen() {
  const router = useRouter();

  const [radiusText, setRadiusText] = useState('');
  const [totalAngleText, setTotalAngleText] = useState(String(SEGMENT_CONFIG.defaultTotalAngle));
  const [degreesPerBendText, setDegreesPerBendText] = useState(
    String(SEGMENT_CONFIG.defaultDegreesPerBend),
  );
  const [startOffsetText, setStartOffsetText] = useState('');
  const [showStartInput, setShowStartInput] = useState(false);
  const [setupVisible, setSetupVisible] = useState(false);

  useRestoreRecentLayout('segment', restoreSegmentFromLayout, (fields) => {
    setRadiusText(fields.radiusText);
    setTotalAngleText(fields.totalAngleText);
    setDegreesPerBendText(fields.degreesPerBendText);
    setStartOffsetText(fields.startOffsetText);
    setShowStartInput(fields.showStartInput);
  });

  const { setup, setSetup } = useCalculatorSetup();
  const { unit, rounding, conduitType, conduitSize, benderProfileId, customBenderProfiles } = setup;

  const benderProfile = getBenderProfile(benderProfileId, customBenderProfiles);
  const radius = parseLengthInput(radiusText);
  const totalAngle = parseAngleInput(totalAngleText);
  const degreesPerBend = parseAngleInput(degreesPerBendText);
  const startOffset = parseLengthInput(startOffsetText);
  const hasStart = startOffset !== undefined;
  const unitLabel = getLengthUnitLabel(unit);
  const setupSummary = `${conduitType} ${conduitSize}"`;
  const setupSubtitle = `${getUnitSystemLabel(unit)} • ${getRoundingLabel(rounding)}`;
  const hasValidRadius = radius !== undefined && radius > 0;
  const hasValidAngles = totalAngle !== undefined && degreesPerBend !== undefined;
  const hasValidInputs = hasValidRadius && hasValidAngles;
  const lengthInput = getLengthInputMode(unit);

  const engineInput = useMemo(
    () => ({
      radius: radius ?? Number.NaN,
      totalAngle: totalAngle ?? Number.NaN,
      degreesPerBend: degreesPerBend ?? Number.NaN,
      startOffset: hasStart ? startOffset : undefined,
      benderProfileId,
      conduitType,
      tradeSize: conduitSize,
      unitSystem: unit,
      roundingPrecision: rounding,
      customBenderProfiles,
    }),
    [
      benderProfileId,
      conduitSize,
      conduitType,
      customBenderProfiles,
      degreesPerBend,
      hasStart,
      radius,
      rounding,
      startOffset,
      totalAngle,
      unit,
    ],
  );

  const result = useMemo(() => calculateSegment(engineInput), [engineInput]);

  const calculationResult = useMemo(
    () => toSegmentCalculationResult(engineInput, result),
    [engineInput, result],
  );

  usePersistRecentLayout({
    calculatorId: 'segment',
    calculatorTitle: getCalculatorById('segment')?.title ?? 'Segment Bend',
    inputSnapshot: toStoredInputSnapshot(createSegmentInputSnapshot(engineInput)),
    setupSnapshot: snapshotSetupFromInput(engineInput),
    calculationResult,
    enabled: radiusText.trim() !== '' || totalAngleText.trim() !== '',
  });

  const spacingValue = hasValidInputs ? result.spacingFormatted : '—';
  const perBendValue = hasValidInputs ? result.degreesPerBendFormatted : '—';
  const bendsValue = hasValidInputs ? result.numberOfBendsFormatted : '—';

  const secondaryResults = hasValidInputs
    ? [
        { label: segmentCopy.results.perBend, value: perBendValue },
        { label: segmentCopy.results.bends, value: bendsValue },
      ]
    : undefined;

  const startError =
    startOffsetText.trim() !== '' && startOffset === undefined
      ? segmentCopy.fields.startOffset.errorInvalid
      : undefined;

  const inputsStarted = radiusText.trim() !== '';
  const visibleWarnings = inputsStarted ? result.warnings : [];

  function handleBackPress() {
    const safeRouter = router as typeof router & { canGoBack?: () => boolean };

    if (typeof safeRouter.canGoBack === 'function' && safeRouter.canGoBack()) {
      router.back();
      return;
    }

    router.replace(Routes.home);
  }

  function applySetup(nextSetup: SetupValues) {
    setSetup(
      patchCalculatorSetup(setup, {
        conduitType: DEFAULT_CONDUIT_TYPE,
        conduitSize: nextSetup.conduitSize,
        benderProfileId: nextSetup.benderProfileId,
        unit: nextSetup.unit,
        rounding: nextSetup.rounding,
      }),
    );
    setSetupVisible(false);
  }

  function resetInputs() {
    setRadiusText('');
    setTotalAngleText(String(SEGMENT_CONFIG.defaultTotalAngle));
    setDegreesPerBendText(String(SEGMENT_CONFIG.defaultDegreesPerBend));
    setStartOffsetText('');
    setShowStartInput(false);
  }

  function removeStartInput() {
    setStartOffsetText('');
    setShowStartInput(false);
  }

  return (
    <BendCalculatorLayout
      title={segmentCopy.screenTitle}
      subtitle=""
      centerTitle
      inputDensity="compact"
      workspaceDensity="compact"
      onBackPress={handleBackPress}
      trust={{
        benderName: formatSegmentTrustTitle(),
        meta: [formatSetupOnlyBenderMeta(benderProfile.name), setupSummary, setupSubtitle].join(' • '),
        onEdit: () => setSetupVisible(true),
      }}
      inputs={[
        {
          type: 'row',
          key: 'radius-angle',
          inputs: [
            {
              type: 'field',
              key: 'radius',
              label: segmentCopy.fields.radius.label,
              value: radiusText,
              onChangeText: setRadiusText,
              placeholder: segmentCopy.fields.radius.placeholder,
              unit: unitLabel,
              variant: 'compact',
              lengthInput,
              error:
                radiusText !== '' && !hasValidRadius
                  ? segmentCopy.fields.radius.errorRequired
                  : undefined,
            },
            {
              type: 'field',
              key: 'totalAngle',
              label: segmentCopy.fields.totalAngle.label,
              value: totalAngleText,
              onChangeText: setTotalAngleText,
              placeholder: segmentCopy.fields.totalAngle.placeholder,
              unit: segmentCopy.degreeUnit,
              variant: 'compact',
              keyboardType: 'decimal-pad',
              error:
                totalAngleText !== '' && totalAngle === undefined
                  ? segmentCopy.fields.totalAngle.errorRequired
                  : undefined,
            },
          ],
        },
        {
          type: 'row',
          key: 'per-bend',
          inputs: [
            {
              type: 'field',
              key: 'degreesPerBend',
              label: segmentCopy.fields.degreesPerBend.label,
              value: degreesPerBendText,
              onChangeText: setDegreesPerBendText,
              placeholder: segmentCopy.fields.degreesPerBend.placeholder,
              unit: segmentCopy.degreeUnit,
              variant: 'compact',
              keyboardType: 'decimal-pad',
              error:
                degreesPerBendText !== '' && degreesPerBend === undefined
                  ? segmentCopy.fields.degreesPerBend.errorRequired
                  : undefined,
            },
            ...(showStartInput
              ? [
                  {
                    type: 'field' as const,
                    key: 'startField',
                    label: segmentCopy.fields.startOffset.label,
                    value: startOffsetText,
                    onChangeText: setStartOffsetText,
                    placeholder: segmentCopy.fields.startOffset.placeholder,
                    unit: unitLabel,
                    variant: 'compact' as const,
                    lengthInput,
                    error: startError,
                  },
                ]
              : []),
          ],
        },
      ]}
      workspace={
        <SegmentDiagram
          data={result.diagramData}
          isEmpty={!hasValidInputs}
          isInvalid={inputsStarted && !hasValidInputs}
        />
      }
      primaryResult={
        hasValidInputs
          ? { label: segmentCopy.results.spacing, value: spacingValue }
          : undefined
      }
      secondaryResults={secondaryResults}
      dock={{
        left: [{ key: 'reset', label: 'Reset', onPress: resetInputs }],
        center: showStartInput
          ? {
              key: 'remove-start',
              label: 'Remove Start',
              variant: 'pill',
              onPress: removeStartInput,
            }
          : {
              key: 'set-start',
              label: segmentCopy.fields.startOffset.addButton,
              variant: 'pill',
              onPress: () => setShowStartInput(true),
            },
        guide: { onPress: () => router.push(guideRoute('segment')) },
      }}
      warnings={visibleWarnings}
      footer={
        <EditSetupSheet
          visible={setupVisible}
          values={{
            conduitType,
            conduitSize,
            benderProfileId,
            unit,
            rounding,
            bendAngle: 45,
          }}
          onCancel={() => setSetupVisible(false)}
          onApply={applySetup}
        />
      }
    />
  );
}
