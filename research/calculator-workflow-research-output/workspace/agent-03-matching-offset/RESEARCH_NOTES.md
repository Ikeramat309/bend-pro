# Agent 03 — Matching Offset

## A. Job

**“I need to copy an existing offset; I can measure its rise and either the straight-run center spacing or the center-to-center distance along that pipe, but I don’t know the angle.”**

Trigger: parallel/new run must match an already-bent offset (different size sometimes; Bend Pro EMT-only same-method). Conduit being bent is **straight**; reference is **already bent**.

Success: new offset has same rise and lands parallel / same centers as required.

Next action: reproduce bend angle (protractor or center mark on shoe) and DBB (or adjacent) with two equal opposite bends.

## Modes as separate hypotheses

### Match Bends (stronger field story for “I don’t know the angle”)

- Measure offset height (perpendicular).
- Measure existing **center distance along the bent conduit** between bend centers (hypotenuse).
- Solve angle = asin(H/DBB), adjacent = sqrt(DBB²−H²).
- Current Tools 754 “Matching Existing Offsets”: measure center distance + height (machine context) — supports the *job*, not hand-EMT mark math.
- IBEW: match existing by measuring offset + DBB → cosecant → angle.

### Match Centers

- Measure height + **straight-run adjacent** between bend-center stations (projection).
- Solve angle = atan(H/adj), DBB = hypot.
- Useful when centers must align on a rack projection, not when only the bent piece is accessible.
- Risk: users confuse “adjacent” with rack spacing between conduits — copy must forbid that reading.

## Bend centers — how obtained

QuickBend docs describe traditional straight-edge crosshairs on bent pipe, or pre-marking shoe centers (QuickCenter). This is **procedure burden**. Product must teach in Guide; pro screen should say “bend centers” and show where to measure.

## Angle reproduction conflict

- Math yields arbitrary degrees (e.g. 14.0°).
- Field hand benders have discrete angle marks; uncommon angles need protractor or custom center mark.
- **Proposal:** show exact angle as hero; secondary “nearest common angle” advisory with consequence (DBB/adjacent change) — do not silently round.
- Reject auto-rounding without user consent.

## Marks from end

Not required for core “match geometry” job. Conditional: if user supplies Mark 1 / free-end station, produce absolute marks like Offset calculator. Current Bend Pro omission is acceptable for v1 if diagram still shows relative DBB.

## Shrink

Supporting only — used for cut/length planning, not the first mark action. Do not hero shrink.

## I/O

**Required:** mode; offset height; adjacent OR existing center distance.  
**Conditional:** Mark 1 for absolute marks; nearest-angle compare.  
**Setup:** size, units, bender (context only for multiplier method).  
**Hero:** Bend Angle + Distance Between Bends (bends mode) or Bend Angle + DBB (centers — DBB is computed hero mark spacing).  
**Secondary:** Adjacent (bends mode) or shrink (one secondary max on pro — prefer adjacent/DBB pair over shrink).  
**On-pipe:** two equal opposite bends; center-to-center; rotate 180° between bends.  
**Unsupported:** CLR/springback matching without shoe data (QuickBend differentiator — do not fake).

## Worked cases

- Match Bends: H=6", DBB=12" → θ=30°, adj=10.392", shrink=1.608" (geometry).  
- Match Centers: H=3", adj=12" → θ=14.036°, DBB=12.369", shrink=0.369".

## Verdict

**Refine.** Keep two explicit modes. Elevate angle + mark spacing; demote shrink; add Guide procedure for finding centers; optional absolute marks later; never silent angle rounding.

## Conflicts

1. Current Tools matching is for powered offset bender scales — different tool class.  
2. QuickBend may apply CLR algorithm when bender selected — Bend Pro intentionally centerline/cosecant; must stay honest.  
3. “Existing center distance” along conduit vs projected adjacent — modes must not blend.
