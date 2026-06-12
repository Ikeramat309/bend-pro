# Bend Stub 90 Feature

Model calculator for Bend Pro — copy this structure for Offset and future bends.

## Route

`/stub90` → `src/app/stub90.tsx` → `ui/Stub90Screen.tsx`

## Structure

```
bend-stub90/
  stub90.config.ts    — defaults and fixed values
  stub90.copy.ts      — user-facing labels and messages
  engine/
    stub90.engine.ts  — pure calculation
    stub90.types.ts   — input/result/diagram contracts
  ui/
    Stub90Screen.tsx  — screen state and layout
    Stub90Diagram.tsx — feature diagram (shared SVG primitives)
```

## Wording

**UI labels:** Stub Length, Deduct, Deduct Mark, Leg, Take-Up

**Engine keys (internal):** `stubHeight`, `deduct`, `deductMark`, `legLength`

## Shared components used

- `@/shared/ui`: AppHeader, AppScreen, FieldInput
- `@/shared/workspace`: SetupSummary, PipeWorkspaceCard, MeasurementChip, EditSetupSheet
- `@/shared/diagrams`: PipeSegment, MarkLine, DimensionLine, DiagramLabel
