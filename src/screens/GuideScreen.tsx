import { useLocalSearchParams, useRouter } from 'expo-router';
import { useMemo } from 'react';
import { Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';

import {
  CALCULATOR_GUIDES,
  getCalculatorGuide,
  GUIDE_BASICS,
  GUIDE_INTRO,
  isGuideCalculatorId,
  type CalculatorGuide,
  type GuideCalculatorId,
} from '@/data/guide';
import { Routes, guideRoute } from '@/navigation';
import {
  AppHeader,
  BottomNav,
  GuideSectionCard,
  HubListGroup,
  HubListRow,
  HubSectionTitle,
  HubSettingsCard,
  type BendTabId,
} from '@/shared/ui';
import { spacing, uiTheme, useTheme, type ThemePalette } from '@/theme';

export function GuideScreen() {
  const router = useRouter();
  const { colors } = useTheme();
  const styles = useMemo(() => makeStyles(colors), [colors]);
  const { calculator } = useLocalSearchParams<{ calculator?: string | string[] }>();
  const calculatorId = Array.isArray(calculator) ? calculator[0] : calculator;
  const guide =
    calculatorId && isGuideCalculatorId(calculatorId) ? getCalculatorGuide(calculatorId) : undefined;

  function handleTabChange(tab: BendTabId) {
    if (tab === 'layout') router.push(Routes.home);
    if (tab === 'bends') router.push(Routes.bends);
    if (tab === 'benders') router.push(Routes.benderDatabase);
    if (tab === 'guide') router.push(Routes.guide);
  }

  function handleBackPress() {
    const safeRouter = router as typeof router & { canGoBack?: () => boolean };
    if (typeof safeRouter.canGoBack === 'function' && safeRouter.canGoBack()) {
      router.back();
      return;
    }
    router.replace(Routes.guide);
  }

  function openGuide(id: GuideCalculatorId) {
    router.push(guideRoute(id));
  }

  return (
    <View style={styles.screen}>
      {guide ? (
        <GuideDetailView guide={guide} onBackPress={handleBackPress} />
      ) : (
        <GuideIndexView onOpenGuide={openGuide} />
      )}
      <BottomNav activeTab="guide" onTabChange={handleTabChange} />
    </View>
  );
}

type GuideIndexViewProps = {
  onOpenGuide: (id: GuideCalculatorId) => void;
};

function GuideIndexView({ onOpenGuide }: GuideIndexViewProps) {
  const router = useRouter();
  const { colors } = useTheme();
  const styles = useMemo(() => makeStyles(colors), [colors]);
  const families = [...new Set(CALCULATOR_GUIDES.map((item) => item.family))];

  return (
    <>
      <AppHeader
        title="Guide"
        subtitle="Formulas, steps, and common mistakes"
        rightIcon={<Text style={styles.topIcon}>⚙</Text>}
        onRightPress={() => router.push(Routes.settings)}
      />
      <ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
        <HubSettingsCard title={GUIDE_INTRO.title} body={GUIDE_INTRO.body} />

        <View style={styles.section}>
          <HubSectionTitle>{GUIDE_BASICS.title}</HubSectionTitle>
          <GuideSectionCard section={{ title: '', lines: GUIDE_BASICS.lines }} />
        </View>

        {families.map((family) => {
          const items = CALCULATOR_GUIDES.filter((guide) => guide.family === family);
          return (
            <View key={family} style={styles.section}>
              <HubSectionTitle>{family}</HubSectionTitle>
              <HubListGroup>
                {items.map((guide, index) => (
                  <HubListRow
                    key={guide.id}
                    title={guide.title}
                    description={guide.summary}
                    isLast={index === items.length - 1}
                    onPress={() => onOpenGuide(guide.id)}
                  />
                ))}
              </HubListGroup>
            </View>
          );
        })}
      </ScrollView>
    </>
  );
}

type GuideDetailViewProps = {
  guide: CalculatorGuide;
  onBackPress: () => void;
};

function GuideDetailView({ guide, onBackPress }: GuideDetailViewProps) {
  const router = useRouter();
  const { colors } = useTheme();
  const styles = useMemo(() => makeStyles(colors), [colors]);

  return (
    <>
      <AppHeader
        showBack
        title={guide.title}
        subtitle={guide.family}
        onBackPress={onBackPress}
        rightIcon={<Text style={styles.topIcon}>⚙</Text>}
        onRightPress={() => router.push(Routes.settings)}
      />
      <ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
        <Text style={styles.summary}>{guide.summary}</Text>

        <GuideSectionCard section={guide.formula} />
        <GuideSectionCard section={guide.steps} />
        <GuideSectionCard section={guide.mistakes} />
        <GuideSectionCard section={guide.example} />

        <Pressable
          onPress={() => router.push(guide.calculatorRoute)}
          style={({ pressed }) => [styles.openCalculator, pressed && styles.openCalculatorPressed]}
          accessibilityRole="button"
          accessibilityLabel={`Open ${guide.title} calculator`}>
          <Text style={styles.openCalculatorText}>Open {guide.title} calculator</Text>
          <Text style={styles.openCalculatorChevron}>›</Text>
        </Pressable>
      </ScrollView>
    </>
  );
}

function makeStyles(c: ThemePalette) {
  return StyleSheet.create({
    screen: {
      flex: 1,
      backgroundColor: c.background,
    },
    content: {
      width: '100%',
      maxWidth: uiTheme.layout.maxContentWidth,
      alignSelf: 'center',
      padding: uiTheme.layout.screenPadding,
      paddingBottom: spacing.xxxl,
      gap: spacing.lg,
    },
    section: {
      gap: spacing.sm,
    },
    summary: {
      fontSize: 15,
      lineHeight: 22,
      color: c.text,
    },
    topIcon: {
      color: c.text,
      fontSize: 20,
    },
    openCalculator: {
      minHeight: uiTheme.hub.navCard.minHeight,
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'space-between',
      borderRadius: uiTheme.hub.navCard.borderRadius,
      borderWidth: 1,
      borderColor: c.primaryBorder,
      backgroundColor: c.primaryMuted,
      paddingHorizontal: spacing.lg,
      paddingVertical: spacing.md,
    },
    openCalculatorPressed: {
      opacity: 0.88,
    },
    openCalculatorText: {
      flex: 1,
      fontSize: 16,
      lineHeight: 22,
      fontWeight: '700',
      color: c.primary,
    },
    openCalculatorChevron: {
      fontSize: uiTheme.hub.chevronSize,
      lineHeight: 30,
      color: c.primary,
      fontWeight: '600',
    },
  });
}
