import { useFocusEffect } from "expo-router/react-navigation";
import { useRouter } from 'expo-router';
import { useCallback, useState } from 'react';
import { ScrollView, StyleSheet, Text, View } from 'react-native';

import {
  continueLayoutRoute,
  loadRecentLayouts,
  resolveContinueLayoutCandidate,
  type ContinueLayoutCandidate,
} from '@/core/sessions';
import { Routes } from '@/navigation';
import {
  AppHeader,
  BottomNav,
  HubNavCard,
  HubSectionTitle,
  type BendTabId,
} from '@/shared/ui';
import { uiTheme, useTheme } from '@/theme';

async function loadContinueCandidate(): Promise<ContinueLayoutCandidate | undefined> {
  const { default: AsyncStorage } = await import('@react-native-async-storage/async-storage');
  const layouts = await loadRecentLayouts(AsyncStorage);
  return resolveContinueLayoutCandidate(layouts);
}

export function HomeScreen() {
  const router = useRouter();
  const { colors } = useTheme();
  const [continueCandidate, setContinueCandidate] = useState<ContinueLayoutCandidate | undefined>();

  useFocusEffect(
    useCallback(() => {
      let cancelled = false;

      void loadContinueCandidate().then((candidate) => {
        if (!cancelled) {
          setContinueCandidate(candidate);
        }
      });

      return () => {
        cancelled = true;
      };
    }, []),
  );

  const navItems = [
    ...(continueCandidate
      ? [
          {
            label: continueCandidate.label,
            description: continueCandidate.description,
            route: continueLayoutRoute(continueCandidate),
          },
        ]
      : []),
    { label: 'Bend Library', description: 'Choose a conduit layout', route: Routes.bends },
    { label: 'Bender Database', description: 'Manage benders and shoes', route: Routes.benderDatabase },
  ] as const;

  function handleTabChange(tab: BendTabId) {
    if (tab === 'layout') router.push(Routes.home);
    if (tab === 'bends') router.push(Routes.bends);
    if (tab === 'benders') router.push(Routes.benderDatabase);
    if (tab === 'guide') router.push(Routes.guide);
  }

  return (
    <View style={[styles.screen, { backgroundColor: colors.background }]}>
      <AppHeader
        title="Bend Pro"
        subtitle="Layout"
        badge="Beta"
        rightIcon={<Text style={[styles.topIcon, { color: colors.text }]}>⚙</Text>}
        onRightPress={() => router.push(Routes.settings)}
      />

      <ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
        <View style={styles.navSection}>
          <HubSectionTitle>Start</HubSectionTitle>
          {navItems.map((item) => (
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
    fontSize: 20,
  },
  navSection: {
    gap: uiTheme.hub.sectionGap,
  },
});
