# Multiple Bends

Single-stick mark planner for an ordered set of absolute bend and cut marks.

## Product boundary

- Every position is measured from the same conduit start end.
- Bend marks carry angle, direction, and flip metadata supplied by the user.
- The planner sorts marks for the field sequence and reports overlaps, overflow,
  invalid values, input-order changes, remaining tail, gaps, and total bend degrees.
- It does **not** calculate take-up, gain, shrink, shoe clearance, or marks for
  another calculator. Those values must come from a calculator result or the user.

## Integration seam

`seedMultipleBendsSnapshotFromFieldSteps` accepts the shared structural
`fieldSteps` shape plus an explicit metadata resolver. The caller must provide
bend/cut type and bend orientation; the planner never guesses them from text.

The screen is active at `/multiple-bends`, uses the shared recent-layout hooks,
and is registered with contextual Guide content. `MultipleBendsScreen` accepts
contextual back/guide callbacks so navigation wiring remains outside the package.
