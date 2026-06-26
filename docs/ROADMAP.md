# Bend Pro Roadmap

Part of the [documentation index](README.md). Entry point: [`AGENTS.md`](../AGENTS.md).

Phased plan after the initial calculator build-out. **Do not expand scope** into a later phase unless a task explicitly asks for it.

Historical phase close-outs live in [`archive/`](archive/). The roadmap below is the **current product sequence**.

## Phase 1 — Calculator workspace foundation ✅ complete

- Shared layout shell: `BendCalculatorLayout` and siblings
- All six calculators on the shared contract; Guide in the dock
- [`UI_WORKSPACE_LAYOUT.md`](UI_WORKSPACE_LAYOUT.md)
- `npm run check` script

## Phase 2 — Visual UI polish ✅ complete

See [`archive/PHASE_2_WRAPUP.md`](archive/PHASE_2_WRAPUP.md).

Hub components, theme tokens, diagram ghost chrome, label-only bottom nav.

## Phase 3 — Field-native fraction keypad ✅ complete

See [`archive/PHASE_3_WRAPUP.md`](archive/PHASE_3_WRAPUP.md).

`fractionKeypad` utility, `FractionKeypad` UI, `FieldInput.lengthInput`.

## Phase 4 — Guide mode ✅ complete

See [`archive/PHASE_4_GUIDE_WRAPUP.md`](archive/PHASE_4_GUIDE_WRAPUP.md).

Guide content for all six calculators; index + contextual `guideRoute()`.

## Phase 5 — Bender database improvement ✅ complete

See [`archive/PHASE_5_WRAPUP.md`](archive/PHASE_5_WRAPUP.md).

Profile chart kinds, detail sheet, override hub, grouped database.

## Phase 5.5 — QA and documentation alignment ✅ complete

- `npm run check` verified; all routes registered in `_layout.tsx`
- [`KNOWN_ISSUES.md`](KNOWN_ISSUES.md) created

## Phase 5.6 — Calculator screen usability ✅ complete

- Imperial `LengthInputSheet` (keypad off input strip)
- Compact result strip in `BendPipeWorkspace`
- Saddle fake Center Mark result cards removed

## Phase 5.7 — Diagram recovery and input refinement ✅ complete

- Pipe workspace flex chain fixed (diagram no longer collapses at large offsets)
- `LengthInputSheet`: Cancel/Done, step buttons, tape ruler; single Done action
- Optional Mark 1 / center distance via dock + `OptionalInputSummary` chips

## Phase 5.8 — Cleanup and stability checkpoint ✅ complete

- `npm run check` fully passing (typecheck, lint, 395 tests)
- ESLint ignores `.expo/`; lint cache moved out of Expo cache dir
- Docs audit; phase wrap-ups archived; [`CLEANUP_REPORT.md`](CLEANUP_REPORT.md)

## Phase 5.9 — Calculator UI polish ✅ complete

See [`PHASE_5_9_POLISH.md`](PHASE_5_9_POLISH.md).

**Delivered:** tighter workspace tokens; consistent diagram scaling via `DiagramSvg`; compact warnings/results/dock; LengthInputSheet layout polish; Rolling Mark 1 optional input aligned with Offset/Saddles.

## Phase 6 — Field validation prep ✅ complete (docs)

Beta prep for real electricians — no new calculators, no debug/export screen.

- [`FIELD_VALIDATION.md`](FIELD_VALIDATION.md) — validation matrix (calculator × size × angle → expected marks), **field validated** definition, offline + persistence verification steps
- [`FIELD_VALIDATION_TEST_SHEET.md`](FIELD_VALIDATION_TEST_SHEET.md) — printable tester case sheet

**Next:** run field sessions and move matrix rows from App-verified → Field validated.

## Phase 7 — Future calculators (not started)

Kick, parallel offset, box offset, back-to-back 90, hydraulic layout — registered as `planned` in `src/core/calculators/` (visible on Bends hub as Coming Soon).

Follow [`FEATURE_TEMPLATE.md`](FEATURE_TEMPLATE.md). EMT only unless product direction changes. **Do not start without explicit scope.**

## How to use this roadmap

Confirm phase before starting work. Update [`CURRENT_STATE.md`](CURRENT_STATE.md) when a phase completes or priorities shift.
