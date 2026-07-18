import { useRouter } from 'expo-router';
import { useMemo, useState } from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';

import { snapshotSetupFromInput } from '@/core/calculations';
import { getCalculatorById } from '@/core/calculators';
import { patchCalculatorSetup, useCalculatorSetup } from '@/core/settings';
import { usePersistRecentLayout, useRestoreRecentLayout } from '@/core/sessions';
import { formatSetupOnlyBenderMeta, getBenderProfile } from '@/data/benders';
import { DEFAULT_CONDUIT_TYPE } from '@/data/conduit';
import { Routes, guideRoute } from '@/navigation';
import { LengthInputSheet } from '@/shared/ui';
import { BendCalculatorLayout, EditSetupSheet, OptionalInputSummary, type SetupValues } from '@/shared/workspace';
import { spacing, typography, useTheme, type ThemePalette } from '@/theme';
import { parseLengthInput } from '@/utils/parseLengthInput';
import { getRoundingLabel } from '@/utils/rounding';
import { getLengthInputMode, getLengthUnitLabel, getUnitSystemLabel } from '@/utils/units';

import { COMPOUND90_CONFIG } from '../compound90.config';
import { compound90Copy } from '../compound90.copy';
import { calculateCompound90, COMPOUND90_SHAPE_DATA } from '../engine/compound90.engine';
import { toCompound90CalculationResult } from '../engine/compound90CalculationResult';
import {
  createCompound90InputSnapshot,
  restoreCompound90FromLayout,
  toStoredInputSnapshot,
} from '../engine/compound90InputSnapshot';
import type { Compound90Shape } from '../engine/compound90.types';
import { Compound90Diagram } from './Compound90Diagram';

const ORIENTATION_OPTIONS: readonly {
  shape: Compound90Shape;
  label: string;
  detail: string;
}[] = [
  { shape: 'circle', label: 'Round', detail: 'at corner' },
  { shape: 'box', label: 'Box', detail: 'flat to walls' },
  { shape: 'diamond', label: 'On point', detail: 'corner up' },
];

function ObstructionOrientationSelector({
  shape,
  onSelect,
}: {
  shape: Compound90Shape;
  onSelect: (shape: Compound90Shape) => void;
}) {
  const { colors } = useTheme();
  const styles = useMemo(() => makeOrientationStyles(colors), [colors]);

  return (
    <View style={styles.wrap} accessibilityRole="radiogroup">
      {ORIENTATION_OPTIONS.map((option) => {
        const active = option.shape === shape;
        return (
          <Pressable
            key={option.shape}
            accessibilityRole="radio"
            accessibilityState={{ checked: active }}
            accessibilityLabel={`${option.label}, ${option.detail}`}
            onPress={() => onSelect(option.shape)}
            style={({ pressed }) => [
              styles.option,
              active && styles.optionActive,
              pressed && styles.pressed,
            ]}>
            <Text style={[styles.label, active && styles.labelActive]}>{option.label}</Text>
            <Text style={[styles.detail, active && styles.detailActive]}>{option.detail}</Text>
          </Pressable>
        );
      })}
    </View>
  );
}

