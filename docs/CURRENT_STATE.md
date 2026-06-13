# Bend Pro Current State

Part of the [documentation index](README.md). Entry point: [`AGENTS.md`](../AGENTS.md).

Honest snapshot of where the app stands. **Phases 1, 2, and 3 are complete.** The app is in **Phase 4** — **3-Point Saddle** is the first new calculator. Keep this doc updated when the picture changes — and never describe planned work as if it exists.

## What currently exists

### Working calculators

- **Offset** (`/offset`, `src/features/bend-offset/`) — offset height + bend angle → distance between bends, shrink, optional Mark 1 / Mark 2. Semi-proportional diagram at the real bend angle. **Multiplier** and **shrink rate** chips are tappable; per-angle manual overrides persist in setup. Setup row shows a hint when overrides are active (e.g. `Custom multiplier at 30°`).
- **3-Point Saddle** (`/saddle3`, `src/features/bend-saddle3/`) — obstruction height + angle preset → center-to-side spacing, shrink, and three layout marks (optional distance to center for absolute mark positions). Semi-proportional saddle diagram with center and side marks.
- **Stub 90** (`/stub90`, `src/features/bend-stub90/`) — stub length − deduct (take-up) → deduct mark, with optional leg length. Semi-proportional diagram with field-accurate mark placement. **Deduct** chip is tappable for manual override per EMT size. Setup row shows a hint when a custom deduct is active.

All three follow the same feature pattern: `*.config.ts`, `*.copy.ts`, `engine/` (pure math + types), `ui/` (screen + diagram). Offset and Stub 90 show a **bender profile context** banner; the saddle uses the standard angle table (not bender-specific). All produce warnings for invalid or impractical inputs and format results via shared `formatLength`.

### Bender profiles (Phase 3 complete)

- **Three generic hand-bender profiles** — field-reference stub 90 deducts for 1/2", 3/4", and 1" EMT. Not manufacturer shoe charts.
- **Custom bender profiles** — users save name + measured stub 90 deducts (fraction input supported). Up to 10 profiles on device.
- **Bender database** (`/bender-database`) — search, select active profile, add/edit/delete custom benders.
- **Manual overrides** — deduct (Stub 90, per size); multiplier and shrink (Offset, per angle). All persist in calculator setup.
- **Settings / Edit Setup** — list built-in and custom profiles; chip list scrolls when more than six profiles.

### Working app shell

- Expo Router routes in `src/app/` (thin, export screens only): `/`, `/bends`, `/offset`, `/stub90`, `/saddle3`, `/settings`, `/bender-database`, `/guide`
- Hub screens in `src/screens/`: Home, Bends library, Settings (functional — unit, rounding, EMT size, bender)
- Shared UI in `src/shared/ui/` (AppHeader, AppScreen, BottomNav, Sheet, FieldInput, OptionChipGroup)
- Workspace components in `src/shared/workspace/` (SetupSummary, BenderProfileContext, PipeWorkspaceCard, PipeWorkspaceResult, MeasurementChip, EditSetupSheet, AngleSelector, OptionalFieldButton, WarningList)
- Persisted calculator setup in `src/core/settings/` (AsyncStorage — unit, rounding, conduit size, bender, custom profiles, manual overrides)
- Shared diagram primitives in `src/shared/diagrams/` (DiagramCanvas, DiagramDefs, PipeSegment, MarkLine, DimensionLine, DiagramLabel, DiagramCallout, BendRadiusZone, DiagramLeaderLine, `resolveProportionalSpans`, diagramTheme)
- Theme tokens in `src/theme/` (colors, spacing, typography)
- Data in `src/data/`: EMT sizes, conduit types (EMT only), bender profiles, bend library navigation metadata
- Jest test suite (`npm test`) — engines, parsing, formatting, settings, diagram proportions, bender profiles

## What is incomplete (Phase 4+ focus)

- **More calculators** — kick, 4-point saddle, rolling offset, segment bending, etc. **3-Point Saddle is live**; others not started. See [`ROADMAP.md`](ROADMAP.md) and [`PRODUCT_BRIEF.md`](PRODUCT_BRIEF.md).
- **Manufacturer shoe charts** — deferred until trustworthy source data exists. Custom profiles + manual overrides cover the gap today.
- **Guide screen** (`/guide`) — placeholder only. No learning content or guided mode (Phase 5).
- **Calculator registry** — not implemented. Calculator availability is defined by `src/data/bendLibrary.ts` and `src/navigation/routes.ts`.

## What needs cleanup (low priority)

- **Leftover boilerplate comments** in some screens — remove when touching those files, per workflow rules.
- **`src/shared/diagrams/primitives/` subfolder** — optional organization deferred from Phase 2; flat `diagrams/` folder is fine for now.
- **Richer diagram empty states** — ghost diagrams exist but could be improved.

## Known risk areas

- **Calculator terminology** — the highest-confusion area. Always check [`GLOSSARY.md`](GLOSSARY.md) and [`NAMING_RULES.md`](NAMING_RULES.md) before changing any label or key.
- **Bender profile gaps** — offset multipliers/shrink are angle-table based, not bender-specific. For stub 90, unlisted EMT sizes on a profile fall back to a default deduct; the profile context banner explains when that happens.
- **Math changes** — any change to engine formulas, multipliers, or shrink constants is a field-safety risk. See [`CALCULATOR_RULES.md`](CALCULATOR_RULES.md).
- **Unit handling** — engines convert metric input to inches internally (`MM_PER_INCH`); formatting back out is handled by `formatLength`. Keep conversions in the engine, not the UI.

See [`ROADMAP.md`](ROADMAP.md) for the phased order.
