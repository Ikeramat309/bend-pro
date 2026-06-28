/**
 * Edit Setup bottom sheet — draft state while open; parent updates only on Apply.
 */
import { useRouter } from 'expo-router';
import { useMemo, useState } from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';

import type { BendAngle, ConduitType, RoundingOption, TradeSize, UnitSystem } from '@/core/types';
import { IMPERIAL_ROUNDING_OPTIONS, METRIC_ROUNDING_OPTIONS, useCalculatorSetup } from '@/core/settings';
import {
  getBenderProfile,
  getBenderProfileIdByName,
  mergeBenderProfiles,
} from '@/data/benders';
import { DEFAULT_CONDUIT_TYPE } from '@/data/conduit';
import { SUPPORTED_EMT_TRADE_SIZES } from '@/data/emt';
import { Routes } from '@/navigation';
import { OptionChipGroup } from '@/shared/ui/OptionChipGroup';
import { Sheet } from '@/shared/ui/Sheet';
import { spacing, typography, useTheme, type ThemePalette } from '@/theme';

export type SetupUnit = UnitSystem;
export type SetupRounding = RoundingOption;
export type SetupBendAngle = BendAngle | 90;

export type SetupValues = {
  conduitType: ConduitType;
  conduitSize: TradeSize;
  benderProfileId: string;
  unit: SetupUnit;
  rounding: SetupRounding;
  bendAngle: SetupBendAngle;
};

export type EditSetupSheetProps = {
  visible: boolean;
  values: SetupValues;
  onCancel: () => void;
  onApply: (nextValues: SetupValues) => void;
};

const UNITS: { label: string; value: SetupUnit }[] = [
  { label: 'Imperial', value: 'imperial' },
  { label: 'Metric', value: 'metric' },
];

export function EditSetupSheet({ visible, values, onCancel, onApply }: EditSetupSheetProps) {
  if (!visible) {
    return (
      <Sheet
        visible={false}
        title="Edit Setup"
        subtitle="EMT size, bender, unit, and rounding."
        onClose={onCancel}
        onSecondaryPress={onCancel}
      />
    );
  }

  return <EditSetupSheetOpen values={values} onCancel={onCancel} onApply={onApply} />;
}

/** Mounted only while open — draft state resets from parent values each time. */
function EditSetupSheetOpen({
  values,
  onCancel,
  onApply,
}: Pick<EditSetupSheetProps, 'values' | 'onCancel' | 'onApply'>) {
  const { colors } = useTheme();
  const styles = useMemo(() => makeStyles(colors), [colors]);
  const router = useRouter();
  const { setup } = useCalculatorSetup();
  const benderProfileNames = mergeBenderProfiles(setup.customBenderProfiles).map(
    (profile) => profile.name,
  );
  const [draft, setDraft] = useState<SetupValues>(values);
  const roundingOptions =
    draft.unit === 'imperial' ? IMPERIAL_ROUNDING_OPTIONS : METRIC_ROUNDING_OPTIONS;

  function updateDraft(patch: Partial<SetupValues>) {
    setDraft((current) => {
      const next = { ...current, ...patch };

      if (patch.unit === 'imperial' && !IMPERIAL_ROUNDING_OPTIONS.includes(next.rounding)) {
        next.rounding = '1/16';
      }
      if (patch.unit === 'metric' && !METRIC_ROUNDING_OPTIONS.includes(next.rounding)) {
        next.rounding = '1mm';
      }

      return next;
    });
  }

  return (
    <Sheet
      visible
      title="Edit Setup"
      subtitle="EMT size, bender, unit, and rounding."
      onClose={onCancel}
      onSecondaryPress={onCancel}
      onPrimaryPress={() => onApply(draft)}>
      <OptionChipGroup
        title="EMT Size"
        options={SUPPORTED_EMT_TRADE_SIZES}
        selected={draft.conduitSize}
        onSelect={(conduitSize) =>
          updateDraft({ conduitType: DEFAULT_CONDUIT_TYPE, conduitSize })
        }
      />

      <OptionChipGroup
        title="Bender Profile"
        options={benderProfileNames}
        selected={getBenderProfile(draft.benderProfileId, setup.customBenderProfiles).name}
        onSelect={(name) =>
          updateDraft({
            benderProfileId: getBenderProfileIdByName(name, setup.customBenderProfiles),
          })
        }
      />

      <Pressable
        onPress={() => {
          onCancel();
          router.push(Routes.benderDatabase);
        }}
        style={({ pressed }) => [styles.browseLink, pressed && styles.browseLinkPressed]}
        accessibilityRole="button">
        <Text style={styles.browseLinkText}>Browse bender database ›</Text>
      </Pressable>

      <OptionChipGroup
        title="Unit"
        options={UNITS.map((unit) => unit.label)}
        selected={draft.unit === 'imperial' ? 'Imperial' : 'Metric'}
        onSelect={(label) => {
          updateDraft({ unit: label === 'Imperial' ? 'imperial' : 'metric' });
        }}
      />

      <OptionChipGroup
        title="Rounding"
        options={roundingOptions}
        selected={draft.rounding}
        onSelect={(rounding) => updateDraft({ rounding })}
      />

      <View style={styles.currentCard}>
        <Text style={styles.currentTitle}>Current draft</Text>
        <Text style={styles.currentLine}>
          Conduit: {draft.conduitType} {draft.conduitSize}&quot;
        </Text>
        <Text style={styles.currentLine}>
          Bender: {getBenderProfile(draft.benderProfileId, setup.customBenderProfiles).name}
        </Text>
        <Text style={styles.currentLine}>Angle: {draft.bendAngle}°</Text>
        <Text style={styles.currentLine}>Unit: {draft.unit}</Text>
        <Text style={styles.currentLine}>Rounding: {draft.rounding}</Text>
      </View>
    </Sheet>
  );
}

function makeStyles(c: ThemePalette) {
  return StyleSheet.create({
    browseLink: {
      alignSelf: 'flex-start',
      paddingVertical: spacing.xs,
    },
    browseLinkPressed: {
      opacity: 0.88,
    },
    browseLinkText: {
      fontSize: 14,
      lineHeight: 20,
      fontWeight: '700',
      color: c.primary,
    },
    currentCard: {
      gap: spacing.xs,
      borderRadius: 12,
      borderWidth: 1,
      borderColor: c.border,
      backgroundColor: c.surface,
      padding: spacing.lg,
    },
    currentTitle: {
      ...typography.label,
      color: c.text,
      marginBottom: spacing.xs,
    },
    currentLine: {
      ...typography.subtitle,
      color: c.muted,
    },
  });
}
