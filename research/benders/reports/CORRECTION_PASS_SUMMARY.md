# Correction pass summary

**Date:** 2026-07-14  
**Folder:** `research/benders/` only  
**Production:** `src/data/benders/` **untouched**

## Before → after

| Metric | Before | After |
|--------|------:|------:|
| Manufacturers | 12 | 12 |
| Sources | 51 | 52 |
| Models | 95 | 99 |
| Measurements | 96 | 99 |
| Conflicts | 8 | 10 |
| Standalone icons | 14 | 14 |
| Manifest entries | 17 | 17 |
| Old misleading `productionCandidateFacts` | 58 | **removed** |
| `newHandCandidates` | n/a | **1** |

Model +4 from explicit splits: `model-greenlee-555cx`, `model-greenlee-555dx`, `model-greenlee-881ct`, `model-greenlee-881gx`.

## Repaired record IDs

See `reports/CORRECTION_PASS_REPAIRED_IDS.json` (full list). Highlights:

| ID | Repair |
|----|--------|
| `src-greenlee-844ah-product` | Added; scope ambiguity |
| `fact-844ah-product-page-clr-unqualified` | Unqualified CLR conflict evidence |
| `fact-844a-emt-*-clr/deduct` | Use-guide groove values preserved |
| `conflict-greenlee-844-clr-listing` | Merged into canonical |
| `src-gardner-b0040-legacy-mislabeled` | URL → `https://file.ecmindustries.com/-/media/inriver/B-0040.pdf` |
| `fact-gardner-b0040-960/961/962-rejected-radius` | Per-size rejected |
| `conflict-gardner-b0040-*` | Per-size conflicts |
| `src-ideal-74-003/006/034` | Dedicated official pages |
| `fact-ideal-74-003/006/034-stub` | Direct official stub-ups; 006 on correct model |
| `model-ideal-74-046/047/026/027/028` | Downgraded `reference_only` |
| `src-nsi-hand-benders-lead` | Homepage → discovery lead |
| `model-greenlee-555c/cx/dx` | Split |
| `model-greenlee-881/881ct/881gx` | Split; no CT→GX transfer |
| `fact-23803-emt-*-minstub` | `derived` + `field_reference_only` |
| Icon SVGs + preview | Aluminum/iron, optical scale, light/dark |

## Remaining open conflicts

1. `conflict-greenlee-844-clr-listing` — 844AH unqualified CLR vs 3/4 groove  
2. `conflict-23803-clr-{1/2,3/4,1,1-1/4,1-1/2,2}` — product page vs REV02 EMT  
3. `conflict-gardner-b0040-{960,961,962}` — rejected mislabel vs current radii  

## Remaining reference-only (count 49)

Includes Milwaukee/Southwire hand, NSI CB leads, powered frames/shoes held research-only, Ideal assemblies without dedicated pages, accessories, legacy Gardner catalog IDs, RIDGID/Benfield/Chicago leads, etc. Full list via:

```bash
node -e "console.log(require('./research/benders/data/models.json').models.filter(m=>m.researchClass==='reference_only').map(m=>m.id).join('\n'))"
```

## Genuinely new safe hand-bender candidates

**Exact count: 1**

- `fact-ideal-74-006-stub` — IDEAL 74-006 head, EMT 1-1/4, Stub Up Height 11, official_exact (new model/source coverage of the existing 11″ chart value — not new bending math)  

(Not promoted to production in this pass.)

## Deterministic rebuild command

```bash
node research/benders/scripts/build-corpus.mjs
node research/benders/scripts/enrich-from-agents.mjs
node research/benders/scripts/correct-corpus.mjs
node research/benders/scripts/build-icon-preview.mjs
node research/benders/scripts/validate.mjs
```

## Validation

- Schema + research validator: **PASSED**  
- `npm run check`: run after this report  

## Confirmation

**`src/data/benders/` was not modified.** Calculator engines and production UI were not modified. No researched numeric values were promoted into production.
