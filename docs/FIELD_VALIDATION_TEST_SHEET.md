# Bend Pro — Field Validation Test Sheet

**Print this page.** One row per physical bend. Use with [`FIELD_VALIDATION.md`](FIELD_VALIDATION.md) for expected values and formulas.

**Tester:** ______________________  **Date:** __________  **Company / crew:** ______________________

**Device:** ______________________  **App build:** __________  **Bender used:** ______________________

**EMT stick:** ______________________  **Lubricant / shoe:** ______________________

---

## How to use

1. Enter the case inputs in the app exactly as listed.
2. Copy **app marks** from the diagram and result strip before bending.
3. Mark and bend physical EMT using app bend order and direction cues.
4. Check **Pass** only if the finished run would be acceptable on a real job.
5. Record deltas — do not “fix” the app on site; note for follow-up.

**Status key:** App-verified = expected from engine tests · Field validated = you bent it and passed

---

## Reference cases (required for beta)

| ID | Calc | Size | Angle / preset | Inputs | App: primary result | App: marks (if any) | ☐ Pass | ☐ Fail | Notes |
|----|------|------|----------------|--------|---------------------|---------------------|--------|--------|-------|
| OFF-REF | Offset | 1/2" | 30° | Height **6"** | Between bends **12"**, shrink **1 1/2"** | — | | | |
| OFF-REF-M | Offset | 1/2" | 30° | Height **6"**, Mark 1 **10"** | Between bends **12"** | Mark 2 **22"** | | | |
| STU-REF | Stub 90 | 1/2" | 90° | Stub **12"** | Deduct mark **7"** (deduct **5"**) | Deduct mark on stub | | | |
| STU-34 | Stub 90 | 3/4" | 90° | Stub **12"** | Deduct mark **6"** (deduct **6"**) | | | | |
| STU-1 | Stub 90 | 1" | 90° | Stub **12"** | Deduct mark **4"** (deduct **8"**) | | | | |
| S3-REF | 3-Pt Saddle | 1/2" | 22.5° / 45° | Obs **2"**, dist to center **24"** | Center mark **24 3/8"** | Sides ≈ **19 1/8"** · **29 5/8"** | | | |
| S4-REF | 4-Pt Saddle | 1/2" | 22.5° | Obs **2"**, width **4"**, dist **30"** | Center **30 3/8"** | Inners ≈ **28 3/8"** · **32 3/8"**; outers ≈ **23 3/16"** · **37 9/16"** | | | |
| SEG-REF | Segment | 1/2" | 90° total, **10°**/bend | Radius **30"**, start **12"** | Spacing **5 1/4"**, 9 bends | First ≈ **14 5/8"**, last ≈ **56 1/2"** | | | |
| ROL-REF | Rolling | 1/2" | 30° | Height **6"**, roll **8"** | Between bends **20"** (true offset **10"**) | | | | |
| ROL-REF-M | Rolling | 1/2" | 30° | Height **6"**, roll **8"**, Mark 1 **12"** | Between bends **20"** | Mark 2 **32"** | | | |

---

## Angle sweep — Offset (height 6", 1/2" EMT)

| ID | Angle | Expected between bends | Expected shrink | ☐ Pass | ☐ Fail | Notes |
|----|-------|------------------------|-----------------|--------|--------|-------|
| OFF-A10 | 10° | 36" | 3/8" | | | |
| OFF-A225 | 22.5° | 15 5/8" | 1 1/8" | | | |
| OFF-A45 | 45° | 8 3/8" | 2 1/4" | | | |
| OFF-A60 | 60° | 7 3/16" | 3" | | | |

---

## Blocked / warning UX (no bend required)

| ID | Calc | Setup | Expected app behavior | ☐ Pass | ☐ Fail | Notes |
|----|------|-------|----------------------|--------|--------|-------|
| STU-114 | Stub 90 | 1-1/4" EMT, stub 12" | Warning; **no** deduct mark; no silent fallback | | | |

---

## Persistence checks (no pipe)

| ID | Step | Expected | ☐ Pass | ☐ Fail | Notes |
|----|------|----------|--------|--------|-------|
| PER-A | Change setup (unit, size, bender) → force-quit → reopen | Setup restored | | | |
| PER-B | Valid offset calc → wait 1s → force-quit → Continue Layout | Inputs + results restored | | | |
| PER-C | Repeat PER-A + PER-B in **airplane mode** | Same as online | | | |
| PER-D | Invalid input (0" height) → force-quit | Continue does **not** restore invalid run | | | |

---

## Free-form cases

| ID | Calc | Size | Angle | Inputs | App marks | ☐ Pass | ☐ Fail | Notes |
|----|------|------|-------|--------|-----------|--------|--------|-------|
| FF-1 | | | | | | | | |
| FF-2 | | | | | | | | |
| FF-3 | | | | | | | | |

---

## Session summary

| Metric | Count |
|--------|-------|
| Reference cases passed | _____ / 10 |
| Angle sweep passed | _____ / 4 |
| Persistence checks passed | _____ / 4 |
| Blocked UX confirmed | _____ / 1 |

**Overall beta readiness (lead electrician):** ☐ Ready for wider beta  ☐ Needs fixes  ☐ Not ready

**Top issues to feed back:**

1. ___________________________________________________________________________
2. ___________________________________________________________________________
3. ___________________________________________________________________________

**Sign-off:** ______________________  **Date:** __________
