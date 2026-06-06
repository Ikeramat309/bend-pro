/**
 * Stub 90 calculator — diagram-first layout using shared UI chunks.
 *
 * Input state lives here; math lives in engine/stub90.engine.ts.
 */
import { useRouter } from 'expo-router';
import { useMemo, useState } from 'react';
import { StyleSheet, View } from 'react-native';

import type { ConduitType, RoundingOption, TradeSize, UnitSystem } from '@/core/types';
import { DEFAULT_CONDUIT_TYPE } from '@/data/conduit';
import { getBenderProfile } from '@/data/benders';
import { Routes } from '@/navigation';
import { AppHeader, AppScreen, FieldInput } from '@/shared/ui';
import {
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
import { hasPositiveNumber, parseOptionalNumber } from '@/utils/validation';

import { calculateStub90 } from '../engine/stub90.engine';
import type { Stub90DiagramViewData } from '../engine/stub90.types';
import { STUB90_CONFIG } from '../stub90.config';
import { stub90Copy } from '../stub90.copy';
import { Stub90Diagram } from './Stub90Diagram';

export default function Stub90Screen() {
  const router = useRouter();

  const [stubLengthText, setStubLengthText] = useState('');
  const [legLengthText, setLegLengthText] = useState('');
  const [showLegInput, setShowLegInput] = useState(false);
  const [unit, setUnit] = useState<UnitSystem>(STUB90_CONFIG.defaultUnit);
  const [rounding, setRounding] = useState<RoundingOption>(STUB90_CONFIG.defaultRounding);
  const [conduitType, setConduitType] = useState<ConduitType>(STUB90_CONFIG.defaultConduitType);
  const [conduitSize, setConduitSize] = useState<TradeSize>(STUB90_CONFIG.defaultTradeSize);
  const [benderProfileId, setBenderProfileId] = useState(STUB90_CONFIG.defaultBenderProfileId);
  const [setupVisible, setSetupVisible] = useState(false);

  const benderProfile = getBenderProfile(benderProfileId);
  const stubLength = Number(stubLengthText || 0);
  const legLength = parseOptionalNumber(legLengthText);
  const hasValidLegLength = legLength !== undefined && Number.isFinite(legLength) && legLength > 0;
  const unitLabel = getLengthUnitLabel(unit);
  const setupSummary = `${conduitType} ${conduitSize}"`;
  const setupSubtitle = `${getUnitSystemLabel(unit)} • ${getRoundingLabel(rounding)}`;
  const hasValidStubLength = hasPositiveNumber(stubLengthText);

  const result = useMemo(
    () =>
      calculateStub90({
        stubHeight: stubLength,
        legLength: hasValidLegLength ? legLength : undefined,
        benderProfileId,
        conduitType,
        tradeSize: conduitSize,
        unitSystem: unit,
        roundingPrecision: rounding,
      }),
    [
      benderProfileId,
      conduitSize,
      conduitType,
      hasValidLegLength,
      legLength,
      rounding,
      stubLength,
      unit,
    ],
  );

  const hasValidDeductMark = hasValidStubLength && result.isValidFirstMark;
  const deductMarkValue = hasValidDeductMark ? result.firstMarkFormatted ?? '—' : '—';
  const visibleWarnings = stubLengthText.trim() !== '' ? result.warnings : [];

  const diagramData: Stub90DiagramViewData | undefined = hasValidDeductMark
    ? {
        deductMark: result.firstMarkFormatted ?? '—',
        stubLength: result.stubHeightFormatted,
        deduct: result.deductFormatted,
        leg: result.legLengthFormatted,
        showLeg: hasValidLegLength,
      }
    : undefined;

  const legLengthError =
    legLengthText.trim() !== '' && !hasValidLegLength
      ? stub90Copy.fields.leg.errorRequired
      : undefined;

  function handleBackPress() {
    const safeRouter = router as typeof router & { canGoBack?: () => boolean };

    if (typeof safeRouter.canGoBack === 'function' && safeRouter.canGoBack()) {
      router.back();
      return;
    }

    router.replace(Routes.home);
  }

  function applySetup(nextSetup: SetupValues) {
    setConduitType(DEFAULT_CONDUIT_TYPE);
    setConduitSize(nextSetup.conduitSize);
    setBenderProfileId(nextSetup.benderProfileId);
    setUnit(nextSetup.unit);
    setRounding(nextSetup.rounding);
    setSetupVisible(false);
  }

  return (
    <View style={styles.screen}>
      <AppHeader
        showBack
        title={stub90Copy.screenTitle}
        subtitle={setupSummary}
        onBackPress={handleBackPress}
      />

      <AppScreen scroll>
        <SetupSummary
          title={benderProfile.name}
          subtitle={setupSubtitle}
          onEdit={() => setSetupVisible(true)}
        />

        <FieldInput
          label={stub90Copy.fields.stubLength.label}
          value={stubLengthText}
          onChangeText={setStubLengthText}
          placeholder={stub90Copy.fields.stubLength.placeholder}
          unit={unitLabel}
          error={
            stubLengthText !== '' && stubLength <= 0
              ? stub90Copy.fields.stubLength.errorRequired
              : undefined
          }
        />

        <View style={styles.legPanel}>
          {showLegInput ? (
            <FieldInput
              label={stub90Copy.fields.leg.label}
              value={legLengthText}
              onChangeText={setLegLengthText}
              placeholder={stub90Copy.fields.leg.placeholder}
              unit={unitLabel}
              variant="compact"
              error={legLengthError}
            />
          ) : (
            <OptionalFieldButton
              label={stub90Copy.fields.leg.addButton}
              onPress={() => setShowLegInput(true)}
            />
          )}
        </View>

        <PipeWorkspaceResult
          title={stub90Copy.workspaceTitle}
          diagram={
            <Stub90Diagram
              data={diagramData}
              isEmpty={!hasValidStubLength}
              isInvalid={hasValidStubLength && !result.isValidFirstMark}
            />
          }
          primaryLabel={stub90Copy.results.deductMark}
          primaryValue={deductMarkValue}
          chips={[
            { label: stub90Copy.results.deduct, value: result.deductFormatted },
            { label: stub90Copy.results.takeUp, value: result.takeUpFormatted },
            ...(hasValidLegLength && result.legLengthFormatted
              ? [{ label: stub90Copy.results.leg, value: result.legLengthFormatted }]
              : []),
          ]}
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
          bendAngle: STUB90_CONFIG.bendAngle,
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
  legPanel: {
    marginTop: -spacing.xs,
  },
});
