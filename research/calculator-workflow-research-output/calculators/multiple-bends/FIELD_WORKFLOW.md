# Build a Run - field workflow

## Starting state

The electrician knows the intended run as a sequence of field jobs: for example a stub 90, an offset, then a cut. They may not yet know every conduit mark.

## Compose

1. Choose conduit stick length and label the measurement end.
2. Tap `Add bend` and choose the physical job.
3. Solve that child using its normal natural inputs.
4. Anchor the child in the run using a field dimension its calculator understands.
5. Repeat for additional bends/cuts.
6. Set or confirm bend order and plane changes.

## Review

1. Read the fit state.
2. Inspect the full-stick diagram and ordered marks.
3. Resolve off-stick, stale, or conflicting-origin items.
4. Expand each bend card to confirm its bender reference, rotation, and warnings.
5. Mark the physical conduit from the named end.
6. Bend in the confirmed order, checking the run after each child.

## Common failures the feature must prevent

- Marks measured from opposite ends appearing in one sorted list.
- A child edit leaving old marks behind.
- Bend-order numbers implying an unsupported automatic sequence.
- A manual mark appearing identical to an engine-solved mark.
- Two child calculators using different reference conventions without conversion.
- A 10-foot fit calculation ignoring validated shrink/gain effects or pretending unvalidated ones are known.

## Field check

The user can trace every mark back to a child calculator and identify which values are measured, derived, profile-specific, or manually supplied.
