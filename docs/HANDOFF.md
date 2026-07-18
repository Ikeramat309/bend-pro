# Bend Pro — Agent Handoff & Master Plan

**This is the single source of truth for any agent picking up Bend Pro.** Read this
first. You do **not** need to read the historical phase docs. Reference docs
(GLOSSARY, NAMING_RULES, CALCULATOR_RULES, ARCHITECTURE_GUARDRAILS, TRUST_MODEL,
FIELD_VALIDATION) are read **on demand** when a task touches them.

---

## 0. First 5 minutes

```bash
npm install
npm run check     # typecheck + lint + import-cycle scan + jest  → must be green
npm start         # Expo; open on a device/simulator to see the UI
```

- **Establish the baseline before any change:** run `npm run check`, record the
  suite/test count, and keep it green after every change.
- **Never change calculator math** in `src/features/*/engine/` unless a task
  explicitly says so and provides field evidence. Math is field-safety-critical.
- Work in small, reviewable steps. One concern per change set.

---

## 1. What Bend Pro is (don't relitigate)

A **mobile-first EMT conduit-bending field tool** for electricians (Expo + React
Native + TypeScript). Diagram-first: the pipe diagram is the hero of every
calculator screen. Twelve workflows ship: **Offset, Matching Offset, Parallel
Offsets, Rolling Offset, Stub 90, Back-to-Back 90, Kick 90, Compound 90,
3-Point Saddle, 4-Point Saddle, Segment Bend, and Multiple Bends.**

It is **not** a generic calculator. Wrong numbers waste real material on a job
site, and wrong trade terminology confuses real users.

---

## 2. Locked decisions (do NOT reopen)

**Product**
- Target users: **journeymen by default** (fast pro screen), **apprentices via
  Guide mode** (same calculators, more explanation; "Open the calculator"
  graduates them to the pro screen).
- Scope: **EMT only, hand benders only.** No RMC/IMC/PVC. No additional
  calculators before beta unless the founder explicitly expands scope.
- **Supported sizes (v1): 1/2", 3/4", 1", 1-1/4" only** (`SUPPORTED_EMT_TRADE_SIZES`).
  1-1/2" and 2" are hidden from the picker. The full size type is retained for
  capability/old setups.
- Trust: keep the **main screen minimal**. Deep explanation lives in Guide,
  `TRUST_MODEL.md`, and the trust strip's one-line note — never clutter the
  default flow. The screen must answer: where do I mark, what's the spacing,
  which bend is first, which way does it face, what warning matters.

**UI direction (the design system — see §4 for detail)**
- **Continuous surface:** one background, **no cards/boxes/dividers**. Separate
  zones with space and type hierarchy.
- **Horizontal pipe, drawn naturally per calculator** (offset = run with a jog,
  stub 90 = L, saddles = up-and-over, segment = arc). **Single-plane calculators
  stay 2D horizontal.** **Multi-plane calculators** (Kick 90, Rolling Offset,
  Matching Offset, and Multiple Bends where applicable) use the shared fixed-view
  isometric 3D pipe (founder-approved revision 2026-07-04). *We tried vertical and
  reverted — do not flip pipes vertical.*
- **Pipe = brushed steel tube** (thick, rounded, 3-concentric-stroke cylinder).
  **Orange = marks. Green = bend/take-up zones. One calm blue = interactive
  only.** Color is functional, never decorative.
- **One big centered hero result** below the pipe; ≤2 secondary chips; marks on
  the pipe. Never show the same value three times.
- **Dark + light themes** (dark-first), switchable in Settings → Appearance,
  persisted.

---

## 3. Current state (what's done & green)

**Trust / correctness (beta-wrap, complete):**
- All twelve engines/workflows are covered by automated tests and desk review;
  there are **no known math bugs**. The original formulas remain locked, and the
  new workflows document their field method and trust boundary. See
  `FIELD_VALIDATION.md`.
- **Stub 90 silent-fallback bug fixed:** uncharted sizes return `missing-chart`
  → warning + no deduct mark + custom-deduct calibration path (no guessing).
- **Manufacturer bender database (workbook v1.1, 11 profiles)** shipped with
  **`verificationStatus`**-gated math — sourced take-up drives Stub 90 deduct;
  reference-only profiles (Milwaukee, Southwire) require a custom deduct.
- **Scope locked** to 1/2"–1-1/4"; generic **1-1/4" take-up = 11"** added,
  flagged **PENDING physical field verification** (see §6).
