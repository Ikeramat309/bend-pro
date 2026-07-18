# QA report - lead adversarial review

## Verdict

**Research package: PASS.**

**Implementation readiness: PASS WITH WORKFLOW-SPECIFIC GATES.** Back-to-Back and Parallel Offsets are ready for refinement. Matching Offset and Compound 90 are ready only with the contract corrections in this package. Build a Run is product-ready but requires shared child-result architecture. Parallel Kick 90 is prototype-ready; not every variant is release-ready.

## Completeness

| Check | Result |
|---|---|
| Canonical root decision/audit/source files | Pass |
| Six workflow folders | Pass |
| Nine required files per workflow | Pass (54/54) |
| Parallel Kick 90 included | Pass |
| Direct user/app evidence separated from math evidence | Pass |
| Source IDs resolve | Pass |
| Mojibake scan of canonical package | Pass |
| Generated dependency tree absent | Pass |
| Formula smoke cases | Pass |
| Production files edited by this review | No |

Latest repository check: TypeScript, ESLint, import-cycle scan, and 69 Jest suites / 696 tests passed.

## Workflow scorecard

Scores are 0-4. `Ready` requires at least 3 for natural inputs, hero action, mark/reference, evidence, and boundary honesty.

| Workflow | Natural inputs | Hero/action | Mark/reference | Diagram contract | Evidence | Boundary honesty | Readiness |
|---|---:|---:|---:|---:|---:|---:|---|
| Back-to-Back 90 | 4 | 4 | 4 | 4 | 4 | 4 | Ready |
| Matching Offset | 4 | 4 | 3 | 4 | 3 | 4 | Ready with exact-angle gate |
| Parallel Offsets | 4 | 4 | 4 | 4 | 4 | 4 | Ready |
| Compound 90 | 4 | 4 | 3 | 4 | 4 | 4 | Ready after orientation model change |
| Build a Run | 4 | 4 | 3 | 4 | 3 | 4 | Product-ready; architecture staged |
| Parallel Kick 90s | 4 | 4 | 3 | 4 | 4 for manual modes / 2 for provisional progression | 4 | Prototype-ready; progression gated |

## Adversarial claim checks

### Compound 90

- **Rejected:** the two square formulas are competing rules for the same picture.
- **Confirmed:** wall-aligned square/rectangle and diamond square are separate source diagrams.
- **Confirmed:** requested clearance has a source rule and should not be left as mental arithmetic.
- **Open:** intermediate-rounding policy and cross-bender center references.

### Parallel Kick 90s

- **Confirmed:** single center-from-back formula includes half OD.
- **Confirmed:** front-of-shoe layout requires a measured shoe factor.
- **Confirmed:** parallel/perpendicular cabinet landing formulas solve different pictured jobs.
- **Rejected:** a current social comment's multiply-by-cos relationship where the primary manual divides by cos.
- **Gated:** applying half-angle progressive shift to every workflow called `parallel kick`.

### Matching Offset

- **Confirmed:** inverse triangle results are mathematically consistent.
- **Rejected:** an exact arbitrary angle is automatically executable on a stock hand bender.
- **Required:** common/uncommon angle status and center-reference method beside the hero.

### Build a Run

- **Confirmed:** user demand exists.
- **Rejected:** raw mark entry is equivalent to solved multi-bend layout.
- **Gated:** CLR/gain chaining and automatic bend-order optimization.

## Recomputed formula cases

| Case | Expected | Result |
|---|---:|---|
| Parallel Offset, S=2, angle=30 | 0.535898 in shift | Pass |
| Matching Bends, rise=6, DBB=12 | 30 deg | Pass |
| Matching Centers, rise=3, run=12 | 14.036243 deg; 12.369317 in DBB | Pass |
| Compound wall box 1.5 x 1.5, OD=1 | 3.742 in exact basis | Pass |
| Compound diamond side=1.5, OD=1 | 4 in | Pass |
| Kick center, K=2, angle=30, OD=1 | 4.5 in | Pass |
| Kick landing parallel, S=2, angle=30 | 4 in | Pass |
| Kick landing perpendicular, S=2.5, angle=30 | 2.886751 in | Pass |

## Link/evidence review

- Accessible and used: Klein, Greenlee, IBEW Local 903, Wheatland, Current Tools, QuickBend docs, official Apple/Google storefronts, public Reddit threads.
- Unavailable and non-blocking: IDEAL PDF, Navy PDF, local E-drive media.
- Facebook content was not accessible enough to quote or code reliably and is not represented as evidence.

## Validator

Run from the research output folder:

`node scripts/validate-research.mjs`

The validator checks canonical file completeness, source-ID resolution, encoding artifacts, absence of nested `node_modules`, and formula smoke cases. It does not replace human review of source diagrams.

## Residual implementation gates

1. Bender profile reference mappings for arbitrary/45-degree centers.
2. Compound saved-state migration from generic Square.
3. Parallel Kick chooser prototype and second-source/geometry test for provisional progression.
4. Build a Run child-result contract and versioning.
5. Production visual/extreme-value testing after implementation.

## Production isolation

This research upgrade did not modify `src/` or production `docs/`. The worktree already contains unrelated production changes from earlier calculator work; they were preserved.
