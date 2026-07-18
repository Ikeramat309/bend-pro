import { useRouter } from 'expo-router';
import { useMemo, useState } from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';

import { snapshotSetupFromInput } from '@/core/calculations';
import { getCalculatorById } from '@/core/calculators';
import { patchCalculatorSetup, useCalculatorSetup } from '@/core/settings';
import { usePersistRecentLayout, useRestoreRecentLayout } from '@/core/sessions';
import { getBenderProfile, formatSetupOnlyBenderMeta } from '@/data/benders';
import { DEFAULT_CONDUIT_TYPE } from '@/data/conduit';
import { Routes, guideRoute } from '@/navigation';
import {
  BendCalculatorLayout,
  EditSetupSheet,
  type SetupValues,
} from '@/shared/workspace';
import {
  spacing,
  typography,
  useTheme,
  type ThemePalette,
} from '@/theme';
import { getLengthInputMode, getLengthUnitLabel, getUnitSystemLabel } from '@/utils/units';
import { getRoundingLabel } from '@/utils/rounding';
import { parseLengthInput } from '@/utils/parseLengthInput';

import { calculateMatchingOffset } from '../engine/matchingOffset.engine';
import { toMatchingOffsetCalculationResult } from '../engine/matchingOffsetCalculationResult';
import {
  createMatchingOffsetInputSnapshot,
  restoreMatchingOffsetFromLayout,
  toStoredInputSnapshot,
} from '../engine/matchingOffsetInputSnapshot';
import type {
  MatchingOffsetEngineInput,
  MatchingOffsetMode,
} from '../engine/matchingOffset.types';
import { MATCHING_OFFSET_CONFIG } from '../matchingOffset.config';
import { matchingOffsetCopy } from '../matchingOffset.copy';
import { MatchingOffsetDiagram } from './MatchingOffsetDiagram';

function MatchingModeSelector({
  mode,
  onSelect,
}: {
  mode: MatchingOffsetMode;
  onSelect: (mode: MatchingOffsetMode) => void;
}) {
  const { colors } = useTheme();
  const styles = useMemo(() => makeModeStyles(colors), [colors]);
  const options: readonly { mode: MatchingOffsetMode; label: string; detail: string }[] = [
    { mode: 'centers', label: matchingOffsetCopy.modes.centers, detail: 'rise + along run' },
    { mode: 'bends', label: matchingOffsetCopy.modes.bends, detail: 'rise + along pipe' },
  ];

  return (
    <View style={styles.wrap} accessibilityRole="tablist">
      {options.map((option) => {
        const active = option.mode === mode;
        return (
          <Pressable
            key={option.mode}
            accessibilityRole="tab"
            accessibilityState={{ selected: active }}
            onPress={() => onSelect(option.mode)}
            style={({ pressed }) => [styles.option, pressed && styles.pressed]}>
            <Text style={[styles.label, active && styles.labelActive]}>{option.label}</Text>
            <Text style={[styles.detail, active && styles.detailActive]}>{option.detail}</Text>
            <View style={[styles.indicator, active && styles.indicatorActive]} />
          </Pressable>
        );
      })}
    </View>
  );
}

