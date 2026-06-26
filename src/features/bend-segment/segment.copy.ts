/** User-facing labels and messages for Segment Bend. */
export const segmentCopy = {
  screenTitle: 'Segment Bend',
  fields: {
    radius: {
      label: 'Radius',
      placeholder: '0',
      errorRequired: 'Enter a radius greater than 0.',
    },
    totalAngle: {
      label: 'Total Angle',
      placeholder: '90',
      errorRequired: 'Enter a total angle greater than 0.',
    },
    degreesPerBend: {
      label: 'Per Bend',
      placeholder: '10',
      errorRequired: 'Enter a degrees-per-bend greater than 0.',
    },
    startOffset: {
      label: 'Start of Bend',
      placeholder: 'Optional',
      addButton: 'Add Start of Bend',
      errorInvalid: 'Enter a valid non-negative value, or leave blank.',
    },
  },
  results: {
    spacing: 'Between Bends',
    perBend: 'Per Bend',
    bends: 'Bends',
    developedLength: 'Bend Length',
    bendsValue: (count: string, perBend: string) => `${count} × ${perBend}`,
    marksAbsolute: (radius: string, first: string, last: string) =>
      `Radius ${radius} · first mark ${first} · last ${last}`,
    marksRelative: (radius: string) =>
      `Radius ${radius} · marks sit a half-space in from each end of the bend.`,
  },
  diagram: {
    radius: 'R',
    spacing: 'Between Bends',
    fieldCue: 'Mark lead-in · bend shots 1→n along arc',
    emptyMessage: 'Enter radius and angle to lay out the segment bend.',
    invalidMessage: 'Radius and angle must be greater than 0.',
  },
  profileContext:
    'Segment spacing is geometric — based on radius and angle, not the bender shoe.',
  workspaceTitle: 'Pipe layout',
  degreeUnit: '°',
} as const;
