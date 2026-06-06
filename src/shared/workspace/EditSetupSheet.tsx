/**
 * Edit Setup bottom sheet — draft state while open; parent updates only on Apply.
 */
import { useState } from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';

import type { BendAngle, ConduitType, RoundingOption, TradeSize, UnitSystem } from '@/core/types';
import {
  BENDER_PROFILES,
  getBenderProfile,
  getBenderProfileIdByName,
  type BenderProfileId,
} from '@/data/benders';
import { DEFAULT_CONDUIT_TYPE } from '@/data/conduit';
import { EMT_TRADE_SIZES } from '@/data/emt';
import { Sheet } from '@/shared/ui/Sheet';
import { colors, spacing, touchTarget, typography } from '@/theme';

export type SetupUnit = UnitSystem;
export type SetupRounding = RoundingOption;
export type SetupBendAngle = BendAngle | 90;

export type SetupValues = {
  conduitType: ConduitType;
  conduitSize: TradeSize;
  benderProfileId: BenderProfileId;
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

const BENDER_PROFILE_NAMES = BENDER_PROFILES.map((profile) => profile.name);
const UNITS: { label: string; value: SetupUnit }[] = [
  { label: 'Imperial', value: 'imperial' },
  { label: 'Metric', value: 'metric' },
];
const IMPERIAL_ROUNDING: SetupRounding[] = ['exact', '1/16', '1/8', '1/4'];
const METRIC_ROUNDING: SetupRounding[] = ['1mm', '5mm', '10mm'];

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
  const [draft, setDraft] = useState<SetupValues>(values);
  const roundingOptions = draft.unit === 'imperial' ? IMPERIAL_ROUNDING : METRIC_ROUNDING;

  function updateDraft(patch: Partial<SetupValues>) {
    setDraft((current) => {
      const next = { ...current, ...patch };

      if (patch.unit === 'imperial' && !IMPERIAL_ROUNDING.includes(next.rounding)) {
        next.rounding = '1/16';
      }
      if (patch.unit === 'metric' && !METRIC_ROUNDING.includes(next.rounding)) {
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
      <OptionGroup
        title="EMT Size"
        options={EMT_TRADE_SIZES}
        selected={draft.conduitSize}
        onSelect={(conduitSize) =>
          updateDraft({ conduitType: DEFAULT_CONDUIT_TYPE, conduitSize })
        }
      />

      <OptionGroup
        title="Bender Profile"
        options={BENDER_PROFILE_NAMES}
        selected={getBenderProfile(draft.benderProfileId).name}
        onSelect={(name) => updateDraft({ benderProfileId: getBenderProfileIdByName(name) })}
      />

      <OptionGroup
        title="Unit"
        options={UNITS.map((unit) => unit.label)}
        selected={draft.unit === 'imperial' ? 'Imperial' : 'Metric'}
        onSelect={(label) => {
          updateDraft({ unit: label === 'Imperial' ? 'imperial' : 'metric' });
        }}
      />

      <OptionGroup
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
          Bender: {getBenderProfile(draft.benderProfileId).name}
        </Text>
        <Text style={styles.currentLine}>Angle: {draft.bendAngle}°</Text>
        <Text style={styles.currentLine}>Unit: {draft.unit}</Text>
        <Text style={styles.currentLine}>Rounding: {draft.rounding}</Text>
      </View>
    </Sheet>
  );
}

function OptionGroup<T extends string>({
  title,
  options,
  selected,
  onSelect,
}: {
  title: string;
  options: readonly T[];
  selected: T;
  onSelect: (value: T) => void;
}) {
  return (
    <View style={styles.group}>
      <Text style={styles.groupTitle}>{title}</Text>
      <View style={styles.chipWrap}>
        {options.map((option) => {
          const active = selected === option;
          return (
            <Pressable
              key={option}
              onPress={() => onSelect(option)}
              style={[styles.chip, active && styles.chipActive]}
              accessibilityRole="button"
              accessibilityState={{ selected: active }}>
              <Text style={[styles.chipText, active && styles.chipTextActive]}>{option}</Text>
            </Pressable>
          );
        })}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  group: {
    gap: spacing.sm,
  },
  groupTitle: {
    ...typography.label,
    color: colors.muted,
  },
  chipWrap: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: spacing.sm,
  },
  chip: {
    minHeight: touchTarget,
    justifyContent: 'center',
    borderRadius: 12,
    borderWidth: 1,
    borderColor: colors.border,
    backgroundColor: colors.surface,
    paddingHorizontal: spacing.lg,
    paddingVertical: spacing.sm,
  },
  chipActive: {
    borderColor: colors.primary,
    backgroundColor: colors.primaryMuted,
  },
  chipText: {
    ...typography.chip,
    color: colors.text,
  },
  chipTextActive: {
    color: colors.primary,
  },
  currentCard: {
    gap: spacing.xs,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: colors.border,
    backgroundColor: colors.surface,
    padding: spacing.lg,
  },
  currentTitle: {
    ...typography.label,
    color: colors.text,
    marginBottom: spacing.xs,
  },
  currentLine: {
    ...typography.subtitle,
    color: colors.muted,
  },
});
