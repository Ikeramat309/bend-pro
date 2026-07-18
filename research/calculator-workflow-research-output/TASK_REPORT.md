# Task report

**Files changed:**

- Root reports created/rewritten: `README.md`, `EXECUTIVE_PRODUCT_DECISIONS.md`, `IMPLEMENTATION_ROADMAP.md`, `CROSS_CALCULATOR_FIELD_CONTRACT.md`, `USER_VOICE_SYNTHESIS.md`, `CURRENT_APP_AUDIT.md`, `COMPETITOR_SYNTHESIS.md`, `SOURCE_REGISTER.md`, `CONFLICTS_AND_GAPS.md`, `RESEARCH_LOG.md`, `SOL_UPGRADE_REPORT.md`, `QA_REPORT.md`, `TASK_REPORT.md`.
- Rewritten for `calculators/back-to-back-90/`: `PRODUCT_SPEC.md`, `FIELD_WORKFLOW.md`, `INPUT_OUTPUT_MATRIX.md`, `DIAGRAM_BRIEF.md`, `CURRENT_GAP_AUDIT.md`, `EVIDENCE_LEDGER.md`, `WORKED_CASES.md`, `OPEN_QUESTIONS.md`, `COMPETITOR_COMPARISON.md`.
- Rewritten for `calculators/matching-offset/`: the same nine contract files.
- Rewritten for `calculators/parallel-offsets/`: the same nine contract files.
- Rewritten for `calculators/compound-90/`: the same nine contract files.
- Rewritten for `calculators/multiple-bends/`: the same nine contract files.
- Created for `calculators/parallel-kick-90/`: the same nine contract files.
- Created: `scripts/validate-research.mjs`.
- Deleted: `workspace/_generate_packages.mjs` (malformed, stale, and capable of overwriting the upgraded package).
- Deleted generated dependency folder: `workspace/_source-cache/node_modules/`.

**What changed:**

- Upgraded the original five-workflow draft into six complete implementation-guidance packages.
- Added primary-manual visual inspection and exact page traceability.
- Added direct app review and electrician-discussion synthesis with a strict rule that social evidence cannot establish math.
- Added Parallel Kick 90s with separate pictured geometry/landing constraints and shoe-factor reference requirements.
- Corrected Compound 90's supposed square-formula conflict: wall-aligned and diamond squares are different source geometries.
- Reframed Multiple Bends as a staged Build a Run composer of validated child calculators.
- Added action gates for Matching Offset arbitrary angles and stable Pipe 1/full mark tables for rack workflows.
- Added deterministic package/encoding/source/formula validation.

**Why it changed:**

The original research was organized but not specific enough to design field-ready calculators. These changes turn it into a product contract that defines natural inputs, hero actions, marks, bender references, diagrams, boundaries, evidence, and release gates.

**Intentionally not changed:**

- No production files under `src/` or production `docs/` were edited.
- No calculator math, routes, registry entries, or UI were changed.
- Supplemental original agent notes under `workspace/` were retained as provenance, even where the canonical lead reports supersede them.
- Downloaded primary manuals remain in `_source-cache` for inspection; canonical links/pages remain in `SOURCE_REGISTER.md`.
- Physical field validation was not added because the founder explicitly chose desk comparison/feedback as the current validation posture.

**How to test:**

- `node research/calculator-workflow-research-output/scripts/validate-research.mjs`
- `npm run check`

Latest results: research validator passed; TypeScript, ESLint, import-cycle scan, and 69 Jest suites / 696 tests passed.

**Risks / follow-up:**

- Compound 90 needs a saved-state migration decision before changing generic Square in production.
- Matching Offset and Compound 90 need verified bender center-reference mappings.
- Parallel Kick 90's through-bend half-angle progression remains release-gated pending an additional geometry/source check.
- Build a Run requires a versioned child-result contract before UI implementation.
- The local QuickBend media drive and two PDFs were unavailable; no decision depends solely on them.
