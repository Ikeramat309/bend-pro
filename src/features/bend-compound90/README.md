# Compound 90

One Bend Pro calculator covers three distinct obstruction orientations with the
standard two-45 compound-90 field layout. Orientation is explicit because a
wall-aligned box and a square set on a corner do not use the same field factor.

## Current model

- Round at corner: diameter × 2.4 + 2 × clearance per side − 1/2 EMT OD
- Box flat to walls: (height + width) × 1.414 + 2 × clearance per side − 1/2 EMT OD
- Square on point: side length × 3 + 2 × clearance per side − 1/2 EMT OD
- Optional First Bend Mark produces an absolute Second Bend Mark.

The field-table result plus requested clearance first locates the back/outside
of conduit; subtracting
half the nominal EMT outside diameter converts it to the bend-center spacing
shown by the diagram. Outside diameters come from Wheatland Tube's official EMT
product sheet. These are field-table calculations, not centerline-radius gain.
The selected bender is setup context only and does not change the result.

Primary field reference: [IBEW Local 903 Bending Book rev2](https://lu903.com/wp-content/uploads/2017/06/Bending-Book-rev-2-full.pdf).
EMT OD reference: [Wheatland Tube 20' EMT and Conduit data sheet](https://www.wheatland.com/wp-content/uploads/2017/12/20-EMT-and-Conduit-Flyer.pdf).

The feature is active as `compound90` at `/compound90`, with contextual Guide
content, recent-layout persistence, and dark/light mobile QA.
