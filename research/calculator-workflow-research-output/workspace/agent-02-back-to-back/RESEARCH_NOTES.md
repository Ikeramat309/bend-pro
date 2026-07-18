# Agent 02 — Back-to-Back 90

## A. Job-to-be-done

**“I need two opposing 90s so the backs land a known distance apart, and I can measure that distance between the parallel surfaces / walls.”**

Triggers: conduit up one wall, across, down another (elongated U); jump between two parallel surfaces; place second 90 after first stub is formed.

Starting state: usually **first 90 already bent** (or about to be bent as stub-up) when the critical measurement for the second mark is taken. Conduit is partly bent.

Success: parallel legs sit against intended surfaces; finished back-to-back distance matches measured gap; no dog-leg.

Immediate next action: mark from back of first 90 → align **star** → bend second 90 with hook opposite first → check distance between parallel surfaces.

## B. Physical measurements

| Measurement | Class | How obtained | From | Path | When | Tool | Risk |
|---|---|---|---|---|---|---|---|
| Back-to-back distance | Required | Between parallel surfaces / finished backs | Back of first 90 / wall faces | Along intended straight run | After first 90 for mark transfer; may plan from walls before | Tape | Measuring to inside vs outside of bend |
| First stub length | Conditional | Finished height to landing | Conduit end / floor | Vertical stub | Before first bend | Tape | Confusing with back-to-back |
| Deduct | Setup-derived | Bender chart | Arrow reference | N/A | Setup | Chart | Missing chart |
| Tight-U adjusted mark | Conditional | Measured B2B − stub height (Klein alternate) | End / first bend | Along conduit | When bender won't fit for star method | Tape | Using wrong symbol |

## C–D. I/O classification

**Required:** Back-to-Back Distance.  
**Conditional:** First Stub Length (only if first stub not already bent / user wants deduct mark); Tight-U mode inputs if star method physically blocked.  
**Optional:** none for core second-mark job.  
**Setup-derived:** trade size, deduct (first stub only), unit, rounding.  
**Unsupported:** cut length from gain as default hero (IBEW reverse-shoe long-run method is a different layout path).

**Hero:** Second 90 Mark (= distance) + “measure from back of first 90” + Star.  
**Secondary:** First Deduct Mark (if stub entered); Deduct.  
**On-pipe:** Bend order 1 Arrow / 2 Star; hook opposite; keep plane.  
**Warning:** dog-leg; first stub ≤ deduct; tight-U may need arrow method.  
**Do not show:** invented gain/setback for standard star workflow.

## E. Field sequence (star method — primary)

1. Measure distance between parallel surfaces (finished back-to-back).
2. Bend first 90 as stub-up (Arrow + deduct) if not already done.
3. From **back edge** of formed first 90, measure distance; mark conduit.
4. Place bender with **hook facing free end opposite original bend**; align mark to **Star**.
5. Bend to 90 keeping conduit flat/coplanar.
6. Check distance between parallel legs/surfaces.

**Alternate (Klein) — tight U:** if bender cannot fit for star method, subtract stub height from measured distance, mark, hook facing first bend, align **Arrow**, roll previously bent end up. Must be explicit mode/warning — not silent.

**Alternate (IBEW) — long reverse-shoe / gain figure:** for long B2B, reverse conduit and use stub-up length − gain additive figure. Different math; do not merge into star calculator without mode.

## F. Diagram brief (summary)

Empty: U-shape ghost; ask for back-to-back distance; show “backs” of 90s.  
Valid: marks 1·Arrow (if stub), 2·Star; dimension between backs; hook cue opposite; plane cue.  
Invalid: clear distance; withhold marks.

## G. Boundary

One calculator. Optional first stub disclosure. Optional/Guide: tight-U arrow method. Do **not** merge with Stub 90 (stub is step 1 only). Do not absorb long-gain cut layout without evidence + mode.

## H. Validation

Block ≤0 distance; stub ≤ deduct; advisory for very short U (tight fit). Warn keep plane.

## I. Worked case

36" B2B, optional 12" stub, 5" deduct → First mark 7" from end (Arrow); Second mark 36" from back of first (Star). Sources: Klein procedure; Stub 90 deduct convention.

## J. Verdict

**Refine** (not major rework). Core job and hero are correct. Gaps: tight-U alternate, stronger plane cue, measurement-origin emphasis, explicit exclusion of gain cut-length as default.

### Questionnaire one-liners

- Electrician says: “I need a back-to-back — 36 between the backs.”
- Already bent: often first stub/90.
- Origin: back of first 90 for second mark; conduit end for optional first deduct.
- Smallest inputs: distance alone → complete second-bend action.
- Absolute full-stick: only if chaining cut length (unsupported here).
- Dominant number: second mark distance (equals B2B).
- After result: mark from back → star → bend.
- Prevent: wrong symbol; same-hook facing; dog-leg.
- Standalone calculator: yes.
