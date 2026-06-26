/** User-facing labels and messages for Rolling Offset. */
export const rollingCopy = {
  screenTitle: 'Rolling Offset',
  fields: {
    offsetHeight: {
      label: 'Offset Height',
      placeholder: '0',
      errorRequired: 'Enter an offset height greater than 0.',
    },
    offsetRoll: {
      label: 'Offset Roll',
      placeholder: '0',
      errorRequired: 'Enter an offset roll greater than 0.',
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
    offsetHeight: 'Offset Height',
    offsetRoll: 'Offset Roll',
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
      'Distance between bends uses the combined offset (height and roll) × multiplier. Enter your own multiplier for this angle if your chart differs.',
    clearHint: 'Leave blank to use the standard table value.',
    errorInvalid: 'Enter a number greater than 0, or leave blank.',
    chartLine: (angle: number, value: string) => `Standard table at ${angle}°: ×${value}`,
  },
  shrinkOverride: {
    title: 'Shrink Override',
    fieldLabel: 'Custom Shrink per Inch',
    placeholder: 'Table value',
    description:
      'Shrink uses the combined offset (height and roll) × shrink per inch. Enter your own rate for this angle if your chart differs.',
    clearHint: 'Leave blank to use the standard table value.',
    errorInvalid: 'Enter a value greater than 0, or leave blank.',
    chartLine: (angle: number, value: string) => `Standard table at ${angle}°: ${value} per inch`,
  },
  diagram: {
    title: 'Rolling Offset',
    rollInset: 'Roll',
    offsetHeight: 'Height',
    offsetRoll: 'Roll',
    distanceBetweenBends: 'Between Bends',
    shrink: 'Shrink',
    mark1: 'Mark 1',
    mark2: 'Mark 2',
    fieldCue: 'Same as offset · roll on last bend',
    emptyMessage: 'Enter offset height and offset roll to calculate the rolling offset.',
    invalidMessage: 'Offset height and offset roll must be greater than 0.',
  },
  profileContext: (profileName: string, bendAngle: number) =>
    `${profileName} — rolling offset uses standard ${bendAngle}° multiplier and shrink tables (not bender-specific charts).`,
  workspaceTitle: 'Pipe layout',
  angleSheetTitle: 'Bend Angle',
  angleSheetSubtitle: 'Choose the bend angle for this rolling offset.',
} as const;
