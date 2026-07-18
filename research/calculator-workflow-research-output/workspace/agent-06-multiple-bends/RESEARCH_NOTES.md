# Agent 06 — Multiple Bends / Layout Builder

## A. Real job?

Electricians rarely open a tool named “Multiple Bends” to invent geometry. Real needs observed in competitor docs and trade practice:

1. **Place several already-computed marks on one stick** (offset + 90 + cut) with one origin.
2. **See remaining length / collisions** before wasting pipe.
3. **Flip a bend** when push-through / reverse bending.
4. **(Advanced)** Auto-chain gain/deduct/CLR across bends — QuickBend claims this with bender specs.

Bend Pro’s current feature does (1)–(3) metadata + sorting **without** (4). That honesty matches TRUST_MODEL, but the **name and hub placement imply a calculator**.

## What must travel between bends (for a true solver)

developed length, take-up/deduct, gain, shrink, orientation/rotation, reference end, bender symbol, no-dog plane, shoe CLR. Without shoe-specific geometry, automatic chaining is **unsafe**.

## Failure modes of automatic chaining

- Double-counting shrink/gain
- Wrong reference end after a flip
- Ignoring springback
- Mixing center marks with arrow/star marks
- Implying fit when shoe clearance unknown

## Three product options (scored 1–5)

| Option | Field value | Evidence | Safety | Complexity | Bend Pro fit | Total |
|---|---:|---:|---:|---:|---:|---:|
| **A. Reframe as Stick Mark Planner** (keep organizer; rename; seed from other calculators’ fieldSteps) | 4 | 3 (QB multi-bend exists; organizer need real) | 5 | 2 | 5 | **19** |
| **B. Build a Run v1** — chain only named calculators’ exported marks with explicit per-bend provenance; no new gain math | 4 | 2 | 4 | 4 | 4 | **18** |
| **C. Remove/defer** until CLR/gain chaining researched to Offset-quality | 2 | 4 (absence of safe math is evidence) | 5 | 1 | 3 | **15** |

**Recommendation:** Option **A** now (reframe + seed), design toward **B**, do **not** ship fake auto-solver. Option C acceptable if hub clutter is a problem and seeding isn’t ready.

## QuickBend observation (Grade C)

Docs list Multiple Bends layouts based on centerline radius, deduct, gain; flip marks; cut marks; measure-to-center toggle. That is a **different product ambition** than Bend Pro’s current planner. Copying QB chaining without data would violate evidence rules.

## Verdict

**Reframe** (primary) / **Remove-defer** if reframe not funded. Not “Keep” as a bend calculator.

## I/O (if reframed)

Required: stick length; at least one mark.  
Hero: sorted mark list with origin “from start end”.  
Secondary: tail after last mark.  
Unsupported: computed take-up/gain/shrink inventing.
