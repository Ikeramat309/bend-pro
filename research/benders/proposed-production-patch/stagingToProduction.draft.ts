/**
 * ILLUSTRATIVE mapping only — not imported by the app.
 * Shows how staging model ids could relate to existing production profile ids.
 */
export const STAGING_TO_PRODUCTION_DRAFT = [
  {
    stagingModelId: 'model-greenlee-840a',
    productionProfileId: 'greenlee-site-rite-aluminum',
    tradeSize: '1/2',
    note: 'Already in production workbook v1.1 — re-verify sources only.',
  },
  {
    stagingModelId: 'model-klein-51606',
    productionProfileId: 'klein-angle-setter-aluminum',
    tradeSize: '1/2',
    note: 'Already in production — Stub-Up Height + CLR from Klein product page.',
  },
  {
    stagingModelId: 'model-gardner-960',
    productionProfileId: 'gardner-bigben-aluminum',
    tradeSize: '1/2',
    note: 'Keep verified_with_source_note warning about B-0040 mislabel.',
  },
  {
    stagingModelId: 'model-ideal-74-031',
    productionProfileId: 'ideal-aluminum',
    tradeSize: '1/2',
    note: 'field_layout_only — stub-up only.',
  },
  {
    stagingModelId: 'model-milwaukee-48-22-4070',
    productionProfileId: 'milwaukee-aluminum',
    tradeSize: '1/2',
    note: 'reference_only — no published take-up.',
  },
] as const;
