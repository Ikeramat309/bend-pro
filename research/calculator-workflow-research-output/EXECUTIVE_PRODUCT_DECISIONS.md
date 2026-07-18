# Executive product decisions

## The product bar

A Bend Pro calculator is ready only when an electrician can answer all five questions without translating the UI:

1. What finished physical condition am I trying to create?
2. What can I measure in the field before bending?
3. From which physical origin do I place each mark?
4. Which bender reference, hook direction, bend order, and rotation do I use?
5. What do I check before committing the next bend?

A correct formula without those answers is not a finished calculator.

## Final verdict table

| Workflow | Product definition | Minimum natural inputs | Hero | Required field cue | Verdict |
|---|---|---|---|---|---|
| Back-to-Back 90 | Put two opposing 90s between parallel surfaces using the direct Star method | Finished back-to-back distance; optional first stub | `Second 90: mark [distance] from the back of Bend 1; use Star` | Hook opposite Bend 1; keep both 90s in one plane | Refine; ready |
| Matching Offset | Copy an existing offset from measurements taken at its bend centers | Rise plus either projected run or distance along conduit | Exact angle + center-to-center mark spacing | Common-angle cue or explicit angle-tool requirement | Refine; ready with gate |
| Parallel Offsets | Lay out equal-size planar offsets that keep rack spacing through the bends | Rack C-C, angle, reference pipe; layout adds rise/count/Mark 1 | Shift per next pipe and an ordered two-mark table | Direction arrow applied to both marks; fixed reference pipe | Refine; ready |
| Compound 90 | Turn 90 degrees with two 45s around a specifically oriented obstruction envelope | Orientation card, dimensions, EMT size; optional clearance | Center-to-center spacing between the two 45s | Center-of-bend reference for the selected bender family | Correct model; ready after contract change |
| Multiple Bends | Compose already-solved bends into one stick and check order, fit, collisions, and cut length | Stick origin plus imported solved bend cards | Ordered bend plan and mark list | Owning calculator retains reference and bend instructions | Reframe as Build a Run |
| Parallel Kick 90s | Lay out a rack of kicked 90s after choosing the physical rack/cabinet orientation | Illustrated geometry, kick, angle, rack spacing, count, first reference | Per-pipe center table plus landing spacing | Center of 90, center of kick, kick direction, and reference method | New; prototype-ready |

## Calls made by the lead

### 1. Compound 90 needs a model correction before visual polish

The IBEW diagrams show two different square cases:

- Sides parallel to the walls: use the rectangular-envelope rule, `(height + width) x 1.414`, then convert from back-of-conduit to bend centers.
- Square rotated 45 degrees like a diamond: use `side x 3`, then convert to bend centers.

The draft treated these as conflicting formulas. They are different geometry. A generic Square selector is therefore under-specified. Bend Pro must show orientation cards and use the matching formula. Optional requested clearance is a real input, not a sentence telling the user to enlarge the obstacle mentally.

### 2. Matching Offset is useful only if the angle can be executed

The engine can solve an exact angle, but stock hand-bender markings do not make every angle equally repeatable. Results must be action-gated:

- If the result is a supported/common angle, show the matching bender angle cue.
- If it is uncommon, show `Exact match needs an angle tool and a calibrated bend-center reference` beside the hero.
- Never silently round or snap the angle.
- An optional `Compare a common angle` action may show the resulting geometric difference, but may not replace the exact result.

### 3. Parallel tools must lock the reference pipe

Reviews and public discussions show that mirrored direction and a changing reference pipe destroy confidence. Pipe 1 stays visibly fixed. The UI says `move both marks` and shows whether each next pipe moves toward or away from the chosen end. A numeric shift alone is not sufficient.

### 4. Parallel Kick 90s starts with pictures, not terminology

Electricians use `parallel`, `stacked`, and `fanned` inconsistently. A current public discussion contains confident, contradictory answers to the same photo. Bend Pro must start with illustrated geometry choices and plain outcomes such as:

- `Keep the rack together through the kick`
- `Land a rack running parallel to the cabinet`
- `Land a rack running into the cabinet`

The app must not infer geometry from the phrase `parallel kick`.

### 5. Multiple Bends is strategically important, but the current notebook is not enough

Direct reviews praise QuickBend's multiple-bend feature. Demand is real. The safe Bend Pro answer is not removal and not a generic list of user-entered marks. It is a staged `Build a Run` feature that imports validated results from owning calculators, preserves their bender references, and performs stick-level fit and order checks. Automatic CLR/gain chaining remains gated by bender data and dedicated tests.

## Decisions not to copy from competitors

- Do not place floating result cards over the pipe diagram.
- Do not make a slider the only numeric input; direct keypad entry is required.
- Do not hide the selected bender, EMT size, reference method, or rounding context.
- Do not turn impossible geometry into a plausible-looking number.
- Do not use social-media formulas as engine evidence.

## Recommended build order

1. Correct Compound 90 orientation and clearance contract.
2. Finish Matching Offset's exact-angle and center-finding contract.
3. Lock reference/direction behavior in Parallel Offsets.
4. Add Back-to-Back Tight-U alternate and plane checks.
5. Prototype Parallel Kick 90s with the geometry chooser.
6. Replace raw Multiple Bends positioning with the Build a Run composition model.

See `IMPLEMENTATION_ROADMAP.md` for release gates.
