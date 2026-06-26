import { StyleSheet, Text } from 'react-native';

import { uiTheme, useTheme } from '@/theme';

export type HubSectionTitleProps = {
  children: string;
};

export function HubSectionTitle({ children }: HubSectionTitleProps) {
  const { colors } = useTheme();
  return <Text style={[styles.title, { color: colors.muted }]}>{children}</Text>;
}

const styles = StyleSheet.create({
  title: uiTheme.hub.sectionTitle,
});
