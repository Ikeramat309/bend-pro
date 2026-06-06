# Project Map

Where code lives today and where new code should go.

## Routes

Expo Router files in `src/app/` — keep them thin (export screens only).

| Route | File | Screen |
|-------|------|--------|
| `/` | `index.tsx` | `HomeScreen` |
| `/bends` | `bends.tsx` | `BendsScreen` |
| `/offset` | `offset.tsx` | `OffsetScreen` |
| `/stub90` | `stub90.tsx` | `Stub90Screen` |
| `/settings` | `settings.tsx` | `SettingsScreen` |
| `/bender-database` | `bender-database.tsx` | `BenderDatabaseScreen` |
| `/guide` | `guide.tsx` | `GuideScreen` |

## Calculator Features

Each calculator is self-contained under `src/features/`.

```
bend-offset/
  offset.config.ts, offset.copy.ts
  engine/offset.engine.ts, offset.types.ts
  ui/OffsetScreen.tsx, OffsetDiagram.tsx

bend-stub90/
  stub90.config.ts, stub90.copy.ts
  engine/stub90.engine.ts, stub90.types.ts
  ui/Stub90Screen.tsx, Stub90Diagram.tsx
```

## Shared UI

| Layer | Path | Purpose |
|-------|------|---------|
| App shell | `src/shared/ui/` | AppHeader, AppScreen, BottomNav, Sheet, FieldInput |
| Workspace | `src/shared/workspace/` | SetupSummary, PipeWorkspaceCard, MeasurementChip, EditSetupSheet, AngleSelector |
| Diagrams | `src/shared/diagrams/` | PipeSegment, MarkLine, DimensionLine, DiagramLabel, diagramTheme |

## Data

| Data | Path |
|------|------|
| EMT sizes | `src/data/emt/` |
| Conduit types (EMT only) | `src/data/conduit/` |
| Bender profiles | `src/data/benders/` |
| Bend library nav | `src/data/bendLibrary.ts` |

## Core & Utils

| Layer | Path |
|-------|------|
| Shared types | `src/core/types.ts` |
| Theme tokens | `src/theme/` |
| Formatting helpers | `src/utils/rounding.ts`, `units.ts`, `validation.ts` |

## Hub Screens

Non-calculator screens live in `src/screens/` and are wired through `src/app/`.
