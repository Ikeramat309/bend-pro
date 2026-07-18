# Parallel Offsets - worked cases

## Primary progression example

- Rack C-C = 2 in
- Angle = 30 deg

Shift = `2 x tan(15) = 0.5359 in`, displayed approximately `9/16 in` using field rounding. This matches the IBEW example.

## Four-pipe Full Layout

- Rack C-C = 2 in
- Angle = 30 deg
- Rise = 6 in
- Pipe 1 Center 1 = 10 in from start end
- Direction = toward free end / increasing station

DBB = `6 / sin(30) = 12 in`.

| Pipe | Shift from Pipe 1 | Center 1 | Center 2 |
|---:|---:|---:|---:|
| 1 | 0 | 10.0000 | 22.0000 |
| 2 | 0.5359 | 10.5359 | 22.5359 |
| 3 | 1.0718 | 11.0718 | 23.0718 |
| 4 | 1.6077 | 11.6077 | 23.6077 |

Display rounding applies only after canonical rows are calculated.

## Reverse direction

Same inputs with decreasing station subtract each row shift. Pipe 1 remains 10/22; Pipe 4 becomes approximately 8.3923/20.3923. If any station becomes negative, withhold that absolute row while retaining relative shifts.

## Properties/rejections

- Shift is zero only when spacing or angle is zero; those inputs are invalid for a real layout.
- Difference between adjacent pipe rows is constant.
- DBB is identical for every pipe.
- Center 2 - Center 1 equals DBB for every valid row.
- Reversing direction changes signs/stations, not magnitudes.
- Mixed sizes/angles/rises are rejected.
