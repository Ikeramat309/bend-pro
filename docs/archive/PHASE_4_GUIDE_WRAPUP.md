# Phase 4 Guide Wrap-Up

Part of the [documentation index](README.md). Entry point: [`AGENTS.md`](../AGENTS.md).

Snapshot as of the **Guide mode expansion** close-out. (Historical calculator Phase 4 remains in [`PHASE_4_WRAPUP.md`](PHASE_4_WRAPUP.md).)

## Goal

Replace the `/guide` placeholder with apprentice-friendly content — formulas, field steps, and common mistakes — opened from each calculator’s Guide dock action without cluttering the calculator workspace.

## Delivered

### Content (`src/data/guide/`)

- **`guideTypes.ts`** — `CalculatorGuide`, `GuideSection`, `GuideCalculatorId`
- **`calculatorGuides.ts`** — walkthroughs for all six active calculators (aligned with feature READMEs and [`CALCULATOR_RULES.md`](CALCULATOR_RULES.md) example cases)
- **`index.ts`** — `getCalculatorGuide`, `isGuideCalculatorId`, intro + core-concepts copy

### UI

- **`GuideSectionCard`** — shared card for formula / steps / mistakes / example blocks
- **`GuideScreen`** — index (grouped by bend family) + detail view driven by `?calculator=` route param
- Detail includes **Open calculator** link back to the live bend screen

### Navigation

- **`guideRoute(calculatorId)`** in `src/navigation/routes.ts`
- All six calculator docks push contextual guide: `guideRoute('offset')`, etc.

## Exit criteria

- `/guide` shows real content, not a placeholder
- Guide from a calculator opens that calculator’s section
- Learning stays on the Guide tab — no mid-calculator explanation cards added
- `npm run check` passes

## Deferred

- Deep-linking to individual sections within a guide (formula vs steps)
- Search across guide content
- Illustrations or animated bend sequences
- Per-setup contextual tips (e.g. showing the user’s current bender deduct in the stub guide)

## Acceptance (Phase 5.5)

Verified: formulas align with engine headers and `CALCULATOR_RULES.md` example cases; guide content lives only on Guide tab; all six `guideRoute()` mappings correct.

## Next phase

**Phase 5 — Bender database improvement** — richer profiles when sourced chart data exists.
