# Research Review Scorecard

The specialist self-scores first. The adversarial QA agent scores independently.
The final score is the QA score, with disagreements recorded.

Use 0–4 for each criterion:

- **0 — absent:** not addressed.
- **1 — weak:** asserted with little evidence or field detail.
- **2 — partial:** useful but important ambiguity remains.
- **3 — strong:** evidence-backed and implementation-ready with minor caveats.
- **4 — exceptional:** independently corroborated, physically explicit, minimal,
  and robust across normal/edge cases.

## Per-workflow score

| Criterion | Weight | What earns a 4 |
|---|---:|---|
| Job-to-be-done clarity | 2 | A field worker's starting condition and desired finished state are unambiguous |
| Measurement naturalness | 3 | Every required input is naturally available and its physical origin is explicit |
| Minimum input discipline | 2 | Required, conditional, optional, setup-derived, and unsupported values are justified |
| Output actionability | 3 | Every shown result maps to a physical measure/mark/bend/check action |
| Hero result correctness | 3 | The dominant result is the actual answer to the field job |
| Mark/reference completeness | 3 | Origin, wrap mark, bender symbol, bend order, hook direction, and rotation are covered |
| Diagram information brief | 2 | Empty/valid/invalid states communicate the workflow without decorative clutter |
| Evidence strength | 3 | Core procedure has independent Grade A/A-B support with precise citations |
| Math/procedure traceability | 3 | Worked cases and recommendations trace to source claims and recompute correctly |
| Conflict honesty | 2 | Competing methods and evidence gaps remain visible and scoped |
| Safety and invalid states | 2 | Impossible, ambiguous, unsupported, and extreme states withhold misleading outputs |
| Product-boundary judgment | 2 | Keep/split/merge/reframe/remove verdict follows evidence rather than sunk cost |
| Competitor insight | 1 | Observed patterns are separated from inference and translated into original product value |
| Pro speed | 1 | A journeyman can reach the complete answer with minimal unnecessary interaction |
| Apprentice learnability | 1 | Guide additions teach measurement and procedure without cluttering the pro flow |

Maximum weighted score: 120.

## Decision bands

- **102–120:** ready for Bend Pro lead to design/implement.
- **84–101:** usable with named caveats; resolve high-impact questions first.
- **66–83:** major research or workflow gaps; do not redesign yet.
- **Below 66:** reject current specification.

Regardless of total, a workflow cannot be “ready” when any of these critical
criteria scores below 3:

- measurement naturalness;
- output actionability;
- hero result correctness;
- mark/reference completeness;
- evidence strength;
- math/procedure traceability.

## Required score table

| Workflow | Weighted score | Critical-floor passed? | Specialist verdict | QA verdict | Ready to redesign? | Blocking gaps |
|---|---:|---|---|---|---|---|
| Back-to-Back 90 | | | | | | |
| Matching Offset | | | | | | |
| Parallel Offsets | | | | | | |
| Compound 90 | | | | | | |
| Multiple Bends | | | | | | |

## Package-level checks

The package passes only when:

- all required files exist;
- source IDs resolve across reports;
- no high-impact recommendation is uncited;
- normal and edge worked cases were recomputed;
- current-app observations are accurate;
- Multiple Bends includes remove/defer as a seriously evaluated option;
- Box Offset and Hydraulic Layout stayed out of scope;
- no production files changed;
- final caveats match `CONFLICTS_AND_GAPS.md`.

The QA report must list failed checks explicitly. “Looks comprehensive” is not a
valid QA result.
