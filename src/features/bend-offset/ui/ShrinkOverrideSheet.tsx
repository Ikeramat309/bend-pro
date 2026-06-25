/**
 * Shrink-per-inch override bottom sheet — lets the user replace the standard
 * offset shrink rate with a value from their own chart or field experience.
 *
 * Draft state while open; parent updates only on Apply. Blank input clears
 * the override. Values are stored in inches per inch of offset height.
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

import { offsetCopy } from '../offset.copy';

const MM_PER_INCH = 25.4;

export type ShrinkOverrideSheetProps = {
  visible: boolean;
  bendAngle: BendAngle;
  benderName: string;
  unitSystem: UnitSystem;
  /** Standard table shrink per inch, formatted for display. */
  chartShrinkPerInchFormatted: string;
  currentOverrideInches?: number;
  onCancel: () => void;
  /** `undefined` clears the override (back to the table value). */
  onApply: (overrideInches: number | undefined) => void;
};

export function ShrinkOverrideSheet(props: ShrinkOverrideSheetProps) {
  if (!props.visible) {
    return (
      <Sheet
        visible={false}
        title={offsetCopy.shrinkOverride.title}
        onClose={props.onCancel}
        onSecondaryPress={props.onCancel}
      />
    );
  }

  return <ShrinkOverrideSheetOpen {...props} />;
}

/** Mounted only while open — draft text resets from the stored override. */
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
      title={offsetCopy.shrinkOverride.title}
      subtitle={`${benderName} • ${bendAngle}°`}
      onClose={onCancel}
      onSecondaryPress={onCancel}
      onPrimaryPress={handleApply}>
      <Text style={styles.description}>{offsetCopy.shrinkOverride.description}</Text>

      <FieldInput
        label={offsetCopy.shrinkOverride.fieldLabel}
        value={text}
        onChangeText={setText}
        placeholder={offsetCopy.shrinkOverride.placeholder}
        unit={getLengthUnitLabel(unitSystem)}
        lengthInput={lengthInput}
        error={!isValid ? offsetCopy.shrinkOverride.errorInvalid : undefined}
      />

      <View style={styles.chartCard}>
        <Text style={styles.chartLine}>
          {offsetCopy.shrinkOverride.chartLine(bendAngle, chartShrinkPerInchFormatted)}
        </Text>
        <Text style={styles.hintLine}>{offsetCopy.shrinkOverride.clearHint}</Text>
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
