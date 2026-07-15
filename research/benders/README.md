# Bend Pro — Bender Research Corpus (Staging)

**Status:** Research staging only. Not production data.

This directory holds an evidence-backed research corpus of conduit benders,
manufacturer sources, measurement facts, conflicts, and original Bend Pro icon
assets. It must **never** be imported by app runtime code under `src/`.

## Absolute rules

- Do **not** write researched values into `src/data/benders/`.
- Do **not** change calculator engines or trusted production charts from this work.
- Unknown numeric values are `null` / omitted — never `0`, never estimates.
- Conflicts stay visible; never silently pick a winner.
- Do not commit third-party PDFs, product photos, or logos.

## Layout

| Path | Purpose |
|------|---------|
| `schema/` | JSON Schema for all staging entities |
| `data/` | **Canonical** merged staging JSON (validate against this) |
| `coverage/` | Coverage and missing-value CSVs |
| `reports/` | Human-readable audits and queues |
| `assets/icons/` | Original SVG icon family |
| `assets/previews/` | Preview sheets |
| `proposed-production-patch/` | Draft mapping notes only (not wired) |
| `workspace/` | Per-agent scratch outputs (may use agent-local IDs) |
| `scripts/validate.mjs` | Staging validation |
| `scripts/build-corpus.mjs` | Rebuild baseline merged corpus |
| `scripts/enrich-from-agents.mjs` | Add identity leads from agent discovery |

Agent workspace files under `workspace/agent2-hand/` and `workspace/agent3-powered/` keep parallel research with agent-local IDs. Prefer `data/` for app-facing review. Do not commit PDFs under `workspace/**/_tmp/`.

## Trust vs production

Production statuses (`verified_default`, `verified_with_source_note`,
`field_layout_only`, `reference_only`) live in `src/data/benders/types.ts`.
Staging uses its own `evidenceStatus` values. Mapping recommendations appear in
`reports/PRODUCTION_CANDIDATES.md` for human review only.

## Validation

```bash
node research/benders/scripts/validate.mjs
```

## Deterministic rebuild (ordered — do not skip steps)

Reconstructs the canonical corpus without silently dropping enrichment:

```bash
node research/benders/scripts/build-corpus.mjs
node research/benders/scripts/enrich-from-agents.mjs
node research/benders/scripts/correct-corpus.mjs
node research/benders/scripts/build-icon-preview.mjs
node research/benders/scripts/validate.mjs
```

Isolated double-rebuild + SHA-256 check (compares seven artifacts to live `data/` + preview):

```bash
node research/benders/scripts/verify-rebuild.mjs
```

1. `build-corpus.mjs` — baseline manufacturers/sources/models/measurements/conflicts  
2. `enrich-from-agents.mjs` — identity leads from agent discovery (incl. Milwaukee 5150-20, Gardner B2000, Greenlee 1818, Current 751)  
3. `correct-corpus.mjs` — QA correction pass (844AH, B-0040, IDEAL, NSI, 555/881 splits, derived min-stub; removes obsolete `src-ideal-74-006-related`)  
4. `build-icon-preview.mjs` — regenerates light/dark preview from standalone icons  
5. `validate.mjs` — JSON Schema + research rules + separated candidate metrics  
6. `verify-rebuild.mjs` — two clean temp rebuilds; SHA-256 must match canonical for manufacturers/sources/models/measurements/conflicts/asset-manifest/icon-family-preview  

After a full rebuild, re-check icon SVGs if manual icon edits were made after step 4.
