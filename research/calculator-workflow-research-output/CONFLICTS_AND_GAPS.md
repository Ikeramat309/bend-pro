# Conflicts, resolutions, and open gaps

## Resolved in the lead pass

| ID | Issue | Resolution | Evidence |
|---|---|---|---|
| R-01 | Compound 90 `side x 3` vs `(height + width) x 1.414` was treated as a square-formula conflict | They are different obstacle orientations. Wall-aligned square uses the rectangle envelope; the `x3` page shows a square rotated like a diamond. Product needs an orientation choice. | S-IBEW903-01 pp. 8-10 visual inspection |
| R-02 | Whether clearance is merely a mental allowance | Source gives an explicit rule: increase the back-of-conduit basis by 2 inches per 1 inch requested clearance. Product should model it. | S-IBEW903-01 pp. 8-10 |
| R-03 | Whether Multiple Bends should simply be removed | Direct reviews establish demand. Keep the ambition, but stage it as Build a Run composed from validated calculators. | U-QB-APPLE-01; C-QB-DOCS-01 |
| R-04 | Whether social discussion can settle Parallel Kick math | It cannot. One current thread includes a wrong multiply-by-cos explanation beside the manual's divide-by-cos relationship. Social sources are restricted to pain/vocabulary. | U-REDDIT-PK90-01 vs S-IBEW903-01 p. 7 |

## Open conflicts that affect product scope

| ID | Question | Positions | Product decision now | What closes it |
|---|---|---|---|---|
| G-01 | Back-to-Back default vs Tight-U | Star is direct default; Arrow alternate is required when the shoe cannot fit | Default Star; explicit `Bender will not fit` alternate, never silent auto-switch | Minimum-fit data per bender if automatic detection is desired |
| G-02 | Exact Matching Offset angle vs stock marks | Geometry returns arbitrary angle; hand benders emphasize common marks | Keep exact result and gate uncommon angles behind angle tool + center calibration | Verified reference map or calibration feature |
| G-03 | Center-of-bend symbol across benders | Klein/Greenlee center notches differ; arbitrary-angle centers are not universally printed | Reference instructions are profile-dependent; generic fallback warns instead of naming a symbol | Complete bender reference database |
| G-04 | Parallel Kick naming | `parallel`, `stacked`, and `fanned` are used inconsistently | Illustrated geometry chooser; internal mode IDs do not depend on community labels | Usability test with electricians, not a terminology vote |
| G-05 | Parallel Kick rack progression vs cabinet landing | `tan(angle/2)` progression and `csc/cos` landing relationships solve different constraints | Split result by physical job; state which spacing is preserved | Prototype review with source diagrams and worked tests |
| G-06 | Support-depth adjustment in Compound 90 | Source supports it, but usage frequency is unknown | Put in Guide/Advanced, not minimum flow | User interviews or telemetry after beta |
| G-07 | Automatic multi-bend chaining | Competitors claim CLR/gain layouts; Bend Pro has incomplete per-shoe validation | Compose safe child results first; gate auto chaining | Bender database promotion + per-shoe engine tests |

## Evidence gaps

- Cross-brand arbitrary-angle center-reference mappings are incomplete.
- Parallel Kick `Forward` competitor behavior is named publicly but its exact on-screen geometry is not reproducibly captured in this session.
- The local QuickBend video/screenshot volume is unavailable in the current environment.
- IDEAL and Navy PDFs were inaccessible; no implementation decision depends on them.
- Physical field validation remains outside this desk-research pass, per founder direction.

## Non-gaps

- A social thread disagreeing with a primary manual is not a math conflict to average.
- QuickBend having a feature is not proof that Bend Pro should copy its inputs or engine.
- A mathematically valid exact angle is not automatically a complete field instruction.
