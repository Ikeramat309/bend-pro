# Parallel Offsets

Consolidated EMT workflow for the two QuickBend-style entries commonly called
**Simple Parallel Offsets** and **Parallel Offsets**. Bend Pro keeps them in one
calculator so the field formula is learned once:

- **Simple Shift** — center-to-center spacing + bend angle → shift both marks on
  each successive conduit.
- **Full Layout** — adds offset height, 2–8 conduits, shift direction, and an
  optional actual Pipe 1 Mark 1. It returns distance between bends, total rack
  shift, and a mark row for every conduit.

The consolidated workflow is active at `/parallel-offset`, registered on the
Bends hub, documented in Guide, and wired to recent-layout persistence.

## Field method and desk validation

The conduit field method is:

```text
shift per conduit = center-to-center spacing × tan(bend angle / 2)
cumulative shift for pipe n = shift per conduit × (n - 1)
distance between bends = offset height / sin(bend angle)
```

Both marks move by the same signed cumulative shift, so the distance between
bends is identical on every pipe. “Toward free end” subtracts the shift from
measurements made from that end; “Away from free end” adds it.

Worked case: 2" C-C, 30°, four conduits, 6" offset:

- shift = `2 × tan(15°) = 0.535898"` (displays 9/16" at 1/16 rounding)
- total rack shift = `0.535898 × 3 = 1.607695"`
- distance between bends = `6 / sin(30°) = 12"`

Independent analytic check: two equal-angle offset centerlines separated by
`S` on the straight require a longitudinal translation `δ` such that their
diagonal segments remain `S` apart. Solving the parallel-line distance gives
`|δ| = S × tan(θ/2)`, matching the trade method.

### Sources reviewed

- [Cliffhanger Tools — Repeatable Conduit Bending User Manual, Parallel Offsets](https://www.cliffhangertools.com/pages/Repeatable-Conduit-Bending-User-Manual.html)
  states the conduit start-mark adjustment as C-C spacing × tangent of half the
  offset angle, and says to apply the adjustment to every subsequent conduit.
- [Access Electric — How to Make Parallel Offset Conduit Bends](https://www.accesstopower.com/blog/how-to-make-parallel-offset-conduit-bends)
  independently teaches the same half-angle tangent relationship.
- [U.S. Navy NAVEDTRA 14265A, pp. 2-16–2-19](https://media.defense.gov/2014/Jun/20/2002655942/-1/-1/1/140620-N-ZZ182-6583.pdf)
  confirms exact offset travel as offset ÷ sin(angle). Its separate
  sine-half-angle “spread allowance” is for parallel piping fittings/elbows,
  not the conduit mark-progression method, and is intentionally not mixed into
  this calculator.

## Contracts

- `engine/parallelOffset.engine.ts` — pure formula, validation, formatting, and
  per-conduit layout.
- `engine/parallelOffset.types.ts` — input/result/diagram contracts.
- `engine/parallelOffsetCalculationResult.ts` — shared result adapter.
- `engine/parallelOffsetInputSnapshot.ts` — JSON-safe recent-layout snapshot,
  sanitizer, and restore hook.
- `diagram/parallelOffsetDiagramGeometry.ts` — clamped presentation-only rack
  geometry; never feeds values back into the engine.
- `ui/ParallelOffsetScreen.tsx` — compact continuous-surface workflow. It
  accepts the contextual `onGuidePress` integration hook.
- `ui/ParallelOffsetDiagram.tsx` — theme-aware satin multi-conduit diagram.
- `ui/ParallelOffsetLayoutSheet.tsx` — explicit rack direction/count and the
  complete relative/absolute mark table.

## Assumptions and limits

- EMT only in the current product scope.
- Every conduit is the same size and uses the same bend angle and shoe radius.
- C-C spacing is measured perpendicular to the straight runs.
- Pipe 1 is the reference/inner conduit. The user explicitly chooses which way
  later marks move; the app never guesses rack orientation.
- Absolute marks are generated only after Pipe 1 Mark 1 is entered. Relative
  shifts remain valid without it.
- A base mark that would produce a negative measurement is never displayed;
  the engine warns and keeps only the valid relative shifts.
- The screen supports 2–8 conduits so every pipe stays readable on a phone.
- This is a planar parallel offset. Parallel rolling offsets and mixed conduit
  sizes are not implied or calculated.

## Verification

```text
npm test -- --runInBand src/features/bend-parallel-offset
npm run typecheck
npm run lint
```
