# Bend Offset Feature

Two-bend offset calculator — mirrors the Stub 90 architecture pattern.

## Route

`/offset` → `src/app/offset.tsx` → `ui/OffsetScreen.tsx`

## Structure

```
bend-offset/
  offset.config.ts    — defaults and valid angles
  offset.copy.ts      — user-facing labels and messages
  engine/
    offset.engine.ts  — pure calculation
    offset.types.ts   — input/result/diagram contracts
  ui/
    OffsetScreen.tsx  — screen state and layout
    OffsetDiagram.tsx — feature diagram (shared SVG primitives)
```

## Wording

**UI labels:** Offset Height, Bend Angle, Distance Between Bends, Shrink, Mark 1, Mark 2

**Engine keys (internal):** `offsetHeight`, `distanceBetweenBends`, `firstMark` → `mark1`, `secondMark` → `mark2`

## Shared components used

- `@/shared/ui`: AppHeader, AppScreen, FieldInput, Sheet
- `@/shared/workspace`: SetupSummary, PipeWorkspaceCard, MeasurementChip, EditSetupSheet, AngleSelector
- `@/shared/diagrams`: PipeSegment, MarkLine, DimensionLine, DiagramLabel
