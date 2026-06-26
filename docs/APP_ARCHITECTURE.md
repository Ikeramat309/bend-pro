# App Architecture

Part of the [documentation index](README.md). Entry point: [`AGENTS.md`](../AGENTS.md).

Bend Pro uses thin routes, self-contained calculator features, and shared UI/diagram/workspace layers. Related: [`PROJECT_MAP.md`](PROJECT_MAP.md), [`UI_WORKSPACE_LAYOUT.md`](UI_WORKSPACE_LAYOUT.md), [`CALCULATOR_RULES.md`](CALCULATOR_RULES.md), [`DIAGRAM_SYSTEM.md`](DIAGRAM_SYSTEM.md).

## Flow

```text
App shell (src/app/)
  -> Hub screens (src/screens/) or calculator features (src/features/)
  -> BendCalculatorLayout (src/shared/workspace/)
  -> Shared UI (src/shared/ui/)
  -> Shared diagrams (src/shared/diagrams/)
  -> Data (src/data/) + core (src/core/)
```

## Routes

Route files in `src/app/` export screens only — no calculator math.

| Route | Screen |
|-------|--------|
| `/offset` | `src/features/bend-offset/ui/OffsetScreen.tsx` |
| `/stub90` | `src/features/bend-stub90/ui/Stub90Screen.tsx` |
| `/saddle3` | `src/features/bend-saddle3/ui/Saddle3Screen.tsx` |
| `/saddle4` | `src/features/bend-saddle4/ui/Saddle4Screen.tsx` |
| `/segment` | `src/features/bend-segment/ui/SegmentScreen.tsx` |
| `/rolling` | `src/features/bend-rolling/ui/RollingScreen.tsx` |
| `/bends` | `src/screens/BendsScreen.tsx` |
| `/settings` | Settings hub |
| `/bender-database` | Bender profile management |
| `/guide` | Guide index + per-calculator walkthroughs (`src/screens/GuideScreen.tsx`, `src/data/guide/`) |

## `src/features` — calculator modules

Each bend type is a **self-contained feature folder** (`bend-offset`, `bend-stub90`, etc.):

| Layer | Role |
|-------|------|
| `engine/*.engine.ts` | Pure math, validation, warnings, `diagramData` |
| `engine/*.types.ts` | Input/output contracts |
| `*.config.ts` | Defaults, valid angles/presets |
| `*.copy.ts` | User-facing strings (terminology from glossary) |
| `ui/*Screen.tsx` | Input state, setup hook, **`BendCalculatorLayout` composition** |
| `ui/*Diagram.tsx` | SVG diagram from engine `diagramData` |

**Rules:** features do not import from other features. Shared types from `@/core/types`. Screens call `useCalculatorSetup()` — they do not duplicate persisted setup state.

**Engine vs UI:** all bend formulas, unit conversion to internal inches, and rounding for display strings live in **engine**. UI parses text input, passes numbers to engine, and maps results to layout props and diagram props. Never change math in UI files.

## `src/shared/workspace` — calculator screen shell

Universal calculator chrome (Phase 1 foundation):

- **`BendCalculatorLayout`** — orchestrates header, trust, inputs, workspace, dock, warnings
- **`BendHeader`** — compact back + title + EMT subtitle
- **`BendTrustStrip`** — bender name, meta, trust note, edit setup
- **`BendInputStrip`** — declarative `BendInputConfig[]` or custom children
- **`BendPipeWorkspace`** — hero diagram + compact result strip below (primary + up to two secondary chips)
- **`BendActionDock`** — adaptive left actions + Guide (right)
- **`workspaceTypes.ts`** — prop contracts

Supporting pieces still used by layout or sheets: `EditSetupSheet`, `AngleSelector`, `OptionalFieldButton`, `OptionalInputSummary`, `MeasurementChip`, `WarningList`. Legacy `SetupSummary` / `PipeWorkspaceResult` remain exported but calculators should use the new shell.

See [`UI_WORKSPACE_LAYOUT.md`](UI_WORKSPACE_LAYOUT.md) for result priority and dock rules.

## `src/shared/diagrams` — reusable SVG primitives

Shared drawing blocks for all calculator diagrams:

- `DiagramCanvas`, `DiagramDefs`, `diagramTheme`
- `PipeSegment`, `MarkLine`, `DimensionLine`, `DiagramLabel`, `DiagramCallout`, `BendRadiusZone`, `DiagramLeaderLine`
- `resolveProportionalSpans` — semi-proportional scaling with readability clamps

Feature `*Diagram.tsx` files compose these primitives; they do not fork low-level SVG helpers.

## `src/shared/ui` — app-wide UI

Shell components for hubs and modals: `AppHeader`, `AppScreen`, `BottomNav`, `Sheet`, `FieldInput`, `FractionKeypad`, `OptionChipGroup`, hub building blocks (`HubNavCard`, `HubListRow`, `HubSearchField`, `HubSettingsCard`, `HubStatusBadge`, etc.), **`BenderProfileCard`**, **`SetupOverridesCard`**, **`GuideSectionCard`**. Sheet helpers: `SheetFormGroup`, `SheetDangerAction`. Styling tokens live in `src/theme/uiTheme.ts`.

