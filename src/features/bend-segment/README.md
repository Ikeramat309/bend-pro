# Segment Bend Calculator

Approximates a large-radius arc with a series of small equal bends ("shots") spaced evenly along the conduit. Also called a circular or large-radius bend.

## What it does

Given a **radius**, a **total angle**, and a **degrees-per-bend** (shot angle), calculates:

- **Between Bends** — distance between adjacent shot marks (engine key `spacing`)
- **Per Bend** — effective angle per shot after fitting to a whole number of shots (`degreesPerBend`)
- **Bends** — number of shots (`numberOfBends`)
- **Bend Length** — conduit length the bend group consumes (`developedLength`)
- **Marks** — absolute shot positions when a start of bend is provided

## Engine

- `engine/segment.engine.ts` — pure math
- `engine/segment.types.ts` — input/result/diagram contracts

## Formulas

```
numberOfBends N  = round(totalAngle / requestedDegreesPerBend)   (min 1)
degreesPerBend α = totalAngle / N
spacing S        = (π / 180) × radius × α
developedLength  = (π / 180) × radius × totalAngle = N × S
mark i           = startOffset + (i − 0.5) × S      (1-based; staggered half-space)
```

The shot count is rounded to a whole number, then the per-shot angle is
recomputed so the bends close the total angle exactly. This is geometric —
radius and angle only — so it does not use the bender shoe (no deduct/take-up).

## Example case

30" radius, 90° total, 10° per bend:

- Bends: 9 (90 ÷ 10)
- Per bend: 10°
- Between bends: ~5.236" → **5 1/4"** at 1/8"
- Bend length: ~47.124" → **47 1/8"** at 1/8"

90° total at 12° per bend rounds to **8 bends at 11.25°** (warns about the adjustment).

## Route

`/segment` → `src/app/segment.tsx` → `ui/SegmentScreen.tsx`

## Measurement names

| UI label | Engine key |
|----------|------------|
| Radius | `radius` |
| Total Angle | `totalAngle` (degrees) |
| Per Bend | `degreesPerBend` (degrees) |
| Start of Bend | `startOffset` (optional) |
| Between Bends | `spacing` |
| Bends | `numberOfBends` |
| Bend Length | `developedLength` |

## Limitations

- Geometric model (equal shots approximating an arc); no spring-back compensation.
- Radius is to the conduit centerline.
- EMT only; uses shared calculator setup for size, bender display, units, rounding (radius/angle math is conduit-size independent).
