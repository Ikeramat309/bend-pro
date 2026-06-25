import { StyleSheet, Text, View } from 'react-native';

import type { GuideSection } from '@/data/guide';
import { colors, spacing, uiTheme } from '@/theme';

export type GuideSectionCardProps = {
  section: GuideSection;
};

export function GuideSectionCard({ section }: GuideSectionCardProps) {
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

const styles = StyleSheet.create({
  card: {
    gap: spacing.sm,
    borderRadius: uiTheme.hub.settingsCard.borderRadius,
    borderWidth: 1,
    borderColor: uiTheme.hub.settingsCard.borderColor,
    backgroundColor: uiTheme.hub.settingsCard.backgroundColor,
    padding: uiTheme.hub.settingsCard.padding,
  },
  title: {
    fontSize: 16,
    lineHeight: 22,
    fontWeight: '700',
    color: colors.text,
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
    color: colors.primary,
    flexShrink: 0,
  },
  line: {
    flex: 1,
    fontSize: 14,
    lineHeight: 20,
    color: colors.muted,
  },
  singleLine: {
    flex: 1,
  },
  mono: {
    fontFamily: 'monospace',
    color: colors.text,
  },
});
