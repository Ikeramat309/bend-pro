# Source, Evidence, and QA Protocol

## Source hierarchy

Grade every source before using it.

### Grade A — primary authoritative

- current official manufacturer manuals and instruction sheets;
- union/JATC/apprenticeship training material;
- government or military construction training manuals;
- official product documentation with an identifiable model and revision;
- standards or technical data sheets for physical conduit dimensions.

Use Grade A for formulas, bender references, measurement origins, and procedures
whenever possible.

### Grade B — strong trade/educational

- established electrician training publishers;
- instructor-authored conduit-bending texts;
- documented professional tool manuals from reputable bending-tool companies;
- high-quality trade instruction with named authorship and worked cases.

Grade B may support a workflow and corroborate Grade A. It should not override a
direct manufacturer procedure without explaining why.

### Grade C — observational/product evidence

- QuickBend documentation, store listings, and observed app behavior;
- other calculator apps;
- electrician videos with visible physical steps;
- experienced electrician articles or forum consensus.

Use Grade C to understand workflow expectations, terminology, friction, and
competitor interaction. Do not treat app output or popularity as proof of math.

### Grade D — discovery lead only

- retailer copy;
- anonymous posts;
- SEO summaries;
- AI-generated pages;
- snippets without accessible source context;
- unsupported diagrams reposted from elsewhere.

Grade D may identify a term or source to pursue. It cannot support a final
numeric or safety-critical recommendation.

## Required source diversity

For each calculator's core procedure, seek:

- at least one Grade A source;
- a second independent Grade A or B source;
- one observed field/competitor source when interaction design is discussed.

If this cannot be achieved, label the affected recommendation provisional. Do
not inflate source counts with duplicate mirrors or pages repeating one source.

## Citation rules

Every high-impact claim must include:

- source ID;
- direct URL;
- organization/author;
- document title and revision/date if available;
- exact page, section, table, figure, or video timestamp;
- a short paraphrase of what was observed;
- whether the claim is direct evidence or researcher inference;
- limitations and scope.

Keep quotations short. Do not copy full manuals or extensive copyrighted text.

## Claim types

Label every claim as one of:

- numeric/formula;
- physical procedure;
- measurement origin;
- bender reference;
- terminology;
- common mistake;
- competitor observation;
- product inference;
- unresolved hypothesis.

Product inferences require a reasoning chain from field evidence. They are not
made true by adding a citation to an unrelated formula.

## Conflict rules

- Never silently choose one number, multiplier, measurement origin, or procedure.
- Determine whether differences come from conduit type, trade size, bender model,
  inside/outside/center measurement, bend angle, finished versus mark dimension,
  hand versus powered bender, or a genuinely incompatible method.
- Preserve every material conflict in `CONFLICTS_AND_GAPS.md`.
- A recommendation may proceed with a conflict only if scope excludes the
  disputed case or the UI can make the method explicit.
- “Common practice” is not resolution without traceable evidence.

## Math verification

For every worked example:

1. Record source formula or procedure.
2. Normalize units explicitly.
3. Recalculate with full precision.
4. Separate exact result from field-rounded display.
5. State the rounding convention.
6. Check measurement origin and whether conduit OD/CLR/take-up is already
   included.
7. Have the QA agent recompute independently.

Research may conclude that current math needs review, but must not edit an engine.

## Workflow verification

A workflow is not verified merely because its formula is correct. QA must be able
to trace:

- the user's starting condition;
- the physical source of each required input;
- the measurement origin of each mark;
- the bender reference at each mark;
- bend order and hook direction;
- rotation/flip instructions;
- the action attached to each displayed output;
- the final check of the bent conduit.

If any link is missing, classify the product spec as incomplete.

## Competitor analysis rules

- Separate screenshots/observed controls from inferred behavior.
- Do not reverse-engineer or copy proprietary assets.
- Do not assume QuickBend is wrong or right without evidence.
- Record what QuickBend makes easy, what it leaves implicit, and what Bend Pro can
  simplify while preserving the field job.
- A recommendation must stand on field evidence even when it matches a competitor.

## Field validation boundary

The founder does not require physical field verification during this research
run. Use desk evidence and app/competitor comparison to reach a strong product
definition. Clearly label:

- desk-supported;
- app-comparison-supported;
- needs physical bend later;
- blocked by missing source.

Do not use the lack of field validation as an excuse for vague specifications.

## QA rejection conditions

The QA agent must fail or caveat a calculator when:

- required inputs are not physically obtainable as described;
- hero output has no direct field action;
- marks lack a measurement origin;
- bend steps lack bender reference or orientation;
- numeric claims rely only on Grade C/D evidence;
- incompatible methods were blended;
- the spec copies the current app without evaluating it;
- the spec copies QuickBend without field justification;
- a complex automatic planner hides unsupported gain/take-up/shoe assumptions;
- diagrams are described aesthetically but not informationally;
- open questions are presented as decisions.

## Production isolation check

At the end, record file hashes or `git status --short` evidence showing no changes
were made under `src/` or existing project documentation. Research output is the
only authorized mutation.
