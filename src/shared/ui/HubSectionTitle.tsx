import { StyleSheet, Text } from 'react-native';

import { uiTheme } from '@/theme';

export type HubSectionTitleProps = {
  children: string;
};

export function HubSectionTitle({ children }: HubSectionTitleProps) {
  return <Text style={styles.title}>{children}</Text>;
}

const styles = StyleSheet.create({
  title: uiTheme.hub.sectionTitle,
});
