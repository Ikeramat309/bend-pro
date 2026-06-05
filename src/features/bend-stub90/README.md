# Bend Stub 90 Feature

The Stub 90 calculator finds the mark used to bend a finished 90 degree stub.

## Current Route

`/stub90`

Route file: `src/app/stub90.tsx`

## Engine Files

- `engine/stub90Engine.ts`
- `engine/stub90Types.ts`

## UI Files

- `ui/Stub90ProScreen.tsx`
- `ui/Stub90Diagram.tsx`

## Important Measurement Names

- `stubLength`: finished vertical stub measurement
- `deduct`: bender deduct/take-up value shown to the user
- `deductMark`: `stubLength - deduct`
- `legLength`: optional horizontal leg measurement

## Notes

Do not change Stub 90 math during architecture cleanup.

The current engine may still contain legacy names internally. New UI copy should use `DEDUCT MARK`, not `FIRST MARK`.

Shared UI currently comes from `src/components/bend/`.

Shared diagrams currently come from `src/components/diagram/`.
