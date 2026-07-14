# Kick 90 Calculator

Small-angle kick bend laid out from a 90° bend reference — uses the standard offset multiplier method on kick rise.

## What it does

Given **kick rise** (how far the leg must move sideways/up) and a **bend angle**, calculates:

- **Distance Between Bends** — spacing from the 90° bend mark to the kick mark (`kickRise × multiplier`)
- **Shrink** — conduit length lost (`kickRise × shrink per inch`)
- **Mark 1 / Mark 2** — optional layout marks, wired through the screen and recent-layout persistence

## Engine

- `engine/kick90.engine.ts` — pure math
- `engine/kick90AngleData.ts` — standard offset angle table (same constants as basic offset)
- `engine/kick90.types.ts` — input/result/diagram contracts

## Formulas

```
distanceBetweenBends = kickRise × multiplier
shrink = kickRise × shrinkPerInch
mark2 = mark1 + distanceBetweenBends
```

Multiplier and shrink use the same standard offset angle table as the basic Offset calculator. Setup overrides persist per angle like Offset and Rolling.

## Example case

6" kick rise at 30° bend:

- Distance between bends: **12"** (6 × 2.0)
- Shrink: **1 1/2"** (6 × 1/4)

## Route

`/kick90` → `src/app/kick90.tsx` → `ui/Kick90Screen.tsx`

## Measurement names

| UI label | Engine key |
|----------|------------|
| Kick Rise | `kickRise` |
| Bend Angle | `bendAngle` |
| Distance Between Bends | `distanceBetweenBends` |
| Shrink | `shrink` |
| Mark 1 / Mark 2 | `mark1`, `mark2` |

## Limitations

- Uses the standard offset multiplier/shrink table — not bender-specific.
- EMT only; uses shared calculator setup for size, bender display, units, rounding, and recent-layout persistence.
