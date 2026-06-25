import { StyleSheet, Text, View } from 'react-native';

import { colors, uiTheme } from '@/theme';

export type HubEmptyStateProps = {
  title: string;
  body?: string;
};

export function HubEmptyState({ title, body }: HubEmptyStateProps) {
  return (
    <View style={styles.card}>
      <Text style={styles.title}>{title}</Text>
      {body ? <Text style={styles.body}>{body}</Text> : null}
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    gap: 4,
    borderRadius: uiTheme.hub.settingsCard.borderRadius,
    borderWidth: 1,
    borderColor: uiTheme.hub.settingsCard.borderColor,
    backgroundColor: uiTheme.hub.settingsCard.backgroundColor,
    padding: uiTheme.hub.settingsCard.padding,
  },
  title: {
    fontSize: 16,
    lineHeight: 22,
    fontWeight: '600',
    color: colors.text,
  },
  body: {
    fontSize: 14,
    lineHeight: 20,
    color: colors.muted,
  },
});
