# QA Report — Correction pass (canonical corpus)

**Auditor:** Correction-only audit pass  
**Date:** 2026-07-14  
**Scope:** Exact contents of `research/benders/data/*.json` after `correct-corpus.mjs`  
**Validator:** `node research/benders/scripts/validate.mjs` → **PASSED**

---

## Executive verdict: **pass-with-caveats**

Canonical corpus is research staging only. It is **not** approved for production promotion. Validator schemas are enforced; candidate metrics are separated; known source defects were repaired.

---

## Canonical counts (after correction)

| Object | Count |
|--------|------:|
| Manufacturers | 12 |
| Sources | 52 |
| Models | 99 |
| Measurements | 99 |
| Conflicts | 10 |
| **Assets (manifest entries)** | **17** |
| — Standalone icons | **14** |
| — Preview sheets | **1** |
| — Manufacturer placeholders | **2** |
| Hand / mechanical / electric / hydraulic | 49 / 9 / 10 / 6 |
| Shoes + accessories | 24 |
| Official-typed sources | 47 |
| Archived official sources | 3 |
| Source-backed numerical facts | 96 |
| Reference-only models | 49 |
| Rejected claims | 3 |

> Note: Model count rose 95 → 99 because 555C/CX/DX and 881/881CT/881GX were split. Not silent enrichment loss.

### Separated candidate metrics (replaces old `productionCandidateFacts`)

| Metric | Count | Meaning |
|--------|------:|---------|
| `existingProductionBaselineFacts` | 43 | Staging mirrors of workbook v1.1 profiles |
| `newHandCandidates` | **1** | Genuinely new safe hand EMT facts |
| `poweredResearchFacts` | 52 | Powered/shoe research numerics |
| `heldConflictFacts` | 20 | Facts in open/needs_human_review conflict groups |
| `derivedReferenceFacts` | 6 | Derived or field_reference_only |

**Only new safe hand candidate ID:** `fact-ideal-74-006-stub` (new model/source coverage of the existing 11″ Stub Up Height — not new bending math)  
(Rules: hand + EMT + app sizes 1/2–1-1/4 + high confidence + direct official + non-approximate + no open conflict + not already baseline.)

---

## Spot-check notes (correction pass)

- Greenlee Site-Rite groove values preserved; 844AH product-page CLR held as scope ambiguity.
- Gardner B-0040 URL corrected; 5/6/8 rejected per size.
- IDEAL 74-003 / 74-006 / 74-034 direct official stub-ups; assemblies without dedicated pages → `reference_only`.
- NSI homepage reclassified as discovery lead (`sourceType: other`).
- 555 and 881 families split; no 881CT→881GX chart transfer.
- Derived 23803 min-stub → `field_reference_only` / `derived`.

---

## Do not promote

See `workspace/agent6-qa/REJECTED_CLAIMS.json` (update mentally: prefer current conflict/rejected IDs after correction) and:

- All Greenlee 23803 CLR sides  
- All B-0040 rejected radius facts  
- All powered research facts for Stub 90  
- Held conflict facts  
- Derived min-stub facts  

---

## Assets

- 14 standalone `currentColor` SVGs  
- Preview regenerated from icons (light + dark + 24px strip)  
- A11y contract: `assets/ICON_A11Y_CONTRACT.md`  
- Provenance: draft original silhouettes; do not overstate exclusive legal ownership  

---

## Licensing

URL references only. No third-party PDFs in repo. Icons are original draft research artwork.
