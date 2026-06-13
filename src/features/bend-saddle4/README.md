# 4-Point Saddle Calculator

Routes over a wide obstruction with four bends: two offsets back-to-back forming a flat-topped plateau (rise, level across, drop).

## What it does

Given **obstruction height**, **saddle width** (the flat top), and a **bend angle** (used on all four bends), calculates:

- **Between Bends** — conduit distance between each outer and inner bend (engine key `betweenBends`)
- **Shrink** — total run length lost across both offsets
- **Center Mark** — when distance to obstruction center is provided
- **Bend marks** — the four bend positions (two outer, two top/inner)

## Engine

- `engine/saddle4.engine.ts` — pure math
- `engine/saddle4AngleData.ts` — angle table (22.5°, 30°, 45°), mirrors the offset multiplier/shrink table
- `engine/saddle4.types.ts` — input/result/diagram contracts

## Formulas

```
betweenBends   = obstructionHeight × multiplier        (outer ↔ inner spacing)
shrinkToCenter = obstructionHeight × shrinkPerInch      (one offset, before center)
shrink (total) = 2 × shrinkToCenter
centerMark     = distanceToCenter + shrinkToCenter
innerMark1     = centerMark − saddleWidth / 2
innerMark2     = centerMark + saddleWidth / 2
outerMark1     = innerMark1 − betweenBends
outerMark2     = innerMark2 + betweenBends
```

A 4-point saddle is two offsets, so the multiplier and shrink-per-inch are the
standard offset constants. Total run shrink is two offsets; only the first
offset's shrink sits ahead of center, so the center mark adds `shrinkToCenter`
(half the total).

## Example case

2" obstruction, 4" saddle width, 22.5°, distance to center 30":

- Between bends: 5.2" (2 × 2.6)
- Shrink (total): 3/4" (2 × 2 × 3/16)
- Center mark: 30 3/8" (30 + 3/8)
- Top (inner) marks: 28 3/8" and 32 3/8" (center ± 2")
- Outer marks: ~23 3/16" and ~37 9/16" (inner ± 5.2")

## Route

`/saddle4` → `src/app/saddle4.tsx` → `ui/Saddle4Screen.tsx`

## Measurement names

| UI label | Engine key |
|----------|------------|
| Obstruction Height | `obstructionHeight` |
| Saddle Width | `saddleWidth` |
| Bend Angle | `bendAngle` |
| Distance to Center | `distanceToCenter` (optional) |
| Between Bends | `betweenBends` |
| Shrink | `shrink` (total, both offsets) |
| Center Mark | `centerMark` |
| Outer / Top (marks, secondary) | `outerMark1/2`, `innerMark1/2` |

## Limitations

- Angle table is generic — not bender- or manufacturer-specific (same approach as Offset multipliers).
- All four bends use one angle.
- No manual multiplier/shrink overrides yet (future if needed).
- EMT only; uses shared calculator setup for size, bender display, units, rounding.
