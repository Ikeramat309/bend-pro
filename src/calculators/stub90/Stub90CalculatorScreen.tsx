/**
 * Stub 90 calculator screen.
 *
 * UI collects input and displays the pure engine result. Calculation logic stays
 * in stub90Engine.ts.
 */
import { useRouter } from 'expo-router';
import { useMemo, useState } from 'react';
import { Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';

import {
  AppTopBar,
  BigMeasurementInput,
  EditSetupSheet,
  SetupChip,
  type OffsetSetupValues,
  type SetupBender,
} from '@/components/bend';
import type { Stub90ConduitDiagramData } from '@/components/diagram/diagramTypes';
import { DEFAULT_BENDER_PROFILE_ID, getBenderProfile } from '@/data/benderProfiles';
import { Routes } from '@/navigation';
import { colors, layout, radius, spacing, typography } from '@/theme';
import { getRoundingLabel } from '@/utils/rounding';
import { getLengthUnitLabel, getUnitSystemLabel } from '@/utils/units';
import { hasPositiveNumber, parseOptionalNumber } from '@/utils/validation';

import { calculateStub90Engine } from './stub90Engine';
import { Stub90Diagram } from './Stub90Diagram';
import type { ConduitType, RoundingOption, Unit } from './stub90Types';

const DEFAULT_UNIT: Unit = 'imperial';
const DEFAULT_CONDUIT_TYPE: ConduitType = 'EMT';
const DEFAULT_BENDER: SetupBender = 'Generic Hand Bender';
const DEFAULT_BENDER_PROFILE = getBenderProfile(DEFAULT_BENDER_PROFILE_ID);

export default function Stub90CalculatorScreen() {
  const router = useRouter();

  const [stubHeightText, setStubHeightText] = useState('');
  const [legLengthText, setLegLengthText] = useState('');
  const [showLegLengthInput, setShowLegLengthInput] = useState(false);
  const [unit, setUnit] = useState<Unit>(DEFAULT_UNIT);
  const [rounding, setRounding] = useState<RoundingOption>('1/16');
  const [conduitType, setConduitType] = useState<ConduitType>(DEFAULT_CONDUIT_TYPE);
  const [conduitSize, setConduitSize] = useState('1/2');
  const [bender, setBender] = useState<SetupBender>(DEFAULT_BENDER);
  const [setupVisible, setSetupVisible] = useState(false);

  const stubHeight = Number(stubHeightText || 0);
  const legLength = parseOptionalNumber(legLengthText);
  const hasValidLegLength =
    legLength !== undefined && Number.isFinite(legLength) && legLength > 0;
  const unitLabel = getLengthUnitLabel(unit);
  const unitLabelText = getUnitSystemLabel(unit);
  const setupSummary = `${conduitType} ${conduitSize}"`;
  const setupSubText = `${unitLabelText} • ${getRoundingLabel(rounding)}`;
  const hasValidStubHeight = hasPositiveNumber(stubHeightText);

  const result = useMemo(() => {
    return calculateStub90Engine({
      stubHeight,
      legLength: hasValidLegLength ? legLength : undefined,
      benderProfileId: DEFAULT_BENDER_PROFILE.id,
      conduitType,
      tradeSize: conduitSize,
      unitSystem: unit,
      roundingPrecision: rounding,
    });
  }, [
    conduitSize,
    conduitType,
    hasValidLegLength,
    legLength,
    rounding,
    stubHeight,
    unit,
  ]);

  function handleBackPress() {
    const safeRouter = router as typeof router & { canGoBack?: () => boolean };

    if (typeof safeRouter.canGoBack === 'function' && safeRouter.canGoBack()) {
      router.back();
      return;
    }

    router.replace(Routes.home);
  }

  function applySetup(nextSetup: OffsetSetupValues) {
    setConduitType(nextSetup.conduitType);
    setConduitSize(nextSetup.conduitSize);
    setBender(nextSetup.bender);
    setUnit(nextSetup.unit);
    setRounding(nextSetup.rounding);
    setSetupVisible(false);
  }

  const hasValidFirstMark = hasValidStubHeight && result.isValidFirstMark;
  const firstMarkValue = hasValidFirstMark ? result.firstMarkFormatted ?? '—' : '—';
  const visibleWarnings = stubHeightText.trim() !== '' ? result.warnings : [];
  const diagramData: Stub90ConduitDiagramData | undefined = hasValidFirstMark
    ? {
        type: 'stub90',
        firstMark: result.firstMark ?? 0,
        stubLength: result.stubHeight,
        deduct: result.deduct,
        legLength: result.legLength,
        unitLabel,
        formatted: {
          firstMark: result.firstMarkFormatted ?? '—',
          stubLength: result.stubHeightFormatted,
          deduct: result.deductFormatted,
          legLength: result.legLengthFormatted,
          conduitLength: result.conduitLengthFormatted,
        },
      }
    : undefined;
  const legLengthError =
    legLengthText.trim() !== '' && !hasValidLegLength ? 'Enter a leg length greater than 0.' : undefined;

  return (
    <View style={styles.screen}>
      <AppTopBar
        showBack
        title="90° Stub"
        subtitle={setupSummary}
        onBackPress={handleBackPress}
      />

      <ScrollView
        contentContainerStyle={styles.content}
        showsVerticalScrollIndicator={false}
        keyboardShouldPersistTaps="handled">
        <SetupChip
          mainText={bender}
          subText={setupSubText}
          onEdit={() => setSetupVisible(true)}
        />

        <BigMeasurementInput
          label="STUB LENGTH"
          value={stubHeightText}
          onChangeText={setStubHeightText}
          placeholder="0"
          unit={unitLabel}
          error={
            stubHeightText !== '' && stubHeight <= 0
              ? 'Enter a stub length greater than 0.'
              : undefined
          }
        />

        <View style={styles.legLengthPanel}>
          {showLegLengthInput ? (
            <BigMeasurementInput
              label="LEG LENGTH"
              value={legLengthText}
              onChangeText={setLegLengthText}
              placeholder="Optional"
              unit={unitLabel}
              variant="compact"
              error={legLengthError}
            />
          ) : (
            <Pressable
              onPress={() => setShowLegLengthInput(true)}
              style={({ pressed }) => [styles.addLegButton, pressed && styles.addLegButtonPressed]}
              accessibilityRole="button">
              <Text style={styles.addLegIcon}>＋</Text>
              <Text style={styles.addLegText}>Add Leg Length</Text>
            </Pressable>
          )}
        </View>

        <Stub90ResultCard
          deductMarkValue={firstMarkValue}
          diagramData={diagramData}
          isEmpty={!hasValidStubHeight}
          isInvalid={hasValidStubHeight && !result.isValidFirstMark}
        />

        <Pressable
          onPress={() => {}}
          style={({ pressed }) => [styles.guidedCard, pressed && styles.guidedCardPressed]}
          accessibilityRole="button">
          <View style={styles.guidedIcon}>
            <Text style={styles.guidedIconText}>◎</Text>
          </View>
          <View style={styles.guidedTextBlock}>
            <Text style={styles.guidedTitle}>Guided Mode</Text>
            <Text style={styles.guidedSubtitle}>Step-by-step layout and bending help</Text>
          </View>
          <Text style={styles.guidedChevron}>›</Text>
        </Pressable>

        {visibleWarnings.length > 0 ? (
          <View style={styles.warningCard}>
            {visibleWarnings.map((warning) => (
              <Text key={warning} style={styles.warningText}>
                {warning}
              </Text>
            ))}
          </View>
        ) : null}
      </ScrollView>

      <EditSetupSheet
        visible={setupVisible}
        values={{
          conduitType,
          conduitSize,
          bender,
          unit,
          rounding,
          bendAngle: 90,
        }}
        onCancel={() => setSetupVisible(false)}
        onApply={applySetup}
      />
    </View>
  );
}

function Stub90ResultCard({
  deductMarkValue,
  diagramData,
  isEmpty,
  isInvalid,
}: {
  deductMarkValue: string;
  diagramData?: Stub90ConduitDiagramData;
  isEmpty: boolean;
  isInvalid: boolean;
}) {
  return (
    <View style={styles.resultCard}>
      <View style={styles.resultBlock}>
        <Text style={styles.resultTitle}>DEDUCT MARK</Text>
        <Text style={styles.primaryValue}>{deductMarkValue}</Text>
      </View>

      <View style={styles.divider} />

      <Stub90Diagram
        data={diagramData}
        isEmpty={isEmpty}
        isInvalid={isInvalid}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    backgroundColor: colors.background,
  },
  content: {
    width: '100%',
    maxWidth: layout.maxContentWidth,
    alignSelf: 'center',
    padding: spacing.lg,
    paddingBottom: spacing.section,
    gap: spacing.lg,
  },
  resultCard: {
    borderRadius: 18,
    borderWidth: 1,
    borderColor: colors.primary,
    backgroundColor: colors.surface2,
    paddingHorizontal: spacing.xl,
    paddingTop: spacing.xl,
    paddingBottom: spacing.lg,
    gap: spacing.md,
  },
  resultBlock: {
    gap: spacing.xs,
  },
  resultTitle: {
    ...typography.label,
    color: colors.primary,
    fontWeight: '700',
  },
  primaryValue: {
    fontSize: 40,
    lineHeight: 44,
    fontWeight: '800',
    color: colors.primary,
  },
  divider: {
    height: 1,
    backgroundColor: colors.primaryBorder,
  },
  legLengthPanel: {
    marginTop: -spacing.xs,
    opacity: 0.92,
  },
  addLegButton: {
    minHeight: 40,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: spacing.sm,
    borderRadius: radius.lg,
    borderWidth: 1,
    borderColor: colors.border,
    backgroundColor: colors.surface,
    paddingHorizontal: spacing.md,
  },
  addLegButtonPressed: {
    opacity: 0.88,
  },
  addLegIcon: {
    color: colors.primary,
    fontSize: 18,
    lineHeight: 20,
    fontWeight: '800',
  },
  addLegText: {
    ...typography.chip,
    color: colors.primary,
  },
  guidedCard: {
    minHeight: 72,
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.md,
    borderRadius: radius.lg,
    borderWidth: 1,
    borderColor: colors.border,
    backgroundColor: colors.surface,
    padding: spacing.lg,
  },
  guidedCardPressed: {
    opacity: 0.88,
  },
  guidedIcon: {
    width: 38,
    height: 38,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: radius.full,
    borderWidth: 1,
    borderColor: colors.primaryBorder,
    backgroundColor: colors.primaryMuted,
  },
  guidedIconText: {
    color: colors.primary,
    fontSize: 20,
    lineHeight: 22,
    fontWeight: '700',
  },
  guidedTextBlock: {
    flex: 1,
    gap: 2,
  },
  guidedTitle: {
    ...typography.body,
    color: colors.text,
    fontWeight: '700',
  },
  guidedSubtitle: {
    ...typography.subtitle,
    color: colors.muted,
  },
  guidedChevron: {
    color: colors.primary,
    fontSize: 26,
    lineHeight: 28,
  },
  warningCard: {
    gap: spacing.sm,
    borderRadius: radius.lg,
    borderWidth: 1,
    borderColor: colors.warning,
    backgroundColor: colors.surface,
    padding: spacing.lg,
  },
  warningText: {
    ...typography.subtitle,
    color: colors.warning,
  },
});
