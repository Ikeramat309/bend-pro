import type { ReactNode } from 'react';
import { useMemo } from 'react';
import { StyleSheet, View } from 'react-native';

import { uiTheme, useTheme, type ThemePalette } from '@/theme';

export type HubListGroupProps = {
  children: ReactNode;
};

export function HubListGroup({ children }: HubListGroupProps) {
  const { colors } = useTheme();
  const styles = useMemo(() => makeStyles(colors), [colors]);

  return <View style={styles.group}>{children}</View>;
}

function makeStyles(c: ThemePalette) {
  return StyleSheet.create({
    group: {
      overflow: 'hidden',
      borderRadius: uiTheme.hub.listGroup.borderRadius,
      borderWidth: 1,
      borderColor: c.border,
      backgroundColor: c.surface,
    },
  });
}
