# Bend Pro Roadmap

Part of the [documentation index](README.md). Entry point: [`AGENTS.md`](../AGENTS.md).

Phased plan for the regroup/refactor era. Phases are ordered by dependency: stabilization and the diagram system come **before** any new calculators. Everything below the current phase is **planned future work** — do not build it unless a task explicitly asks for it, and do not document it as if it exists.

## Phase 1 — Stabilize Offset and Stub 90 ✅ complete

- Lock down engine math, validation, and warnings for both calculators
- Add engine tests with documented example cases (see `CALCULATOR_RULES.md`)
- Clean terminology drift between engine keys and UI labels (`NAMING_RULES.md`, `GLOSSARY.md`)
- Fraction-native input, persisted calculator setup, functional Settings screen
- Keep both screens working at all times — small, safe change sets only

**Exit criteria met:** both calculators have tested engines, consistent terminology, persisted setup, and no known math or labeling bugs.

## Phase 2 — Reusable pipe diagram system ✅ complete

- Shared diagram primitives in `src/shared/diagrams/` (`PipeSegment`, `MarkLine`, `DimensionLine`, `DiagramLabel`, `DiagramCallout`, `BendRadiusZone`, `DiagramLeaderLine`, `resolveProportionalSpans`, `diagramTheme`)
- Unified `diagramData` contract from engines — numeric values + formatted display strings
- Semi-proportional live diagrams for Stub 90 and Offset (geometry from `diagramData`, clamped for readability)
- Field-accurate diagram semantics (stub mark on the stub, offset diagonal at real bend angle, dimensions along the pipe)
- Manual chart overrides surfaced on calculator screens (deduct, multiplier, shrink) with setup-row hints

**Exit criteria met:** both calculators render from shared primitives; new calculator diagrams should compose primitives rather than fork drawing code.

**Deferred (not blocking later phases):** `primitives/` subfolder organization, richer empty-preview states, additional anchored callout patterns beyond the current leader line.

## Phase 3 — Bender profiles and manual override ✅ complete

**Delivered:**

- Manual deduct override (Stub 90, per EMT size)
- Manual multiplier and shrink-per-inch overrides (Offset, per bend angle)
- Override hints on setup rows; tappable result chips with override sheets
- Three generic hand-bender profiles (field-reference charts, not manufacturer data)
- Bender database — browse, search, select active profile
- Custom bender profiles — create, edit, delete, select (measured stub 90 deducts)
- Profile context banners on Stub 90 and Offset (`BenderProfileContext`)
- Fraction input for custom bender deducts; scrollable bender chip lists when many profiles exist

**Exit criteria met:** a user with any hand bender can get correct marks from a profile or a manual override, and can **select** their bender — not only override a generic table.

**Deferred to future (requires real data, not invented values):**

- Manufacturer / model-specific shoe charts

## Phase 4 — More calculators ✅ wrapped (paused)

See [`PHASE_4_WRAPUP.md`](PHASE_4_WRAPUP.md) for the full close-out snapshot.

**Delivered:**

- **3-Point Saddle** (`/saddle3`) — obstruction height, angle presets (22.5°/45°, 30°/60°, 45°/90°), optional distance to center, diagram + engine tests
- **4-Point Saddle** (`/saddle4`) — obstruction height, saddle width, equal bend angle (22.5°/30°/45°), optional distance to center; two-offset (plateau) diagram + engine tests
- **Segment Bend** (`/segment`) — radius, total angle, degrees-per-bend → shot count, between-bends spacing, developed length, optional start marks; arc diagram + engine tests
- **Rolling Offset** (`/rolling`) — offset height + offset roll → distance between bends, shrink, optional marks; pipe-first diagram + engine tests

**Exit criteria met (for Phase 4 scope):** four new calculators follow the feature template, have tested engines, documented example cases, and ship in the bend library.

**Deferred (future hardening or later phases):**

- Kick / 90 with kick and other bend-library placeholders (parallel offset, box offset, back-to-back 90, hydraulic layout)
- Saddle manual multiplier/shrink overrides (Offset parity)
- Richer diagram empty states
- Per-calculator visual polish pass

## Phase 5 — Guide mode (next product focus)

- Turn the placeholder Guide screen into real learning content: formulas, bend steps, common mistakes, apprentice walkthroughs
- Guided mode stays separate from the main calculator result (see `DESIGN_SYSTEM.md`)

**Optional parallel track:** calculator hardening (close gaps listed in `PHASE_4_WRAPUP.md`) — recommended before adding more calculators.

## Phase 6 — Polish, testing, and release preparation

- Visual polish pass across calculators using the design system
- Broader test coverage (engines, formatting, validation)
- Performance and accessibility review
- Store/release preparation

## How to use this roadmap

- Agents: confirm which phase a task belongs to before starting. If a task pulls in work from a later phase, flag it instead of expanding scope.
- Keep this doc updated when a phase completes or priorities shift — and update [`CURRENT_STATE.md`](CURRENT_STATE.md) to match.
