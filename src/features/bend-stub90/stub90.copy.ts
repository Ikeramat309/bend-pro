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
    takeUp: 'Take-Up',
    leg: 'Leg',
  },
  diagram: {
    title: '90° Stub',
    stubLength: 'Stub Length',
    deduct: 'Deduct',
    deductMark: 'Deduct Mark',
    bendMark: 'Bend Mark',
    leg: 'Leg',
    emptyMessage: 'Enter stub length to calculate Deduct Mark.',
    invalidMessage: 'Stub length must be greater than deduct.',
  },
  workspaceTitle: 'Pipe layout',
} as const;
