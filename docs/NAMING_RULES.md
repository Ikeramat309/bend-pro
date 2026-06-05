# Naming Rules

Use one name for one measurement concept.

Changing measurement names randomly makes the app harder for beginners, electricians, and coding agents to understand.

## Stub 90 Names

Use `stubLength` for the finished vertical stub measurement.

Use `deduct` for the bender deduct/take-up value shown to the user.

Use `deductMark` for `stubLength - deduct`.

Use `legLength` for the horizontal leg.

Avoid calling `deductMark` "first mark" in the UI for a 90 degree bend unless it is only legacy/internal.

Legacy engine code may still contain older names during migration. Prefer the names above for new UI copy and new public contracts.

## Offset Names

Use `rise` for offset height.

Use `markSpacing` for distance between offset bends.

Use `shrink` for offset shrink.

Use `mark1` and `mark2` for the two offset marks.

## General Rules

Avoid using multiple names for the same field.

Avoid abbreviations in UI labels when the full field term is clearer.

Do not rename measurement keys without updating this document.

When adding a new calculator, define its measurement names in that feature README before building a large UI.
