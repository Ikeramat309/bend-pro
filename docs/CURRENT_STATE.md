# Bend Pro Current State

Part of the [documentation index](README.md). Entry point: [`AGENTS.md`](../AGENTS.md).

Honest snapshot of where the app stands. **Phases 1–4 are complete or wrapped.** The app ships **six calculators**. Phase 4 is **paused** — Kick and several polish items are deferred. See [`PHASE_4_WRAPUP.md`](PHASE_4_WRAPUP.md) for the close-out detail.

## What currently exists

### Working calculators

- **Offset** (`/offset`, `src/features/bend-offset/`) — offset height + bend angle → distance between bends, shrink, optional Mark 1 / Mark 2. Semi-proportional diagram at the real bend angle. **Multiplier** and **shrink rate** chips are tappable; per-angle manual overrides persist in setup. Setup row shows a hint when overrides are active (e.g. `Custom multiplier at 30°`).
- **Stub 90** (`/stub90`, `src/features/bend-stub90/`) — stub length − deduct (take-up) → deduct mark, with optional leg length. Semi-proportional diagram with field-accurate mark placement. **Deduct** chip is tappable for manual override per EMT size. Setup row shows a hint when a custom deduct is active.
- **3-Point Saddle** (`/saddle3`, `src/features/bend-saddle3/`) — obstruction height + angle preset → center-to-side spacing, shrink, and three layout marks (optional distance to center for absolute mark positions). Semi-proportional saddle diagram with center and side marks.
- **4-Point Saddle** (`/saddle4`, `src/features/bend-saddle4/`) — obstruction height + saddle width + equal bend angle → between-bends spacing, total shrink, and four layout marks (optional distance to center for absolute mark positions). Two-offset (flat-topped plateau) diagram. Reuses the standard offset multiplier/shrink constants.
- **Segment Bend** (`/segment`, `src/features/bend-segment/`) — radius + total angle + degrees-per-bend → shot count, between-bends spacing, developed length, and staggered marks (optional start of bend for absolute positions). Arc diagram with evenly spaced shot ticks and a radius leader. Purely geometric (radius/angle), conduit-size independent.
- **Rolling Offset** (`/rolling`, `src/features/bend-rolling/`) — offset height + offset roll → distance between bends, shrink, and optional Mark 1 / Mark 2. Pipe-first diagram with compact roll inset. Shares offset multiplier/shrink overrides from setup.

All six follow the same feature pattern: `*.config.ts`, `*.copy.ts`, `engine/` (pure math + types), `ui/` (screen + diagram). Offset, Rolling Offset, and Stub 90 show a **bender profile context** banner; the saddles use the standard angle table and the segment bend is geometric — none use bender-specific multiplier charts. All produce warnings for invalid or impractical inputs and format results via shared `formatLength`.

### Bender profiles (Phase 3 complete)

- **Three generic hand-bender profiles** — field-reference stub 90 deducts for 1/2", 3/4", and 1" EMT. Not manufacturer shoe charts.
- **Custom bender profiles** — users save name + measured stub 90 deducts (fraction input supported). Up to 10 profiles on device.
- **Bender database** (`/bender-database`) — search, select active profile, add/edit/delete custom benders.
- **Manual overrides** — deduct (Stub 90, per size); multiplier and shrink (Offset and Rolling Offset, per angle). All persist in calculator setup.
- **Settings / Edit Setup** — list built-in and custom profiles; chip list scrolls when more than six profiles.

### Working app shell

- Expo Router routes in `src/app/` (thin, export screens only): `/`, `/bends`, `/offset`, `/stub90`, `/saddle3`, `/saddle4`, `/segment`, `/rolling`, `/settings`, `/bender-database`, `/guide`
- Hub screens in `src/screens/`: Home, Bends library, Settings (functional — unit, rounding, EMT size, bender)
- Shared UI in `src/shared/ui/` (AppHeader, AppScreen, BottomNav, Sheet, FieldInput, OptionChipGroup)
- Workspace components in `src/shared/workspace/` (SetupSummary, BenderProfileContext, PipeWorkspaceCard, PipeWorkspaceResult, MeasurementChip, EditSetupSheet, AngleSelector, OptionalFieldButton, WarningList)
- Persisted calculator setup in `src/core/settings/` (AsyncStorage — unit, rounding, conduit size, bender, custom profiles, manual overrides)
- Shared diagram primitives in `src/shared/diagrams/` (DiagramCanvas, DiagramDefs, PipeSegment, MarkLine, DimensionLine, DiagramLabel, DiagramCallout, BendRadiusZone, DiagramLeaderLine, `resolveProportionalSpans`, diagramTheme)
- Theme tokens in `src/theme/` (colors, spacing, typography)
- Data in `src/data/`: EMT sizes, conduit types (EMT only), bender profiles, bend library navigation metadata
- Jest test suite (`npm test`) — 191 tests at Phase 4 wrap-up (engines, parsing, formatting, settings, diagram proportions, bender profiles)

## What is incomplete (honest gaps)

These are **not blockers** for using the app in the field, but they are real follow-ups:

### Deferred calculators (not started)

- Kick / 90 with kick, parallel offset, box offset, back-to-back 90, hydraulic layout — listed as coming-soon in `bendLibrary.ts`

### Per-calculator maturity gaps

- **Saddles (3- and 4-point):** no manual multiplier/shrink overrides (Offset has them)
- **Segment bend:** geometric model only — no spring-back compensation
- **Rolling offset:** does not model 3D bender-head rotation; true offset stays internal
- **Offset / Stub 90:** multiplier/shrink and deduct tables are generic, not manufacturer shoe charts

### Product gaps (later phases)

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

See [`ROADMAP.md`](ROADMAP.md) for the phased order and [`PHASE_4_WRAPUP.md`](PHASE_4_WRAPUP.md) for Phase 4 close-out.
