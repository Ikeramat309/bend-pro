# Parallel Kick 90s - worked cases

## Primary manual: single 30-degree kick

- Kick = 2 in
- Angle = 30 deg; csc = 2
- EMT OD = 1 in

Center from back of 90 = `2 x 2 + 0.5 = 4.5 in`.

If calibrated shoe factor is 0.75 in, front-of-shoe station = `4.5 - 0.75 = 3.75 in` from the back reference in the displayed direction.

## Rack parallel to cabinet

- Rack C-C = 2 in
- Angle = 30 deg

Landing C-C = `2 x csc(30) = 4 in`.

For three pipes with first kick 2 in and 1-inch OD:

| Pipe | Kick | Center from back of 90 |
|---:|---:|---:|
| 1 | 2 in | 4.5 in |
| 2 | 4 in | 8.5 in |
| 3 | 6 in | 12.5 in |

The 4-inch center progression matches the calculated landing C-C. This table is a derived combination of the manual's p. 5 and p. 6 relationships and must be labeled as such in engine documentation.

## Rack perpendicular to cabinet

- Rack C-C = 2.5 in
- Angle = 30 deg

Landing C-C = `2.5 / cos(30) = 2.8868 in`, displayed approximately `2 7/8 in`, matching the source example.

## Provisional through-bend progression

- Rack C-C = 5 in
- Angle = 30 deg

Progressive kick-center shift = `5 x tan(15) = 1.3397 in`.

This number must not be mixed into the cabinet landing table unless the selected physical mode requires that constraint.

## Rejection/property cases

- angle 0 or 90 degrees;
- count below 2;
- missing/negative kick or spacing;
- front-of-shoe result below zero after shoe-factor subtraction;
- mixed EMT sizes;
- no executable center/shoe reference;
- reverse rack order must reverse table order without changing magnitudes.
