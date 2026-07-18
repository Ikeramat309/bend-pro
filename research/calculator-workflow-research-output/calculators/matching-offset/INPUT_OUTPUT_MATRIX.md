# Matching Offset - input/output matrix

| Item | Class | Physical meaning | Result role | Evidence | Confidence |
|---|---|---|---|---|---|
| Measurement card | Required | Which length can be measured reliably | Chooses inverse relationship | S-IBEW903-01 p. 15; S-CT754-01; C-QB-DOCS-01 | High job, medium naming |
| Rise | Required | Perpendicular separation of finished parallel legs | Solves angle/spacing | Same | High |
| Along the Run | Required in Match Centers | Projected distance between bend-center stations | `atan(rise/run)` and DBB | Geometry | High |
| Along the Pipe | Required in Match Bends | Sloped center-to-center distance | `asin(rise/DBB)` | S-IBEW903-01 p. 15 | High |
| Exact angle | Inferred | Existing offset angle | **Hero** | Inverse trig | High math |
| Center spacing | Inferred/input | Distance between new bend-center marks | **Hero** | Geometry | High |
| Exact-angle execution status | Inferred from profile | Whether selected bender/reference can reproduce angle | Hero gate | Manufacturer/profile mapping | Medium until database complete |
| First Center | Optional | Absolute center station from chosen end | Enables Mark 1/2 | Product | Medium |
| Projected run / shrink | Inferred support | Check and length effect | Secondary/Guide | Geometry; C-QB-TRIG-01 | High math, secondary need |
| Common-angle comparison | Optional action | Alternative chosen angle and resulting mismatch | Decision aid | Geometry | High math; UX to validate |
| CLR visual equivalence | Unsupported guarantee | Exact curve shape of original shoe | Warning | Requires matching shoe/profile | - |
