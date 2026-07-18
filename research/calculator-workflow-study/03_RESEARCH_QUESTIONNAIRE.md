# Calculator Research Questionnaire

Every specialist must answer the universal questionnaire and the target-specific
questions in `02_AGENT_ASSIGNMENTS.md`. “Not found” is acceptable when paired
with the searches and sources attempted.

## A. Job-to-be-done

1. Complete: **“I need to ______, and I have/can measure ______.”**
2. What physical installation triggers this workflow?
3. Is the conduit straight, partly bent, already installed, or being copied?
4. What constraint is fixed: obstruction, landing point, rack spacing, existing
   bend, stub height, total stick length, or enclosure position?
5. What does success look like in the field?
6. What is the immediate next action after the app returns a result?

## B. Physical measurement audit

For every measurement, record:

| Measurement | Required/conditional/optional | How obtained physically | From reference | Along which path/plane | Before or after a bend | Typical tool | Ambiguity/risk |
|---|---|---|---|---|---|---|---|

Questions:

- Does the electrician naturally know this value, or would the app be forcing a
  derived/math measurement back onto the user?
- Is it measured to conduit center, back, outside, edge, tangent, obstruction
  face, box face, floor, or finished surface?
- Is the measurement taken along straight space, along the conduit, or along a
  projected axis?
- Can it be measured accurately after the conduit is bent?
- Does trade size or actual outside diameter change its meaning?
- What tolerance is realistic on a job site?

## C. Input classification

Classify every candidate input as exactly one:

- **Required:** no trustworthy usable result exists without it.
- **Conditional:** required only when a specific mode/output is requested.
- **Optional:** improves the workflow but omission still yields a complete core
  result.
- **Setup-derived:** conduit size, unit, bender profile, rounding, or another
  value already known by the app.
- **Inferable:** can be derived safely from required inputs with cited rules.
- **Guide-only:** useful for teaching but should not occupy the pro screen.
- **Unsupported:** cannot be used safely with current evidence or product scope.

For each input, explain the cost of asking for it and the failure caused by
omitting it.

## D. Output classification

Classify every candidate output as exactly one primary role:

- **Hero:** the main answer to the field job.
- **Secondary:** important supporting measurement, maximum two on the main view.
- **On-pipe instruction:** mark value, order, bender reference, hook direction,
  rotate/flip cue, or dimension that belongs directly on the diagram.
- **Warning:** actionable risk or invalid condition.
- **Guide-only:** formula, explanation, or uncommon detail.
- **Do not show:** redundant, internal, misleading, or not field-actionable.

For each displayed result answer: **what will the electrician physically do with
this number or instruction?** If there is no answer, remove or demote it.

## E. Complete field sequence

Write the workflow as physical steps, not app screens:

1. Establish measurement origin and conduit orientation.
2. Measure and mark each location.
3. Identify the bender reference used at each mark.
4. State hook direction and conduit plane.
5. State bend angle and order.
6. State any flip/rotation between bends.
7. State how the result is checked before the next bend or installation.

Every step must distinguish what the app displays from what the user does.

## F. Diagram information architecture

Describe three states:

### Empty state

- What should the conduit/obstruction preview teach before input?
- Which input is visually requested first?
- What must not appear because it implies an answer that does not exist yet?

### Valid result state

- Pipe pose and plane.
- Obstruction/reference object.
- Measurement origin and free end.
- All physical marks and wrap locations.
- Bend order.
- Bender reference at each mark.
- Hook direction, flip, and rotation cues.
- Hero dimension and supporting dimensions.
- What information stays outside the diagram.

### Invalid/extreme state

- What remains visible?
- What result/marks disappear?
- Which warning explains the problem?
- What geometry must be clamped without changing real values?

Provide a small text wireframe and an annotation inventory. Do not design a
generic card dashboard.

## G. Mode and calculator-boundary audit

- Are there multiple legitimate measurement methods?
- Do they share the same job and output but differ only in available inputs?
- Would a mode selector clarify them, or would separate calculators reduce
  mistakes?
- Is this workflow actually a variant of Offset, Stub 90, saved layouts, or
  another existing feature?
- Would merging create ambiguous field labels?
- Would splitting create needless duplication?
- Is the feature valuable enough to keep?

## H. Trust, validation, and warnings

Identify:

- zero, negative, non-finite, and huge inputs;
- impossible triangles or obstruction clearance;
- marks outside the stick or too close to an end;
- bend angles outside hand-bender practice;
- missing bender data or unsupported sizes;
- ambiguous measurement origins;
- mirrored/rack-direction mistakes;
- shoe interference, accumulated shrink/gain, or spring-back not modeled;
- situations where the app must withhold marks instead of guessing.

Separate blocking warnings from advisory field cautions.

## I. Worked cases

Provide at least:

- one normal reference case;
- one conditional/optional-input case;
- one edge or invalid case;
- one metric-display case if unit conversion is relevant.

For each case include raw formula path, exact values, rounded display values,
mark origins, field steps, and source IDs.

## J. Current Bend Pro verdict

Rate the current implementation from 0–5 on:

- field-goal clarity;
- naturalness of required inputs;
- completeness of output;
- mark and bender-reference clarity;
- diagram usefulness;
- safety/trust honesty;
- pro speed;
- apprentice learnability.

Then choose one verdict:

- Keep
- Refine
- Major rework
- Split
- Merge
- Reframe
- Remove/defer

State what evidence would change that verdict.
