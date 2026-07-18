# Matching Offset - product specification

## Job

Copy an existing two-bend offset when its original angle or marks are unknown.

## First decision: how can the existing offset be measured?

Use two illustrated cards:

1. **Along the run** (`Match Centers`) - measure rise and projected straight-run distance between the two bend-center stations.
2. **Along the pipe** (`Match Bends`) - measure rise and the distance along the sloped conduit between bend centers.

The labels `adjacent` and `hypotenuse` belong in Guide only.

## Required inputs

- measurement card;
- existing offset rise;
- the pictured run distance or along-pipe center distance.

Optional: First Center from the chosen end for absolute marks.

## Results

**Hero pair:**

- `Bend both: [exact angle]`
- `Mark centers: [distance] apart`

The pair is inseparable. Angle without mark spacing is not a field solution.

**Action gate:**

- If the selected bender has a verified executable cue for the solved angle, connect it to the hero.
- Otherwise show `Exact match needs an angle tool and a calibrated bend-center reference` directly under the angle.
- Never silently round to a common angle.

Optional `Compare a common angle` shows the changed spacing and mismatch; it never replaces the exact result without confirmation.

## Field sequence

1. Locate the two bend centers on the existing offset.
2. Measure rise and the distance shown by the selected card.
3. Mark the new conduit at the returned center spacing.
4. Bend the first exact angle on center.
5. Rotate 180 degrees without changing plane and bend the equal opposite angle.
6. Place beside the reference offset and check both centers and final parallel legs.

## Warnings

- In Along the Pipe mode, rise must be less than the center distance.
- Near-zero and out-of-supported-range angles are blocked or explicitly unsupported.
- Uncommon exact angle without an angle tool/reference is mathematically valid but not execution-ready.
- Measuring outside surfaces instead of bend centers invalidates the model.
- Bender/CLR differences can prevent a visual match even when the center triangle matches; state the scope.

## Verdict

**Refine, ready with the angle gate.** The current inverse geometry is strong; measurement and execution instructions must catch up.
