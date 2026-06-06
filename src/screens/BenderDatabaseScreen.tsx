/**
 * FILE: src/screens/BenderDatabaseScreen.tsx
 *
 * PURPOSE: Placeholder bender catalog screen — will read from src/data/ later.
 */

// IMPORTS
import { useRouter } from 'expo-router';
import { StyleSheet, Text, View } from 'react-native';

import { AppHeader, BottomNav, type BendTabId } from '@/shared/ui';
import { Routes } from '@/navigation';
import { colors, layout, radius, spacing, typography } from '@/theme';

// UI
export function BenderDatabaseScreen() {
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
        title="Benders"
        subtitle="Bender database"
        rightIcon={<Text style={styles.topIcon}>⚙</Text>}
        onRightPress={() => router.push(Routes.settings)}
      />
      <View style={styles.content}>
        <View style={styles.card}>
          <Text style={styles.title}>Bender database coming soon.</Text>
          <Text style={styles.body}>
            Search, current bender selection, manufacturer notes, and custom benders will live here.
          </Text>
        </View>
      </View>
      <BottomNav activeTab="benders" onTabChange={handleTabChange} />
    </View>
  );
}

// STYLES
const styles = StyleSheet.create({
  screen: {
    flex: 1,
    backgroundColor: colors.background,
  },
  content: {
    flex: 1,
    width: '100%',
    maxWidth: layout.maxContentWidth,
    alignSelf: 'center',
    padding: spacing.lg,
  },
  topIcon: {
    color: colors.text,
    fontSize: 20,
  },
  card: {
    gap: spacing.md,
    borderRadius: radius.lg,
    borderWidth: 1,
    borderColor: colors.border,
    backgroundColor: colors.surface,
    padding: spacing.lg,
  },
  title: {
    ...typography.body,
    color: colors.text,
    fontWeight: '700',
  },
  body: {
    ...typography.subtitle,
    color: colors.muted,
  },
});

// EXPORTS — BenderDatabaseScreen
