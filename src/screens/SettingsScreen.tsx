import Constants from 'expo-constants';
import { useRouter } from 'expo-router';
import { ScrollView, StyleSheet, View } from 'react-native';

import {
  IMPERIAL_ROUNDING_OPTIONS,
  METRIC_ROUNDING_OPTIONS,
  patchCalculatorSetup,
  useCalculatorSetup,
  type CalculatorSetup,
} from '@/core/settings';
import { getBenderProfile, getBenderProfileIdByName, mergeBenderProfiles } from '@/data/benders';
import { EMT_TRADE_SIZES } from '@/data/emt';
import { Routes } from '@/navigation';
import { AppHeader, HubNavCard, HubSettingsCard, OptionChipGroup, SetupOverridesCard } from '@/shared/ui';
import { colors, uiTheme } from '@/theme';

const UNIT_LABELS = ['Imperial', 'Metric'] as const;

export function SettingsScreen() {
  const router = useRouter();
  const { setup, setSetup } = useCalculatorSetup();
  const roundingOptions =
    setup.unit === 'imperial' ? IMPERIAL_ROUNDING_OPTIONS : METRIC_ROUNDING_OPTIONS;
  const benderProfileNames = mergeBenderProfiles(setup.customBenderProfiles).map(
    (profile) => profile.name,
  );

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
        <HubSettingsCard title="Units">
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
        </HubSettingsCard>

        <HubSettingsCard title="Field Defaults" body="Used by every calculator. Editable per-bend too.">
          <OptionChipGroup
            title="EMT Size"
            options={EMT_TRADE_SIZES}
            selected={setup.conduitSize}
            onSelect={(conduitSize) => update({ conduitSize })}
          />
          <OptionChipGroup
            title="Bender Profile"
            options={benderProfileNames}
            selected={getBenderProfile(setup.benderProfileId, setup.customBenderProfiles).name}
            onSelect={(name) =>
              update({
                benderProfileId: getBenderProfileIdByName(name, setup.customBenderProfiles),
              })
            }
          />
          <HubNavCard
            label="Manage benders"
            description="View charts, add custom profiles, and review overrides"
            onPress={() => router.push(Routes.benderDatabase)}
          />
        </HubSettingsCard>

        <SetupOverridesCard />

        <HubSettingsCard
          title="About"
          body={`Bend Pro ${Constants.expoConfig?.version ?? ''} — EMT bending calculators for the field.`}
        />
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
    maxWidth: uiTheme.layout.maxContentWidth,
    alignSelf: 'center',
    padding: uiTheme.layout.screenPadding,
    paddingBottom: uiTheme.layout.sectionBottom,
    gap: uiTheme.hub.sectionGap,
  },
});
