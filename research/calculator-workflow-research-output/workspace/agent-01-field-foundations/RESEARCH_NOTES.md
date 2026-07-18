# Agent 01 — Field Foundations Research Notes

**Scope:** Hand-bender EMT workflows as taught and executed (not Bend Pro product specs).  
**Window:** Specialist pass, 2026-07-16.  
**Rule:** No invented field lore. Conflicts preserved. Unknowns marked.

---

## 1. Cross-calculator field vocabulary

Canonical terms first; aliases and conflicts noted.

| Term | Field meaning | Common aliases | Conflict / caution |
|---|---|---|---|
| **Stub / stub-up / 90** | Finished L-bend: free end rises to a measured height | Rise, accurate stub, stub end | Finished height ≠ mark location |
| **Free end** | End being bent up (usually the short stub) | Stub end | Opposite of running end |
| **Running end** | Long remaining length after the stub | — | Teaching term; jobsite often unnamed |
| **Take-up / deduct** | Shoe-arc allowance subtracted from finished stub height to get arrow mark | Stub height (Klein stamp language), deduct (Greenlee/GB), take-up (IDEAL/Navy-style teaching) | Same math; three names on tools/manuals |
| **Arrow** | Primary bend-start reference for stubs, offsets, saddle outer marks | Start of bend | Almost always the pro’s default mark reference |
| **Star / star-point** | Locates the **back** of a finished 90 | Tip of star, ★, “B” on some heads | Used for back-to-back second bend, not stub-up |
| **Rim notch / center notch** | Locates **center** of a 3-point saddle | Rim notch (IDEAL/GB), center-of-bend rim notches (Klein), notch near star (Greenlee wording) | Klein also lists a **teardrop**; do not assume teardrop = rim notch without that head’s legend |
| **Degree scale / angle marks** | Stop angle for floor or air bends | Angle arrows (floor sight), degree scale (air sight) | Same angles; different sighting method by bend posture |
| **Hook** | Bender head clamp that grips the pipe | — | **Direction of hook** is a required physical instruction |
| **Cradle / groove / shoe** | Curved track the pipe rolls in | Shoe | Wrong size = kink/damage |
| **Floor bend** | Handle up, foot on heel, pipe on floor | Handle-up bend | Typical for larger EMT (Greenlee tip: 1"–1¼") |
| **Air bend** | Handle hilt on floor, pipe in air | Handle-down bend | Typical for offsets/saddle returns; ½"–¾" often handle-down |
| **Back-to-back** | Two 90s forming a U / span between parallel surfaces | Back to back 90 stubs | Measurement is to **backs** of 90s, not arrow marks |
| **Finish line** | Jobsite mark made with first 90 fitted in place for second star bend | — | Greenlee method; alternative to tape-from-back |
| **Offset** | Two equal opposing bends shifting parallel run | “S” bend (Spanish manuals), kick (sometimes misused) | Kick ≠ full offset in many shops |
| **Kick / dog-leg** | Single-angle change of direction / out-of-plane scrap | Dog leg | “Dog leg” also = failed plane alignment |
| **Multiplier** | Factor × offset depth → mark spacing / center-to-center | Constant multiplier, csc(θ) in apprenticeship trig | Tables use rounded 1.4 / 2.0 / etc. |
| **Shrink / shrink amount** | Length “lost” along the run when bending into an obstruction | Offset loss, conduit shortens | Applied when **working toward** obstruction; ignored when working away (manufacturer consensus) |
| **Center-to-center (offset)** | Distance between the two offset bend marks / centers | Distance between bends | Not the same as finished parallel spacing after bend |
| **Saddle (3-point)** | Center bend + two return bends over an obstacle, then back to original line | 45° center / 22½° returns (most common) | Center mark is moved **ahead** by shrink |
| **Plane / same plane** | All bends share one geometric plane so pipe lays flat | No-dog, lined up | Primary scrap cause when violated |
| **Rotate 180°** | Roll pipe in cradle so second offset/saddle bend opposes the first | Flip (Klein: flip assembly for air bend), reverse conduit | “Flip” and “rotate” are related but not identical actions |
| **Springback** | Pipe opens slightly after force released | Overbend compensation | Manuals emphasize resting angle = desired angle |
| **Gain** | Extra developed length vs sum of leg measurements on a 90 | — | Strong in IBEW/mechanical-bender teaching; rare on hand-bender pocket cards |
| **Travel** | Pull-through distance for a given angle on mechanical benders | — | Chicago/hydraulic language; not hand-bender arrow workflow |
| **Shoe factor (SF)** | Scrap-calibrated front-of-shoe to bend-center distance | — | IBEW kick method; not stamped arrow/star workflow |
| **Trade size vs O.D.** | Nominal size ≠ outside diameter | Designator (metric) | Wheatland publishes actual O.D.; clearance math may need O.D. |
| **Stick / stick length** | Full conduit piece length (commonly 10'; also 20') | — | Marks must fit remaining stick |

