import { useState } from 'react';
import { LayoutChangeEvent, Pressable, StyleSheet, Text, View } from 'react-native';

import { colors, spacing, touchTarget, typography } from '@/theme';
import {
  adjustLengthInputByInches,
  LENGTH_STEP_DELTAS_INCHES,
  type LengthAdjustmentBounds,
} from '@/utils/lengthAdjustment';
import { parseLengthInput } from '@/utils/parseLengthInput';

import { FractionKeypad } from './FractionKeypad';
import { Sheet } from './Sheet';

export type LengthInputSheetProps = {
  visible: boolean;
  label: string;
  value: string;
  unit?: string;
  placeholder?: string;
  /** Commits the edited value and closes the sheet. */
  onCommit: (text: string) => void;
  /** Discards edits and closes the sheet. */
  onCancel: () => void;
  bounds?: LengthAdjustmentBounds;
};

const STEP_BUTTONS = [
  { key: 'minusOne', label: '-1"', delta: LENGTH_STEP_DELTAS_INCHES.minusOne },
  { key: 'minusQuarter', label: '-1/4"', delta: LENGTH_STEP_DELTAS_INCHES.minusQuarter },
  { key: 'minusSixteenth', label: '-1/16"', delta: LENGTH_STEP_DELTAS_INCHES.minusSixteenth },
  { key: 'plusSixteenth', label: '+1/16"', delta: LENGTH_STEP_DELTAS_INCHES.plusSixteenth },
  { key: 'plusQuarter', label: '+1/4"', delta: LENGTH_STEP_DELTAS_INCHES.plusQuarter },
  { key: 'plusOne', label: '+1"', delta: LENGTH_STEP_DELTAS_INCHES.plusOne },
] as const;

/** Bottom-sheet imperial length editor — exact keypad plus tape-measure step controls. */
export function LengthInputSheet({
  visible,
  label,
  value,
  unit = '',
  placeholder = '0',
  onCommit,
  onCancel,
  bounds,
}: LengthInputSheetProps) {
  const [editDraft, setEditDraft] = useState<string | null>(null);
  const draft = editDraft ?? value;

  const displayValue = draft.trim() !== '' ? draft : placeholder;
  const minInches = bounds?.minInches ?? 0;
  const maxInches = bounds?.maxInches ?? 120;
  const sliderInches = parseLengthInput(draft) ?? minInches;

  function applyStep(delta: number) {
    setEditDraft(adjustLengthInputByInches(draft, delta, bounds));
  }

  function applySliderInches(nextInches: number) {
    const clamped = Math.min(Math.max(nextInches, minInches), maxInches);
    const rounded = Math.round(clamped * 16) / 16;
    if (rounded <= 0) {
      setEditDraft('');
      return;
    }
    setEditDraft(adjustLengthInputByInches('', rounded, bounds));
  }

  function handleDone() {
    onCommit(draft);
    setEditDraft(null);
  }

  function handleCancel() {
    setEditDraft(null);
    onCancel();
  }

  return (
    <Sheet
      visible={visible}
      title={label}
      subtitle={unit ? `Tape measure (${unit})` : 'Tape measure'}
      onClose={handleCancel}
      onSecondaryPress={handleCancel}
      onPrimaryPress={handleDone}
      primaryLabel="Done">
      <View style={styles.valueRow}>
        <Text
          style={[styles.value, draft.trim() === '' && styles.valuePlaceholder]}
          numberOfLines={1}
          adjustsFontSizeToFit
          minimumFontScale={0.75}>
          {displayValue}
        </Text>
        {unit ? <Text style={styles.unit}>{unit}</Text> : null}
      </View>

      <View style={styles.stepSection}>
        <Text style={styles.stepLabel}>Quick adjust</Text>
        <View style={styles.stepRow}>
          {STEP_BUTTONS.map((step) => (
            <Pressable
              key={step.key}
              onPress={() => applyStep(step.delta)}
              style={({ pressed }) => [styles.stepButton, pressed && styles.stepPressed]}
              accessibilityRole="button"
              accessibilityLabel={step.label}>
              <Text style={styles.stepButtonText}>{step.label}</Text>
            </Pressable>
          ))}
        </View>
      </View>

      <TapeRulerControl
        inches={sliderInches}
        minInches={minInches}
        maxInches={Math.max(maxInches, minInches + 1)}
        onChange={applySliderInches}
      />

      <FractionKeypad value={draft} onChangeText={setEditDraft} showDone={false} />
    </Sheet>
  );
}