export default function MatchingOffsetScreen() {
  const router = useRouter();
  const [mode, setMode] = useState<MatchingOffsetMode>(MATCHING_OFFSET_CONFIG.defaultMode);
  const [offsetHeightText, setOffsetHeightText] = useState('');
  const [referenceText, setReferenceText] = useState('');
  const [setupVisible, setSetupVisible] = useState(false);

  useRestoreRecentLayout('matchingOffset', restoreMatchingOffsetFromLayout, (fields) => {
    setMode(fields.mode);
    setOffsetHeightText(fields.offsetHeightText);
    setReferenceText(fields.referenceText);
  });

  const { setup, setSetup } = useCalculatorSetup();
  const {
    unit,
    rounding,
    conduitType,
    conduitSize,
    benderProfileId,
    customBenderProfiles,
  } = setup;
  const benderProfile = getBenderProfile(benderProfileId, customBenderProfiles);
  const offsetHeight = parseLengthInput(offsetHeightText);
  const referenceDistance = parseLengthInput(referenceText);
  const hasOffsetHeight = offsetHeight !== undefined && offsetHeight > 0;
  const hasReferenceDistance = referenceDistance !== undefined && referenceDistance > 0;
  const hasBothInputs = hasOffsetHeight && hasReferenceDistance;
  const unitLabel = getLengthUnitLabel(unit);
  const showFieldUnit = unit === 'metric';
  const lengthInput = getLengthInputMode(unit);

  const engineInput = useMemo<MatchingOffsetEngineInput>(() => {
    const common = {
      offsetHeight: offsetHeight ?? Number.NaN,
      benderProfileId,
      conduitType,
      tradeSize: conduitSize,
      unitSystem: unit,
      roundingPrecision: rounding,
      customBenderProfiles,
    };
    return mode === 'centers'
      ? {
          ...common,
          mode,
          adjacent: referenceDistance ?? Number.NaN,
        }
      : {
          ...common,
          mode,
          referenceDistanceBetweenBends: referenceDistance ?? Number.NaN,
        };
  }, [
    benderProfileId,
    conduitSize,
    conduitType,
    customBenderProfiles,
    mode,
    offsetHeight,
    referenceDistance,
    rounding,
    unit,
  ]);

  const result = useMemo(() => calculateMatchingOffset(engineInput), [engineInput]);
  const calculationResult = useMemo(
    () => toMatchingOffsetCalculationResult(engineInput, result),
    [engineInput, result],
  );

  usePersistRecentLayout({
    calculatorId: 'matchingOffset',
    calculatorTitle: getCalculatorById('matchingOffset')?.title ?? 'Matching Offset',
    inputSnapshot: toStoredInputSnapshot(createMatchingOffsetInputSnapshot(engineInput)),
    setupSnapshot: snapshotSetupFromInput(engineInput),
    calculationResult,
    enabled: offsetHeightText.trim() !== '' && referenceText.trim() !== '',
  });

  const visibleWarnings = hasBothInputs ? result.warnings : [];
  const secondaryResults = result.isValid
    ? [
        {
          label: matchingOffsetCopy.results.distanceBetweenBends,
          value: result.distanceBetweenBendsFormatted,
        },
        {
          label: matchingOffsetCopy.results.angleMethod,
          value: result.angleExecution.requiresAngleTool
            ? matchingOffsetCopy.results.angleTool
            : matchingOffsetCopy.results.commonAngle,
        },
      ]
    : undefined;

  function selectMode(nextMode: MatchingOffsetMode) {
    if (nextMode === mode) {
      return;
    }
    setMode(nextMode);
    // The second measurement changes meaning between modes. Never reinterpret
    // a previous value silently under a different field label.
    setReferenceText('');
  }

  function handleBackPress() {
    const safeRouter = router as typeof router & { canGoBack?: () => boolean };
    if (typeof safeRouter.canGoBack === 'function' && safeRouter.canGoBack()) {
      router.back();
      return;
    }
    router.replace(Routes.bends);
  }

  function resetInputs() {
    setOffsetHeightText('');
    setReferenceText('');
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
    <BendCalculatorLayout
      title={matchingOffsetCopy.screenTitle}
      subtitle=""
      centerTitle
      inputDensity="compact"
      workspaceDensity="compact"
      onBackPress={handleBackPress}
      trust={{
        benderName: 'Centerline geometry',
        meta: [
          formatSetupOnlyBenderMeta(benderProfile.name),
          `${conduitType} ${conduitSize}\" · ${getUnitSystemLabel(unit)} · ${getRoundingLabel(rounding)}`,
        ].join(' · '),
        note:
          result.isValid
            ? result.angleExecution.requiresAngleTool
              ? `${result.bendAngleFormatted} is exact. Use an angle tool and a calibrated bend-center reference; do not round it.`
              : `${result.bendAngleFormatted} is a common angle. Locate both centers with a calibrated bend-center reference.`
            : mode === 'centers'
              ? 'Centers Along Run is the straight projection between the two bend centers.'
              : 'Centers Along Pipe is measured on the existing conduit from bend center to bend center.',
        onEdit: () => setSetupVisible(true),
      }}
      inputs={[
        {
          type: 'custom',
          key: 'matchingMode',
          node: <MatchingModeSelector mode={mode} onSelect={selectMode} />,
        },
        {
          type: 'row',
          key: 'measurements',
          inputs: [
            {
              type: 'field',
              key: 'offsetHeight',
              label: matchingOffsetCopy.fields.offsetHeight.label,
              value: offsetHeightText,
              onChangeText: setOffsetHeightText,
              placeholder: matchingOffsetCopy.fields.offsetHeight.placeholder,
              unit: showFieldUnit ? unitLabel : undefined,
              variant: 'compact',
              lengthInput,
              error:
                offsetHeightText !== '' && !hasOffsetHeight
                  ? matchingOffsetCopy.fields.offsetHeight.errorRequired
                  : undefined,
            },
            {
              type: 'field',
              key: 'referenceDistance',
              label:
                mode === 'centers'
                  ? matchingOffsetCopy.fields.adjacent.label
                  : matchingOffsetCopy.fields.referenceDistanceBetweenBends.label,
              value: referenceText,
              onChangeText: setReferenceText,
              placeholder:
                mode === 'centers'
                  ? matchingOffsetCopy.fields.adjacent.placeholder
                  : matchingOffsetCopy.fields.referenceDistanceBetweenBends.placeholder,
              unit: showFieldUnit ? unitLabel : undefined,
              variant: 'compact',
              lengthInput,
              error:
                referenceText !== '' && !hasReferenceDistance
                  ? mode === 'centers'
                    ? matchingOffsetCopy.fields.adjacent.errorRequired
                    : matchingOffsetCopy.fields.referenceDistanceBetweenBends.errorRequired
                  : undefined,
            },
          ],
        },
      ]}
      workspace={
        <View style={styles.diagramWrap}>
          <MatchingOffsetDiagram
            data={result.diagramData}
            mode={mode}
            isEmpty={!hasBothInputs}
            isInvalid={hasBothInputs && !result.isValid}
          />
        </View>
      }
      primaryResult={
        result.isValid
          ? { label: matchingOffsetCopy.results.bendAngle, value: result.bendAngleFormatted }
          : undefined
      }
      secondaryResults={secondaryResults}
      dock={{
        left: [{ key: 'reset', label: 'Reset', onPress: resetInputs }],
        center: {
          key: 'switch-method',
          label: mode === 'centers' ? matchingOffsetCopy.modes.bends : matchingOffsetCopy.modes.centers,
          variant: 'pill',
          onPress: () => selectMode(mode === 'centers' ? 'bends' : 'centers'),
        },
        guide: { onPress: () => router.push(guideRoute('matchingOffset')) },
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
            bendAngle: 30,
          }}
          onCancel={() => setSetupVisible(false)}
          onApply={applySetup}
        />
      }
    />
  );
}

const styles = StyleSheet.create({
  diagramWrap: {
    flex: 1,
    width: '100%',
    alignItems: 'center',
    justifyContent: 'center',
    overflow: 'hidden',
  },
});

function makeModeStyles(colors: ThemePalette) {
  return StyleSheet.create({
    wrap: {
      flexDirection: 'row',
      alignItems: 'center',
      gap: spacing.xl,
      minHeight: 34,
    },
    option: {
      minHeight: 34,
      justifyContent: 'flex-end',
      paddingHorizontal: spacing.xs,
      paddingTop: spacing.xs,
    },
    pressed: {
      opacity: 0.82,
    },
    label: {
      ...typography.label,
      color: colors.muted,
      fontSize: 13,
      fontWeight: '600',
      paddingBottom: 1,
    },
    labelActive: {
      color: colors.primary,
      fontWeight: '700',
    },
    detail: {
      color: colors.muted,
      fontSize: 9.5,
      fontWeight: '600',
      paddingBottom: 4,
    },
    detailActive: {
      color: colors.primary,
    },
    indicator: {
      height: 2,
      borderRadius: 1,
      backgroundColor: 'transparent',
    },
    indicatorActive: {
      backgroundColor: colors.primary,
    },
  });
}
