import { useMemo } from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';

import {
  listSetupOverrides,
  patchClearAllSetupOverrides,
  patchClearSetupOverride,
  patchCalculatorSetup,
  useCalculatorSetup,
  type SetupOverrideEntry,
} from '@/core/settings';
import { spacing, uiTheme, useTheme, type ThemePalette } from '@/theme';

import { HubSettingsCard } from './HubSettingsCard';

export type SetupOverridesCardProps = {
  /** Show a control to clear every override at once. */
  showClearAll?: boolean;
};

/** Lists manual chart overrides saved in calculator setup. */
export function SetupOverridesCard({ showClearAll = true }: SetupOverridesCardProps) {
  const { setup, setSetup } = useCalculatorSetup();
  const { colors } = useTheme();
  const styles = useMemo(() => makeStyles(colors), [colors]);
  const overrides = listSetupOverrides(setup);

  function clearOne(entry: SetupOverrideEntry) {
    setSetup(patchCalculatorSetup(setup, patchClearSetupOverride(setup, entry)));
  }

  function clearAll() {
    setSetup(patchCalculatorSetup(setup, patchClearAllSetupOverrides()));
  }

  if (overrides.length === 0) {
    return (
      <HubSettingsCard
        title="Manual overrides"
        body="No custom deduct, multiplier, or shrink values saved. Calculators use profile charts and standard angle tables until you override from a result chip."
      />
    );
  }

  return (
    <HubSettingsCard title="Manual overrides">
      <Text style={styles.intro}>
        These replace table or profile values on this device. Edit or clear from the calculator
        named in each hint, or remove them here.
      </Text>

      <View style={styles.list}>
        {overrides.map((entry) => (
          <View key={entry.key} style={styles.row}>
            <View style={styles.rowText}>
              <Text style={styles.label}>{entry.label}</Text>
              <Text style={styles.hint}>{entry.editHint}</Text>
            </View>
            <Pressable
              onPress={() => clearOne(entry)}
              style={({ pressed }) => [styles.clearButton, pressed && styles.pressed]}
              accessibilityRole="button"
              accessibilityLabel={`Clear ${entry.label}`}>
              <Text style={styles.clearText}>Clear</Text>
            </Pressable>
          </View>
        ))}
      </View>

      {showClearAll && overrides.length > 1 ? (
        <Pressable
          onPress={clearAll}
          style={({ pressed }) => [styles.clearAllButton, pressed && styles.pressed]}
          accessibilityRole="button">
          <Text style={styles.clearAllText}>Clear all overrides</Text>
        </Pressable>
      ) : null}
    </HubSettingsCard>
  );
}

function makeStyles(c: ThemePalette) {
  return StyleSheet.create({
    intro: {
      fontSize: 14,
      lineHeight: 20,
      color: c.muted,
    },
    list: {
      gap: spacing.sm,
    },
    row: {
      flexDirection: 'row',
      alignItems: 'flex-start',
      gap: spacing.md,
      paddingVertical: spacing.xs,
      borderTopWidth: 1,
      borderTopColor: c.border,
    },
    rowText: {
      flex: 1,
      gap: 2,
    },
    label: {
      fontSize: 14,
      lineHeight: 20,
      fontWeight: '600',
      color: c.text,
    },
    hint: {
      fontSize: 12,
      lineHeight: 16,
      color: c.muted,
    },
    clearButton: {
      paddingHorizontal: spacing.sm,
      paddingVertical: spacing.xs,
      borderRadius: uiTheme.chip.borderRadius,
      borderWidth: 1,
      borderColor: c.border,
      backgroundColor: c.surface2,
    },
    clearText: {
      fontSize: 12,
      lineHeight: 16,
      fontWeight: '700',
      color: c.primary,
    },
    clearAllButton: {
      alignSelf: 'flex-start',
      paddingVertical: spacing.xs,
    },
    clearAllText: {
      fontSize: 13,
      lineHeight: 18,
      fontWeight: '600',
      color: c.error,
    },
    pressed: {
      opacity: 0.88,
    },
  });
}
