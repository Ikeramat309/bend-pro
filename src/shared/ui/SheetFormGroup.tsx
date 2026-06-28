import type { ReactNode } from 'react';
import { useMemo } from 'react';
import { StyleSheet, Text, View } from 'react-native';

import { spacing, uiTheme, useTheme, type ThemePalette } from '@/theme';

export type SheetFormGroupProps = {
  title: string;
  hint?: string;
  children: ReactNode;
};

/** Grouped fields inside a bottom sheet — title, optional hint, stacked inputs. */
export function SheetFormGroup({ title, hint, children }: SheetFormGroupProps) {
  const { colors } = useTheme();
  const styles = useMemo(() => makeStyles(colors), [colors]);

  return (
    <View style={styles.group}>
      <Text style={styles.title}>{title}</Text>
      {hint ? <Text style={styles.hint}>{hint}</Text> : null}
      <View style={styles.fields}>{children}</View>
    </View>
  );
}

function makeStyles(c: ThemePalette) {
  return StyleSheet.create({
    group: {
      gap: spacing.xs,
    },
    title: {
      ...uiTheme.sheet.formGroupTitle,
      color: c.text,
    },
    hint: {
      ...uiTheme.sheet.formGroupHint,
      color: c.muted,
    },
    fields: {
      gap: spacing.sm,
      marginTop: spacing.xs,
    },
  });
}
