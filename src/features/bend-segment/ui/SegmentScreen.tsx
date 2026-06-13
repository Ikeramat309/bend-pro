/**
 * Segment Bend calculator — large-radius bend laid out as equal shots.
 *
 * Input state lives here; math lives in engine/segment.engine.ts.
 */
import { useRouter } from 'expo-router';
import { useMemo, useState } from 'react';
import { StyleSheet, View } from 'react-native';

import { patchCalculatorSetup, useCalculatorSetup } from '@/core/settings';
import { DEFAULT_CONDUIT_TYPE } from '@/data/conduit';
import { getBenderProfile } from '@/data/benders';
import { Routes } from '@/navigation';
import { AppHeader, AppScreen, FieldInput } from '@/shared/ui';
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

import { calculateSegment } from '../engine/segment.engine';
import { SEGMENT_CONFIG } from '../segment.config';
import { segmentCopy } from '../segment.copy';
import { SegmentDiagram } from './SegmentDiagram';

/** Plain positive-number parse for angle fields (degrees, no unit conversion). */
function parseAngleInput(text: string): number | undefined {
  const value = Number(text.trim());
  return Number.isFinite(value) && value > 0 ? value : undefined;
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
  const lengthKeyboard = unit === 'imperial' ? ('numbers-and-punctuation' as const) : ('decimal-pad' as const);

  const result = useMemo(
    () =>
      calculateSegment({
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

  const spacingValue = hasValidInputs ? result.spacingFormatted : '—';
  const perBendValue = hasValidInputs ? result.degreesPerBendFormatted : '—';
  const bendsValue = hasValidInputs ? result.numberOfBendsFormatted : '—';
  const developedLengthValue = hasValidInputs ? result.developedLengthFormatted : '—';

  const resultChips = [
    { label: segmentCopy.results.perBend, value: perBendValue },
    { label: segmentCopy.results.bends, value: bendsValue },
    { label: segmentCopy.results.developedLength, value: developedLengthValue },
  ];

  const marksNote = hasValidInputs
    ? hasStart && result.firstMarkFormatted && result.lastMarkFormatted
      ? segmentCopy.results.marksAbsolute(
          result.radiusFormatted,
          result.firstMarkFormatted,
          result.lastMarkFormatted,
        )
      : segmentCopy.results.marksRelative(result.radiusFormatted)
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

  return (
    <View style={styles.screen}>
      <AppHeader
        showBack
        title={segmentCopy.screenTitle}
        subtitle={setupSummary}
        onBackPress={handleBackPress}
      />

      <AppScreen scroll>
        <SetupSummary
          title={benderProfile.name}
          subtitle={setupSubtitle}
          onEdit={() => setSetupVisible(true)}
        />

        <BenderProfileContext message={segmentCopy.profileContext} tone="info" />

        <View style={styles.inputRow}>
          <FieldInput
            variant="compact"
            label={segmentCopy.fields.radius.label}
            value={radiusText}
            onChangeText={setRadiusText}
            placeholder={segmentCopy.fields.radius.placeholder}
            unit={unitLabel}
            inputProps={{ keyboardType: lengthKeyboard }}
            error={radiusText !== '' && !hasValidRadius ? segmentCopy.fields.radius.errorRequired : undefined}
          />

          <FieldInput
            variant="compact"
            label={segmentCopy.fields.totalAngle.label}
            value={totalAngleText}
            onChangeText={setTotalAngleText}
            placeholder={segmentCopy.fields.totalAngle.placeholder}
            unit={segmentCopy.degreeUnit}
            inputProps={{ keyboardType: 'decimal-pad' }}
            error={
              totalAngleText !== '' && totalAngle === undefined
                ? segmentCopy.fields.totalAngle.errorRequired
                : undefined
            }
          />
        </View>

        <View style={styles.inputRow}>
          <FieldInput
            variant="compact"
            label={segmentCopy.fields.degreesPerBend.label}
            value={degreesPerBendText}
            onChangeText={setDegreesPerBendText}
            placeholder={segmentCopy.fields.degreesPerBend.placeholder}
            unit={segmentCopy.degreeUnit}
            inputProps={{ keyboardType: 'decimal-pad' }}
            error={
              degreesPerBendText !== '' && degreesPerBend === undefined
                ? segmentCopy.fields.degreesPerBend.errorRequired
                : undefined
            }
          />

          <View style={styles.inputSpacer} />
        </View>

        <View style={styles.startPanel}>
          {showStartInput ? (
            <FieldInput
              variant="compact"
              label={segmentCopy.fields.startOffset.label}
              value={startOffsetText}
              onChangeText={setStartOffsetText}
              placeholder={segmentCopy.fields.startOffset.placeholder}
              unit={unitLabel}
              inputProps={{ keyboardType: lengthKeyboard }}
              error={startError}
            />
          ) : (
            <OptionalFieldButton
              label={segmentCopy.fields.startOffset.addButton}
              onPress={() => setShowStartInput(true)}
            />
          )}
        </View>

        <PipeWorkspaceResult
          title={segmentCopy.workspaceTitle}
          diagram={
            <SegmentDiagram
              data={result.diagramData}
              isEmpty={!hasValidInputs}
              isInvalid={inputsStarted && !hasValidInputs}
            />
          }
          primaryLabel={segmentCopy.results.spacing}
          primaryValue={spacingValue}
          chips={resultChips}
          note={marksNote}
        />

        <WarningList warnings={visibleWarnings} />
      </AppScreen>

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
  inputSpacer: {
    flex: 1,
  },
  startPanel: {
    marginTop: -spacing.xs,
  },
});