- `TRUST_MODEL.md` documents what each input actually affects (bender profile
  changes Stub 90 only; trust strips are honest per calculator).

**Workflow:**
- **Continue Layout is real:** Home hydrates recent layouts on focus and opens
  the last calculation; screens restore inputs via `useRestoreRecentLayout`
  (`?layoutId=`). Recent layouts persist in AsyncStorage.
- Guide mode complete for all twelve (formula/steps/mistakes/example + "Open the
  calculator" graduation affordance).

**Calculator UI milestone (complete):**
- Theme foundation: `src/theme/palette.ts` (dark+light), `ThemeContext.tsx`
  (`useTheme()`), persisted Appearance control. App shell + hubs themed.
- Diagram system theme-aware: `getDiagramTheme(scheme)` + `useDiagramTheme()`;
  all primitives + twelve feature diagrams consume it.
- Continuous-surface shell (cards/dividers/dock-bar dissolved).
- **Hero centered result** in `BendPipeWorkspace` (all twelve).
- **Offset reverted to horizontal** (the one screen that was wrongly vertical).
- All twelve calculator screens use the same compact centered header, honest
  setup-first trust line, quiet input density, balanced action dock, and
  brushed-steel tube language.
- The saddle diagrams were rebuilt around physical obstructions, conduit-wrap
  marks, attached measurements, and uncluttered bend callouts. Segment Bend now
  uses the same satin EMT, bend-zone, open-end, and mark language.
- Representative, optional-input, steep-angle, empty, extreme-geometry, dark,
  and light states were reviewed. Last gate: `npm run check` green with **701
  tests across 69 suites**.

**Field-validation prep:** `FIELD_VALIDATION.md` (matrix + "field validated"
definition + offline/persistence QA) and `FIELD_VALIDATION_TEST_SHEET.md`
(printable) exist. Rows are **App-verified**, not yet physically bent.

---

## 4. UI design system (build to this)

| Element | Rule |
|---------|------|
| Surface | One continuous background (`colors.background`). No card borders/fills on calculator screens. |
| Pipe | Brushed-steel **tube**: thick stroke (~19), rendered as 3 concentric strokes (dark edge → gradient body → light sheen core), rounded caps. Steel-gray gradient, not cyan. |
| Marks | Orange (`colors.mark`) ticks on the pipe + bend-order badges. The only hot color. |
| Bend zones | Green (`colors.success`) soft glow on the take-up arc. |
| Accent | One blue (`colors.primary`, `#4C8DFF` dark / `#2F6BFF` light) — interactive elements only. |
| Result | One large centered hero value below the pipe (small uppercase label above), ≤2 secondary chips, centered. |
| Inputs | Quiet, borderless: small uppercase muted label + large tappable value/unit, separated by space or a faint hairline. No heavy boxes. Keep focus/error/picker states. |
| Labels | Horizontal, readable; never overlap marks/badges/dimensions or sit on the pipe. |
| Dock | Borderless text actions on a transparent bar: Reset · [calculator action] · Guide. |
| Nav | Layout · Bends · Benders · Guide. |
| Themes | Dark + light via `useTheme()`; diagrams via `useDiagramTheme()`. No hard-coded colors in new work. |

**Reference mockups** (the agreed look) live in `assets/bendpro-offset-dark.png`
and `assets/bendpro-offset-light.png`. Pipe is stylized SVG (not raster
photoreal) by design — flexible and animatable.

---

## 5. Remaining plan (priority order)

### P1 — Finish the UI polish pass — complete
Goal met: every current calculator matches §4, diagrams stay readable across
supported inputs, and light mode remains continuous.
- All twelve were reviewed in representative live and empty states; saddles,
  Segment Bend, shared headers, input density, and action docks were unified.
- Label/mark/dimension collisions were removed; conduit marks now wrap the pipe
  at the actual tangent points rather than floating nearby.
- ~~Theme + restyle the **sheets**~~ **Done:** sheets themed for light/dark and
  continuous surface (`Sheet`, `LengthInputSheet`, `FractionKeypad`,
  `EditSetupSheet`, `AngleSelector`, override sheets). Verify on device if
  anything still reads off in light mode.
- Light-mode contrast pass once layouts settle.

### P2 — Field-validation readiness (founder-gated, see §6)
- Keep `FIELD_VALIDATION.md` matrix in sync with any UI label changes.
- No code blocks here — this is physical testing by the founder/electricians.

### P3 — Existing-calculator engineering gate — complete
See §7. Physical field validation remains a separate founder-owned beta gate in
§6 and can run alongside catalog expansion.

### Catalog expansion (QuickBend-parity)

Authorized catalog status after the original six:

1. **Kick 90** — shipped
2. **Box Offset** — intentionally deferred by founder; remains Coming Soon
3. **Back-to-Back 90** — shipped
4. **Matching Centers / Matching Bends Offsets** — shipped as one explicit two-mode workflow
5. **Simple Parallel / Parallel Offsets** — shipped as one simple/full-layout workflow
6. **Compound 90s** — shipped with explicit round-at-corner, box-flat-to-walls,
   and square-on-point orientations plus per-side clearance
7. **Multiple Bends** — shipped as a safe absolute-mark planner; it does not invent chained shoe/gain math

**Deferred (trust):** Computed gain/setback from radius — deferred; QuickBend's published values don't match pure radius geometry; needs validated definition or sourced data.

Register each calculator in `src/core/calculators/` first; build engine + tests before full UI.

### Post-beta only (do NOT start without explicit scope)
- **First sidekick tool (decided, not built):** Conduit Fill (NEC latest + CEC 2024)
  — after the bending core is done.
- **Box Offset** and **Hydraulic Layout** remain planned; do not start either
  without explicit founder scope. Follow `FEATURE_TEMPLATE.md`, register first,
  and build engine+tests before UI.
- Manufacturer/verified bender charts (require cited `sourceNote`).
- A "Why this number?" detail sheet (keep it out of the default flow).
- Saved jobs/layouts UI (`SavedLayout` type exists; no service yet).

---

## 6. What ONLY the founder can do (blocking for field beta)

1. **Field-verify the generic 1-1/4" stub-90 take-up (11")** before relying on it.
2. **Physically bend one of each calculator** at a supported size and confirm the
   app's marks produce a correct real bend (moves matrix rows from App-verified →
   Field validated). The founder owns current-model **Klein hand benders up to 1"
   EMT**, so Klein profiles are the ones that can be physically verified on-site.
