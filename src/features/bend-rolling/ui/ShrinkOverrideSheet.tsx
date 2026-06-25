/**
 * Shrink-per-inch override bottom sheet for Rolling Offset.
 */
import { useState } from 'react';
import { StyleSheet, Text, View } from 'react-native';

import { MAX_OFFSET_SHRINK_PER_INCH } from '@/core/settings';
import type { BendAngle, UnitSystem } from '@/core/types';
import { FieldInput } from '@/shared/ui';
import { Sheet } from '@/shared/ui/Sheet';
import { colors, spacing, typography } from '@/theme';
import { parseLengthInput } from '@/utils/parseLengthInput';
import { getLengthUnitLabel, getLengthInputMode } from '@/utils/units';

import { rollingCopy } from '../rolling.copy';

const MM_PER_INCH = 25.4;

export type ShrinkOverrideSheetProps = {
  visible: boolean;
  bendAngle: BendAngle;
  benderName: string;
  unitSystem: UnitSystem;
  chartShrinkPerInchFormatted: string;
  currentOverrideInches?: number;
  onCancel: () => void;
  onApply: (overrideInches: number | undefined) => void;
};

export function ShrinkOverrideSheet(props: ShrinkOverrideSheetProps) {
  if (!props.visible) {
    return (
      <Sheet
        visible={false}
        title={rollingCopy.shrinkOverride.title}
        onClose={props.onCancel}
        onSecondaryPress={props.onCancel}
      />
    );
  }

  return <ShrinkOverrideSheetOpen {...props} />;
}

function ShrinkOverrideSheetOpen({
  bendAngle,
  benderName,
  unitSystem,
  chartShrinkPerInchFormatted,
  currentOverrideInches,
  onCancel,
  onApply,
}: ShrinkOverrideSheetProps) {
  const [text, setText] = useState(() =>
    currentOverrideInches !== undefined ? toDisplayValue(currentOverrideInches, unitSystem) : '',
  );

  const isBlank = text.trim() === '';
  const parsed = parseLengthInput(text);
  const parsedInches =
    parsed !== undefined && parsed > 0
      ? unitSystem === 'metric'
        ? parsed / MM_PER_INCH
        : parsed
      : undefined;
  const isValid =
    isBlank || (parsedInches !== undefined && parsedInches <= MAX_OFFSET_SHRINK_PER_INCH);

  const lengthInput = getLengthInputMode(unitSystem);

  function handleApply() {
    if (!isValid) return;
    onApply(isBlank ? undefined : parsedInches);
  }

  return (
    <Sheet
      visible
      title={rollingCopy.shrinkOverride.title}
      subtitle={`${benderName} • ${bendAngle}°`}
      onClose={onCancel}
      onSecondaryPress={onCancel}
      onPrimaryPress={handleApply}>
      <Text style={styles.description}>{rollingCopy.shrinkOverride.description}</Text>

      <FieldInput
        label={rollingCopy.shrinkOverride.fieldLabel}
        value={text}
        onChangeText={setText}
        placeholder={rollingCopy.shrinkOverride.placeholder}
        unit={getLengthUnitLabel(unitSystem)}
        lengthInput={lengthInput}
        error={!isValid ? rollingCopy.shrinkOverride.errorInvalid : undefined}
      />

      <View style={styles.chartCard}>
        <Text style={styles.chartLine}>
          {rollingCopy.shrinkOverride.chartLine(bendAngle, chartShrinkPerInchFormatted)}
        </Text>
        <Text style={styles.hintLine}>{rollingCopy.shrinkOverride.clearHint}</Text>
      </View>
    </Sheet>
  );
}

function toDisplayValue(inches: number, unitSystem: UnitSystem): string {
  const value = unitSystem === 'metric' ? inches * MM_PER_INCH : inches;
  return String(Math.round(value * 1000) / 1000);
}

const styles = StyleSheet.create({
  description: {
    ...typography.subtitle,
    color: colors.muted,
  },
  chartCard: {
    gap: spacing.xs,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: colors.border,
    backgroundColor: colors.surface,
    padding: spacing.lg,
  },
  chartLine: {
    ...typography.subtitle,
    color: colors.text,
  },
  hintLine: {
    ...typography.subtitle,
    color: colors.muted,
  },
});
