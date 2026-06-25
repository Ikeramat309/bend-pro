import type { ReactNode } from 'react';
import { StyleSheet, View } from 'react-native';

import { diagramTheme } from './diagramTheme';

export type DiagramFrameProps = {
  children: ReactNode;
};

/** Consistent outer frame for calculator pipe diagrams inside the workspace card. */
export function DiagramFrame({ children }: DiagramFrameProps) {
  return <View style={styles.frame}>{children}</View>;
}

const styles = StyleSheet.create({
  frame: {
    flex: 1,
    minHeight: 240,
    overflow: 'hidden',
    backgroundColor: diagramTheme.canvas,
  },
});
