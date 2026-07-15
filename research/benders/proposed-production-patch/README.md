# Proposed production patch (DRAFT — not applied)

This folder shows how approved staging records *might* later map into Bend Pro.
**Nothing here is imported by the app.** Do not copy into `src/data/benders/` without human review.

## Suggested mapping shape

```ts
// ILLUSTRATIVE ONLY — do not paste into production without review
export type StagingToProductionMap = {
  stagingModelId: string;
  productionProfileId?: string; // existing BuiltInBenderProfileId
  suggestedVerificationStatus:
    | 'verified_default'
    | 'verified_with_source_note'
    | 'field_layout_only'
    | 'reference_only';
  promoteTakeUp: boolean;
  promoteRadius: boolean;
  blockers: string[];
};
```

## Example rows (non-authoritative)

| stagingModelId | productionProfileId | suggestedStatus | promoteTakeUp | promoteRadius | blockers |
|----------------|---------------------|-----------------|---------------|---------------|----------|
| model-greenlee-840a | greenlee-site-rite-aluminum | verified_default | false (already) | false (already) | none |
| model-klein-51608 | klein-angle-setter-iron | verified_default | false (already) | false (already) | none |
| model-gardner-960 | gardner-bigben-aluminum | verified_with_source_note | false (already) | false (already) | keep B-0040 note |
| model-ideal-74-031 | ideal-aluminum | field_layout_only | false (already) | false | no CLR |
| model-milwaukee-48-22-4070 | milwaukee-aluminum | reference_only | false | false | no published take-up |
| model-greenlee-shoe-23803 | (none) | n/a | false | false | electric + CLR conflict |
| model-gardner-bemt-52 | (none) | n/a | false | false | electric; out of hand scope |

## Explicit non-goals for any first patch

- No engine math changes  
- No silent replacement of production values  
- No Rigid/IMC expansion of the app  
- No powered-bender Stub 90 charts
