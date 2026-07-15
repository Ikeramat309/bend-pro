# Source Audit

Retrieval date: 2026-07-14

## Hierarchy applied

1. Official manufacturer manuals / instruction sheets  
2. Official product pages with model-specific specs  
3. Official catalogs / bulletins  
4. Archived official docs  
5. Authorized distributor hosting manufacturer docs  
6. Catalog scans (discovery)  
7. Retailer listings (leads only)  
8. Forums / social (leads only — none used for numbers)

## Official source inventory (selected)

| Source ID | Publisher | Type | Currency | Notes |
|-----------|-----------|------|----------|-------|
| src-greenlee-site-rite-cdn | Greenlee | official_pdf_manual | current | Production Site-Rite baseline |
| src-greenlee-555-single-shoe-52065584-rev02 | Greenlee | official_pdf_manual | current | 555 shoe deduct + CLR |
| src-greenlee-23803-product | Greenlee | official_product_page | current | **Conflicts** with REV02 EMT CLR |
| src-greenlee-2015-bending-catalog | Greenlee | official_catalog | archived | 881/880/555 family map |
| src-klein-51604 / 51606 / 51608 / 51607 / 51610 | Klein | official_product_page | current | Stub-up + CLR |
| src-gardner-howto-gar-bro-032 | Gardner | official_pdf_guide | current | BigBen deduct + radius |
| src-gardner-b0040-legacy-mislabeled | Gardner | archived_official | archived | Rejected mislabel evidence |
| src-gardner-b2555-is-002 | Gardner | official_pdf_manual | current | Sidewinder Chart B |
| src-ideal-74-031 / 032 / 001 / 002 | IDEAL | official_product_page | current | Stub Up Height |
| src-milwaukee-48-22-4070…4082 | Milwaukee | official_product_page | current | Identity only |
| src-milwaukee-hand-instruction-58-14-4060 | Milwaukee | official_pdf_manual | current | Confirms no stub chart |
| src-southwire-2024-hand-benders | Southwire | official_pdf_product_sheet | unknown | HTTP 400 on fetch |
| src-southwire-mcb34-product | Southwire | official_product_page | current | Identity corroboration |
| src-current-tools-254 / 753 / 750 / 77 | Current Tools | official_pdf_manual | current | Powered charts |
| src-rack-hoppy / skybender | Rack-A-Tiers | official_product_page | current | Identity only |
| src-ridgid-e666-distributor | Distributor | retailer_listing | unknown | Lead only |
| src-benfield-manual-lead | ECM store | secondary_technical | unknown | Method literature |

## Access problems

- Southwire cutsheet PDF: HTTP 400 during research fetch; URL retained from production.
- Greenlee Site-Rite CDN key URL: used as production baseline; secondary Manualsnet mirror used only for corroboration excerpts.
- RIDGID official E-666 chart not located; distributor page not accepted for numbers.
- NSI CB series: manufacturer site lead; dedicated pages not fully captured.

## Redistribution

All sources recorded as `url_reference_only`. No third-party PDFs or product photos committed to the repo.

## Agent 1 workspace

See `research/benders/workspace/agent1-sources/` for expanded catalog-map and ACCESS_NOTES.
