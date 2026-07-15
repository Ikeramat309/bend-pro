# Agent 3 — Powered / Mechanical Bender Research Notes

**Retrieval date:** 2026-07-14  
**Write path:** `research/benders/workspace/agent3-powered/`  
**Scope:** Mechanical/ratchet, electric (shop + portable battery), hydraulic (hand-pump and power-pump), plus shoes/follow bars/rollers as separate records. Hand benders excluded.

## Method

- Official manufacturer product pages, catalogs, and manuals only.
- Unknown numeric values left `null` / omitted — no photo estimates.
- Non-EMT facts may be recorded with `productionScope: "out_of_production_scope"`.
- Workspace uses schema fields plus rich `staging.*` extensions (pump requirements, frame/shoe separation, kit SKUs, etc.).

## Highest-confidence families

1. **Greenlee 881 Cam-Track / 881GX hydraulic** — live product pages for 881GX/881GXD; press release documenting supersession of 881CT; legacy IM 981 charts for 881/881CT deduct/min stub/CLR (not yet proven identical on GX).
2. **Greenlee 555 electric + single-shoe groups** — 28008 CLR table on product page; 555C deduct table in classic manual; shoe↔frame matrix on MA5956; SG4 CLR published.
3. **Greenlee 854DX / 855GX electric** — current product pages with power specs; shoe accessories documented; 855GX Rigid capacity wording conflict open.
4. **Greenlee 884/885 rigid hydraulic** — product page + shared official manual with full CLR and deduct/min-stub tables (rigid-focused / out of Bend Pro EMT production scope).
5. **Current Tools 77 electric + 254 hydraulic + 750/751 mechanical** — official catalog/manual/product pages; explicit one-shot claims; Greenlee crossover/fit claims recorded as claims only.
6. **Southwire Maxis MHB4000 hydraulic** — official product + 4/25 manual Special Bending Table radii (EMT/IMC/Rigid by size).
7. **Gardner Bender B2000 Cyclone electric** — official product identity + power/size; charts not staged this pass.
8. **Milwaukee 5150-20 M18 FUEL** — official portable battery branch bender + shoe SKUs (not shop table-top).

## Model-name verification notes

| Brief lead | Finding |
|---|---|
| Greenlee Ultra Flex | **Not found** on greenlee.com as a current product name. Rejected lead. |
| Greenlee 855 | Current programmable unit is **855GX** (IntelliBender), electric — not mechanical. |
| Greenlee 885 | **Hydraulic rigid** one-shot/segment family (with 884), not Cam-Track EMT class. |
| Greenlee 881 / 881CT / 881GX | **881GX/881GXD** current; **881/881CT** legacy superseded generation. |
| Greenlee 555 / 555C / CX / DX | **555C** active on series landing; CX/DX still named on shoes/BendWorks; CX/DX EMT shoe **13934 OBSOLETE**. |
| Greenlee 882 | Identity-only via BendWorks (+ secondary pump-literature mention); no capacity page extracted. |

## Brands investigated — negative / limited evidence

| Brand | Result |
|---|---|
| **IDEAL** | Official bending guide / product line shows hand heads/handles only. **No shop electric/hydraulic/mechanical conduit bender** staged. |
| **RIDGID** | Conduit category is hand thin/heavy wall. Tip-Up Wing **HB382/HB383** are gas/black-pipe hydraulic — staged `out_of_production_scope`. |
| **Southwire** | **MHB4000** hydraulic confirmed. No separate Southwire shop electric found in this pass. |
| **Milwaukee** | **5150-20** battery portable confirmed. No table-top shop electric found. |
| **Gardner Bender** | **B2000** electric confirmed. No hydraulic/mechanical shop line extracted this pass. |

## Chart / measurement gaps (intentional)

- **881GX shoe CLR / deduct tables:** product page lists shoe SKUs 94811G–94814G; linked manual `52093598 REV 0` not fully table-extracted — do **not** copy 881CT numbers onto GX.
- **Southwire Table 2 deduct/min stub:** present in manual; OCR reconstruction ambiguous — **not staged** as numbers.
- **B2000 instruction sheet numeric charts:** linked on product page; not extracted this pass.
- **Current Tools 77 / 254:** identity + capacity strong; CLR/deduct charts not found in the catalog pages used.
- **1818:** CLR published only as ranges on product page — not expanded to per-size rows without clearer table.

## Pump classes (hydraulic)

| Class | Evidence |
|---|---|
| External electric pump (e.g. Greenlee **980**, Current Tools **292**) | 884/885 manual suggested pumps; 254P packages; 881GX kit SKUs with 980 |
| External hand pump | Greenlee 755 literature names conduit benders including 882 (secondary); not fully expanded |
| Integrated power hydraulics | Southwire **MHB4000** (20A cord; no competitor shoe interchange per FAQ) |

## Supersession

- Greenlee press (2023-04-04): **881GX** improves on prior **881CT** (lighter follow bars, faster setup with mobile table).
- Recorded as `mdl-greenlee-881ct.marketStatus = superseded` → `replacementModelIds: [mdl-greenlee-881gx]`.

## Counts (this workspace)

See agent return summary in chat for live counts after file write.

## Next research priorities

1. Full extraction of Greenlee **881GX** instruction manual tables (CLR, deduct, min stub) keyed to 9481xG shoes.
2. Clean Southwire **Table 2** deduct/min stub from PDF (not OCR guess).
3. Greenlee **855GX** operator manual capacity reconciliation.
4. Current Tools **77** / **254** manuals for any published CLR/deduct.
5. Gardner Bender **B2000** instruction sheet charts.
6. Confirm whether any IDEAL shop powered bender exists outside the hand line.
