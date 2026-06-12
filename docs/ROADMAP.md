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

**Deferred (not blocking Phase 3):** `primitives/` subfolder organization, richer empty-preview states, additional anchored callout patterns beyond the current leader line.

## Phase 3 — Bender profiles and manual override (current)

**Already done (partial):**

- Manual deduct override (Stub 90, per EMT size)
- Manual multiplier and shrink-per-inch overrides (Offset, per bend angle)
- Override hints on setup rows; tappable result chips with override sheets

**Still to do:**

- Expand bender profile data beyond the single generic hand bender
- Bender database screen (currently placeholder) — search, selection, custom profiles
- Replace silent default fallback with clearer profile context where profiles are incomplete
- Manufacturer / model-specific shoe charts (when data exists)

**Exit criteria:** a user with any hand bender can get correct marks from a profile or a manual override, and can **select** their bender — not only override a generic table.

## Phase 4 — More calculators (later)

Candidates (order undecided; see `PRODUCT_BRIEF.md`):

- 3-point saddle, 4-point saddle, kick, rolling offset, segment bending

Each new calculator must follow `FEATURE_TEMPLATE.md`, `CALCULATOR_RULES.md`, and reuse the diagram system from Phase 2. No new calculator starts until Phase 3 exit criteria are met.

## Phase 5 — Guide mode (later)

- Turn the placeholder Guide screen into real learning content: formulas, bend steps, common mistakes, apprentice walkthroughs
- Guided mode stays separate from the main calculator result (see `DESIGN_SYSTEM.md`)

## Phase 6 — Polish, testing, and release preparation

- Visual polish pass across calculators using the design system
- Broader test coverage (engines, formatting, validation)
- Performance and accessibility review
- Store/release preparation

## How to use this roadmap

- Agents: confirm which phase a task belongs to before starting. If a task pulls in work from a later phase, flag it instead of expanding scope.
- Keep this doc updated when a phase completes or priorities shift — and update [`CURRENT_STATE.md`](CURRENT_STATE.md) to match.
