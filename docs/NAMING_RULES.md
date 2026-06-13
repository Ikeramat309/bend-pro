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

## General Rules

Avoid using multiple names for the same field.

Avoid abbreviations in UI labels when the full field term is clearer.

Do not rename measurement keys without updating this document.

When adding a new calculator, define its measurement names in that feature README before building a large UI.
