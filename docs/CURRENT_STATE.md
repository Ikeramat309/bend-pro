# Bend Pro Current State

Part of the [documentation index](README.md). Entry point: [`AGENTS.md`](../AGENTS.md).

Honest snapshot of where the app stands. **Phases 1 and 2 are complete.** The app is now in **Phase 3** (bender profiles and selection). Keep this doc updated when the picture changes — and never describe planned work as if it exists.

## What currently exists

### Working calculators

- **Offset** (`/offset`, `src/features/bend-offset/`) — offset height + bend angle → distance between bends, shrink, optional Mark 1 / Mark 2. Semi-proportional diagram at the real bend angle. **Multiplier** and **shrink rate** chips are tappable; per-angle manual overrides persist in setup. Setup row shows a hint when overrides are active (e.g. `Custom multiplier at 30°`).
- **Stub 90** (`/stub90`, `src/features/bend-stub90/`) — stub length − deduct (take-up) → deduct mark, with optional leg length. Semi-proportional diagram with field-accurate mark placement. **Deduct** chip is tappable for manual override per EMT size. Setup row shows a hint when a custom deduct is active.

Both follow the same feature pattern: `*.config.ts`, `*.copy.ts`, `engine/` (pure math + types), `ui/` (screen + diagram). Both produce warnings for invalid or impractical inputs, return unified `diagramData` for diagrams, and format results via shared `formatLength`.

### Working app shell

- Expo Router routes in `src/app/` (thin, export screens only): `/`, `/bends`, `/offset`, `/stub90`, `/settings`, `/bender-database`, `/guide`
- Hub screens in `src/screens/`: Home, Bends library, Settings (functional — unit, rounding, EMT size, bender)
- Shared UI in `src/shared/ui/` (AppHeader, AppScreen, BottomNav, Sheet, FieldInput, OptionChipGroup)
- Workspace components in `src/shared/workspace/` (SetupSummary, PipeWorkspaceCard, PipeWorkspaceResult, MeasurementChip, EditSetupSheet, AngleSelector, OptionalFieldButton, WarningList)
- Persisted calculator setup in `src/core/settings/` (AsyncStorage — unit, rounding, conduit size, bender, manual overrides)
- Shared diagram primitives in `src/shared/diagrams/` (DiagramCanvas, DiagramDefs, PipeSegment, MarkLine, DimensionLine, DiagramLabel, DiagramCallout, BendRadiusZone, DiagramLeaderLine, `resolveProportionalSpans`, diagramTheme)
- Theme tokens in `src/theme/` (colors, spacing, typography)
- Data in `src/data/`: EMT sizes, conduit types (EMT only), bender profiles, bend library navigation metadata
- Jest test suite (`npm test`) — engines, parsing, formatting, settings, diagram proportions

## What is incomplete (Phase 3 focus)

- **Bender profiles** — only one profile exists: `generic-hand-bender` with approximate take-up values for 1/2", 3/4", and 1" EMT, plus a hard-coded default fallback of 5". Manual overrides exist for deduct (Stub 90) and multiplier/shrink (Offset), but there is **no way to add or select other bender profiles**.
- **Bender database screen** (`/bender-database`) — placeholder only ("coming soon"). No search, selection, or custom benders.
- **Guide screen** (`/guide`) — placeholder only. No learning content or guided mode.
- **Calculator registry** — not implemented. Calculator availability is defined by `src/data/bendLibrary.ts` and `src/navigation/routes.ts`.

## What needs cleanup (low priority)

- **Leftover boilerplate comments** in some screens — remove when touching those files, per workflow rules.
- **`src/shared/diagrams/primitives/` subfolder** — optional organization deferred from Phase 2; flat `diagrams/` folder is fine for now.
- **Richer diagram empty states** — ghost diagrams exist but could be improved; not blocking Phase 3.

## Known risk areas

- **Calculator terminology** — the highest-confusion area. Always check [`GLOSSARY.md`](GLOSSARY.md) and [`NAMING_RULES.md`](NAMING_RULES.md) before changing any label or key.
- **Bender profile support** — deduct and offset constants vary by bender and angle. Manual overrides reduce trust gaps, but the generic profile with silent 5" fallback for unlisted EMT sizes remains a limitation until Phase 3 expands profiles.
- **Math changes** — any change to engine formulas, multipliers, or shrink constants is a field-safety risk. See [`CALCULATOR_RULES.md`](CALCULATOR_RULES.md).
- **Unit handling** — engines convert metric input to inches internally (`MM_PER_INCH`); formatting back out is handled by `formatLength`. Keep conversions in the engine, not the UI.

See [`ROADMAP.md`](ROADMAP.md) for the phased order.
