# Bend Pro Current State

Part of the [documentation index](README.md). Entry point: [`AGENTS.md`](../AGENTS.md).

Honest snapshot of where the app stands. **Phases 1–5 complete; Phases 5.6–5.8 delivered usability fixes, diagram recovery, and a stability checkpoint.** Six calculators ship on the shared workspace shell. See [`KNOWN_ISSUES.md`](KNOWN_ISSUES.md), [`ROADMAP.md`](ROADMAP.md), [`UI_WORKSPACE_LAYOUT.md`](UI_WORKSPACE_LAYOUT.md), and [`CLEANUP_REPORT.md`](CLEANUP_REPORT.md).

## What currently exists

### Working calculators

All six use the **shared `BendCalculatorLayout`** shell (`src/shared/workspace/`). Math is unchanged in feature `engine/` folders.

- **Offset** (`/offset`) — offset height + bend angle → distance between bends, shrink, optional Mark 1 / Mark 2. Mark 1 opens from **Set First Mark** dock action (compact chip when set). Primary floating result: distance between bends. Secondary: shrink + multiplier (tappable overrides). Dock: Reset · Set First Mark · Guide.
- **Stub 90** (`/stub90`) — stub length − deduct → deduct mark, optional leg. Primary: deduct mark. Secondary: deduct (tappable override). Dock: Reset · Set Mark · Guide.
- **3-Point Saddle** (`/saddle3`) — obstruction height + angle preset → between-bends spacing, shrink, layout marks. Primary swaps to center mark when distance-to-center is entered. Dock: Reset · Set Center · Guide.
- **4-Point Saddle** (`/saddle4`) — obstruction height (required), optional saddle width + distance to center, equal bend angle. Two-offset diagram. Dock: Reset · Set Center · Guide.
- **Segment Bend** (`/segment`) — radius + total angle + degrees-per-bend → shot spacing, bend count (developed length on diagram). Dock: Reset · Set Arc / Next Segment · Guide.
- **Rolling Offset** (`/rolling`) — offset height + roll → distance between bends, shrink. Shares offset multiplier/shrink overrides. Dock: Reset · Set First Mark / Set Roll · Guide.

Each feature: `*.config.ts`, `*.copy.ts`, `engine/`, `ui/` (screen + diagram). Semi-proportional diagrams use shared primitives in `src/shared/diagrams/`.

### Hub UI (Phase 2)

- **`src/theme/uiTheme.ts`** — hub cards, search, field shells, sheet, chip tokens
- **Hub components** (`src/shared/ui/Hub*.tsx`) — nav cards, list rows, search, settings cards, status badges
- **`BenderProfileCard`**, **`SheetFormGroup`**, **`SheetDangerAction`** — bender database and custom bender sheet
- Hub screens use shared components; bottom nav is label-only (no emoji icons)

### Guide mode (Phase 4)

- **`src/data/guide/`** — per-calculator walkthroughs (formula, field steps, common mistakes, worked example)
- **`GuideScreen`** — index grouped by bend family + detail view via `?calculator=` param
- **`guideRoute(id)`** — calculator Guide dock opens contextual section; bottom nav Guide opens index
- **`GuideSectionCard`** — shared content block for guide sections

### Field input (Phase 3 + 5.6)

- **`FractionKeypad`** + **`applyFractionKey`** — trade fraction entry for imperial measurements
- **`LengthInputSheet`** — bottom-sheet imperial editor (label, value, unit, quick step buttons, tape ruler, keypad, Cancel/Done); keeps keypad off the input strip
- **`OptionalInputSummary`** — compact chip for optional marks/center distance when a value is set
- **`FieldInput.lengthInput`** — `'imperial'` opens the length sheet on tap; `'decimal'` keeps system decimal pad inline
- All calculator length fields and bender deduct/shrink overrides wired through `getLengthInputMode()`

### Shared calculator workspace

- **`BendCalculatorLayout`** — universal shell: header, trust strip, input strip, hero pipe workspace, action dock
- **`BendHeader`**, **`BendTrustStrip`**, **`BendInputStrip`**, **`BendPipeWorkspace`**, **`BendActionDock`**
- **`workspaceTypes.ts`** + **`src/theme/workspaceTheme.ts`** — layout prop contracts and polish tokens
- **`DiagramFrame`**, **`DiagramGhostMessage`** (callout-backed empty prompts), **`diagramTheme.ghost`** tokens
- Compact calculator header; workflow action emphasis in dock; **compact result strip** below diagram (diagram remains hero; warnings stay compact below workspace)
- **Guide** in the bottom dock opens the full guide index; each calculator’s Guide action opens that bend’s walkthrough

### Bender profiles

- Three generic hand-bender profiles + custom profiles (stub 90 deducts); **`BenderChartKind`** tags chart source (manufacturer reserved for sourced data)
- **`BenderProfileDetailSheet`** — full stub 90 deduct table with override highlighting; **Chart ›** on profile cards
- **`SetupOverridesCard`** — lists and clears manual deduct / multiplier / shrink overrides (Benders hub + Settings)
- Bender database grouped **Built-in charts** / **Your benders**; Edit Setup and Settings link to manage benders
- Persisted overrides (deduct, multiplier, shrink); profile context in calculator trust strip **note**

### Working app shell

- Routes: `/`, `/bends`, `/offset`, `/stub90`, `/saddle3`, `/saddle4`, `/segment`, `/rolling`, `/settings`, `/bender-database`, `/guide`
- Hub screens: `src/screens/` (Home, Bends, Settings)
- Persisted setup: `src/core/settings/`
- Theme: `src/theme/`
- **`npm run check`** — typecheck + lint + tests; **220 tests** passing at Phase 5.8 checkpoint

## Known limitations

See [`KNOWN_ISSUES.md`](KNOWN_ISSUES.md) for the full list. Summary:

- **Dock “Set Mark” actions** — workflow hints; no field focus/measurement capture
- **Saddles** — no manual multiplier/shrink overrides (Offset has them)
- **Segment bend** — geometric model only; no spring-back
- **Rolling offset** — no 3D bender-head rotation model
- **Bender charts** — generic field-reference values only; manufacturer shoe charts deferred until sourced data exists
- **Fraction keypad** — no decimal point key; mixed-number and quick-fraction entry only; imperial editing uses a bottom sheet so the pipe workspace stays visible
- **Calculator registry** — not implemented; availability via `bendLibrary.ts` + `routes.ts`

## Next development priorities

1. **Phase 6** — additional calculators (Kick, etc.) only when explicitly scoped

## Known risk areas

- **Terminology** — [`GLOSSARY.md`](GLOSSARY.md), [`NAMING_RULES.md`](NAMING_RULES.md)
- **Math changes** — [`CALCULATOR_RULES.md`](CALCULATOR_RULES.md); engines only
- **Layout changes** — keep pipe workspace hero large; respect floating result limits in [`UI_WORKSPACE_LAYOUT.md`](UI_WORKSPACE_LAYOUT.md)

See [`ROADMAP.md`](ROADMAP.md) and [`APP_ARCHITECTURE.md`](APP_ARCHITECTURE.md).
