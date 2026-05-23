/**
 * FILE: src/components/ConduitSelector.tsx
 *
 * PURPOSE: Pick conduit type (EMT/RMC/IMC/PVC) and trade size.
 * INPUTS:  conduitType, sizeId, unitSystem, change callbacks.
 * OUTPUTS: UI + modal pickers — NO fill % or bend math.
 *
 * BEGINNER NOTE — useState here:
 * Only tracks whether modals are open (UI state), not calculation results.
 */
// IMPORTS
import { useState } from 'react';
import { Modal, Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';

import type { UnitSystem } from '@/engine/types';
import {
  CalculatorRadii,
  CalculatorSpacing,
  CalculatorTypography,
  TOUCH_TARGET_MIN,
  useCalculatorTheme,
} from '@/theme';

export const CONDUIT_TYPES = ['EMT', 'RMC', 'IMC', 'PVC'] as const;
export type ConduitType = (typeof CONDUIT_TYPES)[number];

export type ConduitSizeOption = {
  id: string;
  label: string;
};

const IMPERIAL_SIZES: ConduitSizeOption[] = [
  { id: '1/2', label: '1/2"' },
  { id: '3/4', label: '3/4"' },
  { id: '1', label: '1"' },
  { id: '1-1/4', label: '1-1/4"' },
  { id: '1-1/2', label: '1-1/2"' },
  { id: '2', label: '2"' },
  { id: '2-1/2', label: '2-1/2"' },
  { id: '3', label: '3"' },
  { id: '3-1/2', label: '3-1/2"' },
  { id: '4', label: '4"' },
];

const METRIC_SIZES: ConduitSizeOption[] = [
  { id: '16', label: '16 mm' },
  { id: '21', label: '21 mm' },
  { id: '27', label: '27 mm' },
  { id: '35', label: '35 mm' },
  { id: '41', label: '41 mm' },
  { id: '53', label: '53 mm' },
  { id: '63', label: '63 mm' },
  { id: '78', label: '78 mm' },
  { id: '91', label: '91 mm' },
  { id: '103', label: '103 mm' },
];

export type ConduitSelectorProps = {
  conduitType: ConduitType;
  onConduitTypeChange: (type: ConduitType) => void;
  sizeId: string;
  onSizeChange: (sizeId: string) => void;
  unitSystem: UnitSystem;
  disabled?: boolean;
};

type DropdownFieldProps = {
  label: string;
  value: string;
  onPress: () => void;
  disabled?: boolean;
};

function DropdownField({ label, value, onPress, disabled }: DropdownFieldProps) {
  const colors = useCalculatorTheme();

  return (
    <View style={styles.field}>
      <Text style={[styles.fieldLabel, { color: colors.textSecondary }]}>{label}</Text>
      <Pressable
        disabled={disabled}
        onPress={onPress}
        style={({ pressed }) => [
          styles.dropdown,
          {
            backgroundColor: colors.inputBackground,
            borderColor: colors.inputBorder,
            opacity: pressed && !disabled ? 0.85 : 1,
          },
        ]}>
        <Text style={[styles.dropdownValue, { color: colors.text }]}>{value}</Text>
        <Text style={[styles.chevron, { color: colors.textMuted }]}>▼</Text>
      </Pressable>
    </View>
  );
}

export function ConduitSelector({
  conduitType,
  onConduitTypeChange,
  sizeId,
  onSizeChange,
  unitSystem,
  disabled = false,
}: ConduitSelectorProps) {
  const colors = useCalculatorTheme();
  const sizes = unitSystem === 'metric' ? METRIC_SIZES : IMPERIAL_SIZES;
  const selectedSize = sizes.find((s) => s.id === sizeId)?.label ?? 'Select size';

  const [typeModalOpen, setTypeModalOpen] = useState(false);
  const [sizeModalOpen, setSizeModalOpen] = useState(false);

  return (
    <View
      style={[
        styles.card,
        { backgroundColor: colors.card, borderColor: colors.cardBorder },
      ]}>
      <Text style={[styles.title, { color: colors.text }]}>Conduit</Text>

      <DropdownField
        label="Type"
        value={conduitType}
        disabled={disabled}
        onPress={() => setTypeModalOpen(true)}
      />
      <DropdownField
        label="Trade size"
        value={selectedSize}
        disabled={disabled}
        onPress={() => setSizeModalOpen(true)}
      />

      <SelectionModal
        visible={typeModalOpen}
        title="Conduit type"
        options={CONDUIT_TYPES.map((t) => ({ id: t, label: t }))}
        selectedId={conduitType}
        onSelect={(id) => onConduitTypeChange(id as ConduitType)}
        onClose={() => setTypeModalOpen(false)}
      />
      <SelectionModal
        visible={sizeModalOpen}
        title="Trade size"
        options={sizes}
        selectedId={sizeId}
        onSelect={onSizeChange}
        onClose={() => setSizeModalOpen(false)}
      />
    </View>
  );
}

type SelectionModalProps = {
  visible: boolean;
  title: string;
  options: { id: string; label: string }[];
  selectedId: string;
  onSelect: (id: string) => void;
  onClose: () => void;
};

function SelectionModal({
  visible,
  title,
  options,
  selectedId,
  onSelect,
  onClose,
}: SelectionModalProps) {
  const colors = useCalculatorTheme();

  return (
    <Modal visible={visible} transparent animationType="fade" onRequestClose={onClose}>
      <Pressable style={styles.modalBackdrop} onPress={onClose}>
        <Pressable
          style={[styles.modalSheet, { backgroundColor: colors.card, borderColor: colors.cardBorder }]}
          onPress={(e) => e.stopPropagation()}>
          <Text style={[styles.modalTitle, { color: colors.text }]}>{title}</Text>
          <ScrollView style={styles.modalList} keyboardShouldPersistTaps="handled">
            {options.map((option) => {
              const active = option.id === selectedId;
              return (
                <Pressable
                  key={option.id}
                  onPress={() => {
                    onSelect(option.id);
                    onClose();
                  }}
                  style={[
                    styles.modalOption,
                    {
                      backgroundColor: active ? colors.cardSelected : 'transparent',
                    },
                  ]}>
                  <Text style={[styles.modalOptionText, { color: colors.text }]}>{option.label}</Text>
                </Pressable>
              );
            })}
          </ScrollView>
          <Pressable
            onPress={onClose}
            style={[styles.modalClose, { backgroundColor: colors.segmentInactive }]}>
            <Text style={[styles.modalCloseText, { color: colors.text }]}>Cancel</Text>
          </Pressable>
        </Pressable>
      </Pressable>
    </Modal>
  );
}

const styles = StyleSheet.create({
  card: {
    borderRadius: CalculatorRadii.lg,
    borderWidth: 1,
    padding: CalculatorSpacing.lg,
    gap: CalculatorSpacing.md,
  },
  title: {
    ...CalculatorTypography.label,
    fontSize: 16,
  },
  field: {
    gap: CalculatorSpacing.sm,
  },
  fieldLabel: {
    ...CalculatorTypography.label,
  },
  dropdown: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    minHeight: TOUCH_TARGET_MIN,
    borderRadius: CalculatorRadii.md,
    borderWidth: 1,
    paddingHorizontal: CalculatorSpacing.lg,
  },
  dropdownValue: {
    ...CalculatorTypography.input,
    fontSize: 18,
  },
  chevron: {
    fontSize: 12,
  },
  modalBackdrop: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.6)',
    justifyContent: 'flex-end',
  },
  modalSheet: {
    borderTopLeftRadius: CalculatorRadii.lg,
    borderTopRightRadius: CalculatorRadii.lg,
    borderWidth: 1,
    maxHeight: '70%',
    padding: CalculatorSpacing.lg,
    gap: CalculatorSpacing.md,
  },
  modalTitle: {
    ...CalculatorTypography.title,
    fontSize: 20,
  },
  modalList: {
    maxHeight: 320,
  },
  modalOption: {
    minHeight: TOUCH_TARGET_MIN,
    justifyContent: 'center',
    paddingHorizontal: CalculatorSpacing.md,
    borderRadius: CalculatorRadii.sm,
  },
  modalOptionText: {
    ...CalculatorTypography.segment,
  },
  modalClose: {
    minHeight: TOUCH_TARGET_MIN,
    borderRadius: CalculatorRadii.md,
    alignItems: 'center',
    justifyContent: 'center',
  },
  modalCloseText: {
    ...CalculatorTypography.segment,
  },
});
