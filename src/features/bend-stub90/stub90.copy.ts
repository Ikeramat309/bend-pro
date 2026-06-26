/** User-facing labels and messages for Stub 90. */
export const stub90Copy = {
  screenTitle: '90° Stub',
  fields: {
    stubLength: {
      label: 'Stub Length',
      placeholder: '0',
      errorRequired: 'Enter a stub length greater than 0.',
    },
    leg: {
      label: 'Leg',
      placeholder: 'Optional',
      addButton: 'Add Leg',
      errorRequired: 'Enter a leg greater than 0.',
    },
  },
  results: {
    deductMark: 'Deduct Mark',
    deduct: 'Deduct',
    deductCustom: 'Deduct • Custom',
    leg: 'Leg',
  },
  deductOverride: {
    title: 'Deduct Override',
    fieldLabel: 'Custom Deduct',
    placeholder: 'Bender value',
    description:
      'Measured a different take-up on your bender? Enter it here — it replaces the chart value for this EMT size.',
    clearHint: 'Leave blank to use the bender value.',
    errorInvalid: 'Enter a value greater than 0, or leave blank.',
  },
  diagram: {
    title: '90° Stub',
    stubLength: 'Stub Length',
    deduct: 'Deduct',
    deductMark: 'Deduct Mark',
    leg: 'Leg',
    fieldCue: 'Mark from stub tip · bend toe up',
    emptyMessage: 'Enter stub length to calculate Deduct Mark.',
    invalidMessage: 'Stub length must be greater than deduct.',
  },
  workspaceTitle: 'Pipe layout',
} as const;
