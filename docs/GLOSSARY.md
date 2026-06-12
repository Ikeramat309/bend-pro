# Bend Pro Glossary

Part of the [documentation index](README.md). Entry point: [`AGENTS.md`](../AGENTS.md).

Terminology is part of the product. Electricians use these words on real job sites, and mixing them up confuses users and other agents. Use this glossary together with [`NAMING_RULES.md`](NAMING_RULES.md) (which maps terms to exact UI labels and engine keys).

## Conduit and materials

| Term | Definition |
|------|------------|
| **Conduit** | The pipe/tubing that protects electrical wiring. Bend Pro is about bending conduit. |
| **EMT** | Electrical Metallic Tubing — thin-wall steel conduit, the most common type bent by hand. **Bend Pro currently supports EMT only.** |
| **Trade size** | The nominal conduit size used in the trade (1/2", 3/4", 1", …). Not the actual outer diameter. Bend Pro's bender data is keyed by trade size. |

## Bending concepts

| Term | Definition |
|------|------------|
| **Bend angle** | The angle of a single bend, e.g. 10°, 22.5°, 30°, 45°, 60°, 90°. |
| **Offset** | A two-bend layout that shifts conduit sideways (e.g. up and over an obstacle) while keeping it parallel to its original run. |
| **Offset height** | The vertical rise of the offset — how far the conduit needs to shift. Primary input of the Offset calculator. |
| **Travel** | The distance along the pipe between the two offset bends, derived from offset height × angle multiplier. **Preferred user-facing term: "Distance Between Bends"** — "travel" may appear in trade speech and internal discussion but is not the current UI label. |
| **Shrink** | The effective conduit length "lost" because the offset path is longer than a straight line. Users add shrink to their measurement before marking. |
| **Mark** | A pencil/marker line on the pipe showing where to position the bender. |
| **Mark 1** | The first offset layout mark (optional input in the Offset calculator). **Offset language only.** |
| **Mark 2** | The second offset layout mark: Mark 1 + distance between bends. **Offset language only.** |
| **Stub** | The short vertical leg of a 90° bend, typically rising from a box or floor. |
| **Stub length** | The desired finished height of the stub, measured to the back of the bend. Primary input of the Stub 90 calculator. |
| **Deduct** | The amount subtracted from stub length to find the mark, determined by the bender shoe (e.g. 5" for 1/2" EMT on a typical hand bender). **Preferred user-facing term** for this value in Stub 90. |
| **Deduct mark** | Where to mark the pipe for a stub 90: stub length − deduct. **The Stub 90 result must be called "Deduct Mark" in the UI — never "First Mark" or "Start Mark"** (that language belongs to offset layout). |
| **Take-up** | Same physical concept as deduct (what the bender shoe consumes). Use sparingly in UI — **prefer "Deduct"** unless explicitly teaching the take-up concept (e.g. future guide mode). Fine internally. |
| **Leg** | The horizontal run of a stub 90 (optional input). |

## App and system concepts

| Term | Definition |
|------|------------|
| **Bender profile** | A data record describing a specific bender (or generic class of bender) and its take-up/deduct values per trade size. Lives in `src/data/benders/`. Only `generic-hand-bender` exists today. |
| **Manual override** | Lets the user replace chart/table values when their bender or sticker differs. **Stub 90:** manual deduct override per EMT size (tap the Deduct chip). **Offset:** manual multiplier override and manual shrink-per-inch override per bend angle (tap the Multiplier or Shrink chips). All persist in calculator setup. |
| **Guide mode** | *(Planned — Phase 5, placeholder screen only.)* Teaching/walkthrough content for apprentices: formulas, bend steps, common mistakes. |
| **Diagram primitive** | A small reusable SVG building block in `src/shared/diagrams/` (pipe segment, mark line, dimension line, label, callout). Calculators compose primitives instead of drawing one-off graphics. |
| **Pipe segment** | The diagram primitive that draws a straight run of conduit (`PipeSegment`). |
| **Vector / dimension line** | A diagram line with arrowheads/extents that shows a measurement on the diagram (`DimensionLine`) — e.g. stub length, distance between bends. Explains the layout visually instead of forcing users to read text. |

## Preferred vs. avoided terms (quick reference)

| Use in UI | Avoid in UI | Context |
|-----------|-------------|---------|
| Deduct | Take-Up (except when teaching) | Stub 90 |
| Deduct Mark | First Mark, Start Mark | Stub 90 result |
| Mark 1 / Mark 2 | First Mark / Second Mark | Offset layout |
| Distance Between Bends | Travel, Mark Spacing | Offset |
| Offset Height | Rise | Offset input |
| Stub Length | Stub Height | Stub 90 input |
| Bend Angle | Angle (alone, when ambiguous) | All calculators |

The legacy `firstMark` and `takeUp` engine keys have been removed — engine surfaces now match this glossary (`deductMark`, `mark1`/`mark2`; `stubHeight` remains as the engine key for Stub Length). See [`NAMING_RULES.md`](NAMING_RULES.md) for the exact key lists. Prefer the glossary terms for all **new** UI copy and public contracts, and never introduce a new name for a concept that already has one.
