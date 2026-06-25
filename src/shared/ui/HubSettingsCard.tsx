import type { ReactNode } from 'react';
import { StyleSheet, Text, View } from 'react-native';

import { colors, uiTheme } from '@/theme';

export type HubSettingsCardProps = {
  title: string;
  body?: string;
  children?: ReactNode;
};

export function HubSettingsCard({ title, body, children }: HubSettingsCardProps) {
  return (
    <View style={styles.card}>
      <Text style={styles.title}>{title}</Text>
      {body ? <Text style={styles.body}>{body}</Text> : null}
      {children}
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    gap: uiTheme.hub.settingsCard.gap,
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
  body: {
    fontSize: 14,
    lineHeight: 20,
    color: colors.muted,
  },
});
