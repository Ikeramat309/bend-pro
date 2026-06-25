import { useRouter } from 'expo-router';
import { useMemo, useState } from 'react';

import { patchCalculatorSetup, useCalculatorSetup } from '@/core/settings';
import { DEFAULT_CONDUIT_TYPE } from '@/data/conduit';
import { getBenderProfile } from '@/data/benders';
import { Routes, guideRoute } from '@/navigation';
import { LengthInputSheet, OptionChipGroup, Sheet } from '@/shared/ui';
import {
  BendCalculatorLayout,
  EditSetupSheet,
  OptionalInputSummary,
  type SetupValues,
} from '@/shared/workspace';
import { getRoundingLabel } from '@/utils/rounding';
import { getLengthUnitLabel, getLengthInputMode, getUnitSystemLabel } from '@/utils/units';
import { parseLengthInput } from '@/utils/parseLengthInput';

import { calculateSaddle3 } from '../engine/saddle3.engine';
import {
  getSaddle3AngleData,
  SADDLE3_ANGLE_DATA,
} from '../engine/saddle3AngleData';
import type { Saddle3AnglePreset } from '../engine/saddle3.types';
import { SADDLE3_CONFIG } from '../saddle3.config';
import { saddle3Copy } from '../saddle3.copy';
import { Saddle3Diagram } from './Saddle3Diagram';

const PRESET_LABELS = SADDLE3_CONFIG.validPresets.map(
  (preset) => SADDLE3_ANGLE_DATA[preset].label,
);

