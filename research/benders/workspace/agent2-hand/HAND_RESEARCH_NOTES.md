# Agent 2 — Hand Bender Research Notes

**Retrieval date:** 2026-07-14  
**Workspace:** `research/benders/workspace/agent2-hand/`  
**Scope:** Aluminum, iron/ductile-iron, dual-head, Angle Setter hand benders. Manual drive only.

## Method

- Live-fetched manufacturer product pages and official PDFs where reachable.
- Measurement facts recorded **only** when an official source prints the number for that exact model/size.
- Property names follow manufacturer labels: Greenlee/Gardner **DEDUCT** → `stub_deduct`; Klein/IDEAL **Stub-Up / Stub Up Height** → `stub_take_up`; radii → `centerline_radius`.
- Never derived take-up from radius or vice versa. Unknown stays `null` (omitted), never `0`.
- Production baseline values treated as a **research mirror** (documented in model notes); disagreements create conflict records rather than silent “corrections.”
- Third-party PDF binaries were **not** retained in the workspace.

## Production baseline coverage (6 brands)

| Brand | Coverage | Measurements |
|-------|----------|--------------|
| Greenlee Site-Rite Al/Iron/Dual | Chart candidates; use guide + product pages | Deduct + bend radius per size/groove |
| Klein Angle Setter Al/Iron | Chart candidates; official product pages | Stub-Up + CLR |
| Gardner BigBen | Chart candidates; How To + NPA-759 + product pages | EMT Deduct + Radius; B-0040 conflict |
| IDEAL Al/Iron | Expanded SKUs with Stub Up Height | Stub only; **no CLR** |
| Milwaukee Al/Iron | Reference only | Identity; **no take-up/CLR** |
| Southwire MCB | Reference only | Identity; **no take-up/CLR** |

## Expansions with official evidence

- **IDEAL:** 74-046, 74-047, 74-006, 74-028, 74-126, 74-127 (in addition to production heads/assemblies).
- **Gardner legacy:** 930B/931B/932/933 aluminum and 920–923 iron from archived B-0040 — `conflict_review` / low-confidence archived facts only.
- **Klein:** Head SKUs 51608/51609/51610 corroborated alongside assemblies.

## Not expanded (insufficient authoritative hand-bender evidence)

- **Current Tools:** Official docs found are electric/mechanical Omni/750 — out of hand-bender category for this agent.
- **Rack-A-Tiers Hoppy:** Distributor listings only (e.g. bend radius claims); no manufacturer take-up/CLR page fetched → not entered as chart facts.
- **Legacy Benfield** as a separate brand: Gardner product pages label BigBen “Model Benfield”; IDEAL mentions Benfield system. No separate Benfield manufacturer chart with model-specific numbers located this run.
- **IDEAL 74-026 / 74-027:** Named in production notes; product pages not live-fetched here → not invented.

## Conflicts

1. **Gardner BigBen CLR (960/961/962):** Current How To + NPA-759 (+962H page) vs archived B-0040 Radius column (prints deducts 5/6/8). Matches frozen production warning.
2. **Greenlee 844 dual-shoe CLR listing:** Use-guide groove table vs product page single 4-3/16 CLR.

## Blocked / incomplete fetches

- Some Greenlee product pages timed out; use-guide table and search snippets still used where exact.
- Ideal Canada Conduit Bender Guide PDF URL 404 — not used.
- NPA-759 PDF download succeeded but local text extract tooling was limited; values taken from prior indexed extract + corroborating product/How-To sources.

## Counts (this workspace)

| File | Count |
|------|------:|
| models.json | 46 |
| measurements.json | 76 |
| conflicts.json | 4 |
| sources-used.json | 38 |
