# Bend Pro Product Brief

Part of the [documentation index](README.md). Entry point: [`AGENTS.md`](../AGENTS.md).

## What Bend Pro is

Bend Pro is a mobile-first **EMT conduit bending app** for the field, built with Expo, React Native, and TypeScript. It helps users lay out bends on real conduit: where to put marks, what to deduct, how much the pipe shrinks, and what the finished bend looks like.

## Who it is for

- **Electricians** who bend conduit daily and want fast, reliable layout numbers
- **Apprentices** who are still learning the terminology and the why behind each mark
- **Field workers** using a phone one-handed, outdoors, often in poor lighting, with gloves nearby

## Product philosophy

- **Diagram-first.** The pipe diagram with marks and dimension vectors is the hero of every calculator screen — not a stack of result cards. A user should be able to glance at the diagram and know where to mark the pipe.
- **Fast and practical.** Minimal inputs visible at once, progressive disclosure for optional fields, large readable results.
- **Field-trustworthy.** Correct math, correct trade terminology, sensible warnings (e.g. impractical offsets, steep bends). Reduce confusion around marks, deducts, shrink, bends, and layout steps — don't add to it.
- **Reusable primitives.** Diagrams and workspace UI are assembled from shared building blocks (pipe segments, mark lines, dimension lines, labels), like a small game engine — not one-off drawings per screen.

## What makes Bend Pro different from a generic calculator

A generic calculator gives you a number. Bend Pro gives you a **layout**: a visual of the pipe showing where each mark goes, which direction to measure from, what the bender takes up, and what the finished bend looks like. It speaks the trade's language (deduct, shrink, take-up, stub) instead of abstract math labels, and it accounts for the actual bender being used via bender profiles.

## Current scope (this phase)

- **EMT only.** No RMC, IMC, or PVC.
- **Seven calculators:** Offset, Stub 90, 3-Point Saddle, 4-Point Saddle, Segment Bend, Rolling Offset, and Kick 90 — all live with engine tests and feature diagrams.
- **Stabilization over expansion:** Kick 90 is the first catalog expansion; further calculators follow the locked order in [`HANDOFF.md`](HANDOFF.md) §5.

See [`HANDOFF.md`](HANDOFF.md) for current state and deferred items.

## Field-use priorities

1. Correct numbers, every time
2. Clear marks on the diagram — visually obvious where to mark the pipe
3. Readable outdoors: dark high-contrast UI, large primary result
4. Fast: few taps from opening the app to a usable layout
5. Honest warnings when an input is impractical or invalid

## Current calculators (existing)

| Calculator | Route | What it does |
|------------|-------|--------------|
| **Offset** | `/offset` | Two-bend offset layout: distance between bends, shrink, Mark 1 / Mark 2 |
| **Stub 90** | `/stub90` | 90° stub layout: deduct mark from stub length minus bender deduct (take-up) |
| **3-Point Saddle** | `/saddle3` | Route over an obstruction: center-to-side spacing, shrink, and three layout marks |
| **4-Point Saddle** | `/saddle4` | Route over a wide obstruction with a flat top: between-bends spacing, shrink, and four layout marks |
| **Segment Bend** | `/segment` | Large-radius bend from equal shots: shot count, between-bends spacing, developed length, and marks |
| **Rolling Offset** | `/rolling` | Two-direction offset: offset height + offset roll → distance between bends, shrink, optional marks |
| **Kick 90** | `/kick90` | Small-angle kick beside a 90°: kick rise + bend angle → distance between bends, shrink, and an isometric multi-plane layout |

## Planned calculators (future, not built)

These are **planned future work** — they do not exist yet and must not be documented or coded as if they do:

- Parallel offset, box offset, back-to-back 90, matching centers, simple parallel, compound 90s, multiple-bends layout builder (see [`HANDOFF.md`](HANDOFF.md) §5 for order)

Exact order and scope are decided in [`HANDOFF.md`](HANDOFF.md), not here.

## Non-goals for the current phase

- No new calculators unless explicitly requested — follow `FEATURE_TEMPLATE.md` when adding one
- No conduit types beyond EMT
- No accounts, sync, or cloud features
- No generic "math app" features — Bend Pro stays a conduit bending tool

## Related docs

- [`CURRENT_STATE.md`](CURRENT_STATE.md) — what actually exists today
- [`HANDOFF.md`](HANDOFF.md) — plan and direction
- [`GLOSSARY.md`](GLOSSARY.md) — trade terminology
