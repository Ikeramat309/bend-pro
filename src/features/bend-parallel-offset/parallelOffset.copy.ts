export const parallelOffsetCopy = {
  screenTitle: 'Parallel Offsets',
  modes: {
    simple: 'Simple Shift',
    layout: 'Full Layout',
  },
  fields: {
    centerSpacing: {
      label: 'Center-to-Center Spacing',
      shortLabel: 'C-C Spacing',
      placeholder: '0',
      errorRequired: 'Enter center-to-center spacing greater than 0.',
    },
    offsetHeight: {
      label: 'Offset Height',
      placeholder: '0',
      errorRequired: 'Enter an offset height greater than 0.',
    },
    bendAngle: { label: 'Bend Angle' },
    conduitCount: { label: 'Conduits' },
    shiftDirection: { label: 'Outer Conduit Marks Move' },
    baseMark: {
      label: 'Pipe 1 Mark 1',
      placeholder: 'Optional',
      hint: 'Enter the first conduit’s actual Mark 1 to generate every absolute mark.',
    },
  },
  directions: {
    toward: 'Toward free end',
    away: 'Away from free end',
  },
  results: {
    adjustment: 'Shift per Conduit',
    distanceBetweenBends: 'Distance Between Bends',
    totalShift: 'Total Rack Shift',
  },
  diagram: {
    emptySimple: 'Enter center-to-center spacing to calculate the parallel shift.',
    emptyLayout: 'Enter spacing and offset height to build the rack layout.',
    invalid: 'Check the highlighted layout inputs.',
    fieldCueSimple: 'Shift both bend marks by this amount on each next conduit',
    fieldCueToward: 'Pipe 1 first · each outer pipe shifts toward the free end',
    fieldCueAway: 'Pipe 1 first · each outer pipe shifts away from the free end',
  },
  angleSheetTitle: 'Bend Angle',
  angleSheetSubtitle: 'Use the same bend angle and shoe radius on every conduit.',
  layoutSheetTitle: 'Full Layout',
  layoutSheetSubtitle: 'Choose the rack order and optionally generate absolute marks.',
} as const;

