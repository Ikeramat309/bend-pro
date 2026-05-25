/**
 * Figma: Edit Setup bottom sheet — temporary functional setup controls.
 *
 * This component owns DRAFT state while it is open. The parent screen only changes
 * when the user taps Apply, so Cancel can safely discard edits.
 */
import { useEffect, useState } from 'react';
import { Modal, Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';

import type { BendAngle } from '@/calculators/offset/offset.types';
import { colors } from '@/theme/colors';
import { layout, spacing, touchTarget } from '@/theme/spacing';
import { typography } from '@/theme/typography';

export type SetupConduitType = 'EMT' | 'PVC' | 'IMC' | 'RMC';
export type SetupUnit = 'imperial' | 'metric';
export type SetupRounding = 'exact' | '1/16' | '1/8' | '1/4' | '1mm' | '5mm' | '10mm';
export type SetupBender =
  | 'Generic Hand Bender'
  | 'Generic Mechanical Bender'
  | 'Generic Hydraulic Bender';

export type OffsetSetupValues = {
  conduitType: SetupConduitType;
  conduitSize: string;
  bender: SetupBender;
  unit: SetupUnit;
  rounding: SetupRounding;
  bendAngle: BendAngle;
};

export type EditSetupSheetProps = {
  visible: boolean;
  values: OffsetSetupValues;
  onCancel: () => void;
  onApply: (nextValues: OffsetSetupValues) => void;
};

const CONDUIT_TYPES: SetupConduitType[] = ['EMT', 'PVC', 'IMC', 'RMC'];
const CONDUIT_SIZES = ['1/2', '3/4', '1', '1-1/4', '1-1/2', '2'];
const BENDERS: SetupBender[] = [
  'Generic Hand Bender',
  'Generic Mechanical Bender',
  'Generic Hydraulic Bender',
];
const UNITS: { label: string; value: SetupUnit }[] = [
  { label: 'Imperial', value: 'imperial' },
  { label: 'Metric', value: 'metric' },
];
const IMPERIAL_ROUNDING: SetupRounding[] = ['exact', '1/16', '1/8', '1/4'];
const METRIC_ROUNDING: SetupRounding[] = ['1mm', '5mm', '10mm'];

export function EditSetupSheet({ visible, values, onCancel, onApply }: EditSetupSheetProps) {
  const [draft, setDraft] = useState<OffsetSetupValues>(values);

  // Opening the sheet copies the parent values into local draft state.
  useEffect(() => {
    if (visible) {
      setDraft(values);
    }
  }, [values, visible]);

  const roundingOptions = draft.unit === 'imperial' ? IMPERIAL_ROUNDING : METRIC_ROUNDING;

  function updateDraft(patch: Partial<OffsetSetupValues>) {
    setDraft((current) => {
      const next = { ...current, ...patch };

      // Keep rounding valid when switching unit systems.
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
    <Modal visible={visible} transparent animationType="slide" onRequestClose={onCancel}>
      <View style={styles.backdrop}>
        <View style={styles.sheet}>
          <View style={styles.handle} />

          <View style={styles.header}>
            <View>
              <Text style={styles.title}>Edit Setup</Text>
              <Text style={styles.subtitle}>
                Conduit type, size, bender, unit, and rounding.
              </Text>
            </View>
          </View>

          <ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
            <OptionGroup
              title="Conduit Type"
              options={CONDUIT_TYPES}
              selected={draft.conduitType}
              onSelect={(conduitType) => updateDraft({ conduitType })}
            />

            <OptionGroup
              title="Conduit Size"
              options={CONDUIT_SIZES}
              selected={draft.conduitSize}
              onSelect={(conduitSize) => updateDraft({ conduitSize })}
            />

            <OptionGroup
              title="Bender"
              options={BENDERS}
              selected={draft.bender}
              onSelect={(bender) => updateDraft({ bender })}
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
              <Text style={styles.currentLine}>Conduit: {draft.conduitType} {draft.conduitSize}"</Text>
              <Text style={styles.currentLine}>Bender: {draft.bender}</Text>
              <Text style={styles.currentLine}>Angle: {draft.bendAngle}°</Text>
              <Text style={styles.currentLine}>Unit: {draft.unit}</Text>
              <Text style={styles.currentLine}>Rounding: {draft.rounding}</Text>
            </View>
          </ScrollView>

          <View style={styles.actions}>
            <Pressable onPress={onCancel} style={styles.cancelButton} accessibilityRole="button">
              <Text style={styles.cancelText}>Cancel</Text>
            </Pressable>
            <Pressable
              onPress={() => onApply(draft)}
              style={styles.applyButton}
              accessibilityRole="button">
              <Text style={styles.applyText}>Apply</Text>
            </Pressable>
          </View>
        </View>
      </View>
    </Modal>
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
              <Text style={[styles.chipText, active && styles.chipTextActive]}>
                {option}
              </Text>
            </Pressable>
          );
        })}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  backdrop: {
    flex: 1,
    justifyContent: 'flex-end',
    backgroundColor: 'rgba(5, 7, 11, 0.82)',
  },
  sheet: {
    width: '100%',
    maxWidth: layout.maxContentWidth,
    alignSelf: 'center',
    maxHeight: '88%',
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    borderWidth: 1,
    borderColor: colors.border,
    backgroundColor: colors.screen,
    padding: spacing.lg,
    gap: spacing.lg,
  },
  handle: {
    width: 48,
    height: 4,
    alignSelf: 'center',
    borderRadius: 999,
    backgroundColor: colors.border,
  },
  header: {
    gap: spacing.xs,
  },
  title: {
    color: colors.text,
    fontSize: 18,
    fontWeight: '700',
  },
  subtitle: {
    ...typography.subtitle,
    color: colors.muted,
  },
  content: {
    gap: spacing.lg,
    paddingBottom: spacing.sm,
  },
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
  actions: {
    flexDirection: 'row',
    gap: spacing.md,
  },
  cancelButton: {
    flex: 1,
    minHeight: touchTarget,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 12,
    borderWidth: 1,
    borderColor: colors.border,
    backgroundColor: colors.surface,
  },
  applyButton: {
    flex: 1,
    minHeight: touchTarget,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 12,
    backgroundColor: colors.primary,
  },
  cancelText: {
    ...typography.chip,
    color: colors.text,
  },
  applyText: {
    ...typography.chip,
    color: colors.background,
  },
});
