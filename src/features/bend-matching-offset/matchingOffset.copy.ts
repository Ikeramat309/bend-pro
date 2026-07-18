/** User-facing labels and messages for Matching Offset. */
export const matchingOffsetCopy = {
  screenTitle: 'Matching Offset',
  modes: {
    centers: 'Match Centers',
    bends: 'Match Bends',
  },
  fields: {
    offsetHeight: {
      label: 'Offset Height',
      placeholder: '0',
      errorRequired: 'Enter an offset height greater than 0.',
    },
    adjacent: {
      label: 'Centers Along Run',
      placeholder: '0',
      errorRequired: 'Enter the straight-run distance between bend centers.',
    },
    referenceDistanceBetweenBends: {
      label: 'Centers Along Pipe',
      placeholder: '0',
      errorRequired: 'Enter the measured center distance between the existing bends.',
    },
  },
  results: {
    bendAngle: 'Bend Angle',
    distanceBetweenBends: 'Centers Apart',
    adjacent: 'Along Run',
    shrink: 'Shrink',
    angleMethod: 'Set Angle With',
    angleTool: 'Angle Tool',
    commonAngle: 'Common Angle',
  },
  diagram: {
    reference: 'Reference',
    matching: 'Matching',
    fieldCue: 'Measure center to center · make two equal opposite bends',
    emptyCenters: 'Enter offset height and adjacent distance to match bend centers.',
    emptyBends: 'Enter offset height and the existing center distance.',
    invalid: 'Check both measurements to calculate a matching offset.',
  },
} as const;
