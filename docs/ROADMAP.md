# Bend Pro Roadmap

Part of the [documentation index](README.md). Entry point: [`AGENTS.md`](../AGENTS.md).

Phased plan after the initial calculator build-out. **Do not expand scope** into a later phase unless a task explicitly asks for it.

Historical phases (calculator stabilization, diagram system, bender profiles, additional calculators) are **complete** — see [`PHASE_4_WRAPUP.md`](PHASE_4_WRAPUP.md). The roadmap below is the **current product sequence** for foundation, polish, and growth.

## Phase 1 — Calculator workspace foundation ✅ complete

- Shared layout shell: `src/shared/workspace/BendCalculatorLayout.tsx` and siblings
- Universal structure: Header · Trust strip · Input strip · Pipe workspace · Action dock · optional nav
- All six calculators on the shared contract; Guide replaces Summary in the dock
- Document layout rules in [`UI_WORKSPACE_LAYOUT.md`](UI_WORKSPACE_LAYOUT.md)
- `npm run check` script (typecheck + lint + tests)

## Phase 2 — Visual UI polish / design system ✅ complete

See [`PHASE_2_WRAPUP.md`](PHASE_2_WRAPUP.md) for the close-out snapshot.

**Delivered:** workspace + UI theme tokens; hub components and screen refactors; FieldInput/Sheet/OptionChipGroup polish; BenderProfileCard + CustomBenderSheet; shared diagram ghost chrome (`diagramTheme.ghost`, callout empty messages); label-only bottom nav.

**Exit criteria met:** visual polish flows through shared tokens/components; calculator math unchanged; `npm run check` passes.

**Deferred:** bespoke ghost illustrations, full legacy-style purge, animations.

## Phase 3 — Field-native fraction keypad ✅ complete

See [`PHASE_3_WRAPUP.md`](PHASE_3_WRAPUP.md) for the close-out snapshot.

**Delivered:** `fractionKeypad` utility + tests; `FractionKeypad` UI; `FieldInput.lengthInput`; all six calculators + override/custom bender sheets on imperial fraction entry.

**Exit criteria met:** imperial fields use trade keypad; metric unchanged; parse/format utilities unchanged; `npm run check` passes.

## Phase 4 — Guide mode expansion ✅ complete

See [`PHASE_4_GUIDE_WRAPUP.md`](PHASE_4_GUIDE_WRAPUP.md) for the close-out snapshot.

**Delivered:** guide content module for all six calculators; Guide index + detail screens; contextual `guideRoute()` from calculator docks.

**Exit criteria met:** real apprentice content; guide separate from calculator results; per-calculator entry from dock; `npm run check` passes.

## Phase 5 — Bender database improvement ✅ complete

See [`PHASE_5_WRAPUP.md`](PHASE_5_WRAPUP.md) for the close-out snapshot.

**Delivered:** `BenderChartKind` profile model; profile chart helpers; detail sheet with full deduct table; override list/clear hub; grouped bender database; Edit Setup and Settings links.

**Exit criteria met:** chart inspection and override discoverability improved; no invented manufacturer data; `npm run check` passes.

## Phase 5.5 — QA, hardening, and documentation alignment ✅ complete

- **`npm run check`** verified (214 tests)
- Route files confirmed for all hub and calculator screens; `_layout.tsx` registers all stack routes
- Docs aligned: `APP_ARCHITECTURE`, `UI_WORKSPACE_LAYOUT`, `CURRENT_STATE`, phase wrap-ups
- **`KNOWN_ISSUES.md`** created — practical limitations and deferred scope

## Phase 6 — Future calculators (next)

- Kick, parallel offset, box offset, back-to-back 90, hydraulic layout — placeholders in `bendLibrary.ts`
- Follow [`FEATURE_TEMPLATE.md`](../FEATURE_TEMPLATE.md) and compose `BendCalculatorLayout` + engine + diagram
- Only when explicitly scoped; EMT only unless product direction changes

## How to use this roadmap

- Confirm phase before starting work. Update [`CURRENT_STATE.md`](CURRENT_STATE.md) when a phase completes or priorities shift.
- Layout and architecture changes belong in Phase 1 docs ([`APP_ARCHITECTURE.md`](APP_ARCHITECTURE.md), [`UI_WORKSPACE_LAYOUT.md`](UI_WORKSPACE_LAYOUT.md)).
