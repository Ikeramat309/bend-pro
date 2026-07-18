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
import { getLengthInputMode, getLengthUnitLabel } from '@/utils/units';

import { backToBackCopy } from '../backToBack.copy';

export type BackToBackDeductOverrideSheetProps = {
  visible: boolean;
  tradeSize: TradeSize;
  unitSystem: UnitSystem;
  benderName: string;
  benderDeductFormatted: string;
  currentOverrideInches?: number;
  onCancel: () => void;
  onApply: (overrideInches: number | undefined) => void;
};

export function BackToBackDeductOverrideSheet(
  props: BackToBackDeductOverrideSheetProps,
) {
  if (!props.visible) {
    return (
      <Sheet
        visible={false}
        title={backToBackCopy.deductOverride.title}
        onClose={props.onCancel}
        onSecondaryPress={props.onCancel}
      />
    );
  }

  return <OpenSheet {...props} />;
}

function OpenSheet({
  tradeSize,
  unitSystem,
  benderName,
  benderDeductFormatted,
  currentOverrideInches,
  onCancel,
  onApply,
}: BackToBackDeductOverrideSheetProps) {
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

  function handleApply() {
    if (isValid) {
      onApply(isBlank ? undefined : parsedInches);
    }
  }

  return (
    <Sheet
      visible
      title={backToBackCopy.deductOverride.title}
      subtitle={`${benderName} \u2022 ${tradeSize}" EMT`}
      onClose={onCancel}
      onSecondaryPress={onCancel}
      onPrimaryPress={handleApply}>
      <Text style={styles.description}>{backToBackCopy.deductOverride.description}</Text>
      <FieldInput
        label={backToBackCopy.deductOverride.fieldLabel}
        value={text}
        onChangeText={setText}
        placeholder={backToBackCopy.deductOverride.placeholder}
        unit={getLengthUnitLabel(unitSystem)}
        lengthInput={getLengthInputMode(unitSystem)}
        error={!isValid ? backToBackCopy.deductOverride.errorInvalid : undefined}
      />
      <View style={styles.reference}>
        <Text style={styles.referenceLine}>
          {benderName} chart: {benderDeductFormatted}
        </Text>
        <Text style={styles.hint}>{backToBackCopy.deductOverride.clearHint}</Text>
      </View>
    </Sheet>
  );
}

function makeStyles(colors: ThemePalette) {
  return StyleSheet.create({
    description: {
      ...typography.subtitle,
      color: colors.muted,
    },
    reference: {
      gap: spacing.xs,
      paddingTop: spacing.sm,
    },
    referenceLine: {
      ...typography.subtitle,
      color: colors.text,
    },
    hint: {
      ...typography.subtitle,
      color: colors.muted,
    },
  });
}