Imperial length fields use `FieldInput.lengthInput="imperial"` to open **`LengthInputSheet`** (bottom sheet with tape-measure step controls, optional tape ruler, `FractionKeypad` + `applyFractionKey` in `src/utils/fractionKeypad.ts`, and `lengthAdjustment.ts` helpers). Metric fields keep inline decimal entry. Optional mark/center fields on Offset and Saddles open from dock actions via the same sheet.

## Bender / profile data

- **`src/data/benders/`** — built-in hand-bender profiles, stub 90 deduct tables, `getBenderProfile`, custom profile helpers, **`benderResolution.ts`** (override precedence, no invented deducts), **`profileChart.ts`** (chart rows, capabilities), **`BenderChartKind`** (canonical chart source: generic, custom-measured, manufacturer)
- **`src/screens/BenderProfileDetailSheet.tsx`** — full deduct table and profile capabilities
- **`src/core/settings/setupOverrides.ts`** — list/clear manual deduct, multiplier, and shrink overrides
- **`src/data/conduit/`**, **`src/data/emt/`** — EMT trade sizes (EMT only for now)
- **`src/data/bendLibrary.ts`** — thin re-export of Bends hub groups from the calculator registry
- **`src/core/calculators/`** — **calculator registry** (source of truth for ids, routes, status, guide links, hub visibility)
- **`src/core/settings/`** — persisted setup (unit, rounding, size, active bender, overrides, custom profiles); hydration via `SettingsProvider` (`isHydrated`, `patchSetup`, `replaceSetup`)

Trust strip on calculator screens reads active profile from setup; Edit Setup sheet writes back via `patchCalculatorSetup`. Edit Setup and Settings link to the bender database; **`SetupOverridesCard`** surfaces active overrides on Benders and Settings.

## Guide content

- **`src/data/guide/`** — static walkthroughs (formula, steps, mistakes, example) for all six calculators
- **`guideRoute(calculatorId)`** — calculator dock Guide opens contextual detail; bottom nav Guide opens index

## Calculator registry

**`src/core/calculators/`** is the source of truth for calculator identity and navigation metadata:

- Stable ids (`offset`, `stub90`, `saddle3`, …)
- Title, category, route, guide id, status (`active` | `planned` | `hidden`)
- Conduit support, tags, sort order, Bends/Home visibility

**All new calculators and field tools must be added to the registry first** — then wire routes, guides, and feature folders from that entry. Do not hand-maintain parallel lists in `bendLibrary.ts` or screen-level title maps.

Helpers: `getCalculatorRoute(id)`, `getBendsScreenFamilies()`. Route path strings: `calculatorRoutes.ts` (`CALCULATOR_ROUTE_PATHS`) — navigation spreads these into `Routes`; core must not import navigation. Tests in `calculatorRegistry.test.ts` and `architectureGuardrails.test.ts` guard duplicate ids, missing routes, guide consistency, feature isolation, and import cycles.

`src/data/bendLibrary.ts` re-exports Bends hub groups from the registry for backward compatibility.

## Calculation result contract

**`src/core/calculations/`** defines the shared result envelope (`CalculationResult`) for saved layouts, export, field steps, and future tooling. Engines keep their native result types; feature adapters map engine output into the contract:

| Calculator | Adapter |
|------------|---------|
| Offset | `toOffsetCalculationResult()` |
| Stub 90 | `toStub90CalculationResult()` |
| Rolling Offset | `toRollingCalculationResult()` |
| 3-Point Saddle | `toSaddle3CalculationResult()` |
| 4-Point Saddle | `toSaddle4CalculationResult()` |
| Segment Bend | `toSegmentCalculationResult()` |

All adapters live under `src/features/bend-*/engine/*CalculationResult.ts`. Calculator screens call adapters for recent-layout persistence; UI layout is unchanged.

## Input snapshots

Each active calculator has typed JSON-safe input snapshot helpers under `src/features/bend-*/engine/*InputSnapshot.ts`:

- `create*InputSnapshot()` — from engine input (calculator fields only; setup lives in `setupSnapshot`)
- `sanitize*InputSnapshot()` — safe restore from storage
- `toStoredInputSnapshot()` — converts to `CalculatorInputSnapshot` for sessions

## Sessions and recent layouts

**`src/core/sessions/`** stores calculator sessions and recent layouts (AsyncStorage, schema-versioned JSON).

- `usePersistRecentLayout()` — debounced save on valid/warning results (wired on all active calculator screens)
- `useRestoreRecentLayout()` — restores inputs when opened with `?layoutId=` from Home
- `upsertRecentLayoutForCalculator()` — one recent entry per calculator id
- `resolveContinueLayoutCandidate()` + `continueLayoutRoute()` — Home Continue hydration and navigation

## Verification

```bash
npm run check        # tsc + lint + import cycles + jest
npx expo start       # route compilation
```

Import-cycle scan: `npm run check:cycles` (`scripts/check-import-cycles.mjs`). Architecture guardrail tests: `src/core/architecture/architectureGuardrails.test.ts`. Full rules: [`ARCHITECTURE_GUARDRAILS.md`](ARCHITECTURE_GUARDRAILS.md).
