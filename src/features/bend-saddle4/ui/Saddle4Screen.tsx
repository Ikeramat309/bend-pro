/**
 * 4-Point Saddle calculator — diagram-first layout over a wide obstruction.
 *
 * Input state lives here; math lives in engine/saddle4.engine.ts.
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

import { calculateSaddle4 } from '../engine/saddle4.engine';
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
  const [showDistanceInput, setShowDistanceInput] = useState(false);
  const [bendAngle, setBendAngle] = useState<Saddle4Angle>(SADDLE4_CONFIG.defaultAngle);
  const [setupVisible, setSetupVisible] = useState(false);
  const [angleSheetVisible, setAngleSheetVisible] = useState(false);

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
  const profileContextMessage = saddle4Copy.profileContext(angleData.label);
  const lengthKeyboard = unit === 'imperial' ? ('numbers-and-punctuation' as const) : ('decimal-pad' as const);

  const result = useMemo(
    () =>
      calculateSaddle4({
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
  const resultChips = showCenterAsHero
    ? [
        { label: saddle4Copy.results.betweenBends, value: betweenBendsValue, tone: 'primary' as const },
        { label: saddle4Copy.results.shrink, value: shrinkValue },
      ]
    : [
        {
          label: saddle4Copy.results.centerMark,
          value: centerMarkValue,
          onPress: hasValidInputs && !showDistanceInput ? () => setShowDistanceInput(true) : undefined,
        },
        { label: saddle4Copy.results.shrink, value: shrinkValue },
      ];

  const marksNote = hasValidInputs
    ? hasDistance &&
      hasValidWidth &&
      result.outerMark1Formatted &&
      result.innerMark1Formatted &&
      result.innerMark2Formatted &&
      result.outerMark2Formatted
      ? saddle4Copy.results.marksAbsolute(
          result.outerMark1Formatted,
          result.innerMark1Formatted,
          result.innerMark2Formatted,
          result.outerMark2Formatted,
        )
      : saddle4Copy.results.marksRelative
    : undefined;

  const distanceError =
    distanceToCenterText.trim() !== '' && distanceToCenter === undefined
      ? saddle4Copy.fields.distanceToCenter.errorInvalid
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

  return (
    <View style={styles.screen}>
      <AppHeader
        showBack
        title={saddle4Copy.screenTitle}
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
            label={saddle4Copy.fields.obstructionHeight.label}
            value={obstructionHeightText}
            onChangeText={setObstructionHeightText}
            placeholder={saddle4Copy.fields.obstructionHeight.placeholder}
            unit={unitLabel}
            inputProps={{ keyboardType: lengthKeyboard }}
            error={
              obstructionHeightText !== '' && !hasValidHeight
                ? saddle4Copy.fields.obstructionHeight.errorRequired
                : undefined
            }
          />
        </View>

        <View style={styles.optionalPanel}>
          {showSaddleWidthInput ? (
            <FieldInput
              variant="compact"
              label={saddle4Copy.fields.saddleWidth.label}
              value={saddleWidthText}
              onChangeText={setSaddleWidthText}
              placeholder={saddle4Copy.fields.saddleWidth.placeholder}
              unit={unitLabel}
              inputProps={{ keyboardType: lengthKeyboard }}
              error={
                saddleWidthText !== '' && !hasValidWidth
                  ? saddle4Copy.fields.saddleWidth.errorRequired
                  : undefined
              }
            />
          ) : (
            <OptionalFieldButton
              label={saddle4Copy.fields.saddleWidth.addButton}
              onPress={() => setShowSaddleWidthInput(true)}
            />
          )}
        </View>

        <FieldInput
          variant="picker"
          label={saddle4Copy.fields.bendAngle.label}
          value={angleData.label}
          onChangeText={() => {}}
          onPress={() => setAngleSheetVisible(true)}
        />

        <View style={styles.distancePanel}>
          {showDistanceInput ? (
            <FieldInput
              label={saddle4Copy.fields.distanceToCenter.label}
              value={distanceToCenterText}
              onChangeText={setDistanceToCenterText}
              placeholder={saddle4Copy.fields.distanceToCenter.placeholder}
              unit={unitLabel}
              variant="compact"
              inputProps={{ keyboardType: lengthKeyboard }}
              error={distanceError}
            />
          ) : (
            <OptionalFieldButton
              label={saddle4Copy.fields.distanceToCenter.addButton}
              onPress={() => setShowDistanceInput(true)}
            />
          )}
        </View>

        <PipeWorkspaceResult
          title={saddle4Copy.workspaceTitle}
          diagram={
            <Saddle4Diagram
              data={result.diagramData}
              isEmpty={!hasValidInputs}
              isInvalid={obstructionHeightText !== '' && !hasValidHeight}
            />
          }
          primaryLabel={primaryLabel}
          primaryValue={primaryValue}
          chips={resultChips}
          note={marksNote}
        />

        <WarningList warnings={visibleWarnings} />
      </AppScreen>

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
  optionalPanel: {
    marginTop: -spacing.xs,
  },
});
