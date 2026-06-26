# Field Validation — Beta Prep

Part of the [documentation index](README.md). Entry point: [`AGENTS.md`](../AGENTS.md).

Prepares Bend Pro for beta testing with real electricians. This doc defines **field validated**, lists the **validation matrix** (calculator × size × angle → expected marks), and links the [printable test sheet](FIELD_VALIDATION_TEST_SHEET.md).

**Scope today:** six active EMT calculators only. No new calculators. No debug/export screen — testers use the app and the sheet.

---

## What “field validated” means

| Status | Meaning |
|--------|---------|
| **App-verified** | Expected marks and spacing match automated engine tests (`src/features/bend-*/engine/*.engine.test.ts`). Math is locked; no physical bend required yet. |
| **Field validated** | A qualified electrician marked and bent **physical EMT** using the app’s marks, bend order, and direction cues on their **actual bender**, and the finished run meets field acceptance (clears obstruction, lands parallel/level, stub height within tolerance, etc.). |
| **Blocked** | App cannot produce a deduct mark (e.g. Stub 90 size missing from profile chart) until the tester sets a custom deduct or picks a supported size. |

A matrix row is **field validated** only when all of the following are recorded on the [test sheet](FIELD_VALIDATION_TEST_SHEET.md):

1. Case ID and calculator
2. EMT size, bender profile, bend angle/preset, rounding
3. Inputs entered in the app
4. App primary marks/spacing (screenshot or written values)
5. Physical outcome: **Pass** or **Fail**
6. Tester name, date, bender model, free-text notes (spring-back, shoe difference, etc.)

**Field validated ≠ app-verified.** Passing Jest does not replace a real bend. Beta sign-off requires moving priority cases from App-verified → Field validated.

---

## Validation matrix

**Defaults for matrix rows unless noted:**

- Conduit: **EMT**
- Bender profile: **Generic Hand Bender** (`generic-hand-bender`)
- Unit / rounding: **Imperial / 1/16"** (segment and saddle reference cases use **1/8"** where noted in engine tests)
- Optional marks: distance-to-center or Mark 1 only when the row says so

**Size column:** Offset, Rolling, Saddles, and Segment math uses **generic angle tables** — trade size does not change spacing (see [`TRUST_MODEL.md`](TRUST_MODEL.md)). Size still matters for **Stub 90 deduct** and for verifying setup UI/trust strip. Beta matrix includes size sweeps where math differs.

### Offset (`offset`)

| Case | Size | Angle | Offset height | Mark 1 (opt.) | Expected between bends | Expected shrink | Expected Mark 2 |
|------|------|-------|---------------|---------------|------------------------|-----------------|-------------------|
| OFF-REF | 1/2" | 30° | 6" | — | 12" | 1 1/2" | — |
| OFF-REF-M | 1/2" | 30° | 6" | 10" | 12" | 1 1/2" | 22" |
| OFF-A10 | 1/2" | 10° | 6" | — | 36" | 3/8" | — |
| OFF-A225 | 1/2" | 22.5° | 6" | — | 15 5/8" | 1 1/8" | — |
| OFF-A45 | 1/2" | 45° | 6" | — | 8 3/8" | 2 1/4" | — |
| OFF-A60 | 1/2" | 60° | 6" | — | 7 3/16" | 3" | — |
| OFF-SZ | 3/4", 1" | 30° | 6" | — | Same as OFF-REF | Same as OFF-REF | — |

**Formulas:** spacing = height × multiplier; shrink = height × shrink-per-inch; Mark 2 = Mark 1 + spacing.

### Stub 90 (`stub90`)

| Case | Size | Stub length | Expected deduct | Expected deduct mark | Notes |
|------|------|-------------|-----------------|----------------------|-------|
| STU-REF | 1/2" | 12" | 5" | 7" | Reference case |
| STU-34 | 3/4" | 12" | 6" | 6" | |
| STU-1 | 1" | 12" | 8" | 4" | |
| STU-114 | 1-1/4" | 12" | — | **Blocked** | Warning; no silent fallback — set custom deduct |
| STU-LEG | 1/2" | 12" | 5" | 7" | Optional leg 24" — diagram only |

