/**
 * FILE: src/components/screen-scaffold.tsx
 *
 * PURPOSE: Generic placeholder layout for non-calculator screens (Home, Settings).
 * Calculator screens should use CalculatorLayout instead.
 */
// IMPORTS
import { useRouter } from 'expo-router';
import { Pressable, ScrollView, StyleSheet, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';
import { MaxContentWidth, Spacing } from '@/constants/theme';

type PlaceholderBlock = {
  title: string;
  description: string;
};

type ScreenScaffoldProps = {
  title: string;
  subtitle?: string;
  showBack?: boolean;
  placeholders?: PlaceholderBlock[];
  children?: React.ReactNode;
};

const DEFAULT_PLACEHOLDERS: PlaceholderBlock[] = [
  { title: 'Primary panel', description: 'Main content area — wire up logic here.' },
  { title: 'Secondary panel', description: 'Supporting controls, inputs, or results.' },
  { title: 'Actions', description: 'Buttons, exports, or navigation targets.' },
];

export function ScreenScaffold({
  title,
  subtitle,
  showBack = false,
  placeholders = DEFAULT_PLACEHOLDERS,
  children,
}: ScreenScaffoldProps) {
  const router = useRouter();

  return (
    <ThemedView style={styles.container}>
      <SafeAreaView style={styles.safeArea} edges={['top', 'left', 'right']}>
        <ScrollView
          contentContainerStyle={styles.scrollContent}
          showsVerticalScrollIndicator={false}>
          <View style={styles.header}>
            {showBack && (
              <Pressable onPress={() => router.back()} style={styles.backButton}>
                <ThemedText type="linkPrimary">← Back</ThemedText>
              </Pressable>
            )}
            <ThemedText type="title" style={styles.title}>
              {title}
            </ThemedText>
            {subtitle ? (
              <ThemedText themeColor="textSecondary" style={styles.subtitle}>
                {subtitle}
              </ThemedText>
            ) : null}
          </View>

          {children}

          <View style={styles.placeholderList}>
            {placeholders.map((block) => (
              <ThemedView key={block.title} type="backgroundElement" style={styles.placeholderCard}>
                <ThemedText type="smallBold">{block.title}</ThemedText>
                <ThemedText themeColor="textSecondary" type="small">
                  {block.description}
                </ThemedText>
              </ThemedView>
            ))}
          </View>
        </ScrollView>
      </SafeAreaView>
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  safeArea: {
    flex: 1,
  },
  scrollContent: {
    paddingHorizontal: Spacing.four,
    paddingBottom: Spacing.six,
    gap: Spacing.four,
    maxWidth: MaxContentWidth,
    width: '100%',
    alignSelf: 'center',
  },
  header: {
    gap: Spacing.two,
    paddingTop: Spacing.three,
  },
  backButton: {
    alignSelf: 'flex-start',
    marginBottom: Spacing.one,
  },
  title: {
    fontSize: 36,
    lineHeight: 42,
  },
  subtitle: {
    fontSize: 16,
    lineHeight: 22,
  },
  placeholderList: {
    gap: Spacing.three,
  },
  placeholderCard: {
    gap: Spacing.two,
    padding: Spacing.four,
    borderRadius: Spacing.three,
  },
});
