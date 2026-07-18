# Naming Rules

Part of the [documentation index](README.md). Entry point: [`AGENTS.md`](../AGENTS.md).

Use one name for one measurement concept. For term definitions and preferred vs. avoided wording, see [`GLOSSARY.md`](GLOSSARY.md); this doc maps those terms to exact UI labels and engine keys.

Changing measurement names randomly makes the app harder for beginners, electricians, and coding agents to understand.

## Stub 90 Names

**UI labels:** Stub Length, Deduct, Deduct Mark, Bend Mark (general mark language), Leg, Take-Up (sparingly).

**Engine keys:** `stubHeight`, `deduct`, `deductMark`, `legLength` (plus `isValidDeductMark`, `*Formatted` variants, and `diagramData`).

Never call the stub 90 result "First Mark" or "Start Mark" in the UI — or in engine keys. The legacy `firstMark` and `takeUp` engine keys were removed; the engine surface now matches the UI language.

## Offset Names

**UI labels:** Offset Height, Bend Angle, Distance Between Bends, Shrink, Mark 1, Mark 2.

**Engine keys:** `offsetHeight`, `distanceBetweenBends`, `shrink`, `mark1`, `mark2`, `bendAngle`, `multiplier`.

## 3-Point Saddle Names

**UI labels:** Obstruction Height, Distance to Center, Between Bends, Shrink, Center Mark, Side (marks, secondary), Bend Angles (preset picker).

**Engine keys:** `obstructionHeight`, `distanceToCenter`, `centerToSide`, `shrink`, `centerMark`, `sideMark1`, `sideMark2`, `anglePreset`, `sideAngle`, `centerAngle`.

The center-to-side spacing is shown in the UI as **Between Bends** (matching Offset's "Distance Between Bends"); the engine key stays `centerToSide`. Do not use Offset **Mark 1 / Mark 2** labels for saddle side marks — those terms are offset-only per the glossary.

## 4-Point Saddle Names

**UI labels:** Obstruction Height, Saddle Width, Bend Angle, Distance to Center, Between Bends, Shrink, Center Mark, Outer / Top (marks, secondary).

**Engine keys:** `obstructionHeight`, `saddleWidth`, `bendAngle`, `distanceToCenter`, `betweenBends`, `shrink`, `shrinkToCenter`, `centerMark`, `outerMark1`, `outerMark2`, `innerMark1`, `innerMark2`, `multiplier`.

A 4-point saddle is two offsets, so `betweenBends` is shown the same way as the 3-Point Saddle and Offset spacing. **Shrink** is the total for both offsets; `shrinkToCenter` (half) is the part folded into the center mark. The four bend marks use **Outer** (the two baseline bends) and **Top** (the two flat-top bends) — never Offset's Mark 1 / Mark 2.

## Segment Bend Names

**UI labels:** Radius, Total Angle, Per Bend, Start of Bend, Between Bends, Bends, Bend Length.

**Engine keys:** `radius`, `totalAngle`, `degreesPerBend`, `startOffset`, `spacing`, `numberOfBends`, `developedLength` (plus `requestedDegreesPerBend`, `marks`, `firstMark`, `lastMark`, `*Formatted` variants).

The shot spacing is shown as **Between Bends** (consistent with Offset and the saddles); the engine key is `spacing`. "Per Bend" is the angle per shot (`degreesPerBend`, in degrees), and "Bend Length" is the developed arc length (`developedLength`). Total Angle and Per Bend are **degrees**, not lengths.

## Rolling Offset Names

**UI labels:** Offset Height, Offset Roll, Bend Angle, Distance Between Bends, Shrink, Mark 1, Mark 2.

**Engine keys:** `offsetHeight`, `advance`, `trueOffset`, `bendAngle`, `distanceBetweenBends`, `shrink`, `mark1`, `mark2`, `multiplier`.

The horizontal roll component is shown as **Offset Roll** in the UI; the engine key stays `advance`. **True Offset** (`trueOffset`) is internal math only — do not show it in the UI. Manual multiplier/shrink overrides share the same setup keys as basic Offset.

## Matching Offset Names

**UI labels:** Match Centers, Match Bends, Offset Height, Centers Along Run,
Centers Along Pipe, Bend Angle, Centers Apart, Set Angle With.

**Engine keys:** `mode`, `offsetHeight`, `adjacent`,
`referenceDistanceBetweenBends`, `bendAngleDegrees`, `distanceBetweenBends`,
`angleExecution`, `shrink`.

**Centers Along Run** is the straight projection between bend-center stations;
**Centers Along Pipe** follows the existing conduit centerline. **Centers Apart**
is the field-facing label for `distanceBetweenBends` in this matching workflow,
chosen to emphasize that both marks reference bend centers. Never replace an
exact calculated angle with a nearby common angle.

## Compound 90 Names

**UI labels:** Round, Box, On Point, Diameter, Height, Width, Side Length,
Clearance / Side, Centers Apart, First Bend Mark, Second Bend Mark.

**Engine keys:** `shape` (`circle`, `box`, `diamond`), `primaryDimension`,
`secondaryDimension`, `clearance`, `distanceBetweenBends`, `firstMark`,
`secondMark`.

The obstruction control describes orientation, not merely shape. **Box** means
its sides are flat to the walls; **On Point** means a square is rotated with a
corner up. Clearance is always the requested free space on each side.

## General Rules

Avoid using multiple names for the same field.

Avoid abbreviations in UI labels when the full field term is clearer.

Do not rename measurement keys without updating this document.

When adding a new calculator, define its measurement names in that feature README before building a large UI.
