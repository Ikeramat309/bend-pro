# Compound 90 - product specification

## Job

Turn the conduit 90 degrees with two 45-degree bends while clearing a corner obstruction. The obstruction's orientation is part of the job.

## Product promise

`Show me where the two 45-degree bend centers must be so the back of the conduit clears this pictured obstruction, including the clearance I ask for.`

## Geometry choices

The first control is an illustrated card, not a text-only shape menu:

1. **Round at corner** - diameter input; back basis `2.4 x diameter`.
2. **Box aligned to walls** - height and width; back basis `1.414 x (height + width)`. A wall-aligned square is this case with equal values.
3. **Square turned like a diamond** - side input; back basis `3 x side`.

All cases add `2 x requested clearance` to the back basis, then subtract `EMT OD / 2` to convert to bend-center spacing.

## Inputs

**Required:** geometry card, pictured dimensions, EMT trade size.

**Optional:** requested clearance; First 45 Center from the chosen conduit end.

**Guide/Advanced:** support depth on either leg. Do not make this a minimum-flow input until demand is confirmed.

## Results

**Hero:** `Mark the two 45-degree centers [C-C] apart.`

If First 45 Center is supplied, show both absolute center marks. Otherwise do not invent a from-end mark.

**Secondary:** requested clearance and the selected orientation. Back-of-conduit basis belongs in Guide, not beside the hero.

## Field instructions

1. Measure the pictured obstruction envelope.
2. Mark the two centers at the returned spacing.
3. Align each mark to the mapped 45-degree center reference for the selected bender, or follow the calibrated-center method.
4. Bend two 45s in the same plane.
5. Check clearance before trimming either leg.

## Invalid and warning states

- Missing/zero/negative dimensions: withhold all marks.
- Center spacing less than or equal to zero: block.
- Missing EMT OD: block the center result.
- No known center reference for selected bender: show center geometry but block the exact bender instruction.
- Large requested clearance or very large obstruction: advisory to verify stick length.
- Result is spacing, not a guaranteed finished-leg/cut-length solution.

## Acceptance

A user looking at the job can select the same orientation shown in the diagram, identify which physical dimensions to measure, place two center marks, know which reference is required, and explain what the calculator does not solve.

## Verdict

**Correct and refine.** The math family is usable, but generic Square must be removed before this workflow is called complete.
