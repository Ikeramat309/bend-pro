# Current Bend Pro audit against the research contract

Production code was inspected read-only. Existing engine behavior is a hypothesis to test, not external evidence.

| Workflow | What is sound | What remains generic or unsafe | Required product correction |
|---|---|---|---|
| Back-to-Back 90 | Direct second mark from the back of Bend 1 and Star method align with Klein/Greenlee | Tight-U fallback, opposite-hook emphasis, and plane/no-dog check are secondary | Preserve simple core; add explicit Tight-U alternate and procedural diagram cues |
| Matching Offset | Two inverse-trig modes correctly distinguish projected run from distance along conduit | Exact angle is presented as if it is automatically bendable; center finding is under-specified; shrink competes with the real action | Gate uncommon angles, show exact center spacing, teach how centers were measured and how the new bend will reproduce them |
| Parallel Offsets | Half-angle progression and Quick Shift/Full Layout structure are right | Reference/direction can still be mentally mirrored; the user may have to propagate the constant; selected bender can imply precision it does not provide | Fix Pipe 1, show preserved gap, apply direction to both marks, output all pipe rows |
| Compound 90 | Round and rectangle formulas and OD center correction match the source family | Generic Square is ambiguous: current `side x 3` is the source's diamond case, not every square; clearance is omitted; center reference is generic | Replace shape-only selection with orientation; add clearance; map/warn about center reference |
| Multiple Bends | Sorting marks, overflow, and collision checks are useful primitives | It behaves like a generic mark notebook, while the name promises solved multi-bend layout; raw angle/direction metadata is not enough | Reframe UI and architecture as Build a Run importing solved calculator results |
| Parallel Kick 90s | No production workflow yet | Terminology, center references, landing orientation, and preserved spacing are easy to conflate | Build from the new illustrated contract; do not reuse Parallel Offset UI with renamed labels |

## Highest-priority correction

Compound 90's Square label can select the wrong physical source formula. This is not a polish issue. Before implementation, decide whether the obstacle is wall-aligned or diamond-oriented using a picture.

## Shared UI audit

The current visual system is strongest when the steel-tube diagram, colored dimensions, mark wraps, and value hierarchy all refer to the same physical object. New workflows must reuse that visual language while allowing calculator-specific geometry.

Common risks to test:

- result labels collide at large inputs;
- values detach from their vectors;
- a diagram rescales so aggressively that two different jobs look identical;
- hidden optional fields change the hero without explaining why;
- bender context remains visible even when the formula is not bender-specific;
- changing direction or reference pipe does not update every mark/table row;
- zero and incomplete values briefly render plausible conduit.

## Explicit non-change

No files under `src/` or production `docs/` were modified by this research upgrade.
