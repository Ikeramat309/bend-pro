# Required Multi-Agent Research Plan

The orchestrator owns synthesis and must use parallel specialists. Specialists
may challenge the current calculator boundaries. Each specialist writes to an
isolated folder under `workspace/`; only the orchestrator writes final reports.

## Output workspace

Create:

```text
C:\Project\research\calculator-workflow-research-output\
  workspace\
    agent-01-field-foundations\
    agent-02-back-to-back\
    agent-03-matching-offset\
    agent-04-parallel-offsets\
    agent-05-compound-90\
    agent-06-multiple-bends\
    agent-07-competitors\
    agent-08-adversarial-qa\
```

Every agent must leave a `RESEARCH_NOTES.md`, `SOURCES.md`, and
`UNRESOLVED.md`. Specialist workspaces are evidence trails, not final product
specifications.

## Orchestrator — product research lead

Responsibilities:

- Establish current-app assumptions before external research.
- Dispatch all specialists with the universal questionnaire.
- Prevent agents from editing production files.
- Reconcile duplicate claims without hiding disagreements.
- Convert field evidence into interaction contracts.
- Distinguish mathematical correctness from workflow usefulness.
- Produce final verdicts and ensure QA happens after synthesis.

The orchestrator must not let majority vote replace evidence.

## Agent 01 — field foundations and terminology

Research how hand-bender workflows are actually taught and executed:

- measurement origins and finished-dimension conventions;
- arrow, star, rim, notch, center, and other bender references;
- hook direction, conduit orientation, flip/rotation language;
- how journeymen sequence measure → mark → bend → check;
- which inputs are normally known from the installation versus calculated;
- common causes of scrap and rework;
- differences between teaching terminology and job-site shorthand.

Deliver a cross-calculator field vocabulary and a list of workflow facts that
must appear visually rather than as explanatory prose.

## Agent 02 — Back-to-Back 90 specialist

Determine the actual jobs hidden behind “back-to-back”:

- Is the common goal two parallel legs at a finished distance, a U-shaped piece,
  two stubs, or several distinct workflows?
- What is already bent when the second measurement is made?
- Is a direct star-reference distance sufficient, or do users need first/second
  stub heights, overall outside dimension, cut length, gain, or a choice of
  reference method?
- When and how is the star used across major hand-bender manuals?
- Which way must the hook face for both bends?
- What result and diagram would let the user complete both bends without
  translating instructions mentally?

Compare the current direct-distance screen with at least two manufacturer
methods and one apprenticeship/trade source when available.

## Agent 03 — Matching Offset specialist

Treat Match Centers and Match Bends as separate hypotheses first.

- What physical object or existing bend is being matched?
- How does the electrician locate bend centers on already-bent conduit?
- Which measurements are realistically obtainable: rise, center distance along
  conduit, straight-run projection, bend angle, outside dimensions, or marks?
- Does the app need to reproduce an arbitrary calculated angle, choose the
  closest field angle, or support both with explicit consequences?
- What mark-from-end workflow turns triangle results into a bendable new piece?
- Is shrink a useful hero/supporting value here, or is it secondary to marks?
- When do “matching centers” and “matching bends” produce meaningfully different
  user flows?

Reject any mode whose required measurement cannot be explained and taken
reliably in the field.

## Agent 04 — Parallel Offsets specialist

Research the complete rack-layout job, not only the half-angle formula.

- What is the installation goal: preserve spacing through one offset, align bend
  centers, align finished runs, or avoid conduit collisions?
- How is rack spacing measured—center-to-center, edge-to-edge, or fixed support
  spacing?
- Which conduit is the reference and how does the user choose inside/outside or
  toward/away direction?
- Do both marks shift equally for each pipe under the field method?
- What inputs are required for a quick “shift only” answer versus a complete
  absolute mark table?
- Are conduit count, first mark, offset height, bend angle, trade size, shoe
  radius, or bend sequence required in each mode?
- How should the diagram communicate pipe order and avoid mirrored layouts?
- When do unequal sizes, rolling offsets, or mixed shoes invalidate the method?

Compare the current Simple Shift/Full Layout consolidation with separate-screen
competitor designs and recommend the least confusing structure.

## Agent 05 — Compound 90 specialist

Research the actual obstruction-clearing job in depth.

- What does “compound 90” mean consistently in conduit work, and what competing
  meanings exist?
- Is the user clearing a round object, square corner, rectangular duct, column,
  beam, or another obstruction while also turning 90 degrees?
- Which obstruction dimensions are measured, from where, and with what required
  clearance/standoff?
- Are two 45-degree bends always the expected method? If not, define the scope.
- What conduit dimension, centerline radius, shoe data, or allowance affects
  physical fit versus only the field table?
- What are the actual bend marks, their measurement origin, bend order, hook
  direction, and plane/orientation?
- Does the user need a first mark, desired landing point, finished leg, or cut
  length to make the result actionable?
- How should the obstruction be represented so the user can verify clearance?

Keep round, square, and rectangle methods separate until evidence proves they
share one interaction.

## Agent 06 — Multiple Bends / layout-builder specialist

Assume the current feature may be the wrong product.

- What real job causes an electrician to need “multiple bends” rather than one
  named bend calculator?
- Is the need a sequence planner, a single-stick combined-bend solver, a way to
  chain calculator outputs, a cut-length estimator, a push-through-bender
  program, a saved job, or merely a mark notebook?
- What information must travel between bends: developed length, take-up, gain,
  shrink, orientation, reference end, bender symbol, accumulated rotation, and
  no-dog checks?
- Can a safe useful v1 exist without shoe-specific geometry?
- What failure modes make automatic chaining dangerous or misleading?
- Would this be better as “Build a Run,” “Stick Layout,” saved job steps, or a
  feature removed until deeper math/data exists?

Produce at least three product options, including **remove/defer**, and score
them by field value, evidence strength, safety, complexity, and fit with Bend Pro.

## Agent 07 — competitor and interaction-pattern specialist

Compare QuickBend and other credible bending tools/manual workflows without
copying their presentation.

For every target workflow capture:

- calculator name and implied job;
- required, conditional, and optional inputs;
- default values and mode structure;
- hero and supporting outputs;
- diagram semantics and interaction;
- field steps exposed or hidden;
- bender/setup dependencies;
- strengths, friction, ambiguity, and opportunities for Bend Pro to simplify;
- whether the competitor gives a complete field action or merely a number.

Separate observed behavior from interpretation. Screenshots and store copy do
not prove mathematical or procedural correctness.

## Agent 08 — adversarial evidence and product QA

Remain independent until draft final specifications exist. Then:

- trace every hero output and required input to evidence;
- identify recommendations derived only from current Bend Pro behavior;
- identify recommendations copied from QuickBend without field justification;
- challenge measurement origins, bend-center assumptions, orientation, and
  bender-reference instructions;
- verify required versus optional classifications;
- check worked examples against cited formulas;
- ensure conflicts remain visible;
- apply `06_REVIEW_SCORECARD.md` and issue pass, pass-with-caveats, or fail.

The QA agent may block a calculator specification from the executive “ready to
redesign” list.

## Cross-review requirement

Before synthesis:

- Agent 01 reviews terminology and physical instructions from Agents 02–06.
- Agent 07 reviews whether competitor claims are observation or inference.
- Each specialist reviews one other specialist's mandatory-input list.
- Agent 08 reviews only after these corrections are recorded.
