# Agent 01 — Sources

Grading: **A** = primary manufacturer/trade training manual used directly; **B** = reputable secondary reprint/mirror of primary or closely related manufacturer guide; **C** = trade aggregator / teaching site; **D** = inaccessible, incomplete marketing, or weak for bending workflow claims.

Short paraphrases only — no manual text copied into product copy.

---

## Primary list (mission-required)

### S01 — IDEAL Conduit Bender Guide (primary URL)

| Field | Value |
|---|---|
| **Grade** | **D** (primary URL) / **A–B** (content via mirrors) |
| **URL (requested)** | https://www.idealind.com/content/dam/canada/assets/manuals/Conduit-Bender-Guide_EN.pdf |
| **Access** | Direct fetch: timeout then **404**. Local download aborted. |
| **Mirrors used** | https://cdn-e.soneparcanada.io/PIM_Docs/Docs/STEP_ASSETS_PDF/471007499.pdf ; https://www.licensedelectrician.com/Store/ID/Data/conduit_bender_guide.pdf |
| **Page/section** | Features (Arrow, Rim Notch, Star-Point, Degree Scale); Steps 1–3 Measure/Mark/Use marks; Don’t Forget (floor/air/overbend); How to Bend a Stub; Back-To-Back; Offset Bend; Saddle Bends; Offset reference table; Saddle mark-ahead table |
| **What it supported** | Canonical hand-bender symbol map; stub take-up example (¾" → 6"); B2B star-at-back; offset shrink only when working into obstruction; rotate 180° between offset bends; saddle rim-notch center + arrow outers; plane caution |
| **Limitations** | Primary CDN URL failed; mirrors appear to be the same IDEAL ND 1534-series booklet but edition letters differ (ND 1534-2 vs 1534-4). Treat numeric tables as IDEAL-family, confirm against a live IDEAL PDF when available. |

### S02 — Klein Tools Conduit Bender Guide

| Field | Value |
|---|---|
| **Grade** | **A** |
| **URL** | https://data.kleintools.com/sites/all/product_assets/documents/instructions/klein/ConduitBenderGuide.pdf |
| **Access** | Fetched successfully |
| **Page/section** | Symbol callouts (Arrow, Star Point, Angle Marks, Stub Height, Center of Bend Rim Notches, Teardrop); Conduit Bending Basics; 90° Stub-Up + Take-Up Table; Back to Back; Offset Formula Table + worked example; Three Point Saddle + table; floor vs air bending notes |
| **What it supported** | Hook toward free end on stubs; take-up subtract from free-end height; star B2B with hook toward new free end; tight-U arrow alternate; offset shrink+multiplier math; flip/air-bend + rotate 180° for second offset; saddle center via rim notch; plane/skew rework; springback resting-angle rule; EMT size coverage ½"–1¼" |
| **Limitations** | Klein-specific “stub height” stamp wording vs IDEAL “take-up”; teardrop mentioned in basics — exact use less explicit than arrow/star/rim in the bend procedures retrieved; not a full apprenticeship trig text |

### S03 — Greenlee Site-Rite Hand Bender Manual (52034125)

| Field | Value |
|---|---|
| **Grade** | **A** |
| **URL** | https://greenlee-cdn.ebizcdn.com/media/52034125.pdf |
| **Access** | Fetched successfully |
| **Page/section** | Bending Handle Up / Handle Down; Marking for 90° Stubs (Mark A/B + Deduct); Back-to-Back 90° Stubs (Finish Line + star); Offset Bends + Offset Table; Working Past / Toward Obstruction examples; Speed Guide for Offsets; 3-Bend Saddles + 45° saddle table; bending tips (plane, handle up/down by size) |
| **What it supported** | Deduct language; two-mark stub teaching; finish-line B2B method; toward vs away shrink; saddle center mark advanced by shrink; notch near star for center; arrow for B/C; angle choice tradeoffs (pull force vs space); springback note especially for rigid |
| **Limitations** | 2008 manual; Site-Rite sighting (pin/line-of-sight) is Greenlee-specific UI on the tool; Spanish half duplicates English — used English procedures |

### S04 — Navy NAVEDTRA 14265A

| Field | Value |
|---|---|
| **Grade** | **D** (inaccessible this pass) |
| **URL** | https://media.defense.gov/2014/Jun/20/2002655942/-1/-1/1/140620-N-ZZ182-6583.pdf |
| **Access** | Web fetch **403 Forbidden**; PowerShell download Access Denied (Akamai) |
| **Page/section** | N/A — not read |
| **What it supported** | Nothing directly this pass |
| **Limitations** | Cannot cite 14265A. Related Navy CE Basic materials exist under other NAVEDTRA numbers (e.g., 14026) but were **not** substituted as if they were 14265A. See UNRESOLVED. |

### S05 — IBEW Local 903 Bending Book (Rev 2)

