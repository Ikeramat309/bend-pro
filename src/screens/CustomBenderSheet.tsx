/**
 * Create / edit custom bender profile — name plus measured stub 90 deducts.
 */
import { useState } from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';

import {
  buildCustomBenderProfileFromDraft,
  draftFromCustomProfile,
  type CustomBenderProfileDraft,
  type CustomBenderProfileStored,
} from '@/data/benders';
import { FieldInput } from '@/shared/ui';
import { Sheet } from '@/shared/ui/Sheet';
import { colors, spacing, typography } from '@/theme';

export type CustomBenderSheetProps = {
  visible: boolean;
  mode: 'create' | 'edit';
  profile?: CustomBenderProfileStored;
  onCancel: () => void;
  onSave: (profile: CustomBenderProfileStored) => void;
  onDelete?: () => void;
  saveError?: string;
};

export function CustomBenderSheet(props: CustomBenderSheetProps) {
  if (!props.visible) {
    return (
      <Sheet
        visible={false}
        title="Custom Bender"
        onClose={props.onCancel}
        onSecondaryPress={props.onCancel}
      />
    );
  }

  return <CustomBenderSheetOpen {...props} />;
}

function CustomBenderSheetOpen({
  mode,
  profile,
  onCancel,
  onSave,
  onDelete,
  saveError,
}: CustomBenderSheetProps) {
  const [draft, setDraft] = useState<CustomBenderProfileDraft>(() =>
    profile ? draftFromCustomProfile(profile) : emptyDraft(),
  );
  const [error, setError] = useState<string | undefined>();
  const displayError = error ?? saveError;

  function updateDraft(patch: Partial<CustomBenderProfileDraft>) {
    setDraft((current) => ({ ...current, ...patch }));
    setError(undefined);
  }

  function handleSave() {
    const result = buildCustomBenderProfileFromDraft(draft, profile?.id);
    if (result.error || !result.profile) {
      setError(result.error);
      return;
    }
    onSave(result.profile);
  }

  const title = mode === 'create' ? 'Add Custom Bender' : 'Edit Custom Bender';
  const subtitle = 'Enter stub 90 deducts you measured on your bender.';

  return (
    <Sheet
      visible
      title={title}
      subtitle={subtitle}
      onClose={onCancel}
      onSecondaryPress={onCancel}
      onPrimaryPress={handleSave}
      primaryLabel={mode === 'create' ? 'Save' : 'Update'}>
      <Text style={styles.description}>
        Generic charts are field references — not manufacturer shoe charts. Save your own
        measured values here when your bender differs.
      </Text>

      <FieldInput
        label="Bender name"
        value={draft.name}
        onChangeText={(name) => updateDraft({ name })}
        placeholder="e.g. Shop hand bender"
        error={displayError}
      />

      <View style={styles.deductGroup}>
        <Text style={styles.groupLabel}>Stub 90 deduct (inches)</Text>
        <Text style={styles.groupHint}>
          Enter at least one size. Fractions OK (e.g. 5 1/4). Leave blank if unknown.
        </Text>
        <FieldInput
          label='1/2" EMT'
          value={draft.deductHalf}
          onChangeText={(deductHalf) => updateDraft({ deductHalf })}
          placeholder="e.g. 5 or 5 1/4"
          inputProps={{ keyboardType: 'numbers-and-punctuation' }}
        />
        <FieldInput
          label='3/4" EMT'
          value={draft.deductThreeQuarter}
          onChangeText={(deductThreeQuarter) => updateDraft({ deductThreeQuarter })}
          placeholder="e.g. 6 or 6 1/8"
          inputProps={{ keyboardType: 'numbers-and-punctuation' }}
        />
        <FieldInput
          label='1" EMT'
          value={draft.deductOne}
          onChangeText={(deductOne) => updateDraft({ deductOne })}
          placeholder="e.g. 8 or 8 1/2"
          inputProps={{ keyboardType: 'numbers-and-punctuation' }}
        />
      </View>

      {mode === 'edit' && onDelete ? (
        <Pressable onPress={onDelete} style={styles.deleteButton} accessibilityRole="button">
          <Text style={styles.deleteText}>Delete custom bender</Text>
        </Pressable>
      ) : null}
    </Sheet>
  );
}

function emptyDraft(): CustomBenderProfileDraft {
  return { name: '', deductHalf: '', deductThreeQuarter: '', deductOne: '' };
}

const styles = StyleSheet.create({
  description: {
    ...typography.subtitle,
    color: colors.muted,
  },
  deductGroup: {
    gap: spacing.sm,
  },
  groupLabel: {
    ...typography.label,
    color: colors.text,
  },
  groupHint: {
    ...typography.subtitle,
    color: colors.muted,
    marginBottom: spacing.xs,
  },
  deleteButton: {
    alignItems: 'center',
    paddingVertical: spacing.sm,
  },
  deleteText: {
    ...typography.subtitle,
    color: colors.error,
    fontWeight: '600',
  },
});
