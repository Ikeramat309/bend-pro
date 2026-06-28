import { useRouter } from 'expo-router';
import { useMemo, useState } from 'react';
import { ScrollView, StyleSheet, Text, View } from 'react-native';

import { getBendsScreenFamilies, getCalculatorRoute, isCalculatorId, type BendsScreenItem } from '@/core/calculators';
import { Routes } from '@/navigation';
import {
  AppHeader,
  BottomNav,
  HubEmptyState,
  HubListGroup,
  HubListRow,
  HubSearchField,
  HubSectionTitle,
  Sheet,
  type BendTabId,
} from '@/shared/ui';
import { uiTheme, useTheme, type ThemePalette } from '@/theme';

export function BendsScreen() {
  const router = useRouter();
  const { colors } = useTheme();
  const styles = useMemo(() => makeStyles(colors), [colors]);
  const [search, setSearch] = useState('');
  const [comingSoonVisible, setComingSoonVisible] = useState(false);

  const filteredFamilies = useMemo(() => {
    const normalized = search.trim().toLowerCase();

    const families = getBendsScreenFamilies();

    if (!normalized) {
      return families;
    }

    return families.map((family) => ({
      ...family,
      items: family.items.filter((item) =>
        `${family.title} ${item.title} ${item.description ?? ''}`.toLowerCase().includes(normalized),
      ),
    })).filter((family) => family.items.length > 0);
  }, [search]);

  function handleTabChange(tab: BendTabId) {
    if (tab === 'layout') router.push(Routes.home);
    if (tab === 'bends') router.push(Routes.bends);
    if (tab === 'benders') router.push(Routes.benderDatabase);
    if (tab === 'guide') router.push(Routes.guide);
  }

  function handleBendPress(item: BendsScreenItem) {
    if (!isCalculatorId(item.id)) {
      setComingSoonVisible(true);
      return;
    }

    const route = getCalculatorRoute(item.id);
    if (item.status === 'active' && route) {
      router.push(route);
      return;
    }
    setComingSoonVisible(true);
  }

  return (
    <View style={styles.screen}>
      <AppHeader
        title="Bends"
        subtitle="Choose a conduit layout"
        rightIcon={<Text style={styles.topIcon}>⚙</Text>}
        onRightPress={() => router.push(Routes.settings)}
      />

      <ScrollView
        contentContainerStyle={styles.content}
        showsVerticalScrollIndicator={false}
        keyboardShouldPersistTaps="handled">
        <HubSearchField
          value={search}
          onChangeText={setSearch}
          placeholder="Search bend type"
        />

        {filteredFamilies.map((family) => (
          <View key={family.title} style={styles.familySection}>
            <HubSectionTitle>{family.title}</HubSectionTitle>
            <HubListGroup>
              {family.items.map((item, index) => (
                <HubListRow
                  key={item.id}
                  title={item.title}
                  description={item.description}
                  badge={item.status === 'coming-soon' ? 'Coming Soon' : undefined}
                  active={item.status === 'active'}
                  dimmed={item.status !== 'active'}
                  isLast={index === family.items.length - 1}
                  onPress={() => handleBendPress(item)}
                />
              ))}
            </HubListGroup>
          </View>
        ))}

        {filteredFamilies.length === 0 ? (
          <HubEmptyState title="No bend types found." body="Try a different search term." />
        ) : null}
      </ScrollView>

      <BottomNav activeTab="bends" onTabChange={handleTabChange} />

      <Sheet
        visible={comingSoonVisible}
        title="Coming Soon"
        subtitle="This bend type is not available yet."
        secondaryLabel="Close"
        onSecondaryPress={() => setComingSoonVisible(false)}
        onClose={() => setComingSoonVisible(false)}
      />
    </View>
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
      paddingBottom: uiTheme.layout.sectionBottom,
      gap: uiTheme.hub.contentGap,
    },
    topIcon: {
      color: c.text,
      fontSize: 20,
    },
    familySection: {
      gap: uiTheme.hub.sectionGap,
    },
  });
}
