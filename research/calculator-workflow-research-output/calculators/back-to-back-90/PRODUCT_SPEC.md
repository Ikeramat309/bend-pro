# Back-to-Back 90 - product specification

## Job

Make two opposing 90s whose backs land a known distance apart between parallel surfaces.

## Minimum flow

Input: **Back-to-Back Distance**.

Hero: `From the back of Bend 1, mark [distance]. Align that mark to Star for Bend 2.`

Action strip:

1. Bend or confirm Bend 1.
2. Measure from its physical back.
3. Mark the entered distance.
4. Hook faces the free end, opposite Bend 1.
5. Align Star and bend 90 in the same plane.
6. Check outside-to-outside fit and dog-leg.

## Optional first stub

When the first 90 is not yet bent, `Add First Stub` accepts finished stub length and returns the first Arrow mark using the selected bender's verified deduct. This remains subordinate to the Back-to-Back hero.

## Tight-U alternate

An explicit `Bender will not fit` action reveals the Klein Tight-U Arrow method. It requires first stub height and computes the alternate second layout described by the manufacturer. The mode changes hook direction and reference, so the diagram and action strip must switch completely. Do not auto-select it without per-bender fit data.

## Inputs

- Required: finished Back-to-Back Distance.
- Conditional: First Stub Length.
- Conditional: Tight-U alternate.
- Setup: bender profile, EMT size, units, rounding.

## Warnings

- Non-positive distance: block.
- First stub at or below deduct: block first-bend mark.
- Tight-U result at or below zero: block.
- Missing verified deduct: direct second Star mark may remain, but first stub mark is withheld.
- Star not mapped on selected profile: retain center geometry and show a reference warning.

## Boundary

This workflow does not calculate long-run developed cut length, gain-based reverse bending, or final free-leg trimming.

## Verdict

**Refine, implementation-ready.** The existing job and hero are right; procedural and Tight-U states need completion.
