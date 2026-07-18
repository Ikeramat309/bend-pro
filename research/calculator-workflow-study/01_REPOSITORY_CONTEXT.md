# Repository Context Grok Must Read

The research is not allowed to infer Bend Pro's product from screenshots alone.
Read the following files before external research so the final report can compare
evidence with the current implementation accurately.

## Product and safety rules

Read completely:

1. `C:\Project\AGENTS.md`
2. `C:\Project\docs\HANDOFF.md`
3. `C:\Project\docs\PRODUCT_BRIEF.md`
4. `C:\Project\docs\CURRENT_STATE.md`
5. `C:\Project\docs\GLOSSARY.md`
6. `C:\Project\docs\NAMING_RULES.md`
7. `C:\Project\docs\TRUST_MODEL.md`
8. `C:\Project\docs\CALCULATOR_RULES.md`
9. `C:\Project\docs\DIAGRAM_SYSTEM.md`
10. `C:\Project\docs\KNOWN_ISSUES.md`

These are constraints, not evidence that the five new workflows are already
correctly designed.

## Target implementations to audit

For each feature, read its README, config, copy, engine types, engine header and
tests, calculation-result adapter, input snapshot, screen, diagram, and diagram
geometry.

- `C:\Project\src\features\bend-back-to-back\`
- `C:\Project\src\features\bend-matching-offset\`
- `C:\Project\src\features\bend-parallel-offset\`
- `C:\Project\src\features\bend-compound90\`
- `C:\Project\src\features\bend-multiple\`

Also read their guide entries in:

- `C:\Project\src\data\guide\calculatorGuides.ts`

Record the current implementation in a neutral table before judging it:

| Current element | What Bend Pro asks/shows | Evidence currently cited | Field assumption embedded |
|---|---|---|---|
| User goal | | | |
| Required inputs | | | |
| Optional inputs | | | |
| Hero output | | | |
| Secondary outputs | | | |
| Diagram instructions | | | |
| Bender reference | | | |
| Bend order/orientation | | | |
| Warnings | | | |

## Product-quality benchmarks inside Bend Pro

Study these to understand the desired completeness of the field job:

- `C:\Project\src\features\bend-rolling\`
- `C:\Project\src\features\bend-offset\`
- `C:\Project\src\features\bend-stub90\`
- `C:\Project\src\features\bend-saddle3\`
- `C:\Project\src\features\bend-saddle4\`

Do not assume their visual arrangement should be copied. Evaluate why their
input maps naturally to the desired physical result and how their diagram tells
the user what to do.

## Registry and shared UI context

Read only as needed to understand current product integration:

- `C:\Project\src\core\calculators\calculatorRegistry.ts`
- `C:\Project\src\core\calculators\calculatorRoutes.ts`
- `C:\Project\src\shared\workspace\`
- `C:\Project\src\shared\diagrams\`

Do not propose changes to shared components until the field contracts are
settled. A shared UI limitation is not a reason to distort a calculator's job.

## Competitor material available locally

Inspect these if they exist:

- `E:\quick bend example\Recording 2026-07-03 222603.mp4`
- `E:\quick bend example\Screenshot 2026-06-11 184232.jpg`
- `E:\quick bend example\Screenshot 2026-06-11 184321.jpg`
- `E:\quick bend example\Screenshot 2026-06-11 184340.jpg`
- `E:\quick bend example\Screenshot 2026-06-11 184411.jpg`
- `E:\quick bend example\Screenshot 2026-06-11 184443.jpg`
- `E:\quick bend example\Screenshot 2026-06-11 184457.jpg`
- `E:\quick bend example\Screenshot 2026-06-11 184516.jpg`
- `E:\quick bend example\Screenshot 2026-06-11 185122.jpg`
- `E:\quick bend example\Screenshot 2026-07-03 221924.jpg`

QuickBend is a benchmark and a source of workflow names, not automatic proof
that its interaction or math is the best possible design.

## Seed sources already known to Bend Pro

Start here, then expand with stronger or more workflow-specific sources:

- IDEAL Conduit Bender Guide:
  `https://www.idealind.com/content/dam/canada/assets/manuals/Conduit-Bender-Guide_EN.pdf`
- Klein Tools Conduit Bender Guide:
  `https://data.kleintools.com/sites/all/product_assets/documents/instructions/klein/ConduitBenderGuide.pdf`
- QuickBend Bending on Centers:
  `https://bhardman1986.github.io/quickbend-docs/docs/bending-on-centers/`
- QuickBend Trigonometry:
  `https://bhardman1986.github.io/quickbend-docs/docs/trigonometry/`
- Current Tools Model 754 manual:
  `https://cdn.acmetool.com/TradeService/Resources/CURENTINST00002.pdf`
- Greenlee Site-Rite hand-bender manual:
  `https://greenlee-cdn.ebizcdn.com/media/52034125.pdf`
- Cliffhanger Tools parallel-offset manual:
  `https://www.cliffhangertools.com/pages/Repeatable-Conduit-Bending-User-Manual.html`
- U.S. Navy NAVEDTRA 14265A:
  `https://media.defense.gov/2014/Jun/20/2002655942/-1/-1/1/140620-N-ZZ182-6583.pdf`
- IBEW Local 903 Bending Book rev2:
  `https://lu903.com/wp-content/uploads/2017/06/Bending-Book-rev-2-full.pdf`
- Wheatland EMT dimensions:
  `https://www.wheatland.com/wp-content/uploads/2017/12/20-EMT-and-Conduit-Flyer.pdf`

Log inaccessible sources rather than pretending they were reviewed.
