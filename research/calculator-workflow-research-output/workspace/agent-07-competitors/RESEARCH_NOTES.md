# Agent 07 — Competitor & Interaction Patterns

## Local materials

`E:\quick bend example` — **UNAVAILABLE** this machine. Screenshots/video not reviewed. Observations below are from public QuickBend docs + App Store listing + other tools’ public pages. Separate **Observed** vs **Inferred**.

## QuickBend (Grade C)

### Observed (store + docs)

- Separate named bends: Matching Bends Offset, Matching Centers Offset, Parallel Offset, Compound 90 Circle/Rectangle/Square, plus Multi-bend layout.
- Claims centerline-radius algorithm when bender selected; Cosecant Method option without radius.
- Multiple Bends: layout on one stick; flip; cut mark; based on CLR/deduct/gain (docs).
- QuickCenter helps mark bend centers on shoe.
- QuickCheck colors impossible/unlikely inputs.

### Inferred (not proven)

- Exact input field labels and hero number hierarchy on each screen.
- Whether parallel offers simple vs full layout split.
- Exact compound multipliers vs CLR-adjusted spacing.

### Implications for Bend Pro

| Pattern | Adopt / Improve / Avoid |
|---|---|
| Separate Matching Centers vs Bends names | Adopt as modes (already) — clearer jobs |
| Separate Compound shapes as top-level | Improve: one calculator + shape selector OK if labels stay shape-specific |
| CLR-based chaining in Multi-bend | Avoid copying without shoe data & validation |
| Cosecant fallback honesty | Adopt — Bend Pro already closer to multiplier honesty on several screens |
| QuickCenter education | Improve via Guide, not fake shoe marks |

## Master Bender Gold (Grade C store copy)

Lists compound 90 around round/square/rect; parallel; gain & take-up; many bender types. **Observed:** marketing feature list. **Not observed:** field interaction.

## Cliffhanger Tools (Grade B manual, fetch timeout)

Parallel mark adjustment via C-C × tan(θ/2) — aligns with IBEW/Access. Tooling for repeatability; not a phone UI model.

## Manufacturer manuals as “competitors” for interaction

Klein/IDEAL teach **procedure**, not calculators: back-to-back is a sequence with star, not a formula screen. Bend Pro should feel like that appliance sequence.

## Per-workflow snapshot

| Workflow | QB observed | Bend Pro current | Opportunity |
|---|---|---|---|
| B2B | Not prominent in store bend list as named item | Direct star distance | Keep manufacturer-procedure fidelity; QB less relevant |
| Matching | Two named calculators | One with modes | Keep modes; add center-finding Guide |
| Parallel | Named Parallel Offset (+ kicks) | Simple/Full modes | Keep; clarify direction |
| Compound | Three named obstruction types | One + shape | Keep consolidation |
| Multiple | Full CLR/gain layout engine | Honest notebook | Reframe; don’t fake QB |

## Strengths / friction

- QB strength: complete stick layouts when bender specs exist.
- QB friction: complexity; bender-data dependency; opacity of algorithm.
- Bend Pro strength: diagram-first, EMT hand-bender honesty.
- Bend Pro friction: Incomplete field cues on newer calculators; Multiple Bends naming.
