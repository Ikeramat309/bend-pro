/**
 * Deduct override bottom sheet — lets the user replace the bender chart's
 * take-up with a value they measured on their own bender.
 *
 * Draft state while open; parent updates only on Apply. Blank input means
 * "use the bender value" (clears the override).
 */
import { useState } from 'react';
import { StyleSheet, Text, View } from 'react-native';

import { MAX_DEDUCT_OVERRIDE_INCHES } from '@/core/settings';
import type { TradeSize, UnitSystem } from '@/core/types';
import { FieldInput } from '@/shared/ui';
import { Sheet } from '@/shared/ui/Sheet';
import { colors, spacing, typography } from '@/theme';
import { parseLengthInput } from '@/utils/parseLengthInput';
import { getLengthUnitLabel } from '@/utils/units';

import { stub90Copy } from '../stub90.copy';

const MM_PER_INCH = 25.4;

export type DeductOverrideSheetProps = {
  visible: boolean;
  tradeSize: TradeSize;
  unitSystem: UnitSystem;
  benderName: string;
  /** Profile chart deduct for this size, formatted for display. */
  benderDeductFormatted: string;
  currentOverrideInches?: number;
  onCancel: () => void;
  /** `undefined` clears the override (back to the bender value). */
  onApply: (overrideInches: number | undefined) => void;
};

export function DeductOverrideSheet(props: DeductOverrideSheetProps) {
  if (!props.visible) {
    return (
      <Sheet
        visible={false}
        title={stub90Copy.deductOverride.title}
        onClose={props.onCancel}
        onSecondaryPress={props.onCancel}
      />
    );
  }

  return <DeductOverrideSheetOpen {...props} />;
}

/** Mounted only while open — draft text resets from the stored override. */
function DeductOverrideSheetOpen({
  tradeSize,
  unitSystem,
  benderName,
  benderDeductFormatted,
  currentOverrideInches,
  onCancel,
  onApply,
}: DeductOverrideSheetProps) {
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
    isBlank || (parsedInches !== undefined && parsedInches <= MAX_DEDUCT_OVERRIDE_INCHES);

  const lengthKeyboard =
    unitSystem === 'imperial' ? ('numbers-and-punctuation' as const) : ('decimal-pad' as const);

  function handleApply() {
    if (!isValid) return;
    onApply(isBlank ? undefined : parsedInches);
  }

  return (
    <Sheet
      visible
      title={stub90Copy.deductOverride.title}
      subtitle={`${benderName} • ${tradeSize}" EMT`}
      onClose={onCancel}
      onSecondaryPress={onCancel}
      onPrimaryPress={handleApply}>
      <Text style={styles.description}>{stub90Copy.deductOverride.description}</Text>

      <FieldInput
        label={stub90Copy.deductOverride.fieldLabel}
        value={text}
        onChangeText={setText}
        placeholder={stub90Copy.deductOverride.placeholder}
        unit={getLengthUnitLabel(unitSystem)}
        inputProps={{ keyboardType: lengthKeyboard }}
        error={!isValid ? stub90Copy.deductOverride.errorInvalid : undefined}
      />

      <View style={styles.benderCard}>
        <Text style={styles.benderLine}>
          {benderName} chart: {benderDeductFormatted}
        </Text>
        <Text style={styles.hintLine}>{stub90Copy.deductOverride.clearHint}</Text>
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
  benderCard: {
    gap: spacing.xs,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: colors.border,
    backgroundColor: colors.surface,
    padding: spacing.lg,
  },
  benderLine: {
    ...typography.subtitle,
    color: colors.text,
  },
  hintLine: {
    ...typography.subtitle,
    color: colors.muted,
  },
});