**Formula:** deduct mark = stub length − deduct (from bender profile chart or override).

### 3-Point Saddle (`saddle3`)

| Case | Size | Preset (side / center) | Obstruction | Dist. to center | Expected center→side | Expected shrink | Expected center mark | Expected side marks |
|------|------|------------------------|-------------|-----------------|----------------------|-----------------|----------------------|---------------------|
| S3-REF | 1/2" | 22.5° / 45° | 2" | 24" | 5.23" (≈2×2.613) | 3/8" | 24 3/8" | ≈19 1/8" · ≈29 5/8" |
| S3-3060 | 1/2" | 30° / 60° | 4" | — | 8" | 1" | — (add distance for marks) | — |
| S3-4590 | 1/2" | 45° / 90° | 2" | — | ≈2.83" | 3/4" | — | — |

**Formulas:** center→side = height × preset multiplier; shrink = height × preset shrink rate; center mark = distance + shrink; side marks = center ± center→side.

### 4-Point Saddle (`saddle4`)

| Case | Size | Angle | Obstruction | Saddle width | Dist. to center | Expected between bends | Expected center mark | Inner marks | Outer marks |
|------|------|-------|-------------|--------------|-----------------|------------------------|----------------------|-------------|-------------|
| S4-REF | 1/2" | 22.5° | 2" | 4" | 30" | 5.2" (≈2×2.6) | 30 3/8" | ≈28 3/8" · ≈32 3/8" | ≈23 3/16" · ≈37 9/16" |
| S4-30 | 1/2" | 30° | 3" | — | — | 6" | — | — | — |
| S4-45 | 1/2" | 45° | 2" | — | — | 2.8" | — | — | — |

**Formulas:** between bends = height × angle multiplier; shrink to center = height × shrink-per-offset; total shrink = 2 × shrink to center; marks chain from center ± half width ± between bends.

### Segment Bend (`segment`)

| Case | Size | Radius | Total angle | °/bend | Start of bend | Expected bends | Expected spacing | Expected first mark | Expected last mark |
|------|------|--------|-------------|--------|---------------|----------------|------------------|---------------------|-------------------|
| SEG-REF | 1/2" | 30" | 90° | 10° | 12" | 9 | 5 1/4" | ≈14 5/8" | ≈56 1/2" |
| SEG-NOST | 1/2" | 30" | 90° | 10° | — | 9 | 5 1/4" | Relative only | Relative only |

**Formulas:** spacing = radius × degrees-per-bend (radians); first mark = start + 0.5×spacing; last mark = start + (n−0.5)×spacing. Geometric model — no spring-back.

### Rolling Offset (`rolling`)

| Case | Size | Angle | Height | Roll (advance) | Mark 1 (opt.) | Expected true offset | Expected between bends | Expected shrink | Expected Mark 2 |
|------|------|-------|--------|----------------|---------------|------------------------|------------------------|-----------------|-----------------|
| ROL-REF | 1/2" | 30° | 6" | 8" | — | 10" | 20" | 2 1/2" | — |
| ROL-REF-M | 1/2" | 30° | 6" | 8" | 12" | 10" | 20" | 2 1/2" | 32" |
| ROL-345 | 1/2" | 30° | 3" | 4" | — | 5" | 10" | 1 1/4" | — |

**Formulas:** true offset = √(height² + roll²); spacing = true offset × multiplier; Mark 2 = Mark 1 + spacing.

---

## Priority for beta

Minimum field-validation set before wider beta:

1. **OFF-REF**, **STU-REF**, **S3-REF**, **S4-REF**, **SEG-REF**, **ROL-REF** — one reference per calculator
2. **STU-34**, **STU-1** — size sweep where deduct changes
3. **OFF-A45**, **ROL-REF-M** — common field angles + optional Mark 1 path
4. **STU-114** — confirm warning UX (blocked, not wrong math)

---

## Offline operation

Bend Pro is **offline-first** for calculator use:

- All six calculators, bender profiles, and guide content ship **on device**
- No network call is required to compute marks or show diagrams
- AsyncStorage is local only — no cloud sync

