# Conflict Report

Retrieval date: 2026-07-14 (post correction pass)  
Policy: never silently pick a winner.

## Open / needs human review

### 1. Greenlee 23803 EMT centerline radius (sizes 1/2–2)

- **Type:** value_mismatch  
- **Facts:** `fact-23803-emt-*-clr-manual` vs `fact-23803-emt-*-clr-page`  
- **Analysis:** Official product page lists CLR values that match the **Rigid/IMC** column of 52065584REV02, not the **EMT** column.  
- **Next:** Confirm with Greenlee which document is authoritative for Cat 23803.

### 2. Gardner BigBen radius vs legacy B-0040 (960 / 961 / 962)

- **Type:** revision_change  
- **Source URL (corrected):** https://file.ecmindustries.com/-/media/inriver/B-0040.pdf  
- **Facts:** current How To CLR vs `fact-gardner-b0040-*-rejected-radius`  
- **Analysis:** B-0040 printed deduct values (5/6/8) in a radius column. Rejected; never production candidates.

### 3. Greenlee 844AH dual-shoe CLR listing (canonical)

- **Type:** family_vs_model_scope  
- **Conflict ID:** `conflict-greenlee-844-clr-listing`  
- **Analysis:** Use guide groove values preserved (1/2 → 4-3/16; 3/4 → 5-1/8). Product page prints a single unqualified 4-3/16 — must **not** be applied to the 3/4 groove. Use-guide facts are **not** downgraded.

## Intentionally not conflicts

- Hand-bender deducts vs electric-shoe deducts — different equipment classes.  
- IDEAL 74-006 head vs 74-034 assembly — separate identities with matching stub-up 11 (not a value conflict).  
- Milwaukee / Southwire missing take-up — absence is not a conflict.
