# 3-Point Saddle Calculator

Routes over an obstruction with three bends: a center bend toward the obstacle and two side bends back to level.

## What it does

Given **obstruction height** and a **side/center angle preset**, calculates:

- **Between Bends** — distance from the center mark to each outer (side) mark (engine key `centerToSide`)
- **Shrink** — conduit length lost (add to distance-to-center for the center mark)
- **Center Mark** — when distance to obstruction center is provided
- **Side marks** — secondary; sit ± Between Bends from the center mark

## Engine

- `engine/saddle3.engine.ts` — pure math
- `engine/saddle3AngleData.ts` — standard angle table (22.5°/45°, 30°/60°, 45°/90°)
- `engine/saddle3.types.ts` — input/result/diagram contracts

## Formulas

```
centerToSide = obstructionHeight × centerToSideMultiplier
shrink = obstructionHeight × shrinkPerInch
centerMark = distanceToCenter + shrink
sideMark1 = centerMark − centerToSide
sideMark2 = centerMark + centerToSide
```

## Example case

2" obstruction, 22.5°/45° preset, distance to center 24":

- Center to side: 5.23" (2 × 2.613)
- Shrink: 3/8" (2 × 3/16)
- Center mark: 24 3/8"
- Side marks: ~19 1/8" and ~29 5/8"

## Route

`/saddle3` → `src/app/saddle3.tsx` → `ui/Saddle3Screen.tsx`

## Measurement names

| UI label | Engine key |
|----------|------------|
| Obstruction Height | `obstructionHeight` |
| Distance to Center | `distanceToCenter` (optional) |
| Between Bends | `centerToSide` |
| Shrink | `shrink` |
| Center Mark | `centerMark` |
| Side (marks, secondary) | `sideMark1`, `sideMark2` |

## Limitations

- Angle table is generic — not bender- or manufacturer-specific (same approach as Offset multipliers).
- No manual multiplier/shrink overrides yet (future if needed).
- EMT only; uses shared calculator setup for size, bender display, units, rounding.
