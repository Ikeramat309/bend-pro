# Research Summary — Bender Corpus

**Retrieval date:** 2026-07-14  
**Status:** Staging only — does not modify `src/data/benders/` or calculator engines.

## Coverage counts (post-validation)

| Metric | Count |
|--------|------:|
| Manufacturers | 12 |
| Sources | 51 |
| Model / family / SKU records | 95 |
| Exact SKU fields across models | 123 |
| Hand | 49 |
| Mechanical | 9 |
| Electric | 8 |
| Hydraulic | 4 |
| Shoes / accessories | 24 |
| Official sources | 47 |
| Archived official sources | 3 |
| Source-backed numerical facts | 94 |
| Reference-only models | 35 |
| Conflicts | 8 |
| Rejected claims | 1 |
| Original icons | 15 |
| Production-candidate facts (staging filter) | 58 |

Run `node research/benders/scripts/validate.mjs` for live totals.

## Highest-confidence manufacturers / models

1. **Greenlee Site-Rite hand** (840/841/842/843 A & F, 844A dual) — deduct + bend radius from official use guide; corroborating mirror + product pages.
2. **Klein Angle Setter** (51603–51610 family) — Stub-Up Height + Centerline Bend Radius on official product pages.
3. **Gardner Bender BigBen** (960/961/962) — EMT deduct + radius from current How To Guide (with known legacy B-0040 conflict rejected).
4. **IDEAL** 74-031 / 74-032 / 74-001 / 74-002 — Stub Up Height on live product pages (no CLR).
5. **Greenlee 555 single-shoe manual 52065584REV02** — EMT deduct + CLR (keep product-page CLR conflict visible).
6. **Gardner B2555 / BEMT-52** — Chart B EMT deduct + radius from IS_002.
7. **Current Tools 254** shoes — EMT deduct, min stub, CLR for 2-1/2"–4" (out of current app size scope).

## Major gaps

- Milwaukee + Southwire hand: identity only (no published take-up).
- NSI CB50/75/100: identity lead only.
- Greenlee 1800/1801/854DX/855GX: identity; charts not fully extracted.
- Current Tools 753/77 stub charts: manuals cited; careful numeric extract still queued.
- RIDGID E-666: distributor lead only.
- Benfield / Chicago legacy: method/class references, not SKU charts.
- Southwire cutsheet PDF returned HTTP 400 during fetch — URL retained, re-verify.

## Important conflicts

1. **Greenlee 23803 EMT CLR** — product page values match Rigid/IMC column of REV02 manual, not EMT column.
2. **Gardner B-0040** — mislabeled deduct-as-radius (rejected; production already warns).
3. **IDEAL 74-034 vs 74-006** — 1-1/4" SKU relationship / stub-up ownership unclear.

## Recommended next integration batch (human review)

1. Re-confirm Klein + Greenlee Site-Rite + Gardner BigBen + IDEAL stub-up facts already mirrored in production (no silent overwrite).
2. Decide whether any **new** IDEAL assembly SKUs need production identity rows (still `field_layout_only` without CLR).
3. Do **not** promote Greenlee 555 / B2555 / Current Tools 254 into Stub 90 until product explicitly expands beyond hand-bender charts.
4. Resolve 23803 CLR conflict with manufacturer before any electric-shoe geometry work.

## Assets

Original SVG icon family under `research/benders/assets/icons/` with preview sheet and manifest. No manufacturer logos or product photos.

## Safety confirmation

- No calculator engine edits.
- No `src/data/benders/` edits.
- User uncommitted diagram files left untouched.
