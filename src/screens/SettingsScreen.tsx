import { useRouter } from 'expo-router';
import { ScrollView, StyleSheet, Text, View } from 'react-native';

import { AppHeader } from '@/shared/ui';
import { colors, layout, radius, spacing, typography } from '@/theme';

const PLACEHOLDER_SECTIONS = [
  { title: 'Units', description: 'Imperial / metric, fraction display, rounding.' },
  { title: 'Defaults', description: 'Preferred bender, conduit type, and safety factors.' },
  { title: 'About', description: 'Version, licenses, and data sources.' },
] as const;

export function SettingsScreen() {
  const router = useRouter();

  return (
    <View style={styles.screen}>
      <AppHeader
        title="Settings"
        subtitle="Units, defaults, and app preferences"
        showBack
        onBackPress={() => router.back()}
      />

      <ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
        {PLACEHOLDER_SECTIONS.map((section) => (
          <View key={section.title} style={styles.card}>
            <Text style={styles.cardTitle}>{section.title}</Text>
            <Text style={styles.cardBody}>{section.description}</Text>
          </View>
        ))}
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
    gap: spacing.xs,
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
