import { StyleSheet, View } from 'react-native';

import { FieldInput } from '@/shared/ui';
import { spacing, workspaceTheme } from '@/theme';

import { OptionalFieldButton } from './OptionalFieldButton';
import type { BendInputConfig } from './workspaceTypes';

export type BendInputStripProps = {
  inputs?: BendInputConfig[];
  children?: React.ReactNode;
  density?: 'default' | 'compact';
};

function renderInput(input: BendInputConfig): React.ReactNode {
  switch (input.type) {
    case 'field':
      return (
        <FieldInput
          key={input.key}
          label={input.label}
          value={input.value}
          onChangeText={input.onChangeText}
          placeholder={input.placeholder}
          unit={input.unit}
          variant={input.variant}
          error={input.error}
          lengthInput={input.lengthInput}
          inputProps={input.keyboardType ? { keyboardType: input.keyboardType } : undefined}
        />
      );
    case 'picker':
      return (
        <FieldInput
          key={input.key}
          variant="picker"
          label={input.label}
          value={input.value}
          onChangeText={() => {}}
          onPress={input.onPress}
        />
      );
    case 'optional':
      return input.visible && input.field ? (
        <FieldInput
          key={input.key}
          label={input.field.label}
          value={input.field.value}
          onChangeText={input.field.onChangeText}
          placeholder={input.field.placeholder}
          unit={input.field.unit}
          variant={input.field.variant ?? 'compact'}
          error={input.field.error}
          lengthInput={input.field.lengthInput}
          inputProps={
            input.field.keyboardType ? { keyboardType: input.field.keyboardType } : undefined
          }
        />
      ) : (
        <OptionalFieldButton key={input.key} label={input.addLabel} onPress={input.onAdd} />
      );
    case 'row':
      return (
        <View key={input.key} style={styles.row}>
          {input.inputs.map((child) => renderInput(child))}
        </View>
      );
    case 'custom':
      return <View key={input.key}>{input.node}</View>;
    default:
      return null;
  }
}

/** Adaptive calculator input area — compact fields, pickers, optional rows. */
export function BendInputStrip({ inputs, children, density = 'default' }: BendInputStripProps) {
  const compact = density === 'compact';
  const wrapStyle = compact ? styles.wrapCompact : styles.wrap;

  if (children) {
    return <View style={wrapStyle}>{children}</View>;
  }

  if (!inputs?.length) {
    return null;
  }

  return <View style={wrapStyle}>{inputs.map((input) => renderInput(input))}</View>;
}

const styles = StyleSheet.create({
  wrap: {
    gap: workspaceTheme.inputStrip.rowGap,
    paddingHorizontal: spacing.lg,
    paddingVertical: workspaceTheme.inputStrip.paddingVertical,
  },
  wrapCompact: {
    gap: workspaceTheme.inputStrip.rowGap,
    paddingHorizontal: spacing.lg,
    paddingVertical: 2,
  },
  row: {
    flexDirection: 'row',
    gap: spacing.md,
    alignItems: 'stretch',
  },
});