type TapeRulerControlProps = {
  inches: number;
  minInches: number;
  maxInches: number;
  onChange: (inches: number) => void;
};

/** Simple snap ruler — tap positions along the bar adjust in 1/16" steps. */
function TapeRulerControl({ inches, minInches, maxInches, onChange }: TapeRulerControlProps) {
  const [trackWidth, setTrackWidth] = useState(0);
  const span = maxInches - minInches;
  const ratio = span > 0 ? (inches - minInches) / span : 0;
  const thumbLeft = trackWidth > 0 ? Math.min(Math.max(ratio, 0), 1) * trackWidth : 0;

  function handleLayout(event: LayoutChangeEvent) {
    setTrackWidth(event.nativeEvent.layout.width);
  }

  function handlePress(locationX: number) {
    if (trackWidth <= 0 || span <= 0) return;
    const nextRatio = Math.min(Math.max(locationX / trackWidth, 0), 1);
    onChange(minInches + nextRatio * span);
  }

  return (
    <View style={styles.rulerSection}>
      <Text style={styles.stepLabel}>Tape ruler</Text>
      <Pressable
        onLayout={handleLayout}
        onPress={(event) => handlePress(event.nativeEvent.locationX)}
        style={styles.rulerTrack}
        accessibilityRole="adjustable"
        accessibilityLabel="Tape ruler adjustment">
        <View style={styles.rulerTicks}>
          {Array.from({ length: 5 }, (_, index) => (
            <View key={index} style={styles.rulerTick} />
          ))}
        </View>
        <View style={[styles.rulerThumb, { left: thumbLeft }]} />
      </Pressable>
    </View>
  );
}

const styles = StyleSheet.create({
  valueRow: {
    flexDirection: 'row',
    alignItems: 'baseline',
    justifyContent: 'center',
    gap: spacing.sm,
    paddingVertical: spacing.sm,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: colors.border,
    backgroundColor: colors.surface2,
  },
  value: {
    fontSize: 28,
    lineHeight: 34,
    fontWeight: '700',
    color: colors.text,
    fontVariant: ['tabular-nums'],
  },
  valuePlaceholder: {
    color: colors.muted,
  },
  unit: {
    ...typography.subtitle,
    fontSize: 18,
    lineHeight: 22,
    fontWeight: '600',
    color: colors.primary,
  },
  stepSection: {
    gap: spacing.xs,
  },
  stepLabel: {
    fontSize: 11,
    lineHeight: 14,
    fontWeight: '600',
    letterSpacing: 0.55,
    textTransform: 'uppercase',
    color: colors.muted,
  },
  stepRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: spacing.xs,
  },
  stepButton: {
    minHeight: touchTarget - 10,
    paddingHorizontal: spacing.sm,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 10,
    borderWidth: 1,
    borderColor: colors.border,
    backgroundColor: colors.surface2,
  },
  stepPressed: {
    opacity: 0.88,
  },
  stepButtonText: {
    fontSize: 13,
    fontWeight: '600',
    color: colors.text,
    fontVariant: ['tabular-nums'],
  },
  rulerSection: {
    gap: spacing.xs,
  },
  rulerTrack: {
    position: 'relative',
    height: 36,
    justifyContent: 'center',
    borderRadius: 10,
    borderWidth: 1,
    borderColor: colors.border,
    backgroundColor: colors.surface2,
    overflow: 'hidden',
  },
  rulerTicks: {
    ...StyleSheet.absoluteFill,
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingHorizontal: spacing.sm,
    alignItems: 'center',
  },
  rulerTick: {
    width: 1,
    height: 14,
    backgroundColor: colors.border,
  },
  rulerThumb: {
    position: 'absolute',
    top: 6,
    width: 4,
    height: 24,
    marginLeft: -2,
    borderRadius: 2,
    backgroundColor: colors.primary,
  },
});