export default function Saddle3Screen() {
  const router = useRouter();

  const [obstructionHeightText, setObstructionHeightText] = useState('');
  const [distanceToCenterText, setDistanceToCenterText] = useState('');
  const [distanceSheetVisible, setDistanceSheetVisible] = useState(false);
  const [anglePreset, setAnglePreset] = useState<Saddle3AnglePreset>(SADDLE3_CONFIG.defaultPreset);
  const [setupVisible, setSetupVisible] = useState(false);
  const [angleSheetVisible, setAngleSheetVisible] = useState(false);

  const { setup, setSetup } = useCalculatorSetup();
  const { unit, rounding, conduitType, conduitSize, benderProfileId, customBenderProfiles } = setup;

  const benderProfile = getBenderProfile(benderProfileId, customBenderProfiles);
  const angleData = getSaddle3AngleData(anglePreset);
  const obstructionHeight = parseLengthInput(obstructionHeightText);
  const distanceToCenter = parseLengthInput(distanceToCenterText);
  const hasDistance = distanceToCenter !== undefined;
  const unitLabel = getLengthUnitLabel(unit);
  const setupSummary = `${conduitType} ${conduitSize}"`;
  const setupSubtitle = `${getUnitSystemLabel(unit)} • ${getRoundingLabel(rounding)}`;
  const hasValidHeight = obstructionHeight !== undefined && obstructionHeight > 0;
  const profileContextMessage = saddle3Copy.profileContext(angleData.label);
  const lengthInput = getLengthInputMode(unit);

  const result = useMemo(
    () =>
      calculateSaddle3({
        obstructionHeight: obstructionHeight ?? Number.NaN,
        distanceToCenter: hasDistance ? distanceToCenter : undefined,
        anglePreset,
        benderProfileId,
        conduitType,
        tradeSize: conduitSize,
        unitSystem: unit,
        roundingPrecision: rounding,
        customBenderProfiles,
      }),
    [
      anglePreset,
      benderProfileId,
      conduitSize,
      conduitType,
      customBenderProfiles,
      distanceToCenter,
      hasDistance,
      obstructionHeight,
      rounding,
      unit,
    ],
  );

  const centerMarkValue = hasValidHeight
    ? hasDistance
      ? result.centerMarkFormatted ?? '—'
      : saddle3Copy.results.centerMarkOptional
    : '—';

  const betweenBendsValue = hasValidHeight ? result.centerToSideFormatted : '—';
  const shrinkValue = hasValidHeight ? result.shrinkFormatted : '—';

  // Field workflow: once a distance is entered, the Center Mark is the first
  // thing the user marks, so it becomes the hero. Otherwise the always-known
  // Between Bends spacing leads.
  const showCenterAsHero = hasValidHeight && hasDistance;
  const primaryLabel = showCenterAsHero
    ? saddle3Copy.results.centerMark
    : saddle3Copy.results.betweenBends;
  const primaryValue = showCenterAsHero ? centerMarkValue : betweenBendsValue;

  const secondaryResults = hasValidHeight
    ? showCenterAsHero
      ? [
          { label: saddle3Copy.results.betweenBends, value: betweenBendsValue },
          { label: saddle3Copy.results.shrink, value: shrinkValue },
        ]
      : [{ label: saddle3Copy.results.shrink, value: shrinkValue }]
    : undefined;

  const visibleWarnings = obstructionHeightText.trim() !== '' ? result.warnings : [];

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

  function selectPresetByLabel(label: string) {
    const match = SADDLE3_CONFIG.validPresets.find(
      (preset) => SADDLE3_ANGLE_DATA[preset].label === label,
    );
    if (match) setAnglePreset(match);
  }

  function resetInputs() {
    setObstructionHeightText('');
    setDistanceToCenterText('');
    setDistanceSheetVisible(false);
  }

  return (
    <BendCalculatorLayout
      title={saddle3Copy.screenTitle}
      subtitle={setupSummary}
      onBackPress={handleBackPress}
      trust={{
        benderName: benderProfile.name,
        meta: setupSubtitle,
        note: profileContextMessage,
        onEdit: () => setSetupVisible(true),
      }}
      inputs={[
        {
          type: 'row',
          key: 'main',
          inputs: [
            {
              type: 'field',
              key: 'obstructionHeight',
              label: saddle3Copy.fields.obstructionHeight.label,
              value: obstructionHeightText,
              onChangeText: setObstructionHeightText,
              placeholder: saddle3Copy.fields.obstructionHeight.placeholder,
              unit: unitLabel,
              variant: 'compact',
              lengthInput,
              error:
                obstructionHeightText !== '' && !hasValidHeight
                  ? saddle3Copy.fields.obstructionHeight.errorRequired
                  : undefined,
            },
            {
              type: 'picker',
              key: 'preset',
              label: saddle3Copy.fields.anglePreset.label,
              value: angleData.label,
              onPress: () => setAngleSheetVisible(true),
            },
          ],
        },
        ...(distanceToCenterText.trim()
          ? [
              {
                type: 'custom' as const,
                key: 'distanceSummary',
                node: (
                  <OptionalInputSummary
                    label={saddle3Copy.fields.distanceToCenter.label}
                    value={distanceToCenterText}
                    unit={unitLabel}
                    onPress={() => setDistanceSheetVisible(true)}
                  />
                ),
              },
            ]
          : []),
      ]}
      workspace={
        <Saddle3Diagram
          data={result.diagramData}
          isEmpty={!hasValidHeight}
          isInvalid={obstructionHeightText !== '' && !hasValidHeight}
        />
      }
      primaryResult={
        hasValidHeight ? { label: primaryLabel, value: primaryValue } : undefined
      }
      secondaryResults={secondaryResults}
      dock={{
        left: [
          { key: 'reset', label: 'Reset', onPress: resetInputs },
          { key: 'set-center', label: 'Set Center', onPress: () => setDistanceSheetVisible(true) },
        ],
        guide: { onPress: () => router.push(guideRoute('saddle3')) },
      }}
      warnings={visibleWarnings}
      footer={
        <>
          <LengthInputSheet
            visible={distanceSheetVisible}
            label={saddle3Copy.fields.distanceToCenter.label}
            value={distanceToCenterText}
            unit={unitLabel}
            placeholder={saddle3Copy.fields.distanceToCenter.placeholder}
            onCommit={(text) => {
              setDistanceToCenterText(text);
              setDistanceSheetVisible(false);
            }}
            onCancel={() => setDistanceSheetVisible(false)}
          />
          <Sheet
            visible={angleSheetVisible}
            title={saddle3Copy.angleSheetTitle}
            subtitle={saddle3Copy.angleSheetSubtitle}
            onClose={() => setAngleSheetVisible(false)}
            onSecondaryPress={() => setAngleSheetVisible(false)}
            primaryLabel="Done"
            onPrimaryPress={() => setAngleSheetVisible(false)}>
            <OptionChipGroup
              title={saddle3Copy.fields.anglePreset.label}
              options={PRESET_LABELS}
              selected={angleData.label}
              onSelect={selectPresetByLabel}
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