3. Swap the placeholder `feedback@bendpro.app` in Settings before public beta.
4. Decide app-store assets / naming when ready.

---

## 7. Existing-calculator milestone before catalog expansion

- [x] `npm run check` green (typecheck + lint + 0 cycles + 701 tests / 69 suites).
- [x] No overlapping labels/marks on any of the twelve diagrams; pipe reads as a
      steel tube; UI matches §4 in dark **and** light.
- [x] All sheets themed (light/dark) and continuous-surface styled.
- [x] No silent wrong numbers; trust strips honest (Stub 90 only consumes bender).
- [x] Continue Layout restores the last layout for all twelve.
- [x] Picker shows only 1/2"–1-1/4"; uncharted sizes warn (no guess).
- [x] Docs truthful (this file + `CURRENT_STATE.md` + `KNOWN_ISSUES.md`).

Physical bend validation and the 1-1/4" take-up check remain required for public
field beta (§6), but no longer block engineering work on the authorized catalog.

---

## 8. Guardrails (non-negotiable)

- Engine math/constants only change with explicit instruction + field evidence;
  math lives only in `src/features/*/engine/`.
- New calculators are registered in `src/core/calculators/` **first**.
- `src/core/` must not import `@/navigation`; route paths live in
  `calculatorRoutes.ts`. Features must not import other features.
- Use theme tokens via `useTheme()`/`useDiagramTheme()` — no hard-coded colors.
- Run `npm run check` after substantive edits; keep it green.
- Full rules: `AI_AGENT_WORKFLOW.md`, `ARCHITECTURE_GUARDRAILS.md`.

---

## 9. Doc map (lean)

- **This file** — current work, plan, decisions. Start here.
- `PRODUCT_BRIEF.md` — what/who/scope.
- `TRUST_MODEL.md` — what each input affects.
- `FIELD_VALIDATION.md` + `FIELD_VALIDATION_TEST_SHEET.md` — math validation + field testing.
- `CALCULATOR_RULES.md` / `ARCHITECTURE_GUARDRAILS.md` / `AI_AGENT_WORKFLOW.md` — editing rules.
- `GLOSSARY.md` / `NAMING_RULES.md` — terminology & UI labels.
- `PROJECT_MAP.md` / `APP_ARCHITECTURE.md` — where code lives.
- `DIAGRAM_SYSTEM.md` — diagram contract/principles (the locked visual direction is §4 above).
- `FEATURE_TEMPLATE.md` — only for post-beta new calculators.
- `KNOWN_ISSUES.md` — current limitations.
