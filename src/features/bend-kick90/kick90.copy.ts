/** User-facing labels and messages for Kick 90. */
export const kick90Copy = {
  screenTitle: 'Kick 90',
  fields: {
    kickRise: {
      label: 'Kick Rise',
      placeholder: '0',
      errorRequired: 'Enter a kick rise greater than 0.',
    },
    bendAngle: {
      label: 'Bend Angle',
    },
    mark1: {
      label: 'Mark 1',
      placeholder: 'Optional',
      addButton: 'Add Mark 1',
      errorInvalid: 'Enter a valid non-negative value, or leave blank.',
    },
  },
  results: {
    distanceBetweenBends: 'Distance Between Bends',
    shrink: 'Shrink',
    shrinkCustom: 'Shrink • Custom',
    multiplier: 'Multiplier',
    multiplierCustom: 'Multiplier • Custom',
    mark1: 'Mark 1',
    mark2: 'Mark 2',
  },
  multiplierOverride: {
    title: 'Multiplier Override',
    fieldLabel: 'Custom Multiplier',
    placeholder: 'Table value',
    description:
      'Distance between bends = kick rise × multiplier. Enter your own multiplier for this angle if your chart differs.',
    clearHint: 'Leave blank to use the standard table value.',
    errorInvalid: 'Enter a number greater than 0, or leave blank.',
    chartLine: (angle: number, value: string) => `Standard table at ${angle}°: ×${value}`,
  },
  shrinkOverride: {
    title: 'Shrink Override',
    fieldLabel: 'Custom Shrink per Inch',
    placeholder: 'Table value',
    description:
      'Shrink = kick rise × shrink per inch. Enter your own rate for this angle if your chart differs.',
    clearHint: 'Leave blank to use the standard table value.',
    errorInvalid: 'Enter a value greater than 0, or leave blank.',
    chartLine: (angle: number, value: string) => `Standard table at ${angle}°: ${value} per inch`,
  },
  diagram: {
    title: 'Kick 90',
    kickRise: 'Kick Rise',
    distanceBetweenBends: 'Distance Between Bends',
    kickMark: 'Kick Mark',
    ninetyMark: '90° Mark',
    emptyMessage: 'Enter kick rise to lay out the kick.',
    invalidMessage: 'Kick rise must be greater than 0.',
    unavailableMessage: 'Diagram unavailable — results are still shown below.',
  },
  angleSheetTitle: 'Bend Angle',
  angleSheetSubtitle: 'Choose the kick angle for this layout.',
} as const;
