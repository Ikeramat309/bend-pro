/** User-facing labels and messages for Offset. */
export const offsetCopy = {
  screenTitle: 'Offset Bend',
  fields: {
    offsetHeight: {
      label: 'Offset Height',
      placeholder: '0',
      errorRequired: 'Enter an offset height greater than 0.',
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
    mark1Optional: 'Optional',
  },
  multiplierOverride: {
    title: 'Multiplier Override',
    fieldLabel: 'Custom Multiplier',
    placeholder: 'Table value',
    description:
      'Distance between bends = offset height × multiplier. Enter your own multiplier for this angle if your chart or sticker differs from the standard table.',
    clearHint: 'Leave blank to use the standard table value.',
    errorInvalid: 'Enter a number greater than 0, or leave blank.',
    chartLine: (angle: number, value: string) => `Standard table at ${angle}°: ×${value}`,
  },
  shrinkOverride: {
    title: 'Shrink Override',
    fieldLabel: 'Custom Shrink per Inch',
    placeholder: 'Table value',
    description:
      'Shrink = offset height × shrink per inch. Enter your own rate for this angle if your chart differs — this is the conduit length lost for each inch of offset height.',
    clearHint: 'Leave blank to use the standard table value.',
    errorInvalid: 'Enter a value greater than 0, or leave blank.',
    chartLine: (angle: number, value: string) => `Standard table at ${angle}°: ${value} per inch`,
  },
  diagram: {
    title: '2-Bend Offset',
    offsetHeight: 'Offset Height',
    distanceBetweenBends: 'Distance Between Bends',
    shrink: 'Shrink',
    mark1: 'Mark 1',
    mark2: 'Mark 2',
    emptyMessage: 'Enter offset height to calculate distance between bends.',
    invalidMessage: 'Offset height must be greater than 0.',
  },
  workspaceTitle: 'Pipe layout',
  angleSheetTitle: 'Bend Angle',
  angleSheetSubtitle: 'Choose the bend angle for this offset.',
} as const;
