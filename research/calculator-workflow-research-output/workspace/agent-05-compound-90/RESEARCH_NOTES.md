# Agent 05 — Compound 90

## Terminology

**Compound 90 (obstruction-clearing sense used by Bend Pro / QuickBend / Cox / IBEW):** turn a corner with **two 45° bends** so the diagonal clears a round, square, or rectangular obstruction in the corner.

Competing meanings (do not merge):
- Any multi-shot 90 / segmented 90
- Kick + 90 combinations
- “Compound” as rolling / multi-plane bends

Keep scope: **two-45 corner clearance** only for this calculator.

## Obstruction methods (keep shapes explicit)

From **IBEW Local 903** (downloaded text):

| Shape | Back-of-conduit / outside figure | C-C (bend centers) |
|---|---|---|
| Round | Diameter × **2.4** | minus ½ OD |
| Square (side A) | Side × **3** | minus ½ OD |
| Rectangular (A+B from corner legs) | (A+B) × **1.414** | minus ½ OD |

IBEW also notes: supports depth can alter rectangular path; increase B for more clearance.

**Richard A. Cox / ElectricianTalk paraphrase (Grade B/C):** Spacing = d×2.4 (round); d×3 (square); (d1+d2)×1.414 (rectangle). Some forum posts omit OD/2 and treat spacing as mark distance directly — **conflict**.

**Bend Pro current:** matches IBEW including −½ OD for center spacing. **OD/2 is not Bend Pro invention** — present in IBEW.

Wheatland OD for ½" EMT = 0.706" → ½ OD ≈ 0.353".

## Always two 45s?

Field table constants (2.4, 3, 1.414) assume **45°/45°**. Other angle pairs would need different geometry — **unsupported** unless separately sourced.

## Marks / orientation

- Marks are **bend centers** for the two 45s (C-C spacing).
- Bender reference: center-of-bend mark on shoe / charted 45° center — not star (star is back of 90). Exact brand symbol varies; product should say “align to your 45° **center** mark” and Guide how to find it.
- Both bends typically same plane; hook/orientation: “bender head facing same direction” appears in forum Cox discussion (Grade C) — treat as advisory until manufacturer corroborates.
- Optional First Mark → Second Mark = First + C-C. Absolute landing often done by bending then cutting stub (forum) — product should allow optional first mark without requiring cut-length solver.

## Clearance measurement origin

User measures obstruction size (diameter / side / height & width of corner object). Standoff/clearance beyond bare obstruction is **user-enlarged input** (IBEW: increase B for more clearance) — do not invent automatic clearance unless user enters it.

## I/O

**Required:** shape; primary dimension; secondary for rectangle; trade size (for OD).  
**Conditional:** first bend mark → second absolute mark.  
**Hero:** Distance Between Bends (C-C).  
**Secondary:** optional Second Mark; back-of-conduit figure can be Guide/secondary.  
**On-pipe:** two center marks; 45°; bend order; plane.  
**Warnings:** large obstruction; spacing ≤0 after OD correction; unsupported non-45.

## Worked case (IBEW-style)

Round D=2": B=4.8"; ½" EMT OD=0.706; C-C=4.8−0.353=4.447" → display ~4 7/16".  
(IBEW example used D=2 with ½ OD≈0.5 approximation in book example — note book sometimes uses rounded ½" OD.)

## Verdict

**Refine.** Keep three shapes in one calculator with shape selector (shared interaction proven by same two-45 + C-C pattern). Surface clearance tip; hero C-C; do not claim shoe CLR fit beyond table.

## Conflicts

1. Spacing-as-marks without OD/2 vs IBEW C-C with OD/2.  
2. Square: side×3 vs treating square as rectangle (A+A)×1.414 (= side×2.828) — different; IBEW publishes both square×3 and rectangular (A+B)×1.414.  
3. Forum “same hook direction” not Grade A.
