# Compound 90 - worked cases

Final display rounding must be tested separately from exact engine values. Examples below use 1-inch OD where the source examples do.

## Wall-aligned square

- Height = 1.5 in
- Width = 1.5 in
- Clearance = 0
- EMT OD = 1.0 in

Back basis = `(1.5 + 1.5) x 1.414 = 4.242 in`.

Center spacing = `4.242 - 0.5 = 3.742 in`, displayed approximately `3 3/4 in`.

## Wall-aligned rectangle

- Height = 1 in
- Width = 2 in
- Clearance = 0
- EMT OD = 1 in

Same 3-inch envelope sum, so the center spacing is also approximately `3 3/4 in`. The diagram, not the value, distinguishes this job from the equal-sided case.

## Round obstruction

- Diameter = 2 in
- Clearance = 0
- EMT OD = 1 in

Back basis = `2.4 x 2 = 4.8 in`.

Center spacing = `4.8 - 0.5 = 4.3 in`, displayed to the selected fraction. Source table arithmetic rounds the intermediate back basis to `4 13/16 in` and then shows `4 5/16 in`; tests must document whether Bend Pro rounds only at display or at intermediate field-table steps.

## Diamond square

- Side = 1.5 in
- Clearance = 0
- EMT OD = 1 in

Back basis = `1.5 x 3 = 4.5 in`.

Center spacing = `4.5 - 0.5 = 4 in`.

## Clearance

Using the diamond case above with 1 inch requested clearance:

Back basis = `4.5 + (2 x 1) = 6.5 in`.

Center spacing = `6.5 - 0.5 = 6 in`.

## Rejection cases

- zero dimension;
- missing second dimension in wall-aligned mode;
- negative clearance;
- missing EMT OD;
- result at or below zero after center conversion;
- absolute First Center plus spacing beyond available stick when stick length is supplied by Build a Run.
