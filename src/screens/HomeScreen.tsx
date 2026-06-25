import { useRouter } from 'expo-router';
import { ScrollView, StyleSheet, Text, View } from 'react-native';

import { getCalculatorRoute, getHomeContinueCalculator, isCalculatorId } from '@/core/calculators';
import { Routes } from '@/navigation';
import {
  AppHeader,
  BottomNav,
  HubNavCard,
  HubSectionTitle,
  type BendTabId,
} from '@/shared/ui';
import { colors, uiTheme } from '@/theme';

const continueCalculator = getHomeContinueCalculator();
const continueRoute =
  continueCalculator && isCalculatorId(continueCalculator.id)
    ? getCalculatorRoute(continueCalculator.id)
    : undefined;

// TODO(sessions): hydrate recent layouts via `loadRecentLayouts` + `resolveContinueLayoutCandidate`
// from `@/core/sessions` when Continue Layout should resume the last calculation.

const NAV_ITEMS = [
  ...(continueCalculator && continueRoute
    ? [
        {
          label: continueCalculator.homeLabel ?? continueCalculator.title,
          description: continueCalculator.homeDescription ?? continueCalculator.description ?? '',
          route: continueRoute,
        },
      ]
    : []),
  { label: 'Bend Library', description: 'Choose a conduit layout', route: Routes.bends },
  { label: 'Bender Database', description: 'Manage benders and shoes', route: Routes.benderDatabase },
] as const;

export function HomeScreen() {
  const router = useRouter();

  function handleTabChange(tab: BendTabId) {
    if (tab === 'layout') router.push(Routes.home);
    if (tab === 'bends') router.push(Routes.bends);
    if (tab === 'benders') router.push(Routes.benderDatabase);
    if (tab === 'guide') router.push(Routes.guide);
  }

  return (
    <View style={styles.screen}>
      <AppHeader
        title="Bend Pro"
        subtitle="Layout"
        badge="Beta"
        rightIcon={<Text style={styles.topIcon}>⚙</Text>}
        onRightPress={() => router.push(Routes.settings)}
      />

      <ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
        <View style={styles.navSection}>
          <HubSectionTitle>Start</HubSectionTitle>
          {NAV_ITEMS.map((item) => (
            <HubNavCard
              key={item.label}
              label={item.label}
              description={item.description}
              onPress={() => router.push(item.route)}
            />
          ))}
        </View>
      </ScrollView>
      <BottomNav activeTab="layout" onTabChange={handleTabChange} />
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
    gap: uiTheme.hub.contentGap,
  },
  topIcon: {
    color: colors.text,
    fontSize: 20,
  },
  navSection: {
    gap: uiTheme.hub.sectionGap,
  },
});
