# Build a Run (Multiple Bends) - product specification

## Product decision

Do not ship `Multiple Bends` as a generic calculator that asks users to invent positions, angles, direction, and flip metadata. Build it as a **composer of solved Bend Pro bends**.

## Job

Plan several bends and cuts on one stick from one named end, keep their references and order straight, and know whether the layout fits before marking conduit.

## Promise

`Build the run from trusted bend cards, then give me one ordered stick plan without hiding where any mark came from.`

## Inputs

- conduit stick length;
- named measurement end;
- one or more solved bend cards imported from owning calculators;
- user-confirmed bend order and plane/rotation between cards;
- optional cut/manual reference marks clearly labeled as manual.

Adding a bend opens that calculator's natural mini-flow. It does not open a generic `position + angle` editor.

## Result

**Hero state:** `Fits` with remaining tail, or `Does not fit` with shortage and the first failing child.

**Next action:** first unresolved mark/bend instruction, including origin and bender reference.

**Main output:** sorted stick mark table with owning calculator, mark role, station, reference, bend order, direction/plane, and warning state.

## Ownership and math

- Each child result stores calculator ID, engine version, canonical inputs, result snapshot, references, and warnings.
- Build a Run may translate a whole child along the stick using an explicit anchor.
- It may not change the distance between a child's internal marks or reinterpret Arrow/Star/center.
- Editing a child re-runs the owning engine and replaces all derived child marks atomically.
- Automatic gain/CLR chaining is added only for child types with validated bender-specific contracts.

## Stages

### A. Composition

Import solved bends, order/translate them, check bounds, duplicate stations, and stale data.

### B. Validated stick fit

Add cut-length/shrink/deduct/gain effects only where each child engine exposes an audited contract.

### C. Advanced sequencing

Suggest bend order and bender-access feasibility only after explicit rules/tests exist. Until then the user confirms order and the app displays it clearly.

## Warnings

- Off-stick/negative mark: block plan readiness.
- Stale/missing child engine result: block.
- Manual mark: advisory that Bend Pro did not solve it.
- Conflicting reference/measurement ends: block until normalized explicitly.
- Near marks: advisory unless bender-specific minimum separation proves impossible.
- Child warning remains visible at stick level.

## Verdict

**Reframe and keep.** This can become a flagship differentiator, but the current raw mark planner is a foundation, not the finished product.
