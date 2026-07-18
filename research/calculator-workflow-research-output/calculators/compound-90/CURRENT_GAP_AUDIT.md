# Compound 90 - current gap audit

## Critical

The current `square` engine path uses `side x 3 - OD/2` while the UI name implies any square. In the source, that rule belongs to the square turned like a diamond. A square whose sides align to the walls belongs to the rectangular-envelope rule. The current product can therefore be mathematically consistent with one diagram and wrong for the user's pictured square.

## Important

- Requested clearance is evidenced but absent from the natural input set.
- `First Bend Mark` lacks a strong job story unless labeled explicitly as a center station from the selected end.
- The selected bender is shown but does not alter the formula; this must be stated.
- Exact 45-degree center-reference mapping is not complete across every bender profile.
- The hero must say center-to-center, not simply `Between Bends`.

## Good foundations

- Round `2.4D` and rectangle `(H+W) x 1.414` formula families are supported.
- Half-OD conversion correctly distinguishes back-of-conduit from bend centers.
- Optional absolute marks can remain if their origin is explicit.
- The existing steel-tube diagram system can represent the corrected modes.
