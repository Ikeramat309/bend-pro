# Rolling Offset Calculator

Two-direction offset — combines offset height and advance into a true offset, then lays out a standard two-bend offset from the angle table.

## What it does

Given **offset height**, **offset roll**, and a **bend angle**, calculates:

- **Distance Between Bends** — combined offset × multiplier (combined offset = √(height² + roll²), internal only)
- **Shrink** — combined offset × shrink per inch
- **Mark 1 / Mark 2** — optional layout marks (same as basic offset)

## Engine

- `engine/rolling.engine.ts` — pure math
- `engine/rollingAngleData.ts` — standard offset angle table (same constants as basic offset)
- `engine/rolling.types.ts` — input/result/diagram contracts

## Diagram

- `diagram/rollingDiagramGeometry.ts` — pure fixed-view isometric presentation geometry
- `ui/RollingDiagram.tsx` — true 3D centerline scene with floor reference, open tube ends, bend marks, and height/roll dimensions

## Formulas

```
trueOffset = √(offsetHeight² + advance²)
distanceBetweenBends = trueOffset × multiplier
shrink = trueOffset × shrinkPerInch
mark2 = mark1 + distanceBetweenBends
```

Multiplier and shrink use the same standard offset angle table as the basic
Offset calculator. Manual overrides in setup are shared (`offsetMultiplierOverrides`,
`offsetShrinkPerInchOverrides`).

## Example case

6" offset height, 3" offset roll, 30° bend:

- Distance between bends: 24 3/4" (12 3/8" combined × 2.0)
- Shrink: 3 1/16" (12 3/8" combined × 1/4)

## Route

`/rolling` → `src/app/rolling.tsx` → `ui/RollingScreen.tsx`

## Measurement names

| UI label | Engine key |
|----------|------------|
| Offset Height | `offsetHeight` |
| Offset Roll | `advance` |
| Bend Angle | `bendAngle` |
| Distance Between Bends | `distanceBetweenBends` |
| Shrink | `shrink` |
| Mark 1 / Mark 2 | `mark1`, `mark2` |

## Limitations

- Uses the standard offset multiplier/shrink table — not bender-specific.
- The diagram shows the conduit centerline in 3D, but does not model bender-head rotation; field workers still orient the bender for the rolling plane.
- EMT only; uses shared calculator setup for size, bender display, units, rounding.
