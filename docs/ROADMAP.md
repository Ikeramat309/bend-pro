# Bend Pro Roadmap

Part of the [documentation index](README.md). Entry point: [`AGENTS.md`](../AGENTS.md).

Phased plan for the regroup/refactor era. Phases are ordered by dependency: stabilization and the diagram system come **before** any new calculators. Everything below Phase 1 is **planned future work** — do not build it unless a task explicitly asks for it, and do not document it as if it exists.

## Phase 1 — Stabilize Offset and Stub 90 (current)

- Lock down engine math, validation, and warnings for both calculators
- Add engine tests with documented example cases (see `CALCULATOR_RULES.md`)
- Clean terminology drift between engine keys and UI labels (`NAMING_RULES.md`, `GLOSSARY.md`)
- Remove leftover boilerplate comments and stale phase references when touching files
- Keep both screens working at all times — small, safe change sets only

**Exit criteria:** both calculators have tested engines, consistent terminology, and no known math or labeling bugs.

## Phase 2 — Reusable pipe diagram system

- Consolidate diagram building blocks into shared primitives (`src/shared/diagrams/`, with a `primitives/` organization when ready)
- Primitives: conduit paths/segments, bend radius zones, marks, dimension vectors, arrowheads, labels, result callouts, empty preview states
- Feature diagrams (`OffsetDiagram`, `Stub90Diagram`) become thin compositions of primitives
- No calculator math inside diagram components — engines pass diagram-ready values (see `DIAGRAM_SYSTEM.md`)

**Exit criteria:** both existing calculators render from shared primitives; adding a new calculator diagram requires composition, not new drawing code.

## Phase 3 — Bender profiles and manual override

- Expand bender profile data beyond the single generic hand bender
- Let users select a bender profile and see which profile produced their deduct/take-up
- Manual override: users can enter their own deduct/take-up when their bender differs
- Replace the silent default fallback with clear UI feedback
- Build out the bender database screen (currently a placeholder)

**Exit criteria:** a user with any hand bender can get correct marks, either from a profile or a manual override.

## Phase 4 — More calculators (later)

Candidates (order undecided; see `PRODUCT_BRIEF.md`):

- 3-point saddle, 4-point saddle, kick, rolling offset, segment bending

Each new calculator must follow `FEATURE_TEMPLATE.md`, `CALCULATOR_RULES.md`, and reuse the diagram system from Phase 2. No new calculator starts until Phases 1–3 are done.

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
