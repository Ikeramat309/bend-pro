# Naming Rules

Part of the [documentation index](README.md). Entry point: [`AGENTS.md`](../AGENTS.md).

Use one name for one measurement concept. For term definitions and preferred vs. avoided wording, see [`GLOSSARY.md`](GLOSSARY.md); this doc maps those terms to exact UI labels and engine keys.

Changing measurement names randomly makes the app harder for beginners, electricians, and coding agents to understand.

## Stub 90 Names

**UI labels:** Stub Length, Deduct, Deduct Mark, Bend Mark (general mark language), Leg, Take-Up (sparingly).

**Engine keys:** `stubHeight` / `stubLength`, `deduct`, `takeUp`, `deductMark`, `legLength`.

Never call the stub 90 result "First Mark" or "Start Mark" in the UI.

Legacy engine code may still contain older names during migration. Prefer the names above for new UI copy and new public contracts.

## Offset Names

**UI labels:** Offset Height, Bend Angle, Distance Between Bends, Shrink, Mark 1, Mark 2.

**Engine keys:** `rise` (offset height), `markSpacing` (distance between bends), `shrink`, `mark1`, `mark2`.

## General Rules

Avoid using multiple names for the same field.

Avoid abbreviations in UI labels when the full field term is clearer.

Do not rename measurement keys without updating this document.

When adding a new calculator, define its measurement names in that feature README before building a large UI.
