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
      placeholder: 'Optional',
      addButton: 'Add Saddle Width',
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
      'Outer bends fall Between Bends past the top bends. Add saddle width for top mark spacing.',
  },
  diagram: {
    obstructionHeight: 'Obstruction',
    saddleWidth: 'Saddle Width',
    betweenBends: 'Between Bends',
    shrink: 'Shrink',
    outer: 'Outer',
    top: 'Top',
    fieldCue: 'Bend inner pair up · then outers to level',
    emptyMessage: 'Enter obstruction height to lay out the saddle.',
    invalidMessage: 'Obstruction height must be greater than 0.',
  },
  profileContext: (angleLabel: string) =>
    `Saddle spacing and shrink use the standard ${angleLabel} offset table — not bender-specific.`,
  workspaceTitle: 'Pipe layout',
  angleSheetTitle: 'Bend Angle',
  angleSheetSubtitle: 'All four bends use this angle. 22.5° is the most common field choice.',
} as const;
