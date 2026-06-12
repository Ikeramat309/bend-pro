# App Architecture

Part of the [documentation index](README.md). Entry point: [`AGENTS.md`](../AGENTS.md).

Bend Pro uses thin routes, self-contained calculator features, and shared UI/diagram layers. Related: [`PROJECT_MAP.md`](PROJECT_MAP.md) (folder layout), [`CALCULATOR_RULES.md`](CALCULATOR_RULES.md) (engine rules), [`DIAGRAM_SYSTEM.md`](DIAGRAM_SYSTEM.md) (diagram rules).

## Flow

```text
App shell (src/app/)
  -> Hub screens (src/screens/) or calculator features (src/features/)
  -> Shared UI (src/shared/ui/, src/shared/workspace/)
  -> Shared diagrams (src/shared/diagrams/)
  -> Data (src/data/) + core types (src/core/)
```

## Routes

Route files in `src/app/` export screens only — no calculator math.

- `/offset` → `src/features/bend-offset/ui/OffsetScreen.tsx`
- `/stub90` → `src/features/bend-stub90/ui/Stub90Screen.tsx`

## Calculator Features

Each feature owns:

- `*.config.ts` — defaults
- `*.copy.ts` — user-facing strings
- `engine/*.engine.ts` — pure math
- `engine/*.types.ts` — contracts
- `ui/*Screen.tsx` — layout and state
- `ui/*Diagram.tsx` — feature diagram

Features must not import from other feature folders. Shared types come from `@/core/types`.

Calculator setup (unit, rounding, trade size, bender profile) is shared app state: `@/core/settings` provides `SettingsProvider` (mounted in `src/app/_layout.tsx`, persisted via AsyncStorage) and the `useCalculatorSetup` hook. Screens must not keep their own copies of these values.

## Shared UI

- **`src/shared/ui/`** — app shell (header, screen, nav, sheet, field input)
- **`src/shared/workspace/`** — calculator workspace chunks (setup, pipe card, chips, setup sheet)
- **`src/shared/diagrams/`** — reusable SVG primitives and diagram theme

## Data

- **EMT only** — `src/data/emt/`, `src/data/conduit/`
- **Benders** — `src/data/benders/` (one generic hand bender profile today)
- **Bend library** — `src/data/bendLibrary.ts` (navigation metadata)

## Calculator Registry

Not implemented yet. Availability is defined by `bendLibrary.ts` and `src/navigation/routes.ts`.
