# Phase 5 Wrap-Up — Bender database improvement

Part of the [documentation index](README.md). Entry point: [`AGENTS.md`](../AGENTS.md).

## Goal

Improve bender profile selection and manual override discoverability without inventing manufacturer shoe charts.

## Delivered

### Richer profile model (`src/data/benders/`)

- **`BenderChartKind`** on every profile: `generic-field-reference`, `custom-measured`, or `manufacturer` (reserved — requires `sourceNote` with real attribution before use)
- **`profileChart.ts`** — chart kind labels, deduct table rows, calculator capability copy, built-in vs custom grouping
- Built-in profiles tagged `generic-field-reference`; custom profiles `custom-measured`

### Override hub (`src/core/settings/setupOverrides.ts`)

- **`listSetupOverrides()`** — all saved stub 90 deduct, offset multiplier, and shrink overrides
- **`patchClearSetupOverride()`** / **`patchClearAllSetupOverrides()`** — remove overrides from setup
- **`SetupOverridesCard`** — shown on Benders hub and Settings with per-override Clear actions

### Bender database UX

- **`BenderProfileDetailSheet`** — full stub 90 deduct table (chart vs in-use), capabilities, Use as active bender
- **`BenderProfileCard`** — chart kind badge, **Chart ›** opens detail; tap card still selects active profile
- **`BenderDatabaseScreen`** — Built-in / Your benders sections, overrides card, route param `?profile=` for detail
- **`benderDatabaseRoute(profileId?)`** in navigation

### Selection discoverability

- **Edit Setup** sheet — “Browse bender database ›” link
- **Settings** — “Manage benders” nav card + overrides card

## Exit criteria

- Users can inspect full deduct charts and see where overrides apply
- Overrides are visible and clearable outside calculator screens
- No manufacturer chart data invented; model ready for sourced data later
- `npm run check` passes

## Deferred

- Manufacturer profiles with real sourced shoe charts
- Offset multiplier/shrink stored per bender profile (still global angle-table overrides)
- In-calculator link from trust strip bender name to profile detail

## Acceptance (Phase 5.5)

Verified: no shipped profile uses `chartKind: 'manufacturer'`; built-in profiles labeled generic field reference; override list/clear works via `SetupOverridesCard`.

## Next phase

**Phase 6 — Future calculators** (Kick, etc.) only when explicitly scoped.
