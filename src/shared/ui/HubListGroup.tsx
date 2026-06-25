import type { ReactNode } from 'react';
import { StyleSheet, View } from 'react-native';

import { uiTheme } from '@/theme';

export type HubListGroupProps = {
  children: ReactNode;
};

export function HubListGroup({ children }: HubListGroupProps) {
  return <View style={styles.group}>{children}</View>;
}

const styles = StyleSheet.create({
  group: {
    overflow: 'hidden',
    borderRadius: uiTheme.hub.listGroup.borderRadius,
    borderWidth: 1,
    borderColor: uiTheme.hub.listGroup.borderColor,
    backgroundColor: uiTheme.hub.listGroup.backgroundColor,
  },
});
