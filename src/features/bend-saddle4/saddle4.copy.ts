/** User-facing labels and messages for 4-Point Saddle. */
export const saddle4Copy = {
  screenTitle: '4-Point Saddle',
  fields: {
    obstructionHeight: {
      label: 'Obstruction Height',
      placeholder: '0',
      errorRequired: 'Enter an obstruction height greater than 0.',
    },
    saddleWidth: {
      label: 'Saddle Width',
      placeholder: '0',
      errorRequired: 'Enter a saddle width greater than 0.',
    },
    bendAngle: {
      label: 'Bend Angle',
    },
    distanceToCenter: {
      label: 'Distance to Center',
      placeholder: 'Optional',
      addButton: 'Add Distance to Center',
      errorInvalid: 'Enter a valid non-negative value, or leave blank.',
    },
  },
  results: {
    betweenBends: 'Between Bends',
    shrink: 'Shrink',
    centerMark: 'Center Mark',
    centerMarkOptional: 'Add distance',
    marksAbsolute: (outer1: string, inner1: string, inner2: string, outer2: string) =>
      `Marks  ${outer1} · ${inner1} · ${inner2} · ${outer2}`,
    marksRelative:
      'Top bends sit ± half the saddle width from center; outer bends fall Between Bends past them.',
  },
  diagram: {
    obstructionHeight: 'Obstruction',
    saddleWidth: 'Saddle Width',
    betweenBends: 'Between Bends',
    shrink: 'Shrink',
    outer: 'Outer',
    top: 'Top',
    emptyMessage: 'Enter obstruction height and saddle width to lay out the saddle.',
    invalidMessage: 'Obstruction height and saddle width must be greater than 0.',
  },
  profileContext: (angleLabel: string) =>
    `Saddle spacing and shrink use the standard ${angleLabel} offset table — not bender-specific.`,
  workspaceTitle: 'Pipe layout',
  angleSheetTitle: 'Bend Angle',
  angleSheetSubtitle: 'All four bends use this angle. 22.5° is the most common field choice.',
} as const;
