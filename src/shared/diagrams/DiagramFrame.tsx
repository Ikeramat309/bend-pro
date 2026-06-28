import type { ReactNode } from 'react';
import { StyleSheet, View } from 'react-native';

import { workspaceTheme } from '@/theme';

import { useDiagramTheme } from './useDiagramTheme';

export type DiagramFrameProps = {
  children: ReactNode;
};

/** Consistent outer frame for calculator pipe diagrams inside the workspace card. */
export function DiagramFrame({ children }: DiagramFrameProps) {
  const theme = useDiagramTheme();

  return <View style={[styles.frame, { backgroundColor: theme.canvas }]}>{children}</View>;
}

const styles = StyleSheet.create({
  frame: {
    flex: 1,
    width: '100%',
    minHeight: workspaceTheme.workspace.diagramMinHeight,
    justifyContent: 'center',
    alignItems: 'center',
    overflow: 'hidden',
  },
});
