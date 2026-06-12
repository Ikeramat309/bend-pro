# Bend Pro Current State

Part of the [documentation index](README.md). Entry point: [`AGENTS.md`](../AGENTS.md).

Honest snapshot of where the app stands. The app is in a **regroup/refactor phase**: a structural cleanup is largely done, and the focus is stabilizing the two core calculators before anything new. Keep this doc updated when the picture changes — and never describe planned work as if it exists.

## What currently exists

### Working calculators

- **Offset** (`/offset`, `src/features/bend-offset/`) — offset height + bend angle → distance between bends, shrink, optional Mark 1 / Mark 2. Uses standard angle multipliers and shrink-per-inch constants (10°, 22.5°, 30°, 45°, 60°).
- **Stub 90** (`/stub90`, `src/features/bend-stub90/`) — stub length − deduct (take-up) → deduct mark, with optional leg length. Deduct comes from the active bender profile.

Both follow the same feature pattern: `*.config.ts`, `*.copy.ts`, `engine/` (pure math + types), `ui/` (screen + diagram). Both produce warnings for invalid or impractical inputs and format results via shared `formatLength`.

### Working app shell

- Expo Router routes in `src/app/` (thin, export screens only): `/`, `/bends`, `/offset`, `/stub90`, `/settings`, `/bender-database`, `/guide`
- Hub screens in `src/screens/`: Home, Bends library, Settings
- Shared UI in `src/shared/ui/` (AppHeader, AppScreen, BottomNav, Sheet, FieldInput)
- Workspace components in `src/shared/workspace/` (SetupSummary, PipeWorkspaceCard, PipeWorkspaceResult, MeasurementChip, EditSetupSheet, AngleSelector, OptionalFieldButton, WarningList)
- Shared diagram primitives in `src/shared/diagrams/` (DiagramCanvas, DiagramDefs, PipeSegment, MarkLine, DimensionLine, DiagramLabel, DiagramCallout, diagramTheme)
- Theme tokens in `src/theme/` (colors, spacing, typography)
- Data in `src/data/`: EMT sizes, conduit types (EMT only), bender profiles, bend library navigation metadata

## What is incomplete

- **Bender profiles** — only one profile exists: `generic-hand-bender` with approximate take-up values for 1/2", 3/4", and 1" EMT, plus a hard-coded default fallback of 5". Values are generic field references, not manufacturer shoe charts. A **manual deduct override** exists (tap the Deduct chip on Stub 90): per-EMT-size, stored in inches in the persisted setup, replaces the chart value and is flagged in results as `isDeductOverridden`. There is still no way to add or select other benders.
- **Bender database screen** (`/bender-database`) — placeholder only ("coming soon"). No search, selection, or custom benders.
- **Guide screen** (`/guide`) — placeholder only. No learning content or guided mode.
- **Calculator registry** — not implemented. Calculator availability is defined by `src/data/bendLibrary.ts` and `src/navigation/routes.ts`.
- **Engine tests** — ~~no automated tests exist for the calculator engines.~~ **Resolved:** Jest (`jest-expo`) covers both engines, input parsing, formatting, settings sanitizing, and diagram proportion scaling. Run `npm test`.
- **Diagram system migration** — shared primitives exist, but the planned `src/shared/diagrams/primitives/` organization (per `DESIGN_SYSTEM.md`) has not happened. Feature diagrams (`OffsetDiagram`, `Stub90Diagram`) still own a fair amount of layout logic.

## What needs cleanup

- ~~Terminology drift between engine keys and UI labels.~~ **Resolved:** the Stub 90 engine surface now uses `deductMark` / `isValidDeductMark` (the legacy `firstMark` and duplicate `takeUp` keys were removed), and the Offset engine input uses `mark1`. Engine keys match `NAMING_RULES.md`.
- **Leftover boilerplate comments** in some screens (`FILE:`, section banners, stale phase references) — remove when touching those files, per workflow rules.
- **Mixed concerns in feature diagrams** — diagram layout math vs. shared primitives, to be addressed by the diagram system phase.

## What should be stabilized before new features

1. Offset and Stub 90 math, validation, and terminology (with engine tests and documented example cases)
2. The reusable pipe diagram system (`DIAGRAM_SYSTEM.md`)
3. Bender profile selection (manual deduct/take-up override is done; profile selection beyond the generic bender is not)

See [`ROADMAP.md`](ROADMAP.md) for the phased order.

## Known risk areas

- **Calculator terminology** — the highest-confusion area. Mixing "First Mark" (offset) with "Deduct Mark" (stub 90), or "take-up" vs "deduct", directly confuses field users. Always check [`GLOSSARY.md`](GLOSSARY.md) and [`NAMING_RULES.md`](NAMING_RULES.md) before changing any label or key.
- **Bender profile support** — deduct values vary by bender shoe. The current single generic profile with a silent 5" fallback is a known limitation; the engine warns when falling back. Changes here affect real-world marks, so they need explicit tasking and example cases.
- **Math changes** — any change to engine formulas, multipliers, or shrink constants is a field-safety risk. See [`CALCULATOR_RULES.md`](CALCULATOR_RULES.md).
- **Unit handling** — engines convert metric input to inches internally (`MM_PER_INCH`); formatting back out is handled by `formatLength`. Keep conversions in the engine, not the UI.
