# Matching Offset - worked cases

## Along the Pipe / Match Bends

- Rise = 6 in
- Along-pipe center distance = 12 in

Angle = `asin(6/12) = 30 deg`.

Projected run = `sqrt(12^2 - 6^2) = 10.3923 in`.

Shrink by center triangle = `12 - 10.3923 = 1.6077 in`.

Hero remains `30 deg` and `12 in between centers`.

## Along the Run / Match Centers

- Rise = 3 in
- Projected run = 12 in

Angle = `atan(3/12) = 14.0362 deg`.

Center spacing = `sqrt(3^2 + 12^2) = 12.3693 in`.

This is mathematically valid but uncommon. The result must require an angle tool/calibrated center or offer an explicit comparison.

## Common-angle comparison

For the 3-inch rise above, choosing 15 deg would require:

- center spacing = `3 / sin(15) = 11.5911 in`;
- projected run = `3 / tan(15) = 11.1962 in`.

Compared with the measured reference, the run-center station changes by about `0.8038 in`. Show the difference; do not call the 15-degree result a match.

## Rejections

- rise >= along-pipe distance;
- zero/negative lengths;
- non-finite values;
- solved angle outside supported offset range;
- optional First Center leading to an invalid/off-stick second mark.

## Property tests

- Both modes given the same valid triangle return the same angle and center spacing.
- Reconstructing rise from `DBB x sin(angle)` returns the input within tolerance.
- Switching units does not change canonical geometry.