export default function Compound90Screen() {
  const router = useRouter();
  const [shape, setShape] = useState<Compound90Shape>(COMPOUND90_CONFIG.defaultShape);
  const [primaryText, setPrimaryText] = useState('');
  const [secondaryText, setSecondaryText] = useState('');
  const [clearanceText, setClearanceText] = useState('');
  const [firstMarkText, setFirstMarkText] = useState('');
  const [firstMarkSheetVisible, setFirstMarkSheetVisible] = useState(false);
  const [setupVisible, setSetupVisible] = useState(false);

  useRestoreRecentLayout('compound90', restoreCompound90FromLayout, (fields) => {
    setShape(fields.shape);
    setPrimaryText(fields.primaryDimensionText);
    setSecondaryText(fields.secondaryDimensionText);
    setClearanceText(fields.clearanceText);
    setFirstMarkText(fields.firstMarkText);
  });

  const { setup, setSetup } = useCalculatorSetup();
  const { unit, rounding, conduitType, conduitSize, benderProfileId, customBenderProfiles } = setup;
  const bender = getBenderProfile(benderProfileId, customBenderProfiles);
  const primaryDimension = parseLengthInput(primaryText);
  const secondaryDimension = parseLengthInput(secondaryText);
  const clearance = parseLengthInput(clearanceText);
  const firstMark = parseLengthInput(firstMarkText);
  const hasPrimary = primaryDimension !== undefined && primaryDimension > 0;
  const hasSecondary = secondaryDimension !== undefined && secondaryDimension > 0;
  const isBox = shape === 'box';
  const hasValidClearance = clearanceText.trim() === '' || (clearance !== undefined && clearance >= 0);
  const hasValidInputs = hasPrimary && (!isBox || hasSecondary) && hasValidClearance;
  const lengthInput = getLengthInputMode(unit);
  const unitLabel = getLengthUnitLabel(unit);
  const shapeData = COMPOUND90_SHAPE_DATA[shape];
  const setupSummary = `${conduitType} ${conduitSize}"`;
  const setupSubtitle = `${getUnitSystemLabel(unit)} • ${getRoundingLabel(rounding)}`;

  const engineInput = useMemo(
    () => ({
      shape,
      primaryDimension: primaryDimension ?? Number.NaN,
      secondaryDimension: isBox && hasSecondary ? secondaryDimension : undefined,
      clearance,
      firstMark,
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
      firstMark,
      hasSecondary,
      isBox,
      clearance,
      primaryDimension,
      rounding,
      secondaryDimension,
      shape,
      unit,
    ],
  );
  const result = useMemo(() => calculateCompound90(engineInput), [engineInput]);
  const calculationResult = useMemo(
    () => toCompound90CalculationResult(engineInput, result),
    [engineInput, result],
  );

  usePersistRecentLayout({
    calculatorId: 'compound90',
    calculatorTitle: getCalculatorById('compound90')?.title ?? 'Compound 90',
    inputSnapshot: toStoredInputSnapshot(createCompound90InputSnapshot(engineInput)),
    setupSnapshot: snapshotSetupFromInput(engineInput),
    calculationResult,
    enabled: primaryText.trim() !== '',
  });

  function applySetup(next: SetupValues) {
    setSetup(
      patchCalculatorSetup(setup, {
        conduitType: DEFAULT_CONDUIT_TYPE,
        conduitSize: next.conduitSize,
        benderProfileId: next.benderProfileId,
        unit: next.unit,
        rounding: next.rounding,
      }),
    );
    setSetupVisible(false);
  }

  function handleBackPress() {
    const safeRouter = router as typeof router & { canGoBack?: () => boolean };
    if (safeRouter.canGoBack?.()) router.back();
    else router.replace(Routes.home);
  }

  function selectShape(next: Compound90Shape) {
    setShape(next);
    if (next !== 'box') setSecondaryText('');
  }

  function reset() {
    setPrimaryText('');
    setSecondaryText('');
    setClearanceText('');
    setFirstMarkText('');
  }

  const primaryLabel = compound90Copy.fields.primaryDimension[shape];
  const invalidStarted =
    (primaryText.trim() !== '' && !hasPrimary) ||
    (isBox && secondaryText.trim() !== '' && !hasSecondary) ||
    !hasValidClearance;

  return (
    <BendCalculatorLayout
      title={compound90Copy.screenTitle}
      subtitle=""
      centerTitle
      inputDensity="compact"
      workspaceDensity="compact"
      onBackPress={handleBackPress}
      trust={{
        benderName: 'Two-45 center layout',
        meta: [formatSetupOnlyBenderMeta(bender.name), setupSummary, setupSubtitle].join(' • '),
        note: `${shapeData.label} orientation · clearance is added on both sides before the EMT center correction.`,
        onEdit: () => setSetupVisible(true),
      }}
      inputs={[
        {
          type: 'custom',
          key: 'orientation',
          node: <ObstructionOrientationSelector shape={shape} onSelect={selectShape} />,
        },
        {
          type: 'row',
          key: 'dimensions',
          inputs: [
            {
              type: 'field',
              key: 'primaryDimension',
              label: primaryLabel,
              value: primaryText,
              onChangeText: setPrimaryText,
              placeholder: compound90Copy.fields.primaryDimension.placeholder,
              unit: unitLabel,
              variant: 'compact',
              lengthInput,
              error:
                primaryText.trim() !== '' && !hasPrimary
                  ? compound90Copy.fields.primaryDimension.errorRequired
                  : undefined,
            },
            ...(isBox
              ? [
                  {
                    type: 'field' as const,
                    key: 'secondaryDimension',
                    label: compound90Copy.fields.secondaryDimension.label,
                    value: secondaryText,
                    onChangeText: setSecondaryText,
                    placeholder: compound90Copy.fields.secondaryDimension.placeholder,
                    unit: unitLabel,
                    variant: 'compact' as const,
                    lengthInput,
                    error:
                      secondaryText.trim() !== '' && !hasSecondary
                        ? compound90Copy.fields.secondaryDimension.errorRequired
                        : undefined,
                  },
                ]
              : [
                  {
                    type: 'field' as const,
                    key: 'clearance',
                    label: compound90Copy.fields.clearance.label,
                    value: clearanceText,
                    onChangeText: setClearanceText,
                    placeholder: compound90Copy.fields.clearance.placeholder,
                    unit: unitLabel,
                    variant: 'compact' as const,
                    lengthInput,
                    error: !hasValidClearance
                      ? compound90Copy.fields.clearance.error
                      : undefined,
                  },
                ]),
          ],
        },
        ...(isBox
          ? [
              {
                type: 'field' as const,
                key: 'clearance',
                label: compound90Copy.fields.clearance.label,
                value: clearanceText,
                onChangeText: setClearanceText,
                placeholder: compound90Copy.fields.clearance.placeholder,
                unit: unitLabel,
                variant: 'compact' as const,
                lengthInput,
                error: !hasValidClearance ? compound90Copy.fields.clearance.error : undefined,
              },
            ]
          : []),
        ...(firstMarkText.trim()
          ? [
              {
                type: 'custom' as const,
                key: 'firstMarkSummary',
                node: (
                  <OptionalInputSummary
                    label={compound90Copy.fields.firstMark.label}
                    value={firstMarkText}
                    unit={unitLabel}
                    onPress={() => setFirstMarkSheetVisible(true)}
                  />
                ),
              },
            ]
          : []),
      ]}
      workspace={
        <Compound90Diagram
          data={result.diagramData}
          isEmpty={!hasValidInputs}
          isInvalid={invalidStarted || (hasValidInputs && !result.isValid)}
        />
      }
      primaryResult={
        result.isValid
          ? {
              label: compound90Copy.results.distanceBetweenBends,
              value: result.distanceBetweenBendsFormatted,
            }
          : undefined
      }
      secondaryResults={
        result.isValid && result.secondMarkFormatted
          ? [{ label: compound90Copy.results.secondMark, value: result.secondMarkFormatted }]
          : undefined
      }
      dock={{
        left: [{ key: 'reset', label: 'Reset', onPress: reset }],
        center: {
          key: 'first-mark',
          label: compound90Copy.fields.firstMark.addButton,
          variant: 'pill',
          onPress: () => setFirstMarkSheetVisible(true),
        },
        guide: { onPress: () => router.push(guideRoute('compound90')) },
      }}
      warnings={primaryText.trim() !== '' ? result.warnings : []}
      footer={
        <>
          <LengthInputSheet
            visible={firstMarkSheetVisible}
            label={compound90Copy.fields.firstMark.label}
            value={firstMarkText}
            unit={unitLabel}
            placeholder={compound90Copy.fields.firstMark.placeholder}
            onCommit={(value) => {
              setFirstMarkText(value);
              setFirstMarkSheetVisible(false);
            }}
            onCancel={() => setFirstMarkSheetVisible(false)}
          />
          <EditSetupSheet
            visible={setupVisible}
            values={{ conduitType, conduitSize, benderProfileId, unit, rounding, bendAngle: 45 }}
            onCancel={() => setSetupVisible(false)}
            onApply={applySetup}
          />
        </>
      }
    />
  );
}

function makeOrientationStyles(colors: ThemePalette) {
  return StyleSheet.create({
    wrap: {
      flexDirection: 'row',
      gap: spacing.xs,
      width: '100%',
    },
    option: {
      flex: 1,
      minHeight: 48,
      justifyContent: 'center',
      alignItems: 'center',
      borderWidth: 1,
      borderColor: colors.border,
      borderRadius: 12,
      backgroundColor: colors.surface2,
      paddingHorizontal: spacing.xs,
      paddingVertical: spacing.xs,
    },
    optionActive: {
      borderColor: colors.primary,
      backgroundColor: colors.surface,
    },
    pressed: {
      opacity: 0.8,
    },
    label: {
      ...typography.label,
      color: colors.text,
      fontSize: 12,
      fontWeight: '700',
    },
    labelActive: {
      color: colors.primary,
    },
    detail: {
      color: colors.muted,
      fontSize: 9.5,
      fontWeight: '600',
      marginTop: 1,
    },
    detailActive: {
      color: colors.primary,
    },
  });
}