**Expected behavior offline:** same marks and persistence as online. If offline behavior differs, treat as a **release blocker** for beta.

---

## Persistence and restart verification

Storage keys (AsyncStorage):

| Key | Module | Contents |
|-----|--------|----------|
| `bend-pro/calculator-setup/v1` | `src/core/settings/settingsPersistence.ts` | Unit, rounding, EMT size, bender profile, custom profiles, deduct/multiplier/shrink overrides |
| `bend-pro/recent-layouts/v1` | `src/core/sessions/sessionPersistence.ts` | Recent layout envelope (one row per calculator id, input + setup + result snapshots) |

### A. Calculator setup survives restart

1. Fresh install or **Settings → clear app data** (platform equivalent).
2. Open **Settings** → set **Metric**, rounding **5 mm**, EMT **3/4"**, bender **Steelhead (or any non-default)**.
3. **Benders** → add a **custom bender** with at least one stub-90 deduct.
4. **Offset** → set a **custom multiplier** at 30° (setup override).
5. Force-quit the app (swipe away / stop Expo Go task).
6. Relaunch → confirm all values above persisted.
7. Open **Stub 90** → trust strip shows selected bender; deduct reflects profile/override.

**Pass:** every value matches step 2–4 after cold start.  
**Fail:** defaults return, overrides missing, or wrong bender.

### B. Recent layout survives restart

1. **Offset** → enter offset height **6"**, angle **30°**, optional Mark 1 **10"** → confirm **12"** between bends, Mark 2 **22"**.
2. Wait **≥1 second** (persist debounce ~600 ms in `usePersistRecentLayout`).
3. Navigate **Home** → **Continue Layout** card should appear (if implemented for this build).
4. Force-quit → relaunch → **Home** → **Continue Layout** → confirm inputs and results restore.
5. Alternatively: open **Offset** from Bends without Continue — last recent still updates per calculator id.

**Pass:** input fields and primary results match pre-quit state.  
**Fail:** empty inputs, wrong calculator, or stale results.

### C. Continue Layout route param

1. From **Home**, tap **Continue Layout** (note URL/query includes `layoutId`).
2. Confirm target calculator opens with restored fields (not defaults).
3. Change one input → confirm recalculation updates; recent row updates on debounce.

**Pass:** `useRestoreRecentLayout` hydrates from `layoutId`.  
**Fail:** defaults shown despite Continue card.

### D. Offline + persistence combined

1. Complete steps **A** and **B** while online.
2. Enable **airplane mode** (or disable Wi‑Fi/cellular).
3. Force-quit → relaunch offline.
4. Repeat spot checks: setup from A, open continued layout from B, run a new **Stub 90** calculation.

**Pass:** app launches, calculates, and reads storage with no network.  
**Fail:** blank screens, crash, or lost setup/recents.

### E. Invalid runs not persisted

1. **Offset** → enter **0** or invalid height → warnings, no valid primary result.
2. Force-quit → relaunch → **Continue Layout** should **not** offer that invalid run (or prior valid recent remains).

**Pass:** `shouldPersistRecentLayout` skips invalid-only sessions.  
**Fail:** broken layout restored as Continue.

### Automated regression (CI)

```bash
npm run check
```

Relevant unit tests: `calculatorSetup.test.ts`, `settingsHydration.test.ts`, `recentLayoutsService.test.ts`, `persistRecentLayout.test.ts`, `offsetInputSnapshot.test.ts`, and each `*.engine.test.ts`.

---

## Related docs

- [`FIELD_VALIDATION_TEST_SHEET.md`](FIELD_VALIDATION_TEST_SHEET.md) — printable cases for electricians
- [`TRUST_MODEL.md`](TRUST_MODEL.md) — what bender profile affects
- [`CALCULATOR_RULES.md`](CALCULATOR_RULES.md) — math change policy
- [`src/core/sessions/README.md`](../src/core/sessions/README.md) — recent layout API
- Feature READMEs — worked examples per calculator

---

## Task report template (for testers)

After a field session, file notes with: case IDs tested, pass/fail, bender used, EMT stick length, photo of marked pipe, and any app vs field delta (spring-back, mark placement, obstruction clearance).
