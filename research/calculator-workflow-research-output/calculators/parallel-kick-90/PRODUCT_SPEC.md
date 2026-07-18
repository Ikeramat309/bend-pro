# Parallel Kick 90s - product specification

## Job

Lay out more than one kicked 90 so a rack shifts and turns down/up without the conduits colliding, losing the intended spacing, or missing the cabinet landing.

## Why this starts with geometry

`Parallel kick`, `stacked kick`, and `fanned kick` do not identify one universal layout. Public electrician discussions use the same terms for different pictures and produce contradictory answers. The first screen must therefore be three illustrated outcomes:

1. **Fan to a cabinet - rack runs parallel to cabinet**
2. **Turn into a cabinet - rack runs perpendicular to cabinet**
3. **Keep equal gaps through the kicked section** - provisional rack-progression mode

Do not show those labels without pictures.

## Supported release slice

The strongest primary evidence supports:

- locating a single kick center from the back of a formed 90;
- fanned/stacked center progression for conduits running parallel to a cabinet;
- the cabinet landing spacing for both parallel and perpendicular orientations.

The `keep equal gaps through the kicked section` progression uses the parallel-offset half-angle relationship and requires an additional geometry test before release.

## Required inputs

- illustrated geometry choice;
- first kick amount;
- kick angle;
- rack center-to-center spacing;
- conduit count;
- EMT trade size;
- kick direction/handedness;
- first reference pipe/order.

## Reference input

One executable reference method is required:

- verified center-of-bend reference for the selected bender/angle; or
- calibrated shoe factor from front of shoe to bend center.

No generic Arrow assumption.

## Core calculations

Single kicked 90 center measured from the back of the 90:

`center distance = kick x csc(angle) + EMT OD / 2`

Front-of-shoe station when a shoe factor is available:

`front-of-shoe station = center distance - shoe factor(angle)`

Cabinet landing spacing:

- rack parallel to cabinet: `landing C-C = rack C-C x csc(angle)`;
- rack perpendicular to cabinet: `landing C-C = rack C-C / cos(angle)`.

Fanned parallel-to-cabinet progression:

`kick[n] = first kick + (n - 1) x rack C-C`

Each row then uses the single-kick center equation. This makes the center-station progression equal to the landing C-C relationship.

## Results

**Hero:** an ordered table with Pipe, Kick, Center from Back of 90, executable bender station/reference, and landing center.

**Secondary:** landing C-C and total fan width.

The result sentence states exactly which spacing is preserved and which spacing changes.

## Warnings and exclusions

- Unsupported at angle <= 0 or >= 90 degrees.
- Missing center reference/shoe factor: center geometry may display, but executable mark instruction is blocked.
- Mixed sizes, rolling kicks, non-90 primary bends, and arbitrary 3D planes are out of scope.
- Clearance between bender head and adjacent conduit is not guaranteed by centerline math alone.
- Never combine the half-angle progression with cabinet-landing formulas unless the selected picture explicitly calls for both constraints.

## Verdict

**Build as a new workflow after an illustrated prototype review.** Primary math is strong for the center and cabinet relationships; the through-bend progression remains release-gated.
