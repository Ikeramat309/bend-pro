/**
 * Settings — edits the shared, persisted calculator setup. Changes apply
 * immediately and show up in every calculator (same store as Edit Setup).
 */
import Constants from 'expo-constants';
import { useRouter } from 'expo-router';
import { ScrollView, StyleSheet, Text, View } from 'react-native';

import {
  IMPERIAL_ROUNDING_OPTIONS,
  METRIC_ROUNDING_OPTIONS,
  patchCalculatorSetup,
  useCalculatorSetup,
  type CalculatorSetup,
} from '@/core/settings';
import { BENDER_PROFILES, getBenderProfile, getBenderProfileIdByName } from '@/data/benders';
import { EMT_TRADE_SIZES } from '@/data/emt';
import { AppHeader, OptionChipGroup } from '@/shared/ui';
import { colors, layout, radius, spacing, typography } from '@/theme';

const BENDER_PROFILE_NAMES = BENDER_PROFILES.map((profile) => profile.name);
const UNIT_LABELS = ['Imperial', 'Metric'] as const;

export function SettingsScreen() {
  const router = useRouter();
  const { setup, setSetup } = useCalculatorSetup();
  const roundingOptions =
    setup.unit === 'imperial' ? IMPERIAL_ROUNDING_OPTIONS : METRIC_ROUNDING_OPTIONS;

  function update(patch: Partial<CalculatorSetup>) {
    setSetup(patchCalculatorSetup(setup, patch));
  }

  return (
    <View style={styles.screen}>
      <AppHeader
        title="Settings"
        subtitle="Units, defaults, and app preferences"
        showBack
        onBackPress={() => router.back()}
      />

      <ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
        <View style={styles.card}>
          <Text style={styles.cardTitle}>Units</Text>
          <OptionChipGroup
            title="Unit"
            options={UNIT_LABELS}
            selected={setup.unit === 'imperial' ? 'Imperial' : 'Metric'}
            onSelect={(label) => update({ unit: label === 'Imperial' ? 'imperial' : 'metric' })}
          />
          <OptionChipGroup
            title="Rounding"
            options={roundingOptions}
            selected={setup.rounding}
            onSelect={(rounding) => update({ rounding })}
          />
        </View>

        <View style={styles.card}>
          <Text style={styles.cardTitle}>Field Defaults</Text>
          <Text style={styles.cardBody}>Used by every calculator. Editable per-bend too.</Text>
          <OptionChipGroup
            title="EMT Size"
            options={EMT_TRADE_SIZES}
            selected={setup.conduitSize}
            onSelect={(conduitSize) => update({ conduitSize })}
          />
          <OptionChipGroup
            title="Bender Profile"
            options={BENDER_PROFILE_NAMES}
            selected={getBenderProfile(setup.benderProfileId).name}
            onSelect={(name) => update({ benderProfileId: getBenderProfileIdByName(name) })}
          />
        </View>

        <View style={styles.card}>
          <Text style={styles.cardTitle}>About</Text>
          <Text style={styles.cardBody}>
            Bend Pro {Constants.expoConfig?.version ?? ''} — EMT bending calculators for the
            field.
          </Text>
        </View>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    backgroundColor: colors.background,
  },
  content: {
    width: '100%',
    maxWidth: layout.maxContentWidth,
    alignSelf: 'center',
    padding: spacing.lg,
    paddingBottom: spacing.section,
    gap: spacing.md,
  },
  card: {
    gap: spacing.md,
    borderRadius: radius.lg,
    borderWidth: 1,
    borderColor: colors.border,
    backgroundColor: colors.surface,
    padding: spacing.lg,
  },
  cardTitle: {
    ...typography.body,
    color: colors.text,
    fontWeight: '700',
  },
  cardBody: {
    ...typography.subtitle,
    color: colors.muted,
  },
});
