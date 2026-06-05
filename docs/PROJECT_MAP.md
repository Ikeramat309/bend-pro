# Project Map

This map describes where code lives today and where future code should move.

## Routes

Expo Router route files live in `src/app/`.

- Home route: `src/app/index.tsx`
- Bend library route: `src/app/bends.tsx`
- Offset route: `src/app/offset.tsx`
- Stub 90 route: `src/app/stub90.tsx`
- Settings route: `src/app/settings.tsx`
- Bender database route: `src/app/bender-database.tsx`
- Guide route: `src/app/guide.tsx`

Route files should stay thin. They should import and export screens from feature modules or screen modules.

## Calculator Features

Offset now lives in `src/features/bend-offset/`.

- Engine: `src/features/bend-offset/engine/`
- UI: `src/features/bend-offset/ui/`
- Route: `/offset`

Stub 90 now lives in `src/features/bend-stub90/`.

- Engine: `src/features/bend-stub90/engine/`
- UI: `src/features/bend-stub90/ui/`
- Route: `/stub90`

## Shared Bend UI

Current shared bend UI remains in `src/components/bend/`.

This includes setup cards, inputs, action cards, navigation UI, and bend-specific shared controls. These may move later to `src/shared/ui/` or `src/shared/workspace/`, but they are intentionally left in place for this pass.

## Shared Diagram Components

Current shared diagram components remain in `src/components/diagram/`.

Future low-level drawing primitives should live in `src/shared/diagrams/primitives/`.

## Data

Bender profiles currently live in `src/data/benderProfiles.ts`.

Conduit type data currently lives in `src/data/conduitTypes.ts`.

Bend library/navigation data currently lives in `src/data/bendLibrary.ts`.

Future bender data should move into `src/data/benders/`.

Future conduit data should move into `src/data/conduit/`.

## Theme

Theme files live in `src/theme/`.

Use these for colors, spacing, typography, and calculator theme tokens.

## Formatting, Units, And Validation

Current helper files live in `src/utils/`.

- Rounding labels: `src/utils/rounding.ts`
- Unit labels: `src/utils/units.ts`
- UI validation helpers: `src/utils/validation.ts`

Future shared core logic should move into:

- `src/core/calculator/`
- `src/core/units/`
- `src/core/validation/`

Existing engine helpers currently live in `src/engine/` and should be reviewed in a later cleanup pass.
