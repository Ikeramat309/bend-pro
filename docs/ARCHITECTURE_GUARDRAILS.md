# Architecture Guardrails

Part of the [documentation index](README.md). Entry point: [`AGENTS.md`](../AGENTS.md).

This document explains **where code belongs**, **what imports are forbidden**, and **how to extend the app** without architecture decay. It complements [`APP_ARCHITECTURE.md`](APP_ARCHITECTURE.md) (layer overview) and [`AI_AGENT_WORKFLOW.md`](AI_AGENT_WORKFLOW.md) (edit rules).

Automated checks enforce many of these rules — see [Verification](#verification).

## Layer map

```text
src/app/              thin Expo Router exports (no math)
src/screens/          hub screens (Bends, Home, Settings, Guide, Bender DB)
src/features/bend-*/  one folder per calculator — isolated from each other
  engine/             pure bending math + diagramData (no React)
  ui/                 screens, diagrams, override sheets
  *.config.ts         defaults, valid angles/presets
  *.copy.ts           user-facing strings
src/shared/ui/        reusable app shell (headers, sheets, fields)
src/shared/workspace/ BendCalculatorLayout and calculator chrome
src/shared/diagrams/ SVG primitives and diagram theme
src/core/             cross-cutting logic with no UI
  calculators/        registry + route path constants (metadata source of truth)
  measurements/       MM_PER_INCH, unit conversion to canonical inches
  validation/         strict decimal/length parsing
  settings/           persisted setup + hydration
  architecture/       import-cycle test helpers (Jest only)
src/data/             static datasets (EMT sizes, benders, guide walkthroughs)
src/navigation/       Routes object (spreads core route paths)
src/utils/            formatting helpers (prefer core for parsing/conversion)
```

## Where things belong

### Calculator metadata (ids, titles, routes, hub visibility)

**Source of truth:** `src/core/calculators/calculatorRegistry.ts`

Register every calculator here first. The registry owns:

- Stable id (`offset`, `stub90`, …)
- Title, category, description, tags, sort order
- Status (`active` | `planned` | `hidden`)
- Route (for active calculators)
- Guide id link
- Bends/Home visibility flags

**Route path strings** live in `src/core/calculators/calculatorRoutes.ts` — not in `src/navigation/routes.ts`. Navigation spreads those paths into `Routes`; it does not define calculator paths independently.

**Do not duplicate** calculator lists in:

- `src/data/bendLibrary.ts` (re-export only)
- `src/screens/BendsScreen.tsx` (use `getCalculatorRoute`, `getBendsScreenFamilies`)
- Hub screens or route files (no title → route maps)

Tests: `calculatorRegistry.test.ts`, `architectureGuardrails.test.ts`.

### Bending math

**Location:** `src/features/bend-<name>/engine/*.engine.ts`

Engines are pure functions: typed input in, result + `diagramData` out. No React, no hooks, no navigation, no feature UI imports.

Engines may import:

- `@/core/measurements` — `toCanonicalInches`, constants
- `@/core/validation` — parsing helpers when needed in engine tests
- `@/core/types`, `@/data/benders/`, `@/data/emt/`
- Same-feature `*.types.ts`, angle data, config

Engines must **not** import React, Expo Router, `@/shared/ui`, `@/shared/workspace`, or other features.

Formula headers and worked examples are required — see [`CALCULATOR_RULES.md`](CALCULATOR_RULES.md).

### Unit conversion and length parsing

**Canonical internal unit:** inches (fraction-friendly).

| Concern | Location |
|---------|----------|
| `MM_PER_INCH`, conversion constants | `src/core/measurements/constants.ts` |
| Display ↔ canonical conversion | `src/core/measurements/conversion.ts` |
| Strict decimal parsing | `src/core/validation/parseDecimal.ts` |
| Length input → canonical inches | `src/core/measurements/parseLengthInput.ts` |

Do **not** define `MM_PER_INCH` or duplicate conversion logic in features, utils, or UI. Legacy `src/utils/parseLengthInput.ts` re-exports from core for backward compatibility — new code imports `@/core/measurements` directly.

Override sheets and hub forms use strict parsing so invalid strings like `"2abc"` are rejected without changing valid numeric results.

### Guide content

**Walkthrough content:** `src/data/guide/calculatorGuides.ts`

Guides hold formula explanations, steps, mistakes, and examples. They are **content**, not navigation metadata.

**Linking:** registry entries set `guideId`; `guideRoute(calculatorId)` in `src/navigation/routes.ts` opens contextual guide from calculator dock.

Guide ids must match registry `guideId` values. Tests in `calculatorRegistry.test.ts` and `architectureGuardrails.test.ts` enforce alignment.

Guide titles may differ slightly from registry titles for readability — but ids and calculator association must stay in sync.

### Bender database entries

**Built-in profiles:** `src/data/benders/` (e.g. `genericHandBender.ts`, `handBenderCompact.ts`)

**Resolution and overrides:** `src/data/benders/benderResolution.ts`, `src/core/settings/setupOverrides.ts`

**Defaults shared by engines:** `src/data/benders/benderDefaults.ts`

To add a **generic** built-in profile:

1. Add profile data in `src/data/benders/` following existing `BenderSourceType` patterns (`generic`, not `verified` unless manufacturer-sourced).
2. Register in `src/data/benders/index.ts` / profile list used by the bender database screen.
3. Add tests in `benders.test.ts` or colocated `*.test.ts`.
4. Do **not** add manufacturer-verified chart data without an explicit product task.

Custom profiles are user-created and persisted via settings — see `customBenders.ts`.

### Diagram layout vs math

- **Math and mark positions:** engine `diagramData`
- **Proportional layout helpers:** `src/features/bend-*/diagram/*DiagramGeometry.ts` (when extracted) or inline in `*Diagram.tsx` using `@/shared/diagrams` primitives
- **Never** compute bend formulas in diagram components — only map `diagramData` to SVG

## Import rules

### Allowed dependency direction

```text
app / screens  →  features / shared / navigation / core / data
features       →  shared / core / data / utils (not other features)
shared         →  core / theme / utils (not features)
core           →  core / data (not features, not shared UI, not navigation*)
navigation     →  core (route paths + types only)
data           →  core types (avoid importing navigation or features)
```

\* `src/core/calculators/` must not import `@/navigation` — that caused a registry → navigation → guide → registry cycle. Route paths live in `calculatorRoutes.ts` instead.

### Forbidden imports (enforced by tests where noted)

| From | Must not import |
|------|-----------------|
| `features/bend-*/` | Other `features/bend-*/` modules |
| `features/*/engine/` | `react`, `react-native`, `expo-router`, `@/shared/ui`, `@/shared/workspace`, other features |
| Any file | Circular dependency chains under `src/` |
| Screens / data | Hand-maintained calculator id lists duplicating the registry |

### Prefer specific imports in hot paths

- Core registry types: `@/core/calculators/calculatorRegistry` or `@/core/calculators`
- Measurements: `@/core/measurements`
- Avoid pulling navigation into core or engine code

## How to add a new calculator

Only when a task explicitly requests it. Follow [`FEATURE_TEMPLATE.md`](FEATURE_TEMPLATE.md).

1. **Registry** — add entry in `calculatorRegistry.ts` (`REGISTRY_SOURCE`); add route path in `calculatorRoutes.ts` if `status: 'active'`.
2. **Route** — add thin `src/app/<name>.tsx` exporting the feature screen.
3. **Feature folder** — `src/features/bend-<name>/` with engine, types, config, copy, ui, README.
4. **Guide** — add walkthrough in `calculatorGuides.ts`; set matching `guideId` on registry entry.
5. **Tests** — engine unit tests + registry tests; run `npm run check`.
6. **Docs** — update feature README; update `PROJECT_MAP.md` / `CURRENT_STATE.md` if shipping.

Do not add parallel metadata in `bendLibrary.ts` or screen-level routing maps.

## What AI agents should avoid changing

Unless the task explicitly requires it:

- **Calculator formulas, constants, or rounding** in engines
- **Registry ids or routes** without updating routes, app files, guides, and tests together
- **Navigation structure** or hub layout redesign
- **Import direction** (e.g. core importing navigation or features)
- **Duplicating** `MM_PER_INCH`, calculator lists, or route maps outside the registry
- **Cross-feature imports** “for convenience”
- **Manufacturer bender chart data** without verified sourcing workflow
- **Broad refactors** of shared UI when fixing a single calculator

Safe, encouraged changes:

- Colocated tests for engines and guardrails
- Extracting diagram geometry from `*Diagram.tsx` without changing math output
- Strict parsing that rejects invalid input strings
- Documentation and guardrail tests

## Verification

```bash
npm run check          # typecheck + lint + import cycles + jest
npm run check:cycles   # scripts/check-import-cycles.mjs only
npm test -- architectureGuardrails
npm test -- calculatorRegistry
```

Guardrail tests live in:

- `src/core/architecture/architectureGuardrails.test.ts` — feature isolation, engine purity, constant duplication, cycles, hub routing
- `src/core/calculators/calculatorRegistry.test.ts` — registry integrity and guide alignment
- `scripts/check-import-cycles.mjs` — standalone cycle scan (also run as part of `npm run check`)

## Known acceptable duplication (manual review)

| Area | Notes |
|------|-------|
| Guide titles vs registry titles | Content vs nav metadata — ids must match, wording may differ |
| `Routes` vs `CALCULATOR_ROUTE_PATHS` | Navigation adds hub routes; calculator paths originate in core |
| `src/utils/*` re-exports | Legacy paths; prefer `@/core/measurements` in new code |
| Diagram geometry not yet extracted | Offset and Saddle3 have geometry modules; others may still inline layout math that is **visual only** |

## Related docs

- [`APP_ARCHITECTURE.md`](APP_ARCHITECTURE.md) — layer overview
- [`CALCULATOR_RULES.md`](CALCULATOR_RULES.md) — engine/UI separation
- [`TESTING.md`](TESTING.md) — colocated test conventions
- [`PROJECT_MAP.md`](PROJECT_MAP.md) — file locations
