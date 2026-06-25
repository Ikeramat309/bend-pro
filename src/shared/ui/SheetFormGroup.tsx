import type { ReactNode } from 'react';
import { StyleSheet, Text, View } from 'react-native';

import { spacing, uiTheme } from '@/theme';

export type SheetFormGroupProps = {
  title: string;
  hint?: string;
  children: ReactNode;
};

/** Grouped fields inside a bottom sheet — title, optional hint, stacked inputs. */
export function SheetFormGroup({ title, hint, children }: SheetFormGroupProps) {
  return (
    <View style={styles.group}>
      <Text style={styles.title}>{title}</Text>
      {hint ? <Text style={styles.hint}>{hint}</Text> : null}
      <View style={styles.fields}>{children}</View>
    </View>
  );
}

const styles = StyleSheet.create({
  group: {
    gap: spacing.xs,
  },
  title: uiTheme.sheet.formGroupTitle,
  hint: uiTheme.sheet.formGroupHint,
  fields: {
    gap: spacing.sm,
    marginTop: spacing.xs,
  },
});
