import { useRouter } from 'expo-router';
import { useMemo, useState } from 'react';

import { snapshotSetupFromInput } from '@/core/calculations';
import { getCalculatorById } from '@/core/calculators';
import { patchCalculatorSetup, useCalculatorSetup } from '@/core/settings';
import { usePersistRecentLayout, useRestoreRecentLayout } from '@/core/sessions';
import { DEFAULT_CONDUIT_TYPE } from '@/data/conduit';
import { getBenderProfile, formatSetupOnlyBenderMeta, formatStandardSaddleTableTrustTitle } from '@/data/benders';
import { Routes, guideRoute } from '@/navigation';
import { LengthInputSheet, OptionChipGroup, Sheet } from '@/shared/ui';
import {
  BendCalculatorLayout,
  EditSetupSheet,
  OptionalInputSummary,
  type BendFieldInputConfig,
  type BendInputConfig,
  type BendPickerInputConfig,
  type SetupValues,
} from '@/shared/workspace';
import { getRoundingLabel } from '@/utils/rounding';
import { getLengthUnitLabel, getLengthInputMode, getUnitSystemLabel } from '@/utils/units';
import { parseLengthInput } from '@/utils/parseLengthInput';

import { calculateSaddle4 } from '../engine/saddle4.engine';
import { toSaddle4CalculationResult } from '../engine/saddle4CalculationResult';
import {
  createSaddle4InputSnapshot,
  restoreSaddle4FromLayout,
  toStoredInputSnapshot,
} from '../engine/saddle4InputSnapshot';
import { getSaddle4AngleData, SADDLE4_ANGLE_DATA } from '../engine/saddle4AngleData';
import type { Saddle4Angle } from '../engine/saddle4.types';
import { SADDLE4_CONFIG } from '../saddle4.config';
import { saddle4Copy } from '../saddle4.copy';
import { Saddle4Diagram } from './Saddle4Diagram';

const ANGLE_LABELS = SADDLE4_CONFIG.validAngles.map((angle) => SADDLE4_ANGLE_DATA[angle].label);

