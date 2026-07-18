import { useMemo, useState } from 'react';
import { StyleSheet, View } from 'react-native';

import { FieldInput, OptionChipGroup, Sheet } from '@/shared/ui';
import { spacing } from '@/theme';
import { parseLengthInput } from '@/utils/parseLengthInput';
import { formatCanonicalLengthForDisplay, toCanonicalInches } from '@/core/measurements';
import type { UnitSystem } from '@/core/types';
import { getLengthInputMode, getLengthUnitLabel } from '@/utils/units';

import type {
  MultipleBendsDirection,
  MultipleBendsMarkInput,
  MultipleBendsMarkKind,
} from '../engine/multipleBends.types';
import { multipleBendsCopy } from '../multipleBends.copy';

export type MarkEditorSheetProps = {
  visible: boolean;
  mark: MultipleBendsMarkInput | null;
  unitSystem: UnitSystem;
  onCancel: () => void;
  onSave: (mark: MultipleBendsMarkInput) => void;
};

export function MarkEditorSheet({
  visible,
  mark,
  unitSystem,
  onCancel,
  onSave,
}: MarkEditorSheetProps) {
  if (!mark) {
    return <Sheet visible={false} title="Edit Mark" onClose={onCancel} />;
  }

  return (
    <MarkEditorForm
      key={mark.id}
      visible={visible}
      mark={mark}
      unitSystem={unitSystem}
      onCancel={onCancel}
      onSave={onSave}
    />
  );
}

function MarkEditorForm({
  visible,
  mark,
  unitSystem,
  onCancel,
  onSave,
}: MarkEditorSheetProps & { mark: MultipleBendsMarkInput }) {
  const [positionText, setPositionText] = useState(
    formatCanonicalLengthForDisplay(mark.positionInches, unitSystem),
  );
  const [kind, setKind] = useState<MultipleBendsMarkKind>(mark.kind);
  const [angleText, setAngleText] = useState(String(mark.angleDegrees ?? 30));
  const [direction, setDirection] = useState<MultipleBendsDirection>(mark.direction ?? 'up');
  const [flip, setFlip] = useState<'No' | 'Yes'>(mark.flip ? 'Yes' : 'No');
  const enteredPosition = parseLengthInput(positionText);
  const position =
    enteredPosition === undefined ? undefined : toCanonicalInches(enteredPosition, unitSystem);
  const angleDegrees = Number(angleText);
  const angleValid = Number.isFinite(angleDegrees) && angleDegrees > 0 && angleDegrees <= 90;

  const draft = useMemo<MultipleBendsMarkInput | null>(() => {
    if (position === undefined || (kind === 'bend' && !angleValid)) return null;
    return {
      id: mark.id,
      positionInches: position,
      kind,
      angleDegrees: kind === 'bend' ? angleDegrees : undefined,
      direction: kind === 'bend' ? direction : undefined,
      flip: kind === 'bend' ? flip === 'Yes' : undefined,
    };
  }, [angleDegrees, angleValid, direction, flip, kind, mark, position]);

  return (
    <Sheet
      visible={visible}
      title={mark?.id.startsWith('new-') ? 'Add Mark' : 'Edit Mark'}
      subtitle="All positions measure from the same start end."
      onClose={onCancel}
      onSecondaryPress={onCancel}
      primaryLabel="Save Mark"
      onPrimaryPress={() => draft && onSave(draft)}>
      <View style={styles.body}>
        <FieldInput
          label={multipleBendsCopy.fields.markPosition}
          value={positionText}
          onChangeText={setPositionText}
          lengthInput={getLengthInputMode(unitSystem)}
          unit={getLengthUnitLabel(unitSystem)}
          error={position === undefined ? 'Enter a valid distance.' : undefined}
        />
        <OptionChipGroup
          title={multipleBendsCopy.fields.markType}
          options={['bend', 'cut'] as const}
          selected={kind}
          onSelect={setKind}
        />
        {kind === 'bend' ? (
          <>
            <FieldInput
              label={multipleBendsCopy.fields.bendAngle}
              value={angleText}
              onChangeText={setAngleText}
              unit="°"
              inputProps={{ keyboardType: 'decimal-pad' }}
              error={angleValid ? undefined : 'Enter an angle greater than 0° and no more than 90°.'}
            />
            <OptionChipGroup
              title={multipleBendsCopy.fields.direction}
              options={['up', 'down'] as const}
              selected={direction}
              onSelect={setDirection}
            />
            <OptionChipGroup
              title={multipleBendsCopy.fields.flip}
              options={['No', 'Yes'] as const}
              selected={flip}
              onSelect={setFlip}
            />
          </>
        ) : null}
      </View>
    </Sheet>
  );
}

const styles = StyleSheet.create({ body: { gap: spacing.lg } });
