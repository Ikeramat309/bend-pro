# Bend Offset Feature

The Offset calculator lays out a two-bend offset for clearing an obstruction while keeping conduit parallel.

## Current Route

`/offset`

Route file: `src/app/offset.tsx`

## Engine Files

- `engine/offset.logic.ts`
- `engine/offset.types.ts`
- `engine/offset.validation.ts`
- `engine/offsetEngine.ts`
- `engine/offsetTypes.ts`

## UI Files

- `ui/OffsetProScreen.tsx`

## Important Measurement Names

- `rise`: offset height
- `markSpacing`: distance between offset bends
- `shrink`: offset shrink
- `mark1`: first offset mark
- `mark2`: second offset mark

## Notes

Do not change Offset math during architecture cleanup.

Shared UI currently comes from `src/components/bend/`.
