import Constants from 'expo-constants';
import { useRouter } from 'expo-router';
import { Linking, ScrollView, StyleSheet, View } from 'react-native';

import {
  IMPERIAL_ROUNDING_OPTIONS,
  METRIC_ROUNDING_OPTIONS,
  patchCalculatorSetup,
  useCalculatorSetup,
  type CalculatorSetup,
} from '@/core/settings';
import { getBenderProfile, getBenderProfileIdByName, mergeBenderProfiles } from '@/data/benders';
import { SUPPORTED_EMT_TRADE_SIZES } from '@/data/emt';
import { Routes } from '@/navigation';
import { AppHeader, HubNavCard, HubSettingsCard, OptionChipGroup, SetupOverridesCard } from '@/shared/ui';
import { uiTheme, useTheme, type ThemeMode } from '@/theme';

const UNIT_LABELS = ['Imperial', 'Metric'] as const;

const APPEARANCE_LABELS = ['System', 'Light', 'Dark'] as const;
type AppearanceLabel = (typeof APPEARANCE_LABELS)[number];

const MODE_TO_LABEL: Record<ThemeMode, AppearanceLabel> = {
  system: 'System',
  light: 'Light',
  dark: 'Dark',
};
const LABEL_TO_MODE: Record<AppearanceLabel, ThemeMode> = {
  System: 'system',
  Light: 'light',
  Dark: 'dark',
};

/** Beta feedback inbox — placeholder address; swap before public beta. */
const FEEDBACK_EMAIL = 'feedback@bendpro.app';

export function SettingsScreen() {
  const router = useRouter();
  const { setup, setSetup } = useCalculatorSetup();
  const { colors, mode, setMode } = useTheme();
  const roundingOptions =
    setup.unit === 'imperial' ? IMPERIAL_ROUNDING_OPTIONS : METRIC_ROUNDING_OPTIONS;
  const benderProfileNames = mergeBenderProfiles(setup.customBenderProfiles).map(
    (profile) => profile.name,
  );

  function update(patch: Partial<CalculatorSetup>) {
    setSetup(patchCalculatorSetup(setup, patch));
  }

  return (
    <View style={[styles.screen, { backgroundColor: colors.background }]}>
      <AppHeader
        title="Settings"
        subtitle="Units, defaults, and app preferences"
        showBack
        onBackPress={() => router.back()}
      />

      <ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
        <HubSettingsCard title="Appearance" body="Follow your device, or force light or dark.">
          <OptionChipGroup
            title="Theme"
            options={APPEARANCE_LABELS}
            selected={MODE_TO_LABEL[mode]}
            onSelect={(label) => setMode(LABEL_TO_MODE[label])}
          />
        </HubSettingsCard>

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
            options={SUPPORTED_EMT_TRADE_SIZES}
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

        <HubSettingsCard title="Beta" body="Found a wrong number or a confusing screen? Tell us — field feedback shapes the release.">
          <HubNavCard
            label="Send feedback"
            description="Report a bad mark, a bug, or an idea"
            onPress={() => {
              const subject = encodeURIComponent('Bend Pro beta feedback');
              const body = encodeURIComponent(
                `App version: ${Constants.expoConfig?.version ?? ''}\nCalculator:\nWhat happened:\n`,
              );
              void Linking.openURL(`mailto:${FEEDBACK_EMAIL}?subject=${subject}&body=${body}`);
            }}
          />
        </HubSettingsCard>

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