### Teaching vs jobsite shorthand

| Teaching / manual | Jobsite shorthand |
|---|---|
| Take-up / deduct from stub height | “Knock off 5” / “use the number on the head” |
| Align arrow with mark | “Hit the arrow” |
| Star-point to back of 90 | “Star it” / “mark the back” |
| Working toward obstruction + shrink | “Add the shrink” / “don’t forget shrink” |
| Working away from obstruction | “No shrink” / “bending away” |
| Rotate 180° between offset bends | “Flip it” / “spin it” / “air bend the second” |
| Keep bends in same plane | “Don’t dog it” / “keep it flat” |
| Measure → mark → bend → check | Often compressed to “mark it and bend” |
| Center-to-center / distance between bends | “Spread” / “between marks” |
| Rim notch on saddle center | “Notch the center” |

---

## 2. Workflow facts that must appear visually (not prose)

These are physical instructions. If a diagram/UI only explains them in text, field error rate rises.

1. **Which end is the measurement origin** (free end vs coupling/last fitting vs obstruction face).
2. **Finished dimension vs mark dimension** (e.g., 14" stub vs 8" arrow mark after 6" take-up).
3. **Bender reference at each mark** (arrow / star / rim-notch) — symbol on the pipe pose, not a glossary.
4. **Hook direction** relative to free end / previous bend / saddle center.
5. **Bend order** (1st, 2nd, 3rd) with angle at each mark.
6. **Floor vs air posture** when the second bend requires it.
7. **Rotate 180° / reverse conduit** cue between opposing bends.
8. **Toward vs away from obstruction** (whether shrink is in the first-mark math).
9. **Back-of-bend dimension** for back-to-back (star), distinct from arrow-mark stub math.
10. **Plane / lay-flat check** after multi-bend sequences.
11. **Obstruction reference**: face clearance vs centerline of obstacle (offsets vs saddles differ).
12. **Check method**: level/square/degree mark, then fit check before next bend when method requires it (Greenlee finish-line B2B).

---

## 3. Foundational mechanics (evidence-backed)

### 3.1 Universal sequence (manufacturer consensus)

IDEAL’s three steps are the teaching spine shared across hand-bender guides:

1. **Measure the job** (finished geometry from the installation).
2. **Mark the conduit** using take-up / multiplier / shrink tables.
3. **Use the bender’s engineered marks** (arrow / star / notch / degree scale).

Physical execution pattern observed across Klein, Greenlee, IDEAL, Gardner Bender:

**measure → calculate mark(s) → mark pipe → seat in hook → align symbol → bend with foot pressure → allow springback → check angle/plane/fit → next bend or cut/ream.**

### 3.2 Stub-up (building-block bend)

**Known from install:** desired finished stub height (box, wall, floor-to-ceiling, etc.).  
**Calculated:** mark distance = finished stub − take-up/deduct.  
**Bender ref:** arrow.  
**Hook:** toward free end being bent up (Klein explicit).  
**Check:** free end at height; degree/level at 90°.

**Presentation conflict (same math):**

- IDEAL/Klein/GB: one mark at (height − deduct) from free end; arrow on that mark.
- Greenlee: Mark A at finished stub height; Mark B = Mark A − deduct; arrow on Mark B.

Do not treat “Mark A” as universal without showing which method.

**Typical EMT take-up/deduct on hand benders (manufacturer tables):**

| EMT | Common deduct |
|---|---|
| ½" | 5" |
| ¾" | 6" |
| 1" | 8" |
| 1¼" | 11" (Klein/IDEAL-family teaching); **GB one table lists 12"** — conflict |

Always prefer the value stamped on the user’s bender head over a generic table.

### 3.3 Back-to-back

**Known:** distance between parallel surfaces / backs of intended 90s.  
**Sequence:** first stub (arrow + take-up) → measure from **back** of first 90 → mark → **star** on mark → second 90 with hook toward the new free end (Klein).  
**Alternate (Greenlee):** fit first stub in place → mark finish line on pipe → star to finish line.  
**Tight-U alternate (Klein):** when shoe won’t fit for star method, subtract stub height and use **arrow** with hook toward first bend (caution: first bend comes at operator).

### 3.4 Offset

**Known:** offset depth; distance to obstruction (or from last coupling); chosen angle.  
**Calculated:** spacing = depth × multiplier; shrink = depth × shrink/inch (when working **toward**).  
**Toward obstruction:** first mark = distance + total shrink; second mark spaced by multiplier distance.  
**Away from obstruction:** ignore shrink (IDEAL/Greenlee/GB explicit).  
**Bender ref:** arrow both bends.  
**Orientation:** after first bend, **rotate conduit 180°** (IDEAL); Klein describes flip to air-bend for second.  
**Check:** pipe lays flat; clears obstacle; parallel resumes.

Angle choice is installer/space/pull-force tradeoff (shallow = easier pull, longer footprint; steep = opposite).

### 3.5 Three-point saddle

**Known:** obstacle height/O.D.; distance to **center** of obstacle.  
**Calculated:** advance center mark by shrink; outer marks at table distance each way from center.  
**Common angles:** 45° center + two 22½° returns (or 60° + two 30°).  
**Refs:** rim/center notch on center mark; arrow on outer marks.  
**Order:** center first, then returns (with rotate/reverse as taught).  
**Plane caution** repeated in every major guide.

### 3.6 Inputs normally known vs calculated

| Known from install / tool | Calculated |
|---|---|
| Conduit trade size | Mark distances |
| Bender brand/size (stamped deduct) | Total shrink |
| Finished stub height / B2B span / offset depth | Distance between bends |
| Distance to obstruction or obstacle center | Center-mark advance (saddle) |
| Chosen bend angle (often constrained by space) | Travel/gain (advanced / other tools) |
| Stick available length (conditional) | Cut length after bends (often post-bend) |

Apps that ask the user to measure “take-up” or “developed length” are fighting the field pattern unless the user is in a travel/gain method (IBEW mechanical).

### 3.7 Scrap / rework causes (from manuals + apprenticeship)

| Cause | Evidence pattern |
|---|---|
| Wrong bender size for conduit | Klein: damage / improper bend |
| Light foot pressure / pipe slides in shoe | Kink; marks walk |
| Forgot take-up/deduct | Stub short/long |
| Used arrow instead of star (or reverse) on B2B | Span wrong by ~take-up |
| Forgot shrink when bending into obstacle | Comes up short |
| Applied shrink when bending away | Overshoots |
| Failed 180° rotation / plane | Dog-leg / won’t lay flat |
| Springback not accounted | Under-angle |
| Marks from wrong end | Entire layout mirrored |
| Star method on too-tight U without Klein alternate | Shoe interference |
| Measuring to face vs center on saddle | Saddle lands off obstacle |
| Using table deduct instead of head stamp / wrong brand table | Systematic height error (see 1¼" 11" vs 12") |

### 3.8 IBEW Local 903 book — foundations relevance

Primary value: trig definition of offset loss, parallel-offset advance, kicks, matching existing offsets, gain, travel, concentric — **mostly mechanical/Chicago language** (front of shoe, travel marks).  
Use as Grade A for **math concepts** and rack/kick jobs; do **not** overwrite hand-bender arrow/star vocabulary with shoe-factor language unless the product explicitly supports that method.

### 3.9 Wheatland EMT flyer — foundations relevance

Confirms trade-size tables with **actual O.D./I.D.**, length tolerance (±¼"), and 10' vs 20' stick practice for long runs. Useful when clearance or cut-length workflows need O.D., not for bending-symbol teaching.

---

## 4. Questionnaire A–H (foundations perspective)

*Not calculator-product specs. Answers describe hand-bender EMT field foundations.*

### A. Job-to-be-done

1. **Complete:** “I need to place bends so the finished conduit fits the measured installation, and I have/can measure finished heights, spans, obstruction depth/location, and my bender’s stamped deduct.”
2. **Triggers:** box/wall/floor stubs; U between parallel surfaces; shift around joist/obstruction; saddle over crossing pipe; kicks into cabinets; rack of parallel offsets.
3. **Conduit state:** usually straight stick on the ground; sometimes partly bent (B2B second mark; matching existing); rarely already installed when marking (Greenlee finish-line is an exception that uses fit-in-place).
4. **Fixed constraints:** vary by job — stub height, B2B outside span, obstruction depth + approach distance, obstacle center, rack C-C, stick length, enclosure KO positions.
5. **Success:** lays flat in plane; hits finished dimensions; clears obstacle; couplings/boxes land; wire-pull angles acceptable.
6. **Immediate next action after a correct result:** mark pipe → seat hook → align symbol → bend → check → next bend or cut/ream/install.

### B. Physical measurement audit

| Measurement | Req/cond/opt | How obtained | From reference | Path/plane | Before/after bend | Tool | Ambiguity/risk |
|---|---|---|---|---|---|---|---|
| Finished stub height | Required (stub) | Tape to landing | Free end → back/finished height of 90 | Vertical/finished rise | Before | Tape | Confusing height with arrow mark |
| Take-up/deduct | Setup-derived | Read bender head / size table | Shoe arc | N/A | Before | Head stamp | Brand/size mismatch; 1¼" table conflict |
| Arrow mark location | Inferable | Height − deduct | Free end along pipe | Along conduit | Before | Tape + marker | Wrong end |
| B2B span | Required (B2B) | Between parallel surfaces or backs | Back of first 90 → back of second | Along run / between walls | After first 90 (typical) | Tape | Measuring to arrow instead of back |
| Finish line | Conditional | Fit first stub in place | Installation geometry onto pipe | At back location | After first 90 | Marker | Only valid if fit position is true |
| Offset depth | Required (offset) | Clearance needed | Obstacle / box face / elevation change | Perpendicular to run | Before | Tape | Face vs center; adding extra clearance inconsistently |
| Distance to obstruction | Required when locating offset on stick | From end/coupling to obstacle | Chosen origin | Along run | Before | Tape | Toward vs away changes shrink |
| Offset angle | Required (chosen) | Space + pull judgment | — | — | Before | — | Not a measured length; constrained |
| Shrink | Inferable | Table × depth | — | Along run | Before | Table | Omit when away; include when toward |
| Mark spacing / C-C | Inferable | Depth × multiplier | Between marks along pipe | Along conduit | Before | Table | Rounding 1.4 vs √2 |
| Saddle obstacle height/O.D. | Required (saddle) | Measure obstacle | Obstacle | Vertical | Before | Tape | O.D. vs rise clearance |
| Distance to obstacle **center** | Required (saddle) | To centerline | End/coupling → center | Along run | Before | Tape | Using near face instead of center |
| Plane / dog check | Required after multi-bend | Visual + lay flat | Prior bend plane | Bend plane | After each critical bend | Eye / floor / level | Easy to miss mid-sequence |
| Springback | Optional technique | Overbend slightly | Degree scale | — | During | Degree marks | EMT less than rigid; still present |
| Actual O.D. | Conditional (clearance/racks) | Chart or calipers | Trade size → O.D. | — | Before | Chart | Trade size ≠ O.D. |
| Stick length | Conditional | Stock length / remaining | Ends of pipe | Along conduit | Before | Tape | Marks beyond stick |
| Gain / travel / SF | Unsupported for basic hand-bender arrow workflow | Scrap calibration / charts | Shoe-specific | — | Before | Scrap | Different tool class |

**Natural vs forced:** Electricians naturally know finished geometry and obstruction numbers. Take-up, shrink, and multipliers are looked up/stamped — not “measured” as installation dimensions. Forcing users to enter take-up every time is unnatural unless bender profile is unknown.

**Tolerance (realistic):** Hand-bend jobsite work is commonly tape-to-nearest ⅛"–¼" with visual plane checks; manufacturer examples use fractions (⅜", etc.). Exact metric conversion of imperial field marks is secondary to matching the user’s tape.

### C. Input classification (foundations candidates)

| Input | Class | Cost of asking | Failure if omitted |
|---|---|---|---|
| Conduit size | Setup-derived | Low once | Wrong deduct / wrong shoe |
| Bender profile / stamped deduct | Setup-derived | Low once | Systematic stub error |
| Finished stub height | Required (stub) | Natural | Cannot place arrow mark |
| B2B finished back-to-back distance | Required (B2B) | Natural | Wrong span |
| Offset depth | Required (offset/saddle height) | Natural | Wrong spacing/shrink |
| Distance to obstruction / center | Required when placing on a stick | Natural | Wrong location on pipe |
| Bend angle | Required | Medium (choice) | No multiplier/shrink row |
| Toward vs away | Required (offset locate) | Low if visual | Shrink wrong way |
| Unit system | Setup-derived | Low | Display confusion |
| Stick length | Optional / conditional | Medium | Cannot warn marks off-stick |
| Extra clearance beyond obstacle | Optional | Low | May scrape obstacle |
| Gain / travel / developed length | Guide-only or unsupported (hand bender) | High / confusing | N/A if omitted for arrow method |
| “Measure take-up yourself” | Unsupported as primary | High | Duplicates stamp; invites error |

### D. Output classification (foundations candidates)

| Output | Role | Physical use |
|---|---|---|
| Mark distance(s) from stated origin | **Hero** | Place mark(s) on pipe |
| Bender symbol per mark | **On-pipe instruction** | Align hook/shoe |
| Hook direction | **On-pipe instruction** | Seat pipe correctly |
| Bend angle + order | **On-pipe instruction** | Stop at degree mark in sequence |
| Rotate/flip / air-bend cue | **On-pipe instruction** | Orient second opposing bend |
| Toward/away + whether shrink applied | **Secondary** (max) | Trust the first mark |
| Finished dimension callout (stub height, clear, span) | **Secondary** | Verify success |
| Multiplier / shrink formula | **Guide-only** | Teaching; not needed to bend if marks given |
| Gain / travel coefficients | **Do not show** on basic hand-bender flows | Wrong tool language |
| Generic “success” copy without marks | **Do not show** | No physical action |

### E. Complete field sequence (physical)

1. **Origin & orientation:** Pick free end / coupling / obstruction reference; decide toward vs away; note pipe plane.
2. **Measure & mark:** Take finished dims; compute marks; mark pipe clearly (some use two marks for Greenlee stub method).
3. **Bender reference:** Arrow (stub/offset/outers), star (B2B back), notch (saddle center).
4. **Hook & plane:** Hook toward specified end; pipe seated in cradle; prior bends in same plane as handle/sight.
5. **Angle & order:** Bend to degree marks in taught order (saddle center first, etc.).
6. **Flip/rotation:** For offsets/saddle returns — rotate 180° / reverse as required; switch to air bend when taught.
7. **Check:** Degree/level; lay flat; measure finished stub/span/clearance; correct springback/overbend with handle if needed; then install or next piece.

**App vs user:** App displays mark values + symbol + hook/rotate cues; user alone measures install, marks pipe, bends, and verifies fit.

### F. Diagram information architecture (foundations)

**Empty state**

- Teach: straight pipe, one free end, one obstruction or landing ghosted without numbers.
- Request first: the finished job dimension (stub height / depth / span) — not take-up.
- Must not show: completed marks, hero clearances, or bend order implying a solved layout.

**Valid result state**

- Pipe pose + plane; obstruction/landing; origin end; all marks with wrap ticks; bend order; symbol at each mark; hook arrows; flip/rotate glyphs; hero finished dim + ≤2 supporting dims.
- Outside diagram: formulas, full shrink tables, brand essays, gain/travel.

**Invalid / extreme state**

- Keep: pipe, obstruction, inputs user entered.
- Remove/hide: actionable mark ticks that would be wrong.
- Warn: which constraint failed (mark past stick, depth/angle impossible for space, missing deduct, toward/away unset).
- Clamp visuals without rewriting true numeric inputs.

**Text wireframe (stub example)**

```text
[FREE END]----(arrow mark @ 8")====SHOESARC====[RUNNING END]
   ^ finished stub 14"                 hook → free end
   take-up 6" (setup)
```

**Annotation inventory:** origin, finished dim, mark dim, symbol, hook, angle, order, rotate, toward/away, check.

### G. Mode and calculator-boundary audit (foundations)

| Observation | Implication |
|---|---|
| Stub, B2B, offset, saddle share measure→mark→symbol→bend | Shared vocabulary/diagram language across calculators |
| Toward vs away offsets share job, differ by shrink | Mode or explicit toggle — not separate products |
| Greenlee finish-line B2B vs tape-from-back | Same job, different available input — mode or alternate method |
| Tight-U arrow alternate vs star B2B | Conditional method when shoe interferes |
| IBEW travel/gain/kick shoe-factor | Different tool class — separate or advanced; merging labels will confuse |
| Matching existing offset (measure rise + spacing → angle) | Related to offset but reverse inputs — distinct mode |
| Parallel offset advance (tan½θ × C-C) | Rack job; not a generic offset clone |

Merging everything into one “bend calculator” creates ambiguous labels (center mark vs arrow mark). Splitting every table row into its own app creates duplication. Foundations recommend **named jobs** with **shared visual language**.

### H. Trust, validation, and warnings (foundations)

**Blocking**

- Non-finite / negative / zero finished dimensions where a positive length is required.
- Marks that fall off the stick or inside an impossible end zone (when stick length known).
- Missing conduit size or deduct/bender profile when stub math is required.
- Toward/away unset when shrink-affected locate is requested.
- Angle outside common hand-bender practice set shown on heads (typically 10°, 22½°, 30°, 45°, 60°, 90°) without advanced mode.
- Shoe interference cases where star B2B cannot physically fit and no alternate path selected.

**Advisory**

- Springback not modeled precisely.
- Table multipliers are rounded.
- Deduct table may disagree with head stamp / other brands.
- Plane/dog-leg is user-executed.
- Clearance may need O.D. + extra, not trade size alone.
- Rigid/IMC springback notes differ from EMT.

**Withhold marks rather than guess** when origin, toward/away, or bender deduct is unknown.

---

## 5. Worked reference sketches (foundations; not product QA)

### Normal — stub (IDEAL/Klein pattern)

- ¾" EMT, finished stub 14", take-up 6" → mark 8" from free end → arrow → hook to free end → bend 90°.
- Sources: IDEAL mirror; Klein take-up table.

### Conditional — offset toward obstruction (Klein/Greenlee pattern)

- Depth 6", distance 20", 45° → shrink 2.25", first mark 22.25", spacing 8.4" → arrow, rotate 180°, air bend second.
- Sources: Klein example; Greenlee toward-obstruction method.

### Edge / conflict — 1¼" deduct

- Klein table: 11". Gardner Bender table excerpt: 12".  
- **Rule:** use head stamp; flag cross-brand table risk.

### Metric display

- Manufacturer teaching is imperial-first; GB publishes mm alongside inches. Field marks should remain faithful to the inch fractions used in tables unless user unit mode converts carefully.

---

## 6. Implications for all Bend Pro calculators

1. Speak **arrow / star / notch / hook / rotate / toward-away** consistently.
2. Never equate finished dimension with mark dimension in one unlabeled number.
3. Prefer **setup-derived deduct** over asking users to re-measure take-up.
4. Put symbol + hook + order on the diagram.
5. Preserve method conflicts as explicit alternates, not averaged instructions.
6. Keep mechanical **travel/gain** language out of basic hand-bender flows unless scoped.
