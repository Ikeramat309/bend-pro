import { useRouter } from 'expo-router';
import { Pressable, StyleSheet, View } from 'react-native';

import { ScreenScaffold } from '@/components/screen-scaffold';
import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';
import { Spacing } from '@/constants/theme';
import { Routes } from '@/navigation';

const NAV_ITEMS = [
  { label: 'Calculator Workbench', route: Routes.calculatorWorkbench },
  { label: 'Bender Database', route: Routes.benderDatabase },
  { label: 'Settings', route: Routes.settings },
] as const;

export function HomeScreen() {
  const router = useRouter();

  return (
    <ScreenScaffold
      title="Bend Pro"
      subtitle="Conduit bending calculator — skeleton build"
      placeholders={[
        { title: 'Recent jobs', description: 'Saved calculations and work-in-progress runs.' },
        { title: 'Quick actions', description: 'Start a new bend, open standards, or import data.' },
      ]}>
      <View style={styles.navSection}>
        <ThemedText type="smallBold">Navigate</ThemedText>
        {NAV_ITEMS.map((item) => (
          <Pressable key={item.label} onPress={() => router.push(item.route)}>
            <ThemedView type="backgroundSelected" style={styles.navButton}>
              <ThemedText type="default">{item.label}</ThemedText>
              <ThemedText type="linkPrimary">Open →</ThemedText>
            </ThemedView>
          </Pressable>
        ))}
      </View>
    </ScreenScaffold>
  );
}

const styles = StyleSheet.create({
  navSection: {
    gap: Spacing.two,
  },
  navButton: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: Spacing.three,
    borderRadius: Spacing.three,
  },
});
