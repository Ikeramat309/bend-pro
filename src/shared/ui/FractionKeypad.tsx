import { Pressable, StyleSheet, Text, View } from 'react-native';

import { colors, spacing, touchTarget, uiTheme } from '@/theme';
import {
  applyFractionKey,
  FRACTION_KEYPAD_QUICK_KEYS,
  type FractionKey,
} from '@/utils/fractionKeypad';

export type FractionKeypadProps = {
  value: string;
  onChangeText: (text: string) => void;
  /** When false, hides the internal Done key — use sheet-level Done instead. */
  showDone?: boolean;
};

type KeyDef = {
  key: FractionKey | 'done';
  label: string;
  wide?: boolean;
};

function buildRows(showDone: boolean): KeyDef[][] {
  const bottomRow: KeyDef[] = showDone
    ? [
        { key: '0', label: '0', wide: true },
        { key: 'clear', label: 'Clr' },
        { key: 'done', label: 'Done' },
      ]
    : [
        { key: '0', label: '0', wide: true },
        { key: 'clear', label: 'Clr' },
      ];

  return [
    [
      { key: '7', label: '7' },
      { key: '8', label: '8' },
      { key: '9', label: '9' },
      { key: 'backspace', label: '⌫' },
    ],
    [
      { key: '4', label: '4' },
      { key: '5', label: '5' },
      { key: '6', label: '6' },
      { key: 'space', label: 'Space' },
    ],
    [
      { key: '1', label: '1' },
      { key: '2', label: '2' },
      { key: '3', label: '3' },
      { key: 'slash', label: '/' },
    ],
    bottomRow,
  ];
}

/** Trade fraction keypad for imperial length fields — glove-friendly tap targets. */
export function FractionKeypad({ value, onChangeText, showDone = true }: FractionKeypadProps) {
  const rows = buildRows(showDone);

  function handleKey(key: KeyDef) {
    if (key.key === 'done') return;
    onChangeText(applyFractionKey(value, key.key));
  }

  return (
    <View style={styles.wrap}>
      <View style={styles.quickRow}>
        {FRACTION_KEYPAD_QUICK_KEYS.map((fraction) => (
          <Pressable
            key={fraction}
            onPress={() => onChangeText(applyFractionKey(value, fraction))}
            style={({ pressed }) => [styles.quickKey, pressed && styles.keyPressed]}
            accessibilityRole="button"
            accessibilityLabel={`Insert ${fraction}`}>
            <Text style={styles.quickKeyText}>{fraction}</Text>
          </Pressable>
        ))}
      </View>

      {rows.map((row, rowIndex) => (
        <View key={`row-${rowIndex}`} style={styles.row}>
          {row.map((keyDef) => (
            <Pressable
              key={keyDef.label}
              onPress={() => handleKey(keyDef)}
              style={({ pressed }) => [
                styles.key,
                keyDef.wide && styles.keyWide,
                keyDef.key === 'done' && styles.keyDone,
                pressed && styles.keyPressed,
              ]}
              accessibilityRole="button"
              accessibilityLabel={keyDef.label}>
              <Text
                style={[
                  styles.keyText,
                  keyDef.key === 'done' && styles.keyDoneText,
                  keyDef.key === 'backspace' && styles.keyUtilityText,
                ]}>
                {keyDef.label}
              </Text>
            </Pressable>
          ))}
        </View>
      ))}
    </View>
  );
}

const styles = StyleSheet.create({
  wrap: {
    gap: spacing.xs,
    paddingTop: spacing.sm,
  },
  quickRow: {
    flexDirection: 'row',
    gap: spacing.xs,
  },
  quickKey: {
    flex: 1,
    minHeight: touchTarget - 6,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: uiTheme.fractionKeypad.keyRadius,
    borderWidth: 1,
    borderColor: colors.primaryBorder,
    backgroundColor: colors.primaryMuted,
  },
  quickKeyText: {
    fontSize: 14,
    fontWeight: '700',
    color: colors.primary,
    fontVariant: ['tabular-nums'],
  },
  row: {
    flexDirection: 'row',
    gap: spacing.xs,
  },
  key: {
    flex: 1,
    minHeight: touchTarget - 4,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: uiTheme.fractionKeypad.keyRadius,
    borderWidth: 1,
    borderColor: colors.border,
    backgroundColor: colors.surface2,
  },
  keyWide: {
    flex: 2,
  },
  keyDone: {
    borderColor: colors.primaryBorder,
    backgroundColor: colors.surface,
  },
  keyPressed: {
    opacity: 0.88,
  },
  keyText: {
    fontSize: 18,
    fontWeight: '600',
    color: colors.text,
    fontVariant: ['tabular-nums'],
  },
  keyUtilityText: {
    fontSize: 16,
    color: colors.muted,
  },
  keyDoneText: {
    fontSize: 14,
    fontWeight: '700',
    color: colors.primary,
  },
});
