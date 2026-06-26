/** User-facing labels and messages for 3-Point Saddle. */
export const saddle3Copy = {
  screenTitle: '3-Point Saddle',
  fields: {
    obstructionHeight: {
      label: 'Obstruction Height',
      placeholder: '0',
      errorRequired: 'Enter an obstruction height greater than 0.',
    },
    anglePreset: {
      label: 'Bend Angles',
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
    sideMarksAbsolute: (mark1: string, mark2: string) =>
      `Side marks  ${mark1}  ·  ${mark2}`,
    sideMarksRelative: 'Side marks fall ± Between Bends from the center mark.',
  },
  diagram: {
    title: '3-Point Saddle',
    obstructionHeight: 'Obstruction',
    betweenBends: 'Between Bends',
    shrink: 'Shrink',
    centerMark: 'Center',
    sideMark1: 'Side',
    sideMark2: 'Side',
    fieldCue: 'Bend center up first · then sides to level',
    emptyMessage: 'Enter obstruction height to lay out the saddle.',
    invalidMessage: 'Obstruction height must be greater than 0.',
  },
  profileContext: (presetLabel: string) =>
    `Saddle spacing and shrink use the standard ${presetLabel} angle table — not bender-specific.`,
  workspaceTitle: 'Pipe layout',
  angleSheetTitle: 'Saddle Angles',
  angleSheetSubtitle: 'Side bends / center bend. 22.5° / 45° is the most common field combo.',
} as const;
