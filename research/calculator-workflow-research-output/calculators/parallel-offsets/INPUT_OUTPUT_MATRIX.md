# Parallel Offsets - input/output matrix

| Item | Class | Physical meaning | Result role | Evidence | Confidence |
|---|---|---|---|---|---|
| Rack C-C | Required | Centerline spacing between adjacent straight pipes | Shift basis | S-IBEW903-01 p. 4; S-ACCESS-01 | High |
| Bend angle | Required | Equal angle used for all offset bends | Shift/DBB | Same | High |
| Pipe count | Required | Number of rack conduits | Full relative table | Product/user need | High |
| Pipe 1 / order | Required | Physical reference edge of rack | Prevents mirroring | U-REDDIT-PK90-01; product | High |
| Direction along stick | Required for signed/absolute layout | Which conduit end receives progressive movement | Signs row shifts | Geometry/product | High |
| Shift per conduit | Inferred | Increment between corresponding marks | **Hero** | `S x tan(angle/2)` | High |
| Offset rise | Conditional Full Layout | Common perpendicular displacement | DBB | Standard offset geometry | High |
| DBB | Inferred in Full Layout | Center spacing between equal opposite bends | Hero support | `rise / sin(angle)` | High |
| Pipe 1 Center 1 | Optional | Absolute first center from named end | Enables absolute table | Product | High |
| Center 1/2 by pipe | Conditional inferred | Actual marks from named end | Action table | Geometry | High |
| Total rack shift | Inferred | `(count - 1) x shift` | Secondary/check | Geometry | High |
| Bender reference | Setup-derived | Center/converted mark method used consistently | Instruction/feasibility | Profile mapping | Medium |
| Mixed-size compensation | Unsupported | Different ODs/CLRs | Do not solve | Outside current evidence | - |
