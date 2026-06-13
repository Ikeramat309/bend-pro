/**
 * 3-Point Saddle calculator — diagram-first layout over an obstruction.
 *
 * Input state lives here; math lives in engine/saddle3.engine.ts.
 */
import { useRouter } from 'expo-router';
import { useMemo, useState } from 'react';
import { StyleSheet, View } from 'react-native';

import { patchCalculatorSetup, useCalculatorSetup } from '@/core/settings';
import { DEFAULT_CONDUIT_TYPE } from '@/data/conduit';
import { getBenderProfile } from '@/data/benders';
import { Routes } from '@/navigation';
import { AppHeader, AppScreen, FieldInput, OptionChipGroup, Sheet } from '@/shared/ui';
import {
  BenderProfileContext,
  EditSetupSheet,
  OptionalFieldButton,
  PipeWorkspaceResult,
  SetupSummary,
  WarningList,
  type SetupValues,
} from '@/shared/workspace';
import { colors, spacing } from '@/theme';
import { getRoundingLabel } from '@/utils/rounding';
import { getLengthUnitLabel, getUnitSystemLabel } from '@/utils/units';
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
  const [showDistanceInput, setShowDistanceInput] = useState(false);
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
  const lengthKeyboard = unit === 'imperial' ? ('numbers-and-punctuation' as const) : ('decimal-pad' as const);

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
  const resultChips = showCenterAsHero
    ? [
        { label: saddle3Copy.results.betweenBends, value: betweenBendsValue, tone: 'primary' as const },
        { label: saddle3Copy.results.shrink, value: shrinkValue },
      ]
    : [
        {
          label: saddle3Copy.results.centerMark,
          value: centerMarkValue,
          onPress: hasValidHeight && !showDistanceInput ? () => setShowDistanceInput(true) : undefined,
        },
        { label: saddle3Copy.results.shrink, value: shrinkValue },
      ];

  const sideMarksNote = hasValidHeight
    ? hasDistance && result.sideMark1Formatted && result.sideMark2Formatted
      ? saddle3Copy.results.sideMarksAbsolute(
          result.sideMark1Formatted,
          result.sideMark2Formatted,
        )
      : saddle3Copy.results.sideMarksRelative
    : undefined;

  const distanceError =
    distanceToCenterText.trim() !== '' && distanceToCenter === undefined
      ? saddle3Copy.fields.distanceToCenter.errorInvalid
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

  return (
    <View style={styles.screen}>
      <AppHeader
        showBack
        title={saddle3Copy.screenTitle}
        subtitle={setupSummary}
        onBackPress={handleBackPress}
      />

      <AppScreen scroll>
        <SetupSummary
          title={benderProfile.name}
          subtitle={setupSubtitle}
          onEdit={() => setSetupVisible(true)}
        />

        <BenderProfileContext message={profileContextMessage} tone="info" />

        <View style={styles.inputRow}>
          <FieldInput
            variant="compact"
            label={saddle3Copy.fields.obstructionHeight.label}
            value={obstructionHeightText}
            onChangeText={setObstructionHeightText}
            placeholder={saddle3Copy.fields.obstructionHeight.placeholder}
            unit={unitLabel}
            inputProps={{ keyboardType: lengthKeyboard }}
            error={
              obstructionHeightText !== '' && !hasValidHeight
                ? saddle3Copy.fields.obstructionHeight.errorRequired
                : undefined
            }
          />

          <FieldInput
            variant="picker"
            label={saddle3Copy.fields.anglePreset.label}
            value={angleData.label}
            onChangeText={() => {}}
            onPress={() => setAngleSheetVisible(true)}
          />
        </View>

        <View style={styles.distancePanel}>
          {showDistanceInput ? (
            <FieldInput
              label={saddle3Copy.fields.distanceToCenter.label}
              value={distanceToCenterText}
              onChangeText={setDistanceToCenterText}
              placeholder={saddle3Copy.fields.distanceToCenter.placeholder}
              unit={unitLabel}
              variant="compact"
              inputProps={{ keyboardType: lengthKeyboard }}
              error={distanceError}
            />
          ) : (
            <OptionalFieldButton
              label={saddle3Copy.fields.distanceToCenter.addButton}
              onPress={() => setShowDistanceInput(true)}
            />
          )}
        </View>

        <PipeWorkspaceResult
          title={saddle3Copy.workspaceTitle}
          diagram={
            <Saddle3Diagram
              data={result.diagramData}
              isEmpty={!hasValidHeight}
              isInvalid={obstructionHeightText !== '' && !hasValidHeight}
            />
          }
          primaryLabel={primaryLabel}
          primaryValue={primaryValue}
          chips={resultChips}
          note={sideMarksNote}
        />

        <WarningList warnings={visibleWarnings} />
      </AppScreen>

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
    </View>
  );
}

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    backgroundColor: colors.background,
  },
  inputRow: {
    flexDirection: 'row',
    gap: spacing.md,
    alignItems: 'stretch',
  },
  distancePanel: {
    marginTop: -spacing.xs,
  },
});