| Field | Value |
|---|---|
| **Grade** | **A** (trade apprenticeship compilation) |
| **URL** | https://lu903.com/wp-content/uploads/2017/06/Bending-Book-rev-2-full.pdf |
| **Access** | Fetched successfully |
| **Page/section** | Offset loss via trig; parallel offsets progression; kicks + shoe factor; cabinet KO spacing; 45° obstruction clears (square/rect/round); rolling offset; gain for 90s; travel method; matching existing offsets; concentric bends; trig multiplier chart |
| **What it supported** | Apprenticeship math behind shrink/multipliers; parallel-offset advance; matching-offset reverse workflow; gain concept; distinction between hand-bender card math and mechanical travel/shoe methods |
| **Limitations** | Credits multiple books / “Professor Brown”; heavy Chicago/mechanical language (front of shoe, travel) — **not** a hand-bender arrow/star primer; some OCR/layout noise in extraction; not manufacturer-tool-specific |

### S06 — Wheatland 20' EMT and Conduit Flyer

| Field | Value |
|---|---|
| **Grade** | **B** (dimensions) / **D** (bending workflow) |
| **URL** | https://www.wheatland.com/wp-content/uploads/2017/12/20-EMT-and-Conduit-Flyer.pdf |
| **Access** | Fetched successfully |
| **Page/section** | 20' EMT weights and dimensions (trade size, designator, O.D., I.D.); length/O.D. tolerances; marketing for long runs |
| **What it supported** | Trade size ≠ O.D.; stick-length practice (20' vs 10'); dimensional tolerances relevant to clearance/cut assumptions |
| **Limitations** | No bender symbols, take-up, shrink, or bend procedures — do not use for bending vocabulary |

---

## Supporting sources (used for corroboration / conflict surfacing)

### S07 — Gardner Bender Hand Bender How-To Guide

| Field | Value |
|---|---|
| **Grade** | **A–B** |
| **URL** | https://www.gardnerbender.com/-/media/inriver/GAR_BRO_032_1220_Hand%20Bender%20How%20To%20Guide.pdf |
| **Page/section** | 90° bends + deduct table; back-to-back; offset + shrinkage note (“only when working into objects”); 3-point saddle mention; dog-leg/kick term list; overbend correction |
| **Supported** | Deduct naming; toward-only shrink rule; B2B to back of 90; multiplier/shrink table alignment with Klein/Greenlee/IDEAL |
| **Limitations** | **Conflict:** 1¼" EMT deduct shown as 12" in Table 1 vs common 11" elsewhere — preserved in notes |
| **Why used** | Cross-brand corroboration after IDEAL primary URL failed |

### S08 — Gardner Bender / ECM 960 Series How to Bend Guide

| Field | Value |
|---|---|
| **Grade** | **A–B** |
| **URL** | https://file.ecmindustries.com/-/media/inriver/960-Series-how-to-Bend-Guide.pdf |
| **Page/section** | Symbol legend (Arrow, Rim Notch, Star, Angle Arrows, Degree Scales); stub; B2B; saddle; offset; floor vs air sighting difference |
| **Supported** | Same five-feature symbol model as IDEAL-family; floor angle arrows vs air degree scales; saddle 3/16" & 2½" per inch rules |
| **Limitations** | Brand-specific bend-back channel / vise features not universal |

### S09 — Elliott Electric EMT Conduit Bender Guide (web)

| Field | Value |
|---|---|
| **Grade** | **C** |
| **URL** | https://www.elliottelectric.com/StaticPages/ElectricalReferences/Guides/electrical-conduit-bending-chart-emt-bender-guide.aspx |
| **Page/section** | Bender diagram A/B/C; 90° stub; back-to-back |
| **Supported** | Secondary confirmation of arrow/star roles and B2B outside-of-first-bend measurement language |
| **Limitations** | Aggregator page; not a manufacturer PDF; used only as corroboration, not sole proof |

---

## Access log (mission URLs)

| URL | Result |
|---|---|
| idealind.com … Conduit-Bender-Guide_EN.pdf | Timeout → 404; download connection closed |
| data.kleintools.com … ConduitBenderGuide.pdf | OK |
| greenlee-cdn.ebizcdn.com/media/52034125.pdf | OK |
| media.defense.gov … 140620-N-ZZ182-6583.pdf (NAVEDTRA 14265A) | 403 / Access Denied |
| lu903.com … Bending-Book-rev-2-full.pdf | OK |
| wheatland.com … 20-EMT-and-Conduit-Flyer.pdf | OK |

---

## Source-to-claim map (high-signal)

| Claim | Best sources |
|---|---|
| Arrow = stubs, offsets, saddle outers | S01 mirrors, S02, S03, S08 |
| Star = back of 90 / B2B | S01 mirrors, S02, S03, S07, S08 |
| Rim/center notch = saddle center | S01 mirrors, S02, S03, S08 |
| Stub mark = height − deduct/take-up | S01 mirrors, S02, S03, S07 |
| Shrink only when working toward obstruction | S01 mirrors, S03, S07 |
| Rotate 180° between offset bends | S01 mirrors, S02 |
| Hook toward free end (stub) | S02 |
| Finish-line B2B alternate | S03 |
| Tight-U arrow alternate | S02 |
| Parallel offset advance / gain / travel | S05 |
| Actual EMT O.D. by trade size | S06 |
| 1¼" deduct 11" vs 12" conflict | S02 vs S07 |
