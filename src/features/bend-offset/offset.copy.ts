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
    mark1: 'Mark 1',
    mark2: 'Mark 2',
    mark1Optional: 'Optional',
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
