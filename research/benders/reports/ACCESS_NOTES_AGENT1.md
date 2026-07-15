# Agent 1 — Access Notes

Retrieval date: **2026-07-14**  
Scope: official manufacturer product pages, manuals, catalogs, shoe charts for conduit benders.

## Blocked / broken / degraded URLs

| URL / lead | Status | Notes |
|---|---|---|
| `https://www.southwire.com/medias/2401-Hand-Benders-Cutsheet-WEB.pdf` (production short form) | **HTTP 400** without Hybris `?context=` token | Short production URL used in Bend Pro `sources.ts` fails anonymous fetch. Context-bearing URL works (see `src-southwire-mcb-cutsheet-2024`). Prefer storing the context URL or re-resolve from product page downloads. |
| `https://www.gardnerbender.com/-/media/inriver/NPA-759.pdf` | **Intermittent timeout** | Document reachable via search/CDN variants (`?modified=…`). Content previously validated; retry or use product-page asset links if fetch fails. |
| `https://www.milwaukeetool.com/products/48-22-4070` (and sibling `/products/48-22-40xx`) | **Redirect** | Still resolves (200 via redirect) to `/products/details/.../48-22-40xx`. Update bookmarks to canonical details URLs when convenient. |
| `https://idealelectricalinc.com/...` vs `https://beta.idealindustries.com/...` | **Dual live catalogs** | Production Bend Pro uses `idealelectricalinc.com` (verified live, stub-up heights present). IDEAL also serves same SKUs on `beta.idealindustries.com`. Treat as same manufacturer; prefer pages that expose stub-up height. |
| `https://www.ridgid.com/us/en/thin-wall-conduit-benders` | **Partial render** | Ordering table and model numbers (B-1677/B-1678/B-1679) present; page template leaves `{{gallerySelectedImage…}}` placeholders. Specs usable; no downloadable shoe-chart PDF found on page. |
| Greenlee CDN document keys | **Generally OK** | Site-Rite manual key `1adba548-…` fetched successfully (large bilingual PDF). Other keys (`89b8e7cb-…` 1800 manual, `13ed568a-…` 1801 manual) also returned content. |

## Contradictions / identity traps

| Topic | Finding |
|---|---|
| **NSI vs TORK** | NSI Industries sells CB50/CB75/CB100 conduit benders. **TORK** under nsiindustries.com is timers/controls — **not** benders. Do not catalog TORK as a bender brand. |
| **Benfield / Chicago / Emerson** | “Benfield” is a **marking/method legacy**, not a current SKU manufacturer. “Chicago bender” colloquially maps to **Greenlee 1800/1801** ratchet mechanical benders (Emerson/Greenlee). No separate active Emerson “Chicago” product family page found. |
| **Gardner Bender radius vs deduct** | Production note still applies: older GB guides have mislabeled radius/deduct tables. Prefer current How-To Guide `GAR_BRO_032_1220` + NPA-759 for BigBen radii/deducts. |
| **Milwaukee stub height** | Official manual (`58-14-4060d3`) says mark using “Desired stub height − Indicated tool stub height” but **does not publish the indicated stub heights** as numeric chart values in the PDF body. Product pages likewise omit take-up/radius. Keep Milwaukee as identity/reference until a shoe chart is found. |
| **Southwire MCB** | Cutsheet confirms MCB1/2, MCB3/4, MCB1 and capacities only — **no take-up/radius**. |
| **Current Tools ↔ Greenlee shoe fit** | Current Tools official catalog/manuals state certain 77 Series shoes fit Greenlee 555 Classic, and 254 major components fit Greenlee 881CT. Treat as manufacturer claim for discovery; do not invent interchangeability tables beyond those docs. |
| **Appleton / Steel City hand benders** | Retailer and used-tool listings exist; **no current official Appleton/ABB product page for conduit hand benders** found in this pass. Steel City under ABB is fittings/conduit systems, not benders. Left out of manufacturers list pending official docs. |
| **Ultra Tugger** | Greenlee Ultra Tugger is a **cable puller**, not a conduit bender. Do not include. |

## Production source verification summary (Bend Pro workbook v1.1)

| Production source | Verified 2026-07-14 |
|---|---|
| Greenlee Site-Rite CDN PDF | Yes — live |
| Klein 51603–51610 product pages | Yes — live (expanded to 51605/51609/51611–51613) |
| Gardner How-To `GAR_BRO_032_1220` | Yes — live |
| Gardner NPA-759 | Intermittent; content known current |
| IDEAL 74-xxx idealelectricalinc.com | Yes — live (74-031 stub-up 5" confirmed) |
| Milwaukee `/products/48-22-40xx` | Yes via redirect |
| Southwire short cutsheet URL | Broken without context token; alternate context URL works |

## Not downloaded

Per mission rules, **no PDFs were saved into the repository**. All entries are URL references only (`redistributionLicenseStatus: url_reference_only`).
