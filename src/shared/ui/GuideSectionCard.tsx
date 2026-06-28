import { useMemo } from 'react';
import { StyleSheet, Text, View } from 'react-native';

import type { GuideSection } from '@/data/guide';
import { spacing, uiTheme, useTheme, type ThemePalette } from '@/theme';

export type GuideSectionCardProps = {
  section: GuideSection;
};

export function GuideSectionCard({ section }: GuideSectionCardProps) {
  const { colors } = useTheme();
  const styles = useMemo(() => makeStyles(colors), [colors]);

  return (
    <View style={styles.card}>
      {section.title ? <Text style={styles.title}>{section.title}</Text> : null}
      {section.lines.map((line, index) => (
        <View key={`${section.title}-${index}`} style={styles.lineRow}>
          {section.lines.length > 1 ? (
            <Text style={styles.marker}>{section.ordered ? `${index + 1}.` : '•'}</Text>
          ) : null}
          <Text
            style={[
              styles.line,
              section.mono && styles.mono,
              section.lines.length === 1 && styles.singleLine,
            ]}>
            {line}
          </Text>
        </View>
      ))}
    </View>
  );
}

function makeStyles(c: ThemePalette) {
  return StyleSheet.create({
    card: {
      gap: spacing.sm,
      borderRadius: uiTheme.hub.settingsCard.borderRadius,
      borderWidth: 1,
      borderColor: c.border,
      backgroundColor: c.surface,
      padding: uiTheme.hub.settingsCard.padding,
    },
    title: {
      fontSize: 16,
      lineHeight: 22,
      fontWeight: '700',
      color: c.text,
    },
    lineRow: {
      flexDirection: 'row',
      alignItems: 'flex-start',
      gap: spacing.sm,
    },
    marker: {
      width: 18,
      fontSize: 14,
      lineHeight: 20,
      fontWeight: '700',
      color: c.primary,
      flexShrink: 0,
    },
    line: {
      flex: 1,
      fontSize: 14,
      lineHeight: 20,
      color: c.muted,
    },
    singleLine: {
      flex: 1,
    },
    mono: {
      fontFamily: 'monospace',
      color: c.text,
    },
  });
}