export default function Saddle4Screen() {
  const router = useRouter();

  const [obstructionHeightText, setObstructionHeightText] = useState('');
  const [saddleWidthText, setSaddleWidthText] = useState('');
  const [showSaddleWidthInput, setShowSaddleWidthInput] = useState(false);
  const [distanceToCenterText, setDistanceToCenterText] = useState('');
  const [distanceSheetVisible, setDistanceSheetVisible] = useState(false);
  const [bendAngle, setBendAngle] = useState<Saddle4Angle>(SADDLE4_CONFIG.defaultAngle);
  const [setupVisible, setSetupVisible] = useState(false);
  const [angleSheetVisible, setAngleSheetVisible] = useState(false);

  useRestoreRecentLayout('saddle4', restoreSaddle4FromLayout, (fields) => {
    setObstructionHeightText(fields.obstructionHeightText);
    setSaddleWidthText(fields.saddleWidthText);
    setShowSaddleWidthInput(fields.showSaddleWidthInput);
    setDistanceToCenterText(fields.distanceToCenterText);
    setBendAngle(fields.bendAngle);
  });

  const { setup, setSetup } = useCalculatorSetup();
  const { unit, rounding, conduitType, conduitSize, benderProfileId, customBenderProfiles } = setup;

  const benderProfile = getBenderProfile(benderProfileId, customBenderProfiles);
  const angleData = getSaddle4AngleData(bendAngle);
  const obstructionHeight = parseLengthInput(obstructionHeightText);
  const saddleWidth = parseLengthInput(saddleWidthText);
  const distanceToCenter = parseLengthInput(distanceToCenterText);
  const hasDistance = distanceToCenter !== undefined;
  const unitLabel = getLengthUnitLabel(unit);
  const setupSummary = `${conduitType} ${conduitSize}"`;
  const setupSubtitle = `${getUnitSystemLabel(unit)} • ${getRoundingLabel(rounding)}`;
  const hasValidHeight = obstructionHeight !== undefined && obstructionHeight > 0;
  const hasValidWidth = saddleWidth !== undefined && saddleWidth > 0;
  const hasValidInputs = hasValidHeight;
  const setupOnlyMeta = formatSetupOnlyBenderMeta(benderProfile.name);
  const lengthInput = getLengthInputMode(unit);

  const engineInput = useMemo(
    () => ({
      obstructionHeight: obstructionHeight ?? Number.NaN,
      saddleWidth: hasValidWidth ? saddleWidth : undefined,
      distanceToCenter: hasDistance ? distanceToCenter : undefined,
      bendAngle,
      benderProfileId,
      conduitType,
      tradeSize: conduitSize,
      unitSystem: unit,
      roundingPrecision: rounding,
      customBenderProfiles,
    }),
    [
      bendAngle,
      benderProfileId,
      conduitSize,
      conduitType,
      customBenderProfiles,
      distanceToCenter,
      hasDistance,
      obstructionHeight,
      rounding,
      saddleWidth,
      hasValidWidth,
      unit,
    ],
  );

  const result = useMemo(() => calculateSaddle4(engineInput), [engineInput]);

  const calculationResult = useMemo(
    () => toSaddle4CalculationResult(engineInput, result),
    [engineInput, result],
  );

  usePersistRecentLayout({
    calculatorId: 'saddle4',
    calculatorTitle: getCalculatorById('saddle4')?.title ?? '4-Point Saddle',
    inputSnapshot: toStoredInputSnapshot(createSaddle4InputSnapshot(engineInput)),
    setupSnapshot: snapshotSetupFromInput(engineInput),
    calculationResult,
    enabled: obstructionHeightText.trim() !== '',
  });

  const centerMarkValue = hasValidInputs
    ? hasDistance
      ? result.centerMarkFormatted ?? '—'
      : saddle4Copy.results.centerMarkOptional
    : '—';

  const betweenBendsValue = hasValidInputs ? result.betweenBendsFormatted : '—';
  const shrinkValue = hasValidInputs ? result.shrinkFormatted : '—';

  // Field workflow: once a distance is entered, the Center Mark is the first
  // thing the user marks, so it becomes the hero. Otherwise the always-known
  // Between Bends spacing leads.
  const showCenterAsHero = hasValidInputs && hasDistance;
  const primaryLabel = showCenterAsHero
    ? saddle4Copy.results.centerMark
    : saddle4Copy.results.betweenBends;
  const primaryValue = showCenterAsHero ? centerMarkValue : betweenBendsValue;

  const secondaryResults = hasValidInputs
    ? showCenterAsHero
      ? [
          { label: saddle4Copy.results.betweenBends, value: betweenBendsValue },
          { label: saddle4Copy.results.shrink, value: shrinkValue },
        ]
      : [{ label: saddle4Copy.results.shrink, value: shrinkValue }]
    : undefined;

  const inputsStarted = obstructionHeightText.trim() !== '';
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

  function selectAngleByLabel(label: string) {
    const match = SADDLE4_CONFIG.validAngles.find(
      (angle) => SADDLE4_ANGLE_DATA[angle].label === label,
    );
    if (match) setBendAngle(match);
  }

  function resetInputs() {
    setObstructionHeightText('');
    setSaddleWidthText('');
    setShowSaddleWidthInput(false);
    setDistanceToCenterText('');
    setDistanceSheetVisible(false);
  }

  const obstructionHeightInput: BendFieldInputConfig = {
    type: 'field',
    key: 'obstructionHeight',
    label: saddle4Copy.fields.obstructionHeight.label,
    value: obstructionHeightText,
    onChangeText: setObstructionHeightText,
    placeholder: saddle4Copy.fields.obstructionHeight.placeholder,
    unit: unitLabel,
    variant: 'compact',
    lengthInput,
    error:
      obstructionHeightText !== '' && !hasValidHeight
        ? saddle4Copy.fields.obstructionHeight.errorRequired
        : undefined,
  };

  const saddleWidthInput: BendFieldInputConfig = {
    type: 'field',
    key: 'saddleWidthField',
    label: saddle4Copy.fields.saddleWidth.label,
    value: saddleWidthText,
    onChangeText: setSaddleWidthText,
    placeholder: saddle4Copy.fields.saddleWidth.placeholder,
    unit: unitLabel,
    variant: 'compact',
    lengthInput,
    error:
      saddleWidthText !== '' && !hasValidWidth
        ? saddle4Copy.fields.saddleWidth.errorRequired
        : undefined,
  };

  const bendAngleInput: BendPickerInputConfig = {
    type: 'picker',
    key: 'angle',
    label: saddle4Copy.fields.bendAngle.label,
    value: angleData.label,
    onPress: () => setAngleSheetVisible(true),
  };

  // Keep the complete 4-point input flow visible without a hidden third row.
  // Before width is added, height and angle share the first row. Afterwards,
  // height and width pair together and angle moves to the second row.
  const calculatorInputs: BendInputConfig[] = [
    {
      type: 'row',
      key: 'primary-measurements',
      inputs: showSaddleWidthInput
        ? [obstructionHeightInput, saddleWidthInput]
        : [obstructionHeightInput, bendAngleInput],
    },
    ...(showSaddleWidthInput
      ? [bendAngleInput]
      : [
          {
            type: 'optional' as const,
            key: 'saddleWidth',
            addLabel: saddle4Copy.fields.saddleWidth.addButton,
            onAdd: () => setShowSaddleWidthInput(true),
            visible: false,
            field: saddleWidthInput,
          },
        ]),
    ...(distanceToCenterText.trim()
      ? [
          {
            type: 'custom' as const,
            key: 'distanceSummary',
            node: (
              <OptionalInputSummary
                label={saddle4Copy.fields.distanceToCenter.label}
                value={distanceToCenterText}
                unit={unitLabel}
                onPress={() => setDistanceSheetVisible(true)}
              />
            ),
          },
        ]
      : []),
  ];

  return (
    <BendCalculatorLayout
      title={saddle4Copy.screenTitle}
      subtitle=""
      centerTitle
      inputDensity="compact"
      workspaceDensity="compact"
      onBackPress={handleBackPress}
      trust={{
        benderName: formatStandardSaddleTableTrustTitle(angleData.label),
        meta: [setupOnlyMeta, setupSummary, setupSubtitle].filter(Boolean).join(' • '),
        onEdit: () => setSetupVisible(true),
      }}
      inputs={calculatorInputs}
      workspace={
        <Saddle4Diagram
          data={result.diagramData}
          isEmpty={!hasValidInputs}
          isInvalid={obstructionHeightText !== '' && !hasValidHeight}
        />
      }
      primaryResult={
        hasValidInputs ? { label: primaryLabel, value: primaryValue } : undefined
      }
      secondaryResults={secondaryResults}
      dock={{
        left: [{ key: 'reset', label: 'Reset', onPress: resetInputs }],
        center: {
          key: 'set-center',
          label: saddle4Copy.fields.distanceToCenter.addButton,
          variant: 'pill',
          onPress: () => setDistanceSheetVisible(true),
        },
        guide: { onPress: () => router.push(guideRoute('saddle4')) },
      }}
      warnings={visibleWarnings}
      footer={
        <>
          <LengthInputSheet
            visible={distanceSheetVisible}
            label={saddle4Copy.fields.distanceToCenter.label}
            value={distanceToCenterText}
            unit={unitLabel}
            placeholder={saddle4Copy.fields.distanceToCenter.placeholder}
            onCommit={(text) => {
              setDistanceToCenterText(text);
              setDistanceSheetVisible(false);
            }}
            onCancel={() => setDistanceSheetVisible(false)}
          />
          <Sheet
            visible={angleSheetVisible}
            title={saddle4Copy.angleSheetTitle}
            subtitle={saddle4Copy.angleSheetSubtitle}
            onClose={() => setAngleSheetVisible(false)}
            onSecondaryPress={() => setAngleSheetVisible(false)}
            primaryLabel="Done"
            onPrimaryPress={() => setAngleSheetVisible(false)}>
            <OptionChipGroup
              title={saddle4Copy.fields.bendAngle.label}
              options={ANGLE_LABELS}
              selected={angleData.label}
              onSelect={selectAngleByLabel}
            />
          </Sheet>
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
        </>
      }
    />
  );
}
