# Research log

## Original Grok pass

The first pass created five 9-file workflow packages, root synthesis, source cache, and a preliminary QA report. It correctly identified strong Back-to-Back and Parallel Offset foundations and the need to reframe Multiple Bends. Its largest limitations were thin user evidence, incomplete field-reference instructions, no Parallel Kick 90 package, and conclusions that often restated the current app.

## Lead audit - 2026-07-16

### Package inspection

- Read every root decision/QA file and the field, product, and I/O files for all five workflows.
- Identified 45/45 original calculator files and a generated dependency tree inside the source cache.
- Treated `workspace/` agent notes as supplemental, not canonical decisions.

### Primary-source inspection

- Extracted text from the locally cached Klein, Greenlee, IBEW, Current Tools, and Wheatland PDFs.
- Rendered and visually inspected IBEW PDF pages 4-10 rather than relying on OCR alone.
- Verified:
  - p. 4 parallel-offset progression;
  - p. 5 kicked-90 center and shoe-factor method;
  - pp. 6-7 two cabinet orientation relationships;
  - pp. 8-10 compound obstruction orientation, clearance, support notes;
  - p. 15 matching-existing-offset method.
- Visual inspection resolved the supposed Compound 90 square-formula conflict as two different orientations.

### Competitor and user research

- Reviewed QuickBend public docs for feature list, centers, trig language, Multiple Bends, and impossible-state behavior.
- Reviewed official Apple and Google Play listings and visible direct reviews for QuickBend and iBend Pipe.
- Reviewed public electrician discussions about app acceptance, bend order, matching/parallel work, and parallel kicked 90s.
- Attempted public Facebook search; usable electrician post content was login-gated and excluded.
- Confirmed the local `E:\quick bend example` path is not mounted in this session.

### Synthesis

- Rewrote all nine files for each original workflow.
- Added a complete nine-file Parallel Kick 90 package.
- Added lead upgrade, user voice, and implementation roadmap reports.
- Rewrote source, conflict, competitor, current audit, executive, and cross-calculator contracts.
- Removed generated `node_modules` and the malformed/stale one-shot package generator from the research workspace.
- Added and ran a dependency-free research validator.

## Search/exclusion discipline

- Used primary manuals for math/procedure.
- Used competitor docs for observed feature/interaction claims.
- Used reviews/forums/social sources only for user needs, language, and failure modes.
- Excluded weak SEO calculator pages, inaccessible Facebook content, and third-party review aggregation when direct storefront evidence existed.

## Production isolation

All mutations in this lead pass targeted `research/calculator-workflow-research-output/` plus temporary rendered PDF pages that were deleted after inspection. Existing production changes in the dirty worktree were not edited.
