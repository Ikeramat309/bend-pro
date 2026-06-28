# Bend Pro Current State

Part of the [documentation index](README.md). **For current work and the full plan, read [`HANDOFF.md`](HANDOFF.md) first.**

Honest snapshot of where the app stands. Six calculators ship on the shared workspace shell; the calculator math is desk-validated and the app is in a **UI redesign** (continuous-surface, light/dark, steel-tube diagrams) heading toward field beta. See [`HANDOFF.md`](HANDOFF.md), [`KNOWN_ISSUES.md`](KNOWN_ISSUES.md), and [`TRUST_MODEL.md`](TRUST_MODEL.md).

## UI redesign status

The app is mid-redesign toward the locked direction in [`HANDOFF.md` §4](HANDOFF.md): one continuous surface (no cards), horizontal steel-**tube** pipe drawn naturally per calculator, orange marks, green bend zones, one blue accent, a big centered hero result, quiet borderless inputs, and **dark + light** themes (Settings → Appearance). Theme foundation, hub theming, theme-aware diagrams, continuous-surface shell, and the hero result have landed; remaining work is the final polish pass (overlaps, sheet theming, light-mode contrast) — see [`HANDOFF.md` §5](HANDOFF.md).

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

### Calculator registry

- **`src/core/calculators/`** — single source of truth for calculator ids, routes, Bends hub grouping, and home metadata
- **`getBendsScreenFamilies()`**, **`getCalculatorRoute()`**, **`getCalculatorById()`** — Bends hub and navigation consume registry helpers
- Planned calculators (Kick, parallel offset, etc.) registered with `status: 'planned'`; they appear on Bends as Coming Soon but have no routes

### Recent layouts

- **`src/core/sessions/`** — AsyncStorage-backed recent-layout service with unit tests
- **All six calculator screens** persist via `usePersistRecentLayout` and restore via `useRestoreRecentLayout` when opened with `?layoutId=`
- **Home Continue Layout** hydrates recents on focus (`loadRecentLayouts` + `resolveContinueLayoutCandidate`) and navigates to the stored calculator with layout id

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
- **`npm run check`** — typecheck + lint + import-cycle scan + tests; ~**401 tests** passing (38 suites) — verify on pickup

### Field validation prep (Phase 6 docs)

- [`FIELD_VALIDATION.md`](FIELD_VALIDATION.md) — matrix, **field validated** definition, offline + restart persistence steps
- [`FIELD_VALIDATION_TEST_SHEET.md`](FIELD_VALIDATION_TEST_SHEET.md) — printable cases for electricians
- **Not done yet:** physical field sessions; matrix rows remain **App-verified** until testers sign off

## Known limitations

See [`KNOWN_ISSUES.md`](KNOWN_ISSUES.md) for the full list. Summary:

- **Dock “Set Mark” actions** — workflow hints; no field focus/measurement capture
- **Saddles** — no manual multiplier/shrink overrides (Offset has them)
- **Segment bend** — geometric model only; no spring-back
- **Rolling offset** — no 3D bender-head rotation model
- **Bender charts** — generic field-reference values only; manufacturer shoe charts deferred until sourced data exists
- **Fraction keypad** — no decimal point key; mixed-number and quick-fraction entry only; imperial editing uses a bottom sheet so the pipe workspace stays visible
- **Home Continue Layout** — hidden until a recent layout exists; opens the last saved calculation with inputs restored
- **Bender profile vs math** — profile selection changes Stub 90 deduct only; other calculators show the profile in the trust strip but use generic angle tables (see [`TRUST_MODEL.md`](TRUST_MODEL.md))

## Next development priorities

1. **Field validation sessions** — use [`FIELD_VALIDATION.md`](FIELD_VALIDATION.md) and the [test sheet](FIELD_VALIDATION_TEST_SHEET.md); record pass/fail on reference cases
2. **Phase 7** — additional calculators (Kick, etc.) only when explicitly scoped

## Known risk areas

- **Terminology** — [`GLOSSARY.md`](GLOSSARY.md), [`NAMING_RULES.md`](NAMING_RULES.md)
- **Math changes** — [`CALCULATOR_RULES.md`](CALCULATOR_RULES.md); engines only
- **Layout changes** — keep the pipe workspace the hero; follow the locked UI direction in [`HANDOFF.md`](HANDOFF.md) §4

See [`HANDOFF.md`](HANDOFF.md) and [`APP_ARCHITECTURE.md`](APP_ARCHITECTURE.md).
