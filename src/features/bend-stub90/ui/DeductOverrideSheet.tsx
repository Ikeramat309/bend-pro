/**
 * Deduct override bottom sheet — lets the user replace the bender chart's
 * take-up with a value they measured on their own bender.
 *
 * Draft state while open; parent updates only on Apply. Blank input means
 * "use the bender value" (clears the override).
 */
import { useMemo, useState } from 'react';
import { StyleSheet, Text, View } from 'react-native';

import {
  formatCanonicalLengthForDisplay,
  parsePositiveLengthToCanonicalInches,
} from '@/core/measurements';
import { MAX_DEDUCT_OVERRIDE_INCHES } from '@/core/settings';
import type { TradeSize, UnitSystem } from '@/core/types';
import { FieldInput } from '@/shared/ui';
import { Sheet } from '@/shared/ui/Sheet';
import { spacing, typography, useTheme, type ThemePalette } from '@/theme';
import { getLengthUnitLabel, getLengthInputMode } from '@/utils/units';

import { stub90Copy } from '../stub90.copy';

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
  const { colors } = useTheme();
  const styles = useMemo(() => makeStyles(colors), [colors]);
  const [text, setText] = useState(() =>
    currentOverrideInches !== undefined
      ? formatCanonicalLengthForDisplay(currentOverrideInches, unitSystem)
      : '',
  );

  const isBlank = text.trim() === '';
  const parsedInches = parsePositiveLengthToCanonicalInches(text, unitSystem);
  const isValid =
    isBlank || (parsedInches !== undefined && parsedInches <= MAX_DEDUCT_OVERRIDE_INCHES);

  const lengthInput = getLengthInputMode(unitSystem);

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
        lengthInput={lengthInput}
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

function makeStyles(c: ThemePalette) {
  return StyleSheet.create({
    description: {
      ...typography.subtitle,
      color: c.muted,
    },
    benderCard: {
      gap: spacing.xs,
      borderRadius: 12,
      borderWidth: 1,
      borderColor: c.border,
      backgroundColor: c.surface,
      padding: spacing.lg,
    },
    benderLine: {
      ...typography.subtitle,
      color: c.text,
    },
    hintLine: {
      ...typography.subtitle,
      color: c.muted,
    },
  });
}
