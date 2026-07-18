# Implementation roadmap derived from research

This is a product sequence, not authorization to edit production math. Each engine change still requires calculator-specific tests and review.

## Wave 0 - contract corrections

### Compound 90

- Replace generic `Square` with illustrated orientation choices.
- Model wall-aligned square as the rectangular-envelope case.
- Keep the `side x 3` rule only for the diamond orientation shown in the source.
- Add optional requested clearance; show support-depth adjustment in Guide until product scope confirms an Advanced input.
- Map the center-of-bend reference for supported bender families or show a blocking reference warning.

**Gate:** worked cases from IBEW pages 8-10 pass without conflating back-of-conduit and center-to-center measurements.

### Matching Offset

- Rename inputs to what a tape measures.
- Add the common/uncommon angle action gate.
- Add bend-center measurement instructions and center-reference assumptions.
- Keep exact angle; no silent snapping.

**Gate:** every valid result tells the user how to reproduce both the angle and the center spacing.

## Wave 1 - existing rack and 90 refinement

### Parallel Offsets

- Make Pipe 1 a fixed visual object.
- Require a direction choice only when absolute/progressive marks are requested.
- Output both marks for every pipe; do not make the user propagate a constant mentally.
- Withhold negative or off-stick marks while preserving safe relative information.

### Back-to-Back 90

- Keep direct Star method as default.
- Add `Bender will not fit` entry to the documented Tight-U Arrow alternate.
- Strengthen back-of-first-90 origin, opposite hook, and plane check.

**Gate:** all extreme numeric states keep annotations legible and all mark origins explicit.

## Wave 2 - Parallel Kick 90 prototype

1. Build the illustrated geometry chooser first with no math.
2. Validate wording against the three source geometries.
3. Implement single kicked-90 center layout and landing-spacing calculations.
4. Add rack progression only where the geometry contract is unambiguous.
5. Connect bender center-reference or shoe-factor calibration.
6. Add a mark table, bend order, kick direction, and a final landing check.

**Release gates:**

- No text-only `parallel/stacked/fanned` selector.
- Center-of-kick and center-of-90 origins are visually distinct.
- Social-media formulas are covered only as rejected/conflicting examples.
- At least one primary/manual worked case per supported geometry is recomputed in tests.
- Unsupported mixed-size, rolling, and non-90 families are rejected clearly.

## Wave 3 - Build a Run

### Phase A: composition

- Import a solved bend result from an owning calculator.
- Preserve calculator ID, marks, bender reference, direction, plane, and warnings.
- Sort physical marks from a selected conduit end.
- Flag off-stick marks and impossible proximity without inventing corrective math.

### Phase B: stick fit

- Compute cut length only for bend types with validated shrink/deduct/gain contracts.
- Keep an explanation trail from final mark back to the owning calculator.

### Phase C: advanced chaining

- Add CLR/gain chaining only after the bender database and per-shoe tests support it.

**Gate:** deleting or editing one child bend cannot leave stale marks from its prior result.

## Shared Definition of Done

Every calculator in these waves must pass:

- Natural field inputs, not formula-variable inputs.
- Hero is the next field action.
- Every mark says from where and to what reference.
- Bend order, hook/rotation/plane cues where applicable.
- Bender/EMT/rounding context visible.
- Impossible geometry withholds unsafe output.
- Diagram scales safely for zero, small, large, and extreme valid values.
- Light/dark and smallest supported mobile viewport reviewed.
- Engine tests include source worked cases and inverse/property cases where meaningful.
- Guide includes source, assumptions, and measurement method.

## Explicit deferrals

- Mixed conduit sizes within one parallel rack
- Rolling parallel offsets or rolling parallel kicks
- Automatic arbitrary-shoe center mapping without calibration data
- Non-EMT conduit types
- Hydraulic layout and Box Offset in this research package
