import { useState } from 'react';
import { StyleSheet, Text, View } from 'react-native';

import {
  buildCustomBenderProfileFromDraft,
  draftFromCustomProfile,
  type CustomBenderProfileDraft,
  type CustomBenderProfileStored,
} from '@/data/benders';
import {
  FieldInput,
  Sheet,
  SheetDangerAction,
  SheetFormGroup,
} from '@/shared/ui';
import { uiTheme } from '@/theme';

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
      <Text style={styles.intro}>
        Generic charts are field references — not manufacturer shoe charts. Save your own measured
        values here when your bender differs.
      </Text>

      <FieldInput
        label="Bender name"
        value={draft.name}
        onChangeText={(name) => updateDraft({ name })}
        placeholder="e.g. Shop hand bender"
        error={displayError}
      />

      <SheetFormGroup
        title="Stub 90 deduct (inches)"
        hint="Enter at least one size. Fractions OK (e.g. 5 1/4). Leave blank if unknown.">
        <View style={styles.deductRow}>
          <FieldInput
            variant="compact"
            label='1/2" EMT'
            value={draft.deductHalf}
            onChangeText={(deductHalf) => updateDraft({ deductHalf })}
            placeholder="5 1/4"
            lengthInput="imperial"
          />
          <FieldInput
            variant="compact"
            label='3/4" EMT'
            value={draft.deductThreeQuarter}
            onChangeText={(deductThreeQuarter) => updateDraft({ deductThreeQuarter })}
            placeholder="6 1/8"
            lengthInput="imperial"
          />
        </View>
        <FieldInput
          label='1" EMT'
          value={draft.deductOne}
          onChangeText={(deductOne) => updateDraft({ deductOne })}
          placeholder="e.g. 8 or 8 1/2"
          lengthInput="imperial"
        />
      </SheetFormGroup>

      {mode === 'edit' && onDelete ? (
        <SheetDangerAction label="Delete custom bender" onPress={onDelete} />
      ) : null}
    </Sheet>
  );
}

function emptyDraft(): CustomBenderProfileDraft {
  return { name: '', deductHalf: '', deductThreeQuarter: '', deductOne: '' };
}

const styles = StyleSheet.create({
  intro: uiTheme.sheet.intro,
  deductRow: {
    flexDirection: 'row',
    gap: 12,
    alignItems: 'stretch',
  },
});
