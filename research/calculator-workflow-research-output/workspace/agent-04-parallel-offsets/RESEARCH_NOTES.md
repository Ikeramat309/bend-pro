# Agent 04 — Parallel Offsets

## A. Job

**“I’m running a rack of equal offsets and I need each next pipe’s marks shifted so the gaps stay equal through the diagonal.”**

Goal: preserve C-C spacing through the offset (aesthetics + clearance), not merely compute one offset. Reference pipe is Pipe 1 (inner/first). Direction toward/away free end must be chosen by user — app must never guess.

## Measurement

| Item | Class | Notes |
|---|---|---|
| C-C spacing | Required | Perpendicular to straight runs; center-to-center of conduits |
| Bend angle | Required | Same on every pipe |
| Offset height | Conditional (Full Layout) | For DBB = H/sinθ |
| Conduit count | Conditional (Full Layout) | 2–8 practical on phone |
| Shift direction | Conditional (Full Layout absolute/relative progression) | Toward/away free end |
| Pipe 1 Mark 1 | Conditional | Absolute marks only |

Formula (corroborated):  
`shift = S × tan(θ/2)`  
Both marks on a pipe shift equally → DBB unchanged across rack.  
IBEW: advance centers of progressive conduits by that figure.  
Cliffhanger Tools / Access Electric: same half-angle tangent relationship.

## Conflict preserved

Navy NAVEDTRA discusses offset travel and a separate sine-half-angle **spread allowance for parallel piping fittings/elbows**. That is **not** the conduit mark-progression method. Do not mix into engine. (Navy PDF 403 this run; conflict retained from Bend Pro prior desk note + Access/Cliffhanger/IBEW for conduit method.)

## Structure recommendation

**Keep consolidation** Simple Shift + Full Layout with explicit mode selector (learns one formula). Do not split into two hub tiles unless user testing shows mode blindness. QuickBend lists “Parallel Offset” as one store entry (and separate Parallel Kick variants — out of scope).

## Diagram must show

Pipe 1 → Pipe N order; shift arrows along stick; free-end origin; same DBB; warning if mirrored.

## Invalidators (unsupported)

Unequal trade sizes; mixed shoes; parallel rolling offsets; using edge-to-edge gap without converting to C-C.

## Worked case

S=2", θ=30°, n=4, H=6" → shift=0.5359" (~9/16"), total rack=1.6077", DBB=12".

## Verdict

**Refine.** Keep modes; strengthen direction/origin diagram language; absolute marks stay optional; loud unsupported cases.
