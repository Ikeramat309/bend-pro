# App Architecture

Bend Pro is organized around thin routes, self-contained calculator features, and stable shared systems.

## Architecture Flow

```text
App Shell
  -> Expo Router routes
  -> Calculator registry
  -> Calculator feature modules
  -> Shared UI
  -> Shared diagram system
  -> Shared data/bender profiles
  -> Shared units/formatting/validation
```

## App Shell

The app shell is the Expo app and router setup in `src/app/`.

Route files should not contain calculator math. They should only connect URLs to screens.

## Expo Router Routes

Routes live in `src/app/`.

Examples:

- `src/app/offset.tsx` exports the Offset feature screen.
- `src/app/stub90.tsx` exports the Stub 90 feature screen.

## Calculator Registry

The app does not have a full calculator registry yet. For now, calculator availability is represented by `src/data/bendLibrary.ts` and route constants in `src/navigation/routes.ts`.

A future registry can connect route, title, icon, feature metadata, and default setup.

## Calculator Feature Modules

Each calculator should live under `src/features/`.

Feature modules own:

- Their engine logic
- Their engine types
- Their validation rules
- Their screens and calculator-specific UI
- Their copy and feature metadata
- Their README

Feature modules should not duplicate shared UI or data.

## Shared UI

Shared bend UI currently lives in `src/components/bend/`.

These components are reused by calculators and screens. They should move to `src/shared/` later only when it can be done safely.

## Shared Diagram System

Shared diagram components currently live in `src/components/diagram/`.

Future drawing primitives should live in `src/shared/diagrams/primitives/`.

The diagram system should stay reusable for Offset, Stub 90, Back-to-Back, Saddles, and future calculators.

## Shared Data And Bender Profiles

Current shared data lives in `src/data/`.

Bender profile data currently lives in `src/data/benderProfiles.ts`.

Future bender data modules should live in `src/data/benders/`.

Future conduit data modules should live in `src/data/conduit/`.

## Shared Units, Formatting, And Validation

Current helpers live in `src/utils/` and `src/engine/`.

Future shared core helpers should live in:

- `src/core/calculator/`
- `src/core/units/`
- `src/core/validation/`

Move these gradually. Do not break working calculators just to make folders look cleaner.
