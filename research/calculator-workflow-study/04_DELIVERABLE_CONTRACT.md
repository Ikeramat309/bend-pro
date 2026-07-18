# Research Deliverable Contract

All final deliverables belong under:

`C:\Project\research\calculator-workflow-research-output`

## Required directory tree

```text
calculator-workflow-research-output\
  README.md
  EXECUTIVE_PRODUCT_DECISIONS.md
  CURRENT_APP_AUDIT.md
  CROSS_CALCULATOR_FIELD_CONTRACT.md
  COMPETITOR_SYNTHESIS.md
  SOURCE_REGISTER.md
  CONFLICTS_AND_GAPS.md
  RESEARCH_LOG.md
  QA_REPORT.md
  calculators\
    back-to-back-90\
      FIELD_WORKFLOW.md
      PRODUCT_SPEC.md
      INPUT_OUTPUT_MATRIX.md
      DIAGRAM_BRIEF.md
      CURRENT_GAP_AUDIT.md
      COMPETITOR_COMPARISON.md
      EVIDENCE_LEDGER.md
      WORKED_CASES.md
      OPEN_QUESTIONS.md
    matching-offset\
      ...same nine files...
    parallel-offsets\
      ...same nine files...
    compound-90\
      ...same nine files...
    multiple-bends\
      ...same nine files...
  workspace\
    ...agent folders from 02_AGENT_ASSIGNMENTS.md...
```

All files are Markdown. Optional machine-readable CSV/JSON indexes may be added,
but they cannot replace the required reports.

## Root deliverables

### `README.md`

- Research purpose, scope, date, and elapsed time.
- Agent roster and assignments.
- Output map.
- Source counts by grade.
- Explicit statement that production code was untouched.

### `EXECUTIVE_PRODUCT_DECISIONS.md`

Begin with this table:

| Workflow | Current verdict | Recommended product definition | Required inputs | Hero output | Main field action | Confidence | Ready to redesign? |
|---|---|---|---|---|---|---|---|

Then list:

- decisions supported strongly enough to implement;
- decisions requiring founder preference;
- decisions blocked by evidence;
- features or modes recommended for removal/deferment;
- the recommended redesign order by field value and confidence.

### `CURRENT_APP_AUDIT.md`

Compare the current five screens with the research outcome. Do not treat
existing code as the baseline of truth.

| Workflow | Current job implied | Current required inputs | Current hero output | What is correct | What is generic/incomplete | Safety or usability consequence |
|---|---|---|---|---|---|---|

### `CROSS_CALCULATOR_FIELD_CONTRACT.md`

Define reusable product rules discovered across calculators:

- how measurement origin is communicated;
- when absolute marks are optional versus necessary;
- how bender references are named;
- bend order, hook direction, rotation, and flip cues;
- hero/secondary/on-pipe result hierarchy;
- required/conditional/optional progressive disclosure;
- setup-only bender context;
- invalid-state withholding rules;
- what belongs in the pro screen versus Guide.

Do not turn this into a new visual style guide. It is a field-information
contract.

### `COMPETITOR_SYNTHESIS.md`

Summarize QuickBend and other tools by workflow, with observed behavior separate
from interpretation. Identify which patterns Bend Pro should adopt, improve,
avoid, or validate further.

### `SOURCE_REGISTER.md`

One row per source:

| Source ID | Title | Organization/author | URL | Type | Published/revised | Accessed | Grade | Workflows | Exact page/section/timestamp | What it supports | Limitations |
|---|---|---|---|---|---|---|---|---|---|---|---|

### `CONFLICTS_AND_GAPS.md`

One record per unresolved issue:

| Conflict ID | Claim/question | Source positions | Why they differ | Product impact | Current recommendation | What resolves it |
|---|---|---|---|---|---|---|

### `RESEARCH_LOG.md`

Timestamped search and synthesis log. Include failed searches, inaccessible
sources, scope changes, agent handoffs, and corrections.

### `QA_REPORT.md`

- Completeness result for each required file.
- Scorecard result per workflow.
- Traceability sampling.
- Recomputed worked examples.
- Uncited or weak claims.
- Conflict-hiding check.
- Production-file change check.
- Final verdict: pass, pass-with-caveats, or fail.

## Per-calculator deliverables

### `FIELD_WORKFLOW.md`

- One-sentence job story.
- Starting physical state.
- Available field measurements.
- Required tools.
- Measurement origins.
- Full mark/bend/check sequence.
- Bender reference, hook direction, and rotation at every bend.
- Common mistakes and recovery.
- Variants that should not be silently combined.

### `PRODUCT_SPEC.md`

Use this exact order:

1. Recommended product name.
2. One-sentence promise to the user.
3. Entry condition: when to use it and when not to.
4. Recommended calculator/mode boundary.
5. Minimum complete flow.
6. Required inputs.
7. Conditional inputs.
8. Optional inputs.
9. Setup-derived inputs.
10. Unsupported inputs or outputs.
11. Hero output.
12. Secondary outputs, maximum two.
13. On-diagram field instructions.
14. Warnings and blocked states.
15. Pro interaction flow.
16. Apprentice/Guide additions.
17. Current implementation verdict.
18. Acceptance criteria for a future implementation.
19. Evidence confidence and open decisions.

### `INPUT_OUTPUT_MATRIX.md`

Include:

| Item | Required classification | Physical meaning | How user obtains it / uses it | Affects | Display role | Evidence IDs | Confidence |
|---|---|---|---|---|---|---|---|

Every current and proposed input/output must appear, including items recommended
for removal.

### `DIAGRAM_BRIEF.md`

- Empty, valid, conditional, invalid, and extreme states.
- Pipe pose and physical reference object.
- Mark positions and wrap treatment.
- Measurement vectors and attachment points.
- Bend order, bender reference, hook, flip, and rotation cues.
- Hero/supporting annotations.
- Collision/legibility priorities.
- Text wireframe.
- A “must not imply” list.

### `CURRENT_GAP_AUDIT.md`

Map current behavior to evidence:

| Current decision | Supported, incomplete, contradicted, or unproven | Evidence | User consequence | Recommended action |
|---|---|---|---|---|

### `COMPETITOR_COMPARISON.md`

Compare observed inputs, outputs, modes, diagrams, and field completeness. Include
at least QuickBend when material is available. Avoid claiming hidden formulas.

### `EVIDENCE_LEDGER.md`

One row per procedural, numeric, terminology, or product claim:

| Claim ID | Claim | Claim type | Source IDs | Grade | Direct evidence or inference | Confidence | Product consequence |
|---|---|---|---|---|---|---|---|

### `WORKED_CASES.md`

Normal, conditional, edge/invalid, and metric cases. Show exact and displayed
values, measurement origins, complete field actions, and source IDs.

### `OPEN_QUESTIONS.md`

Separate:

- founder product choices;
- questions answerable through more desk research;
- questions needing QuickBend comparison;
- questions needing an electrician/physical bend;
- intentionally unsupported scope.

## Acceptance standard

A deliverable is incomplete if it gives formulas but cannot state how to measure,
mark, orient, bend, and check the conduit. A beautiful screen recommendation is
not acceptable without a complete field workflow.
