# Project Map

Part of the [documentation index](README.md). Entry point: [`AGENTS.md`](../AGENTS.md).

Where code lives today and where new code should go. For layering rules see [`APP_ARCHITECTURE.md`](APP_ARCHITECTURE.md); for editing rules see [`AI_AGENT_WORKFLOW.md`](AI_AGENT_WORKFLOW.md).

## Routes

Expo Router files in `src/app/` — keep them thin (export screens only).

| Route | File | Screen |
|-------|------|--------|
| `/` | `index.tsx` | `HomeScreen` |
| `/bends` | `bends.tsx` | `BendsScreen` |
| `/offset` | `offset.tsx` | `OffsetScreen` |
| `/stub90` | `stub90.tsx` | `Stub90Screen` |
| `/saddle3` | `saddle3.tsx` | `Saddle3Screen` |
| `/saddle4` | `saddle4.tsx` | `Saddle4Screen` |
| `/segment` | `segment.tsx` | `SegmentScreen` |
| `/rolling` | `rolling.tsx` | `RollingScreen` |
| `/settings` | `settings.tsx` | `SettingsScreen` |
| `/bender-database` | `bender-database.tsx` | `BenderDatabaseScreen` |
| `/guide` | `guide.tsx` | `GuideScreen` |

## Calculator Features

Each calculator is self-contained under `src/features/`.

```
bend-offset/
  offset.config.ts, offset.copy.ts
  engine/offset.engine.ts, offset.types.ts, offsetAngleData.ts
  ui/OffsetScreen.tsx, OffsetDiagram.tsx, MultiplierOverrideSheet.tsx, ShrinkOverrideSheet.tsx

bend-stub90/
  stub90.config.ts, stub90.copy.ts
  engine/stub90.engine.ts, stub90.types.ts
  ui/Stub90Screen.tsx, Stub90Diagram.tsx, DeductOverrideSheet.tsx

bend-saddle3/
  saddle3.config.ts, saddle3.copy.ts
  engine/saddle3.engine.ts, saddle3.types.ts, saddle3AngleData.ts
  ui/Saddle3Screen.tsx, Saddle3Diagram.tsx

bend-saddle4/
  saddle4.config.ts, saddle4.copy.ts
  engine/saddle4.engine.ts, saddle4.types.ts, saddle4AngleData.ts
  ui/Saddle4Screen.tsx, Saddle4Diagram.tsx

bend-segment/
  segment.config.ts, segment.copy.ts
  engine/segment.engine.ts, segment.types.ts
  ui/SegmentScreen.tsx, SegmentDiagram.tsx

bend-rolling/
  rolling.config.ts, rolling.copy.ts
  engine/rolling.engine.ts, rolling.types.ts, rollingAngleData.ts
  ui/RollingScreen.tsx, RollingDiagram.tsx, MultiplierOverrideSheet.tsx, ShrinkOverrideSheet.tsx
```

## Shared UI

| Layer | Path | Purpose |
|-------|------|---------|
| App shell | `src/shared/ui/` | AppHeader, AppScreen, BottomNav, Sheet, FieldInput, OptionChipGroup |
| Workspace | `src/shared/workspace/` | SetupSummary, BenderProfileContext, PipeWorkspaceCard, MeasurementChip, EditSetupSheet, AngleSelector |
| Diagrams | `src/shared/diagrams/` | PipeSegment, MarkLine, DimensionLine, DiagramLabel, DiagramCallout, BendRadiusZone, DiagramLeaderLine, proportions helper, diagramTheme |

## Data

| Data | Path |
|------|------|
| EMT sizes | `src/data/emt/` |
| Conduit types (EMT only) | `src/data/conduit/` |
| Bender profiles (3 generic + custom, persisted in setup) | `src/data/benders/`, `src/screens/BenderDatabaseScreen.tsx`, `src/screens/CustomBenderSheet.tsx` |
| Bend library nav | `src/data/bendLibrary.ts` |

## Core & Utils

| Layer | Path |
|-------|------|
| Shared types | `src/core/types.ts` |
| Persisted calculator setup (unit, rounding, size, bender, manual overrides) | `src/core/settings/` |
| Theme tokens | `src/theme/` |
| Formatting/parsing helpers | `src/utils/rounding.ts`, `units.ts`, `formatLength.ts`, `parseLengthInput.ts` |

## Hub Screens

Non-calculator screens live in `src/screens/` and are wired through `src/app/`.
