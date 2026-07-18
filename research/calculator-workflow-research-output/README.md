# Bend Pro calculator workflow research - lead review

This package is the product and field-workflow basis for six Bend Pro workflows:

1. Back-to-Back 90
2. Matching Offset
3. Parallel Offsets
4. Compound 90
5. Multiple Bends / Build a Run
6. Parallel Kick 90s

The original multi-agent desk study was useful, but it was not implementation-grade. This lead review adds primary-manual page checks, direct app-store reviews, public electrician discussions, a sixth workflow, explicit field actions, and adversarial product decisions.

## How to use this package

Read in this order:

1. `EXECUTIVE_PRODUCT_DECISIONS.md` - what Bend Pro should build
2. `IMPLEMENTATION_ROADMAP.md` - order, gates, and Definition of Done
3. `CROSS_CALCULATOR_FIELD_CONTRACT.md` - rules every calculator must obey
4. `USER_VOICE_SYNTHESIS.md` - what working electricians praise and struggle with
5. `CURRENT_APP_AUDIT.md` - gaps in the existing Bend Pro workflows
6. `calculators/<workflow>/PRODUCT_SPEC.md` - the contract for one workflow
7. `SOURCE_REGISTER.md`, `CONFLICTS_AND_GAPS.md`, and `QA_REPORT.md` - evidence and caveats

`SOL_UPGRADE_REPORT.md` explains what changed from the original Grok package.

## Authority rules

- Manufacturer manuals and apprenticeship material may support math and bender procedure.
- Bend Pro engine tests may describe current behavior, but do not prove field correctness.
- Competitor documentation may establish feature presence and interaction patterns, not truth.
- App reviews, Reddit, forums, Facebook, and video comments may establish vocabulary, frustration, demand, and failure modes. They never establish calculator math on their own.
- When a source uses the same word for different geometry, the product must ask with a diagram. It must not guess from the label.

## Executive verdict

| Workflow | Product call | Development readiness |
|---|---|---|
| Back-to-Back 90 | Refine the direct Star method; keep Tight-U as an explicit alternate | Ready |
| Matching Offset | Keep two measurement modes; add an exact-angle action gate | Ready with a required uncommon-angle warning |
| Parallel Offsets | Keep one workflow with Quick Shift and Full Rack views | Ready |
| Compound 90 | Correct the obstruction-orientation model and add clearance | Ready after the shape/orientation contract replaces generic Square |
| Multiple Bends | Make it Build a Run, a composer of solved bends; do not ship a raw-mark notebook as a flagship calculator | Product-ready, engine work staged |
| Parallel Kick 90s | Start with an illustrated geometry chooser; support center-based kick and landing-spacing cases | Ready for prototype; release math remains gated by reference mapping |

## Isolation

All authored changes in this review are under `research/calculator-workflow-research-output/`. Production `src/` and production documentation were not edited.

## Reproducibility note

The source cache contains downloaded manuals used for page inspection. Generated dependency folders are not research evidence and are removed during cleanup. Canonical URLs and exact pages are in `SOURCE_REGISTER.md`.
