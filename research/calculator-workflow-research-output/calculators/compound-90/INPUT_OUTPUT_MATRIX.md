# Compound 90 - input/output matrix

| Item | Class | Physical meaning | Result use | Evidence | Confidence |
|---|---|---|---|---|---|
| Geometry card | Required | Orientation of the obstacle relative to the corner | Selects formula and diagram | S-IBEW903-01 pp. 8-10 | High |
| Diameter | Required for round | Outside diameter of round obstacle | `2.4D` back basis | S-IBEW903-01 p. 9 | High |
| Height + width | Required for wall-aligned box | Two perpendicular envelope dimensions | `1.414(H+W)` back basis | S-IBEW903-01 pp. 8-9 | High |
| Diamond side | Required for diamond | Side shown on turned-square diagram | `3S` back basis | S-IBEW903-01 p. 10 | High |
| Requested clearance | Optional, default 0 | Additional physical clearance | Adds `2C` to back basis | S-IBEW903-01 pp. 8-10 | High |
| EMT trade size / OD | Required setup | Outside diameter of conduit | Subtract `OD/2` for center marks | S-WHEAT-01; S-IBEW903-01 | High |
| C-C between 45s | Inferred | Centerline distance between bend centers | **Hero** | S-IBEW903-01 pp. 8-10 | High |
| First 45 center | Optional | Absolute center station from selected end | Enables two absolute marks | Product boundary | Medium |
| Second 45 center | Conditional inferred | First center + C-C | On-pipe result | Geometry | High |
| Bender center reference | Setup-derived | Shoe location representing center of a 45 | Bend instruction | S-KLEIN-01 pp. 1, 10; S-GREENLEE-01 p. 9 | Medium/brand-specific |
| Support depth | Advanced/Guide | Stand-off on each leg | Source adjustment | S-IBEW903-01 pp. 8-10 | High math, unknown demand |
| Finished leg/cut length | Unsupported by core | Final landing beyond the compound bend | Do not imply | Not established by this input set | - |
